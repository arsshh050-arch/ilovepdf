import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Download, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { SplitMode, RangeMode, ExtractMode, SplitRange, SizeUnit } from '../../types/split';
import { getAllPagesMetadata } from '../../utils/pdfPageRenderer';
import { SplitSidebar } from './SplitSidebar';
import { RangeGroupContainer } from './RangeGroupContainer';
import { PdfPageCard } from './PdfPageCard';
import { ToolResultLayout } from '../results/ToolResultLayout';
import { saveResultSession, ResultSessionData } from '../../utils/sessionStore';

interface SplitPdfWorkspaceProps {
  file: File;
  onReset: () => void;
}

// Helper: Parse string like "1,3,5-8" into sorted unique array of page numbers
function parsePageSelectionString(input: string, totalPages: number): number[] {
  if (!input.trim()) return [];
  const parts = input.split(',').map((s) => s.trim());
  const pageSet = new Set<number>();

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end) && start >= 1 && end <= totalPages && start <= end) {
        for (let i = start; i <= end; i++) {
          pageSet.add(i);
        }
      }
    } else {
      const num = parseInt(part, 10);
      if (!isNaN(num) && num >= 1 && num <= totalPages) {
        pageSet.add(num);
      }
    }
  }

  return Array.from(pageSet).sort((a, b) => a - b);
}

// Helper: Convert array of numbers back to compact page string e.g. [1,3,5,6,7,8] -> "1,3,5-8"
function formatPageSelectionArray(pages: number[]): string {
  if (pages.length === 0) return '';
  const sorted = Array.from(new Set(pages)).sort((a, b) => a - b);
  const ranges: string[] = [];

  let start = sorted[0];
  let end = start;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = sorted[i];
      end = start;
    }
  }
  ranges.push(start === end ? `${start}` : `${start}-${end}`);

  return ranges.join(',');
}

export function SplitPdfWorkspace({ file, onReset }: SplitPdfWorkspaceProps) {
  const [totalPages, setTotalPages] = useState<number>(1);
  const [originalFileSize, setOriginalFileSize] = useState<number>(file.size);

  // Overall State
  const [activeMode, setActiveMode] = useState<SplitMode>('range');
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Download Result State
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('ilovepdf_split.pdf');
  const [isZipOutput, setIsZipOutput] = useState<boolean>(false);

  // Range Mode State
  const [rangeMode, setRangeMode] = useState<RangeMode>('custom');
  const [ranges, setRanges] = useState<SplitRange[]>([
    { id: uuidv4(), from: 1, to: 1 },
  ]);
  const [fixedPages, setFixedPages] = useState<number>(2);
  const [mergeRanges, setMergeRanges] = useState<boolean>(false);

  // Pages Mode State
  const [extractMode, setExtractMode] = useState<ExtractMode>('all');
  const [selectedPagesInput, setSelectedPagesInput] = useState<string>('1');
  const [mergeSelectedPages, setMergeSelectedPages] = useState<boolean>(false);

  // Size Mode State
  const [maxFileSize, setMaxFileSize] = useState<number>(5);
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>('MB');
  const [allowCompression, setAllowCompression] = useState<boolean>(true);

  // Load Metadata
  useEffect(() => {
    let isMounted = true;
    getAllPagesMetadata(file).then((meta) => {
      if (isMounted) {
        setTotalPages(meta.pageCount);
        setOriginalFileSize(meta.fileSize);
        // Default range 1 to full pages or up to 5
        const defaultTo = Math.min(meta.pageCount, 5);
        setRanges([{ id: uuidv4(), from: 1, to: defaultTo }]);
        setSelectedPagesInput(`1-${meta.pageCount}`);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [file]);

  // Handlers for Ranges
  const handleUpdateRange = (id: string, field: 'from' | 'to', value: number) => {
    setRanges((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, [field]: value };
        return updated;
      })
    );
  };

  const handleAddRange = () => {
    const lastRange = ranges[ranges.length - 1];
    const newFrom = lastRange ? Math.min(lastRange.to + 1, totalPages) : 1;
    const newTo = Math.min(newFrom + 2, totalPages);
    setRanges((prev) => [
      ...prev,
      { id: uuidv4(), from: newFrom, to: newTo },
    ]);
  };

  const handleRemoveRange = (id: string) => {
    if (ranges.length <= 1) return;
    setRanges((prev) => prev.filter((r) => r.id !== id));
  };

  // Parsed selected page numbers for Pages mode
  const selectedPageNumbers = useMemo(() => {
    if (extractMode === 'all') {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    return parsePageSelectionString(selectedPagesInput, totalPages);
  }, [extractMode, selectedPagesInput, totalPages]);

  // Handle clicking a page thumbnail in Pages mode
  const handleTogglePageSelection = useCallback(
    (pageNum: number) => {
      if (extractMode !== 'selected') return;
      const currentPages = parsePageSelectionString(selectedPagesInput, totalPages);
      let updatedPages: number[];

      if (currentPages.includes(pageNum)) {
        updatedPages = currentPages.filter((p) => p !== pageNum);
      } else {
        updatedPages = [...currentPages, pageNum];
      }

      setSelectedPagesInput(formatPageSelectionArray(updatedPages));
    },
    [extractMode, selectedPagesInput, totalPages]
  );

  // Validation
  const isFormDisabled = useMemo(() => {
    if (processing) return true;

    if (activeMode === 'range') {
      if (rangeMode === 'smart') return true;
      if (rangeMode === 'custom') {
        if (ranges.length === 0) return true;
        return ranges.some(
          (r) =>
            isNaN(r.from) ||
            isNaN(r.to) ||
            r.from < 1 ||
            r.to > totalPages ||
            r.from > r.to
        );
      }
      if (rangeMode === 'fixed') {
        return fixedPages < 1;
      }
    }

    if (activeMode === 'pages') {
      if (extractMode === 'selected') {
        return selectedPageNumbers.length === 0;
      }
    }

    if (activeMode === 'size') {
      return maxFileSize <= 0;
    }

    return false;
  }, [
    processing,
    activeMode,
    rangeMode,
    ranges,
    totalPages,
    fixedPages,
    extractMode,
    selectedPageNumbers,
    maxFileSize,
  ]);

  // Client-side fallback split using pdf-lib and JSZip
  const splitPdfInBrowser = async (): Promise<{ url: string; filename: string; isZip: boolean }> => {
    const { PDFDocument } = await import('pdf-lib');
    const JSZip = (await import('jszip')).default;

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const total = pdfDoc.getPageCount();

    let groups: number[][] = [];

    if (activeMode === 'range') {
      if (rangeMode === 'custom') {
        groups = ranges.map(r => {
          const pages: number[] = [];
          for (let p = Math.max(1, r.from); p <= Math.min(total, r.to); p++) {
            pages.push(p - 1);
          }
          return pages;
        }).filter(g => g.length > 0);
      } else {
        // fixed
        for (let i = 0; i < total; i += fixedPages) {
          const pages: number[] = [];
          for (let p = i; p < Math.min(total, i + fixedPages); p++) {
            pages.push(p);
          }
          groups.push(pages);
        }
      }

      if (mergeRanges && groups.length > 0) {
        const mergedGroup = groups.flat();
        groups = [mergedGroup];
      }
    } else if (activeMode === 'pages') {
      const pageIndices = extractMode === 'all'
        ? Array.from({ length: total }, (_, i) => i)
        : selectedPageNumbers.map(p => p - 1).filter(p => p >= 0 && p < total);

      if (mergeSelectedPages) {
        groups = [pageIndices];
      } else {
        groups = pageIndices.map(p => [p]);
      }
    } else {
      for (let i = 0; i < total; i++) {
        groups.push([i]);
      }
    }

    if (groups.length === 0) {
      throw new Error('No valid pages found for splitting.');
    }

    if (groups.length === 1) {
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdfDoc, groups[0]);
      copiedPages.forEach(p => newPdf.addPage(p));
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      return {
        url: URL.createObjectURL(blob),
        filename: `${file.name.replace(/\.pdf$/i, '')}_split.pdf`,
        isZip: false,
      };
    } else {
      const zip = new JSZip();
      for (let i = 0; i < groups.length; i++) {
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdfDoc, groups[i]);
        copiedPages.forEach(p => newPdf.addPage(p));
        const pdfBytes = await newPdf.save();
        zip.file(`${file.name.replace(/\.pdf$/i, '')}_split_${i + 1}.pdf`, pdfBytes);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      return {
        url: URL.createObjectURL(zipBlob),
        filename: `${file.name.replace(/\.pdf$/i, '')}_split.zip`,
        isZip: true,
      };
    }
  };

  // Submit to Backend with Fallback
  const handleProcessSplit = async () => {
    if (isFormDisabled) return;

    setProcessing(true);
    setError(null);

    let result: { url: string; filename: string; isZip: boolean } | null = null;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mode', activeMode);

      if (activeMode === 'range') {
        formData.append('rangeMode', rangeMode);
        formData.append('mergeRanges', mergeRanges ? 'true' : 'false');

        if (rangeMode === 'custom') {
          formData.append('ranges', JSON.stringify(ranges));
        } else if (rangeMode === 'fixed') {
          formData.append('fixedPages', fixedPages.toString());
        }
      } else if (activeMode === 'pages') {
        formData.append('extractMode', extractMode);
        formData.append('mergeSelected', mergeSelectedPages ? 'true' : 'false');

        if (extractMode === 'selected') {
          formData.append('selectedPages', JSON.stringify(selectedPageNumbers));
        }
      } else if (activeMode === 'size') {
        const bytesMultiplier = sizeUnit === 'MB' ? 1024 * 1024 : 1024;
        formData.append('maxBytes', (maxFileSize * bytesMultiplier).toString());
        formData.append('allowCompression', allowCompression ? 'true' : 'false');
      }

      try {
        const response = await fetch('/api/tools/split', {
          method: 'POST',
          body: formData,
        });

        const contentType = response.headers.get('Content-Type') || '';
        const contentDisposition = response.headers.get('Content-Disposition') || '';

        if (response.ok && (contentType.includes('pdf') || contentType.includes('zip') || contentType.includes('octet-stream'))) {
          const isZip = contentType.includes('zip') || contentDisposition.includes('.zip');
          let filename = isZip ? 'ilovepdf_split.zip' : 'ilovepdf_split.pdf';
          if (contentDisposition) {
            const match = contentDisposition.match(/filename="?([^"]+)"?/);
            if (match && match[1]) filename = match[1];
          }

          const blob = await response.blob();
          result = {
            url: URL.createObjectURL(blob),
            filename,
            isZip,
          };
        }
      } catch (serverErr) {
        console.warn('Server split request failed, falling back to browser-side split:', serverErr);
      }

      if (!result) {
        result = await splitPdfInBrowser();
      }

      setDownloadUrl(result.url);
      setDownloadFilename(result.filename);
      setIsZipOutput(result.isZip);
    } catch (err: any) {
      console.error('Split execution failed:', err);
      setError(err.message || 'An error occurred while splitting the PDF.');
    } finally {
      setProcessing(false);
    }
  };

  // Render Page Cards for Main Workspace Canvas
  const allPageCards = useMemo(() => {
    const cards = [];
    for (let p = 1; p <= totalPages; p++) {
      const isSelected = selectedPageNumbers.includes(p);
      cards.push(
        <PdfPageCard
          key={p}
          file={file}
          pageNumber={p}
          selectable={activeMode === 'pages' && extractMode === 'selected'}
          selected={activeMode === 'pages' && isSelected}
          onClick={() => handleTogglePageSelection(p)}
        />
      );
    }
    return cards;
  }, [totalPages, file, activeMode, extractMode, selectedPageNumbers, handleTogglePageSelection]);

  // Render Range Groups for Main Workspace Canvas
  const rangeGroupElements = useMemo(() => {
    if (activeMode !== 'range') return null;

    if (rangeMode === 'custom') {
      return ranges.map((r, i) => (
        <RangeGroupContainer
          key={r.id}
          rangeLabel={`Range ${i + 1}`}
          fromPage={r.from}
          toPage={r.to}
          file={file}
          totalPages={totalPages}
        />
      ));
    }

    if (rangeMode === 'fixed') {
      const fixedGroups = [];
      let groupIdx = 1;
      for (let i = 1; i <= totalPages; i += fixedPages) {
        const endPage = Math.min(i + fixedPages - 1, totalPages);
        fixedGroups.push(
          <RangeGroupContainer
            key={i}
            rangeLabel={`Range ${groupIdx++}`}
            fromPage={i}
            toPage={endPage}
            file={file}
            totalPages={totalPages}
          />
        );
      }
      return fixedGroups;
    }

    return null;
  }, [activeMode, rangeMode, ranges, fixedPages, file, totalPages]);

  // IF DOWNLOAD RESULT IS READY
  if (downloadUrl) {
    const sessionData: ResultSessionData = {
      sessionId: 'split_' + Date.now(),
      toolId: 'split-pdf',
      downloadUrl,
      filename: downloadFilename,
      mimeType: isZipOutput ? 'application/zip' : 'application/pdf',
      sizeBytes: file.size,
      createdAt: Date.now(),
      metadata: {
        splitCount: isZipOutput ? ranges.length || 2 : 1,
        mode: activeMode,
        isZip: isZipOutput,
      },
    };

    saveResultSession(sessionData);

    const handleResetSplit = () => {
      setDownloadUrl(null);
    };

    return (
      <ToolResultLayout
        toolId="split-pdf"
        sessionId={sessionData.sessionId}
        sessionData={sessionData}
        onBack={handleResetSplit}
        onResetTool={handleResetSplit}
      />
    );
  }

  return (
    <div className="w-full h-[calc(100vh-60px)] flex flex-col md:flex-row bg-[#F7F7FC] overflow-hidden">
      {/* MAIN LEFT WORKSPACE AREA */}
      <div className="flex-1 h-full overflow-y-auto p-6 md:p-10 flex flex-col items-center">
        {error && (
          <div className="w-full max-w-4xl mb-6 p-4 bg-red-50 border-l-4 border-[#E5322D] text-red-700 rounded-md text-sm font-medium">
            {error}
          </div>
        )}

        <div className="w-full max-w-5xl flex flex-col gap-6">
          {/* RANGE MODE WORKSPACE GROUPS */}
          {activeMode === 'range' && rangeMode !== 'smart' && (
            <div className="flex flex-col gap-6">{rangeGroupElements}</div>
          )}

          {/* PAGES MODE & SIZE MODE WORKSPACE GRID */}
          {(activeMode !== 'range' || rangeMode === 'smart') && (
            <div className="flex flex-wrap gap-5 justify-start">{allPageCards}</div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <SplitSidebar
        activeMode={activeMode}
        onSelectMode={setActiveMode}
        rangeMode={rangeMode}
        onChangeRangeMode={setRangeMode}
        ranges={ranges}
        onUpdateRange={handleUpdateRange}
        onAddRange={handleAddRange}
        onRemoveRange={handleRemoveRange}
        fixedPages={fixedPages}
        onChangeFixedPages={setFixedPages}
        mergeRanges={mergeRanges}
        onToggleMergeRanges={setMergeRanges}
        extractMode={extractMode}
        onChangeExtractMode={setExtractMode}
        selectedPagesInput={selectedPagesInput}
        onChangeSelectedPagesInput={setSelectedPagesInput}
        mergeSelectedPages={mergeSelectedPages}
        onToggleMergeSelectedPages={setMergeSelectedPages}
        selectedPagesCount={selectedPageNumbers.length}
        originalFileSize={originalFileSize}
        maxFileSize={maxFileSize}
        onChangeMaxFileSize={setMaxFileSize}
        sizeUnit={sizeUnit}
        onChangeSizeUnit={setSizeUnit}
        allowCompression={allowCompression}
        onToggleAllowCompression={setAllowCompression}
        totalPages={totalPages}
        processing={processing}
        disabled={isFormDisabled}
        onProcessSplit={handleProcessSplit}
      />
    </div>
  );
}
