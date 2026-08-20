import React, { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import { Download, ArrowLeft, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { MergeFile } from '../../types/merge';
import { MergePdfCard } from './MergePdfCard';
import { AddPdfButton } from './AddPdfButton';
import { MergePdfSidebar } from './MergePdfSidebar';
import { getPdfMetadataAndThumbnail } from '../../utils/pdfPreview';
import { Link } from 'react-router-dom';
import { ToolResultLayout } from '../results/ToolResultLayout';
import { saveResultSession, ResultSessionData } from '../../utils/sessionStore';

interface MergePdfWorkspaceProps {
  initialFiles: File[];
  onResetAll: () => void;
}

export function MergePdfWorkspace({ initialFiles, onResetAll }: MergePdfWorkspaceProps) {
  const [files, setFiles] = useState<MergeFile[]>([]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);
  const [isDragOverWorkspace, setIsDragOverWorkspace] = useState(false);

  // Show Toast
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Process incoming File objects into MergeFile objects
  const processNewFiles = useCallback(async (incomingFiles: File[]) => {
    const validPdfFiles = incomingFiles.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));

    if (validPdfFiles.length < incomingFiles.length) {
      showToast('Only PDF files are supported.');
    }

    if (validPdfFiles.length === 0) return;

    // Create preliminary merge file objects
    const newMergeFiles: MergeFile[] = validPdfFiles.map(file => ({
      id: uuidv4(),
      file,
      name: file.name,
      size: file.size,
      pageCount: 1,
      rotation: 0,
      thumbnailUrl: null,
      loadingPreview: true
    }));

    // Append immediately to state
    setFiles(prev => [...prev, ...newMergeFiles]);

    // Asynchronously load previews & page counts
    for (const mf of newMergeFiles) {
      getPdfMetadataAndThumbnail(mf.file).then(meta => {
        setFiles(prev =>
          prev.map(item =>
            item.id === mf.id
              ? {
                  ...item,
                  pageCount: meta.pageCount,
                  thumbnailUrl: meta.thumbnailUrl,
                  loadingPreview: false
                }
              : item
          )
        );
      });
    }
  }, [showToast]);

  const processedInitialFilesRef = React.useRef<File[] | null>(null);

  // Initial load - process initialFiles only once per unique array reference
  React.useEffect(() => {
    if (initialFiles.length === 0) {
      processedInitialFilesRef.current = null;
      return;
    }

    if (processedInitialFilesRef.current !== initialFiles) {
      processedInitialFilesRef.current = initialFiles;
      processNewFiles(initialFiles);
    }
  }, [initialFiles, processNewFiles]);

  // Configure sensors for touch and mouse drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5 // 5px movement threshold before drag begins
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150, // 150ms press threshold for touch to allow scrolling
        tolerance: 5
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Drag End Handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (over && active.id !== over.id) {
      setFiles(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragStart = (event: any) => {
    setActiveDragId(event.active.id);
  };

  // Rotation Handler
  const handleRotate = (id: string) => {
    setFiles(items =>
      items.map(item =>
        item.id === id
          ? {
              ...item,
              rotation: ((item.rotation + 90) % 360) as 0 | 90 | 180 | 270
            }
          : item
      )
    );
  };

  // Remove Handler
  const handleRemove = (id: string) => {
    setFiles(items => {
      const filtered = items.filter(item => item.id !== id);
      if (filtered.length === 0) {
        onResetAll();
      }
      return filtered;
    });
    showToast('File removed');
  };

  // Keyboard accessibility move handlers
  const handleMoveLeft = (index: number) => {
    if (index > 0) {
      setFiles(items => arrayMove(items, index, index - 1));
    }
  };

  const handleMoveRight = (index: number) => {
    if (index < files.length - 1) {
      setFiles(items => arrayMove(items, index, index + 1));
    }
  };

  // Workspace Drag and Drop overlay for desktop
  const handleWorkspaceDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverWorkspace(true);
  };

  const handleWorkspaceDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverWorkspace(false);
  };

  const handleWorkspaceDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverWorkspace(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      processNewFiles(droppedFiles);
    }
  };

  // Client-side fallback merge using pdf-lib
  const mergePdfsInBrowser = async (): Promise<string> => {
    const { PDFDocument, degrees } = await import('pdf-lib');
    const mergedPdf = await PDFDocument.create();

    for (const item of files) {
      const arrayBuffer = await item.file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

      copiedPages.forEach((page) => {
        if (item.rotation && item.rotation !== 0) {
          const currentAngle = page.getRotation().angle;
          page.setRotation(degrees((currentAngle + item.rotation) % 360));
        }
        mergedPdf.addPage(page);
      });
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  };

  // BACKEND & CLIENT FALLBACK MERGE API CALL
  const handleMergePdf = async () => {
    if (files.length < 2) return;

    setIsProcessing(true);
    setError(null);

    try {
      let mergedUrl: string | null = null;

      // Try server endpoint first
      try {
        const formData = new FormData();
        const rotations: number[] = [];

        // Append files and rotations in exact visual display order
        files.forEach(f => {
          formData.append('files', f.file);
          rotations.push(f.rotation);
        });

        formData.append('rotations', JSON.stringify(rotations));

        const response = await fetch('/api/tools/merge', {
          method: 'POST',
          body: formData
        });

        const contentType = response.headers.get('content-type') || '';

        if (response.ok && (contentType.includes('pdf') || contentType.includes('octet-stream'))) {
          const blob = await response.blob();
          mergedUrl = URL.createObjectURL(blob);
        } else if (contentType.includes('json')) {
          const errJson = await response.json();
          if (!response.ok) {
            console.warn('Server error response:', errJson.error);
          }
        }
      } catch (serverErr) {
        console.warn('Server merge request failed or returned non-PDF, proceeding with client-side merge fallback:', serverErr);
      }

      // If server processing did not return a valid merged PDF URL, run client-side merge fallback
      if (!mergedUrl) {
        mergedUrl = await mergePdfsInBrowser();
      }

      setMergedBlobUrl(mergedUrl);

    } catch (err: any) {
      console.error('Merge error:', err);
      setError(err.message || 'An error occurred while merging your PDF files. Please ensure all files are valid PDF documents.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetMergeSession = () => {
    if (mergedBlobUrl) {
      URL.revokeObjectURL(mergedBlobUrl);
      setMergedBlobUrl(null);
    }
    onResetAll();
  };

  const activeCard = files.find(f => f.id === activeDragId);

  // RESULT VIEW IF MERGE IS COMPLETED
  if (mergedBlobUrl) {
    const totalMergedPages = files.reduce((acc, f) => acc + (f.pageCount || 1), 0);
    const sessionData: ResultSessionData = {
      sessionId: 'merge_' + Date.now(),
      toolId: 'merge-pdf',
      downloadUrl: mergedBlobUrl,
      filename: 'ilovepdf_merged.pdf',
      mimeType: 'application/pdf',
      sizeBytes: files.reduce((acc, f) => acc + f.size, 0),
      createdAt: Date.now(),
      metadata: {
        mergedCount: files.length,
        pageCount: totalMergedPages,
      },
    };

    saveResultSession(sessionData);

    return (
      <ToolResultLayout
        toolId="merge-pdf"
        sessionId={sessionData.sessionId}
        sessionData={sessionData}
        onBack={handleResetMergeSession}
        onResetTool={handleResetMergeSession}
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

      {/* MAIN WORKSPACE CANVAS */}
      <section
        className={`flex-1 p-6 md:p-10 relative overflow-y-auto flex flex-col justify-between min-h-[500px] transition-colors ${
          isDragOverWorkspace ? 'bg-[#EEF1F8]' : ''
        }`}
        onDragOver={handleWorkspaceDragOver}
        onDragLeave={handleWorkspaceDragLeave}
        onDrop={handleWorkspaceDrop}
      >
        {/* DRAG OVERLAY FOR WORKSPACE */}
        {isDragOverWorkspace && (
          <div className="absolute inset-4 border-2 border-dashed border-[#E5322D] bg-[#FFF0EE]/80 rounded-2xl z-40 flex flex-col items-center justify-center pointer-events-none">
            <Upload size={48} className="text-[#E5322D] mb-3 animate-bounce" />
            <p className="text-xl font-bold text-[#E5322D]">Drop PDF files here</p>
            <p className="text-sm text-[#686B74]">Files will be appended to your workspace</p>
          </div>
        )}

        <div>
          {/* ERROR ALERT IF MERGE FAILED */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3 shadow-xs">
              <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1 text-sm">
                <p className="font-bold mb-0.5">Merge Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* DND CONTEXT FOR SORTABLE CARDS */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={files.map(f => f.id)} strategy={rectSortingStrategy}>
              <div className="flex flex-wrap gap-6 justify-center md:justify-start items-start pt-4 pb-20">
                {files.map((file, idx) => (
                  <MergePdfCard
                    key={file.id}
                    file={file}
                    index={idx}
                    totalFiles={files.length}
                    onRotate={handleRotate}
                    onRemove={handleRemove}
                    onMoveLeft={handleMoveLeft}
                    onMoveRight={handleMoveRight}
                  />
                ))}
              </div>
            </SortableContext>

            {/* DRAG OVERLAY PREVIEW */}
            <DragOverlay>
              {activeCard ? (
                <div className="bg-white border-2 border-[#E5322D] rounded-[7px] p-2.5 w-[185px] min-h-[225px] shadow-2xl opacity-90 scale-[1.02] cursor-grabbing flex flex-col items-center">
                  <div className="w-[165px] h-[135px] bg-[#FAFBFD] border border-[#E8EAEF] rounded-[5px] flex items-center justify-center overflow-hidden mb-2.5">
                    {activeCard.thumbnailUrl ? (
                      <img
                        src={activeCard.thumbnailUrl}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                        style={{ transform: `rotate(${activeCard.rotation}deg)` }}
                      />
                    ) : (
                      <div className="text-xs text-[#888]">PDF</div>
                    )}
                  </div>
                  <p className="text-[12px] font-medium text-[#555760] truncate max-w-full">
                    {activeCard.name}
                  </p>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {/* FLOATING RED (+) ADD BUTTON */}
        <div className="fixed md:absolute right-6 bottom-24 md:bottom-10 z-30">
          <AddPdfButton
            totalFiles={files.length}
            onFilesSelected={processNewFiles}
            onShowToast={showToast}
          />
        </div>
      </section>

      {/* RIGHT SIDEBAR */}
      <MergePdfSidebar
        totalFiles={files.length}
        isProcessing={isProcessing}
        onMerge={handleMergePdf}
      />
    </div>
  );
}
