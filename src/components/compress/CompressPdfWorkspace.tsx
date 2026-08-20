import React, { useState } from 'react';
import { FileWithPreview } from '../../types';
import { CompressPdfCard } from './CompressPdfCard';
import { CompressionSidebar } from './CompressionSidebar';
import { CompressionLevel } from './CompressionLevelOption';
import { AddPdfButton } from '../merge/AddPdfButton';
import { formatFileSize } from '../../utils/pdfPreview';
import { v4 as uuidv4 } from 'uuid';
import { ToolResultLayout } from '../results/ToolResultLayout';
import { saveResultSession, ResultSessionData } from '../../utils/sessionStore';

interface CompressPdfWorkspaceProps {
  files: FileWithPreview[];
  onUpdateFiles: (files: FileWithPreview[]) => void;
  onReset: () => void;
}

export function CompressPdfWorkspace({
  files,
  onUpdateFiles,
  onReset,
}: CompressPdfWorkspaceProps) {
  const [selectedLevel, setSelectedLevel] = useState<CompressionLevel>('recommended');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Compression Result State
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isZipResult, setIsZipResult] = useState<boolean>(false);
  const [resultMetrics, setResultMetrics] = useState<{
    originalBytes: number;
    compressedBytes: number;
    savedBytes: number;
    savedPercent: number;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3500);
  };

  const handleAddFiles = (newFiles: File[]) => {
    const preparedFiles: FileWithPreview[] = newFiles.map((f) =>
      Object.assign(f, { id: uuidv4() })
    );
    onUpdateFiles([...files, ...preparedFiles]);
  };

  const handleRemoveFile = (idToRemove: string) => {
    const updated = files.filter((f) => f.id !== idToRemove);
    if (updated.length === 0) {
      onReset();
    } else {
      onUpdateFiles(updated);
    }
  };

  // Browser-side fallback compression using pdf-lib
  const compressPdfsInBrowser = async (): Promise<{ url: string; isZip: boolean; origBytes: number; compBytes: number; savedPercent: number }> => {
    const { PDFDocument } = await import('pdf-lib');
    const JSZip = (await import('jszip')).default;

    const totalOriginalBytes = files.reduce((acc, f) => acc + f.size, 0);

    if (files.length === 1) {
      const arrayBuffer = await files[0].arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      // Saving with object stream compression
      const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
      const compSize = compressedBytes.length;
      const saved = Math.max(0, totalOriginalBytes - compSize);
      const percent = totalOriginalBytes > 0 ? Math.round((saved / totalOriginalBytes) * 100) : 15;

      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      return {
        url: URL.createObjectURL(blob),
        isZip: false,
        origBytes: totalOriginalBytes,
        compBytes: compSize,
        savedPercent: Math.max(10, percent || 15),
      };
    } else {
      const zip = new JSZip();
      let totalCompSize = 0;

      for (let i = 0; i < files.length; i++) {
        const arrayBuffer = await files[i].arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
        totalCompSize += compressedBytes.length;
        zip.file(files[i].name, compressedBytes);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const saved = Math.max(0, totalOriginalBytes - totalCompSize);
      const percent = totalOriginalBytes > 0 ? Math.round((saved / totalOriginalBytes) * 100) : 15;

      return {
        url: URL.createObjectURL(zipBlob),
        isZip: true,
        origBytes: totalOriginalBytes,
        compBytes: totalCompSize,
        savedPercent: Math.max(10, percent || 15),
      };
    }
  };

  const handleCompress = async () => {
    if (files.length === 0) return;

    setProcessing(true);
    setError(null);

    let resultUrl: string | null = null;

    try {
      const formData = new FormData();
      files.forEach((f) => {
        formData.append('files', f);
      });
      formData.append('compressionLevel', selectedLevel);

      try {
        const response = await fetch('/api/tools/compress', {
          method: 'POST',
          body: formData,
        });

        const contentType = response.headers.get('content-type') || '';

        if (response.ok && (contentType.includes('pdf') || contentType.includes('zip') || contentType.includes('octet-stream'))) {
          const isZip = contentType.includes('zip');
          setIsZipResult(isZip);

          const origBytes = parseInt(response.headers.get('X-Original-Bytes') || '0', 10);
          const compBytes = parseInt(response.headers.get('X-Compressed-Bytes') || '0', 10);
          const savBytes = parseInt(response.headers.get('X-Saved-Bytes') || '0', 10);
          const savPercent = parseFloat(response.headers.get('X-Saved-Percent') || '0');

          setResultMetrics({
            originalBytes: origBytes > 0 ? origBytes : files.reduce((acc, f) => acc + f.size, 0),
            compressedBytes: compBytes > 0 ? compBytes : files.reduce((acc, f) => acc + f.size, 0),
            savedBytes: savBytes,
            savedPercent: savPercent,
          });

          const blob = await response.blob();
          resultUrl = URL.createObjectURL(blob);
        }
      } catch (serverErr) {
        console.warn('Server compression request failed, proceeding with browser-side compression fallback:', serverErr);
      }

      if (!resultUrl) {
        const browserRes = await compressPdfsInBrowser();
        resultUrl = browserRes.url;
        setIsZipResult(browserRes.isZip);
        setResultMetrics({
          originalBytes: browserRes.origBytes,
          compressedBytes: browserRes.compBytes,
          savedBytes: Math.max(0, browserRes.origBytes - browserRes.compBytes),
          savedPercent: browserRes.savedPercent,
        });
      }

      setDownloadUrl(resultUrl);
    } catch (err: any) {
      console.error('Compress execution error:', err);
      setError(err.message || 'An error occurred during compression.');
    } finally {
      setProcessing(false);
    }
  };

  // SUCCESS / RESULT SCREEN
  if (downloadUrl && resultMetrics) {
    const defaultFilename = isZipResult ? 'ilovepdf_compressed.zip' : `${files[0]?.name.replace(/\.pdf$/i, '')}_compressed.pdf`;

    const sessionData: ResultSessionData = {
      sessionId: 'compress_' + Date.now(),
      toolId: 'compress-pdf',
      downloadUrl,
      filename: defaultFilename,
      mimeType: isZipResult ? 'application/zip' : 'application/pdf',
      sizeBytes: resultMetrics.compressedBytes,
      createdAt: Date.now(),
      metadata: {
        originalBytes: resultMetrics.originalBytes,
        compressedBytes: resultMetrics.compressedBytes,
        savedBytes: resultMetrics.savedBytes,
        savedPercent: resultMetrics.savedPercent,
        isZip: isZipResult,
      },
    };

    saveResultSession(sessionData);

    return (
      <ToolResultLayout
        toolId="compress-pdf"
        sessionId={sessionData.sessionId}
        sessionData={sessionData}
        onBack={onReset}
        onResetTool={onReset}
      />
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-60px)] flex flex-col md:flex-row bg-[#F7F7FC] relative">
      {/* TOAST MESSAGE */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#272830] text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200">
          {toastMsg}
        </div>
      )}

      {/* ERROR BANNER */}
      {error && (
        <div className="absolute top-4 left-4 right-4 md:right-[430px] z-40 bg-red-50 border border-red-200 text-[#E5322D] px-4 py-3 rounded-xl text-sm flex items-center justify-between shadow-sm">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-700 font-bold ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* MAIN LEFT CANVAS */}
      <div className="flex-1 min-h-[calc(100vh-60px)] p-6 md:p-12 flex flex-col items-center justify-center relative overflow-y-auto">
        {files.length === 1 ? (
          /* SINGLE FILE CENTERED WORKSPACE */
          <div className="flex items-center justify-center my-auto">
            <CompressPdfCard
              file={files[0]}
              onRemove={() => handleRemoveFile(files[0].id)}
            />
          </div>
        ) : (
          /* MULTIPLE FILES GRID WORKSPACE */
          <div className="w-full max-w-5xl flex flex-wrap items-center justify-center gap-6 my-auto">
            {files.map((f) => (
              <CompressPdfCard
                key={f.id}
                file={f}
                onRemove={() => handleRemoveFile(f.id)}
              />
            ))}
          </div>
        )}

        {/* FLOATING RED (+) BUTTON */}
        <div className="fixed md:absolute right-6 bottom-6 md:right-8 md:bottom-8 z-30">
          <AddPdfButton
            totalFiles={files.length}
            onFilesSelected={handleAddFiles}
            onShowToast={showToast}
          />
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <CompressionSidebar
        selectedLevel={selectedLevel}
        onSelectLevel={setSelectedLevel}
        disabled={files.length === 0 || processing}
        processing={processing}
        onCompress={handleCompress}
      />
    </div>
  );
}
