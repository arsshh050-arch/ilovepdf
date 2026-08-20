import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, AlertCircle, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { getToolConfig, ToolConfigSchema } from '../../config/toolConfigurations';
import { getPdfMetadataAndThumbnail, getAllPdfPageThumbnails, getImagePreviewUrl } from '../../utils/pdfPreview';
import { processPdfTool, ProcessingResult } from '../../utils/pdfProcessor';
import { saveResultSession, ResultSessionData } from '../../utils/sessionStore';
import { ToolResultLayout } from '../results/ToolResultLayout';

// Subcomponents
import { DocumentCanvas, WorkspaceFileItem } from './DocumentCanvas';
import { PageCanvas, PageItem } from './PageCanvas';
import { SinglePdfPreviewCanvas } from './SinglePdfPreviewCanvas';
import { DualPdfPreviewCanvas } from './DualPdfPreviewCanvas';
import { AddFilesButton } from './AddFilesButton';
import { ToolPrimaryAction } from './ToolPrimaryAction';
import { ProgressOverlay } from './ProgressOverlay';

// Settings Panels
import { PdfToWordPanel } from './panels/PdfToWordPanel';
import { PdfToExcelPanel } from './panels/PdfToExcelPanel';
import { CompressPdfPanel } from './panels/CompressPdfPanel';
import { SplitPdfPanel, SplitRange } from './panels/SplitPdfPanel';
import { JpgToPdfPanel } from './panels/JpgToPdfPanel';
import { PdfToJpgPanel } from './panels/PdfToJpgPanel';
import { WatermarkPanel } from './panels/WatermarkPanel';
import { ProtectPdfPanel } from './panels/ProtectPdfPanel';
import { UnlockPdfPanel } from './panels/UnlockPdfPanel';
import { GenericToolPanel } from './panels/GenericToolPanel';

interface ToolWorkspaceProps {
  toolId: string;
  initialFiles: File[];
  onResetAll: () => void;
}

export function ToolWorkspace({ toolId, initialFiles, onResetAll }: ToolWorkspaceProps) {
  const config = getToolConfig(toolId);

  // Core File State
  const [fileItems, setFileItems] = useState<WorkspaceFileItem[]>([]);
  const [pageItems, setPageItems] = useState<PageItem[]>([]);
  
  // Workspace State
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [resultData, setResultData] = useState<ProcessingResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<Record<string, any>>({});

  // Show Toast Helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Process incoming files
  const processIncomingFiles = useCallback(async (incomingFiles: File[]) => {
    if (!incomingFiles || incomingFiles.length === 0) return;

    // Filter by accepted types
    const valid = incomingFiles.filter(f => {
      const fileName = f.name.toLowerCase();
      const fileType = f.type.toLowerCase();
      
      // If config accepts anything (shouldn't happen, but just in case)
      if (!config.acceptedFileTypes || config.acceptedFileTypes.length === 0) return true;
      
      return config.acceptedFileTypes.some(ext => {
        const lowerExt = ext.toLowerCase();
        if (lowerExt.startsWith('.')) {
          return fileName.endsWith(lowerExt);
        } else {
          // Check mime type (e.g. image/jpeg, image/*)
          if (lowerExt.endsWith('/*')) {
            return fileType.startsWith(lowerExt.replace('/*', '/'));
          }
          return fileType === lowerExt;
        }
      });
    });

    if (valid.length < incomingFiles.length) {
      showToast('Some unsupported files were skipped.');
    }

    if (valid.length === 0) return;

    // Preliminary items
    const newItems: WorkspaceFileItem[] = valid.map(file => ({
      id: uuidv4(),
      file,
      name: file.name,
      size: file.size,
      pageCount: 1,
      rotation: 0,
      thumbnailUrl: null,
      loadingPreview: true
    }));

    setFileItems(prev => [...prev, ...newItems]);

    // Async thumbnails loading
    for (const item of newItems) {
      if (item.file.type.startsWith('image/') || item.file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
        getImagePreviewUrl(item.file).then(url => {
          setFileItems(prev => prev.map(f => f.id === item.id ? { ...f, thumbnailUrl: url, loadingPreview: false } : f));
        });
      } else {
        getPdfMetadataAndThumbnail(item.file).then(meta => {
          setFileItems(prev => prev.map(f => f.id === item.id ? { ...f, pageCount: meta.pageCount, thumbnailUrl: meta.thumbnailUrl, loadingPreview: false } : f));
        }).catch(err => {
          console.warn('Failed to load PDF preview for', item.file.name, err);
          setFileItems(prev => prev.map(f => f.id === item.id ? { ...f, loadingPreview: false } : f));
        });
      }
    }
  }, [showToast]);

  // Initial load
  const processedRef = useRef<File[] | null>(null);
  useEffect(() => {
    if (initialFiles.length === 0) {
      processedRef.current = null;
      return;
    }
    if (processedRef.current !== initialFiles) {
      processedRef.current = initialFiles;
      processIncomingFiles(initialFiles);
    }
  }, [initialFiles, processIncomingFiles]);

  // Load page grid items if tool uses page-grid
  useEffect(() => {
    if (config.workspaceType === 'page-grid' && fileItems.length > 0) {
      const primaryFile = fileItems[0].file;
      getAllPdfPageThumbnails(primaryFile, 180).then(res => {
        const pages: PageItem[] = res.map(p => ({
          pageNumber: p.pageNumber,
          thumbnailUrl: p.thumbnailUrl,
          rotation: 0,
          selected: true
        }));
        setPageItems(pages);
      });
    }
  }, [config.workspaceType, fileItems]);

  // File Handlers
  const handleRotateFile = (id: string) => {
    setFileItems(prev => prev.map(item => item.id === id ? { ...item, rotation: ((item.rotation + 90) % 360) as 0|90|180|270 } : item));
  };

  const handleRemoveFile = (id: string) => {
    setFileItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      if (updated.length === 0) onResetAll();
      return updated;
    });
    showToast('File removed');
  };

  // Drag and Drop workspace overlay
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processIncomingFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Primary Action execution
  const handleExecute = async () => {
    if (fileItems.length < config.minFiles) {
      showToast(`At least ${config.minFiles} file(s) required.`);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const filesToProcess = fileItems.map(f => f.file);
      const combinedSettings = {
        ...settings,
        rotations: fileItems.map(f => f.rotation),
        selectedPages: pageItems.filter(p => p.selected).map(p => p.pageNumber),
        pageOrders: pageItems.map((p, idx) => ({ originalIndex: p.pageNumber - 1, rotation: p.rotation })),
      };

      const result = await processPdfTool(toolId, filesToProcess, combinedSettings);
      setResultData(result);
    } catch (err: any) {
      console.error('Tool processing error:', err);
      setError(err.message || 'An error occurred while processing your request.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Disable button checks
  let isButtonDisabled = fileItems.length < config.minFiles || isProcessing;
  let disabledReason = '';
  if (fileItems.length < config.minFiles) {
    if (config.id === 'merge-pdf') {
      disabledReason = 'Add at least one more PDF file to merge.';
    } else {
      disabledReason = `Please select at least ${config.minFiles} file(s).`;
    }
  }

  // RESULT VIEW
  if (resultData) {
    const sessionData: ResultSessionData = {
      sessionId: `${toolId}_${Date.now()}`,
      toolId: config.id,
      downloadUrl: resultData.url,
      filename: resultData.filename,
      mimeType: resultData.mimeType,
      sizeBytes: resultData.sizeBytes,
      createdAt: Date.now(),
      savedBytes: resultData.savedBytes,
      savedPercent: resultData.savedPercent,
      metadata: resultData.metadata,
    };

    saveResultSession(sessionData);

    const handleBackToEditor = () => {
      setResultData(null);
    };

    return (
      <ToolResultLayout
        toolId={config.id}
        sessionId={sessionData.sessionId}
        sessionData={sessionData}
        onBack={handleBackToEditor}
        onResetTool={() => {
          setResultData(null);
          onResetAll();
        }}
      />
    );
  }

  return (
    <div className="w-full flex flex-col md:flex-row min-h-[calc(100vh-60px)] bg-[#F6F6FB]">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#202126] text-white text-sm py-2.5 px-5 rounded-full shadow-2xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* PROGRESS OVERLAY */}
      <ProgressOverlay 
        isVisible={isProcessing} 
        title={config.id === 'compress-pdf' ? 'Compressing PDF...' : 'Processing...'} 
        subtitle={config.id === 'compress-pdf' ? 'Applying advanced optimization algorithms...' : 'Please wait while we process your files.'}
      />

      {/* MAIN WORKSPACE CANVAS (~77% Desktop) */}
      <section
        className={`flex-1 p-6 md:p-10 relative overflow-y-auto flex flex-col justify-between min-h-[500px] transition-colors ${
          isDragOver ? 'bg-[#EEF1F8]' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* DROP OVERLAY */}
        {isDragOver && (
          <div className="absolute inset-4 border-2 border-dashed border-[#E5322D] bg-[#FFF0EE]/80 rounded-2xl z-40 flex flex-col items-center justify-center pointer-events-none">
            <Upload size={48} className="text-[#E5322D] mb-3 animate-bounce" />
            <p className="text-xl font-bold text-[#E5322D]">Drop files here</p>
            <p className="text-sm text-[#686B74]">Files will be appended to your workspace</p>
          </div>
        )}

        <div>
          {/* ERROR ALERT */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-start gap-3 shadow-xs">
              <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1 text-sm">
                <p className="font-bold mb-0.5">Processing Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* DYNAMIC CANVAS BASED ON WORKSPACE TYPE */}
          {config.workspaceType === 'document-grid' && (
            <DocumentCanvas
              files={fileItems}
              onReorder={setFileItems}
              onRotate={handleRotateFile}
              onRemove={handleRemoveFile}
            />
          )}

          {config.workspaceType === 'page-grid' && (
            <PageCanvas
              pages={pageItems}
              onTogglePageSelect={(num) => setPageItems(prev => prev.map(p => p.pageNumber === num ? { ...p, selected: !p.selected } : p))}
              onRotatePage={(num) => setPageItems(prev => prev.map(p => p.pageNumber === num ? { ...p, rotation: ((p.rotation + 90) % 360) as any } : p))}
              onSelectAll={() => setPageItems(prev => prev.map(p => ({ ...p, selected: true })))}
              onDeselectAll={() => setPageItems(prev => prev.map(p => ({ ...p, selected: false })))}
              onSelectOdd={() => setPageItems(prev => prev.map(p => ({ ...p, selected: p.pageNumber % 2 !== 0 })))}
              onSelectEven={() => setPageItems(prev => prev.map(p => ({ ...p, selected: p.pageNumber % 2 === 0 })))}
            />
          )}

          {config.workspaceType === 'single-preview' && fileItems[0] && (
            <SinglePdfPreviewCanvas
              file={fileItems[0].file}
            />
          )}

          {config.workspaceType === 'dual-preview' && (
            <DualPdfPreviewCanvas
              files={fileItems.map(f => f.file)}
            />
          )}
        </div>

        {/* FLOATING RED (+) ADD BUTTON */}
        <div className="fixed md:absolute right-6 bottom-24 md:bottom-10 z-30">
          <AddFilesButton
            totalFiles={fileItems.length}
            acceptedTypes={config.acceptedFileTypes}
            multiple={config.multiple}
            onFilesSelected={processIncomingFiles}
            onShowToast={showToast}
          />
        </div>
      </section>

      {/* RIGHT SETTINGS PANEL (~23% Desktop, Min 380px, Max 440px) */}
      <aside className="w-full md:w-[380px] lg:w-[420px] bg-white border-t md:border-t-0 md:border-l border-[#E8EAEF] flex flex-col justify-between shrink-0 shadow-lg md:shadow-none z-20">
        <div className="overflow-y-auto flex-1">
          {/* TOOL HEADER */}
          <div className="p-5 border-b border-[#E8EAEF] bg-[#FAFBFD]">
            <h2 className="text-xl font-extrabold text-[#272830] tracking-tight">{config.title}</h2>
            <p className="text-xs text-[#686B74] mt-0.5">{fileItems.length} file(s) selected</p>
          </div>

          {/* TOOL SPECIFIC PANEL */}
          {config.id === 'pdf-to-word' ? (
            <PdfToWordPanel
              mode={settings.mode || 'no-ocr'}
              onModeChange={(m) => setSettings(s => ({ ...s, mode: m }))}
            />
          ) : config.id === 'pdf-to-excel' ? (
            <PdfToExcelPanel
              mode={settings.mode || 'no-ocr'}
              onModeChange={(m) => setSettings(s => ({ ...s, mode: m }))}
            />
          ) : config.id === 'compress-pdf' ? (
            <CompressPdfPanel
              level={settings.level || 'recommended'}
              onLevelChange={(l) => setSettings(s => ({ ...s, level: l }))}
            />
          ) : config.id === 'split-pdf' ? (
            <SplitPdfPanel
              totalPages={fileItems[0]?.pageCount || 10}
              mode={settings.mode || 'range'}
              onModeChange={(m) => setSettings(s => ({ ...s, mode: m }))}
              rangeMode={settings.rangeMode || 'custom'}
              onRangeModeChange={(rm) => setSettings(s => ({ ...s, rangeMode: rm }))}
              ranges={settings.ranges || [{ from: 1, to: Math.min(5, fileItems[0]?.pageCount || 10) }]}
              onRangesChange={(r) => setSettings(s => ({ ...s, ranges: r }))}
              fixedPages={settings.fixedPages || 1}
              onFixedPagesChange={(fp) => setSettings(s => ({ ...s, fixedPages: fp }))}
              mergeRanges={settings.mergeRanges ?? true}
              onMergeRangesChange={(mr) => setSettings(s => ({ ...s, mergeRanges: mr }))}
              extractMode={settings.extractMode || 'selected'}
              onExtractModeChange={(em) => setSettings(s => ({ ...s, extractMode: em }))}
              selectedPagesInput={settings.selectedPagesInput || ''}
              onSelectedPagesInputChange={(val) => setSettings(s => ({ ...s, selectedPagesInput: val }))}
              mergeSelected={settings.mergeSelected ?? true}
              onMergeSelectedChange={(ms) => setSettings(s => ({ ...s, mergeSelected: ms }))}
              maxMb={settings.maxMb || 5}
              onMaxMbChange={(m) => setSettings(s => ({ ...s, maxMb: m }))}
              allowCompression={settings.allowCompression ?? true}
              onAllowCompressionChange={(ac) => setSettings(s => ({ ...s, allowCompression: ac }))}
            />
          ) : ['jpg-to-pdf', 'png-to-pdf', 'scan-to-pdf'].includes(config.id) ? (
            <JpgToPdfPanel
              orientation={settings.orientation || 'portrait'}
              onOrientationChange={(o) => setSettings(s => ({ ...s, orientation: o }))}
              pageSize={settings.pageSize || 'a4'}
              onPageSizeChange={(ps) => setSettings(s => ({ ...s, pageSize: ps }))}
              margin={settings.margin || 'small'}
              onMarginChange={(m) => setSettings(s => ({ ...s, margin: m }))}
              mergeAll={settings.mergeAll ?? true}
              onMergeAllChange={(ma) => setSettings(s => ({ ...s, mergeAll: ma }))}
            />
          ) : ['pdf-to-jpg', 'pdf-to-png'].includes(config.id) ? (
            <PdfToJpgPanel
              mode={settings.mode || 'pages'}
              onModeChange={(m) => setSettings(s => ({ ...s, mode: m }))}
              quality={settings.quality || 'high'}
              onQualityChange={(q) => setSettings(s => ({ ...s, quality: q }))}
            />
          ) : config.id === 'watermark' ? (
            <WatermarkPanel
              text={settings.text || 'CONFIDENTIAL'}
              onTextChange={(t) => setSettings(s => ({ ...s, text: t }))}
              fontSize={settings.fontSize || 48}
              onFontSizeChange={(fs) => setSettings(s => ({ ...s, fontSize: fs }))}
              color={settings.color || '#E5322D'}
              onColorChange={(c) => setSettings(s => ({ ...s, color: c }))}
              opacity={settings.opacity ?? 0.4}
              onOpacityChange={(o) => setSettings(s => ({ ...s, opacity: o }))}
              rotation={settings.rotation || 45}
              onRotationChange={(r) => setSettings(s => ({ ...s, rotation: r }))}
              position={settings.position || 'center'}
              onPositionChange={(p) => setSettings(s => ({ ...s, position: p }))}
            />
          ) : config.id === 'protect-pdf' ? (
            <ProtectPdfPanel
              password={settings.password || ''}
              onPasswordChange={(p) => setSettings(s => ({ ...s, password: p }))}
              confirmPassword={settings.confirmPassword || ''}
              onConfirmPasswordChange={(cp) => setSettings(s => ({ ...s, confirmPassword: cp }))}
            />
          ) : config.id === 'unlock-pdf' ? (
            <UnlockPdfPanel
              password={settings.password || ''}
              onPasswordChange={(p) => setSettings(s => ({ ...s, password: p }))}
              confirmedPermission={settings.confirmedPermission ?? true}
              onConfirmedPermissionChange={(c) => setSettings(s => ({ ...s, confirmedPermission: c }))}
            />
          ) : (
            <GenericToolPanel
              config={config}
              totalFiles={fileItems.length}
              options={settings}
              onOptionsChange={setSettings}
            />
          )}
        </div>

        {/* FIXED PRIMARY ACTION BUTTON (72px Height, Brand Red #e5322d, Label →) */}
        <ToolPrimaryAction
          label={config.primaryButtonText}
          onClick={handleExecute}
          disabled={isButtonDisabled}
          disabledReason={disabledReason}
          isProcessing={isProcessing}
        />
      </aside>
    </div>
  );
}
