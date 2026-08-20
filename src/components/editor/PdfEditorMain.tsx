import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  EditorMode,
  AnnotateSubTool,
  ShapeSubTool,
  FormSubTool,
  EditorObject,
  PageInfo,
  PdfBookmark,
  PdfAttachment,
  EditorHistoryStep,
  TextEditorObject,
  StampEditorObject,
  SignatureEditorObject,
} from '../../types/pdfEditor';
import { loadPdfDocument } from '../../utils/pdfjsInit';
import { exportEditedPdf } from '../../utils/pdfEditorExporter';
import { EditorTopNavbar } from './EditorTopNavbar';
import { EditorSubToolbar } from './EditorSubToolbar';
import { EditorLeftSidebar } from './EditorLeftSidebar';
import { EditorWorkspace } from './EditorWorkspace';
import { EditorRightPropertiesPanel } from './EditorRightPropertiesPanel';
import { EditorFloatingBottomBar } from './EditorFloatingBottomBar';
import { SignatureModal } from './modals/SignatureModal';
import { CustomStampModal } from './modals/CustomStampModal';
import { InsertPageModal } from './modals/InsertPageModal';
import { LinkModal } from './modals/LinkModal';
import { UnsavedChangesModal } from './modals/UnsavedChangesModal';
import { STAMP_PRESETS } from '../../config/stampPresets';
import { Loader2 } from 'lucide-react';

interface PdfEditorMainProps {
  file: File;
  onExit: () => void;
  onExportSuccess?: (result: { url: string; filename: string; sizeBytes: number }) => void;
}

export function PdfEditorMain({ file, onExit, onExportSuccess }: PdfEditorMainProps) {
  const [documentName, setDocumentName] = useState(file.name);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [originalBytes, setOriginalBytes] = useState<ArrayBuffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Pages state
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // View settings
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState<'continuous' | 'single'>('continuous');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [enableSnapping, setEnableSnapping] = useState(true);

  // Sidebars
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  // Active tools
  const [activeMode, setActiveMode] = useState<EditorMode>('select');
  const [activeAnnotateTool, setActiveAnnotateTool] = useState<AnnotateSubTool>('highlight');
  const [activeShapeTool, setActiveShapeTool] = useState<ShapeSubTool>('rectangle');
  const [activeFormTool, setActiveFormTool] = useState<FormSubTool>('text-field');

  // Object styles state
  const [selectedColor, setSelectedColor] = useState('#E5322D');
  const [fillColor, setFillColor] = useState('transparent');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [opacity, setOpacity] = useState(1);
  const [fontFamily, setFontFamily] = useState('Helvetica');
  const [fontSize, setFontSize] = useState(14);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');

  // Objects, Bookmarks, Attachments
  const [objects, setObjects] = useState<EditorObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<PdfBookmark[]>([]);
  const [attachments, setAttachments] = useState<PdfAttachment[]>([]);
  const [clipboardObject, setClipboardObject] = useState<EditorObject | null>(null);

  // Saved signatures
  const [savedSignatures, setSavedSignatures] = useState<
    Array<{ id: string; dataUrl: string; type: string; label: string }>
  >([]);

  // Modals state
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signatureModalTab, setSignatureModalTab] = useState<'type' | 'draw' | 'upload' | 'initials' | 'company-stamp'>('type');
  const [isCustomStampModalOpen, setIsCustomStampModalOpen] = useState(false);
  const [isInsertPageModalOpen, setIsInsertPageModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<EditorHistoryStep[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Push history step
  const recordHistory = useCallback(
    (
      newObjects: EditorObject[],
      newPages: PageInfo[],
      newBookmarks: PdfBookmark[],
      newAttachments: PdfAttachment[],
      desc = 'Edit'
    ) => {
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        const nextStep: EditorHistoryStep = {
          description: desc,
          objects: JSON.parse(JSON.stringify(newObjects)),
          pages: JSON.parse(JSON.stringify(newPages)),
          bookmarks: JSON.parse(JSON.stringify(newBookmarks)),
          attachments: JSON.parse(JSON.stringify(newAttachments)),
          selectedObjectId,
        };
        return [...sliced, nextStep];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex, selectedObjectId]
  );

  // Initial document loading
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    file.arrayBuffer().then(async (ab) => {
      if (!isMounted) return;
      // Store a safe independent clone of the ArrayBuffer for export
      const storedCopy = ab.slice(0);
      setOriginalBytes(storedCopy);
      try {
        const loadedPdf = await loadPdfDocument(ab.slice(0));
        if (!isMounted) return;
        setPdfDoc(loadedPdf);

        const pageCount = loadedPdf.numPages;
        const initialPages: PageInfo[] = [];

        for (let i = 1; i <= pageCount; i++) {
          const page = await loadedPdf.getPage(i);
          const vp = page.getViewport({ scale: 1.0 });

          // Render thumbnail
          const thumbCanvas = document.createElement('canvas');
          const thumbScale = 140 / vp.width;
          const thumbVp = page.getViewport({ scale: thumbScale });
          thumbCanvas.width = thumbVp.width;
          thumbCanvas.height = thumbVp.height;
          const thumbCtx = thumbCanvas.getContext('2d');
          if (thumbCtx) {
            await (page.render({ canvasContext: thumbCtx, viewport: thumbVp } as any)).promise;
          }

          initialPages.push({
            id: `page_${i}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            pageIndex: i - 1,
            pageNumber: i,
            originalIndex: i - 1,
            width: vp.width,
            height: vp.height,
            rotation: 0,
            thumbnailUrl: thumbCanvas.toDataURL('image/png'),
          });
        }

        setPages(initialPages);
        setLoading(false);

        // Initial history snapshot
        setHistory([
          {
            description: 'Initial Document',
            objects: [],
            pages: initialPages,
            bookmarks: [],
            attachments: [],
            selectedObjectId: null,
          },
        ]);
        setHistoryIndex(0);
      } catch (err) {
        console.error('Failed to load PDF document:', err);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [file]);

  // Undo / Redo handlers
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevStep = history[historyIndex - 1];
      setObjects(JSON.parse(JSON.stringify(prevStep.objects)));
      setPages(JSON.parse(JSON.stringify(prevStep.pages)));
      setBookmarks(JSON.parse(JSON.stringify(prevStep.bookmarks)));
      setAttachments(JSON.parse(JSON.stringify(prevStep.attachments)));
      setSelectedObjectId(prevStep.selectedObjectId);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextStep = history[historyIndex + 1];
      setObjects(JSON.parse(JSON.stringify(nextStep.objects)));
      setPages(JSON.parse(JSON.stringify(nextStep.pages)));
      setBookmarks(JSON.parse(JSON.stringify(nextStep.bookmarks)));
      setAttachments(JSON.parse(JSON.stringify(nextStep.attachments)));
      setSelectedObjectId(nextStep.selectedObjectId);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  // Object mutators
  const handleAddObject = useCallback(
    (newObj: EditorObject) => {
      const updated = [...objects, newObj];
      setObjects(updated);
      setSelectedObjectId(newObj.id);
      recordHistory(updated, pages, bookmarks, attachments, `Add ${newObj.type}`);
    },
    [objects, pages, bookmarks, attachments, recordHistory]
  );

  const handleUpdateObject = useCallback(
    (id: string, updatedProps: Partial<EditorObject>) => {
      const updated = objects.map((o) => (o.id === id ? ({ ...o, ...updatedProps } as EditorObject) : o));
      setObjects(updated);
    },
    [objects]
  );

  const handleDeleteObject = useCallback(
    (id: string) => {
      const updated = objects.filter((o) => o.id !== id);
      setObjects(updated);
      if (selectedObjectId === id) setSelectedObjectId(null);
      recordHistory(updated, pages, bookmarks, attachments, 'Delete object');
    },
    [objects, pages, bookmarks, attachments, selectedObjectId, recordHistory]
  );

  const handleDuplicateSelected = useCallback(() => {
    if (!selectedObjectId) return;
    const obj = objects.find((o) => o.id === selectedObjectId);
    if (!obj) return;
    const dup: EditorObject = {
      ...JSON.parse(JSON.stringify(obj)),
      id: `${obj.type}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      xPct: Math.min(0.9, obj.xPct + 0.03),
      yPct: Math.min(0.9, obj.yPct + 0.03),
    };
    handleAddObject(dup);
  }, [selectedObjectId, objects, handleAddObject]);

  // Page reordering, deletion, rotation, insertion
  const handleRotatePage = (index: number) => {
    const updated = pages.map((p, idx) =>
      idx === index ? { ...p, rotation: ((p.rotation || 0) + 90) % 360 } : p
    );
    setPages(updated);
    recordHistory(objects, updated, bookmarks, attachments, `Rotate page ${index + 1}`);
  };

  const handleDeletePage = (index: number) => {
    if (pages.length <= 1) return;
    const updated = pages.filter((_, idx) => idx !== index);
    const updatedObjects = objects
      .filter((o) => o.pageIndex !== index)
      .map((o) => (o.pageIndex > index ? { ...o, pageIndex: o.pageIndex - 1 } : o));

    setPages(updated);
    setObjects(updatedObjects);
    if (currentPageIndex >= updated.length) {
      setCurrentPageIndex(Math.max(0, updated.length - 1));
    }
    recordHistory(updatedObjects, updated, bookmarks, attachments, `Delete page ${index + 1}`);
  };

  const handleReorderPages = (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return;
    const updated = [...pages];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);

    // Update object pageIndex so elements stay attached to their true page
    const updatedObjects = objects.map((obj) => {
      if (obj.pageIndex === fromIdx) {
        return { ...obj, pageIndex: toIdx };
      }
      if (fromIdx < toIdx && obj.pageIndex > fromIdx && obj.pageIndex <= toIdx) {
        return { ...obj, pageIndex: obj.pageIndex - 1 };
      }
      if (fromIdx > toIdx && obj.pageIndex >= toIdx && obj.pageIndex < fromIdx) {
        return { ...obj, pageIndex: obj.pageIndex + 1 };
      }
      return obj;
    });

    setPages(updated);
    setObjects(updatedObjects);
    recordHistory(updatedObjects, updated, bookmarks, attachments, `Reorder pages`);
  };

  const handleInsertBlankPage = (options: {
    pageSize: 'A4' | 'Letter';
    orientation: 'portrait' | 'landscape';
    position: 'before' | 'after' | 'end';
    targetPage: number;
  }) => {
    const isLandscape = options.orientation === 'landscape';
    let w = options.pageSize === 'Letter' ? 612 : 595.28;
    let h = options.pageSize === 'Letter' ? 792 : 841.89;
    if (isLandscape) {
      const tmp = w;
      w = h;
      h = tmp;
    }

    let insertIdx = pages.length;
    if (options.position === 'before') {
      insertIdx = Math.max(0, options.targetPage - 1);
    } else if (options.position === 'after') {
      insertIdx = Math.min(pages.length, options.targetPage);
    }

    const newPage: PageInfo = {
      id: `page_blank_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      pageIndex: insertIdx,
      pageNumber: insertIdx + 1,
      originalIndex: -1,
      width: w,
      height: h,
      rotation: 0,
      isCustomBlank: true,
      pageSizePreset: options.pageSize,
    };

    const updated = [...pages];
    updated.splice(insertIdx, 0, newPage);

    // Shift objects located on or after insert index
    const updatedObjects = objects.map((o) =>
      o.pageIndex >= insertIdx ? { ...o, pageIndex: o.pageIndex + 1 } : o
    );

    setPages(updated);
    setObjects(updatedObjects);
    recordHistory(updatedObjects, updated, bookmarks, attachments, `Insert blank page`);
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement).tagName;
      if (['INPUT', 'TEXTAREA'].includes(targetTag) || (e.target as HTMLElement).isContentEditable) {
        return;
      }

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedObjectId) {
          e.preventDefault();
          handleDeleteObject(selectedObjectId);
        }
        return;
      }

      // Duplicate (Ctrl+D)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleDuplicateSelected();
        return;
      }

      // Arrow Nudging
      if (selectedObjectId && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const obj = objects.find((o) => o.id === selectedObjectId);
        if (!obj) return;
        const step = e.shiftKey ? 0.02 : 0.003;
        let nx = obj.xPct;
        let ny = obj.yPct;
        if (e.key === 'ArrowUp') ny = Math.max(0, ny - step);
        if (e.key === 'ArrowDown') ny = Math.min(1 - obj.heightPct, ny + step);
        if (e.key === 'ArrowLeft') nx = Math.max(0, nx - step);
        if (e.key === 'ArrowRight') nx = Math.min(1 - obj.widthPct, nx + step);
        handleUpdateObject(selectedObjectId, { xPct: nx, yPct: ny });
        return;
      }

      // Quick Mode Shortcuts
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        const k = e.key.toLowerCase();
        if (k === 'v') setActiveMode('select');
        if (k === 'h') setActiveMode('hand');
        if (k === 'a') setActiveMode('annotate');
        if (k === 'u') setActiveMode('shapes');
        if (k === 'i') setActiveMode('insert');
        if (k === 't') setActiveMode('edit-text');
        if (k === 'f') setActiveMode('forms');
        if (k === 's') setActiveMode('sign');
        if (k === 'w') setActiveMode('whiteout');
        if (e.key === 'Escape') setSelectedObjectId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleUndo,
    handleRedo,
    selectedObjectId,
    handleDeleteObject,
    handleDuplicateSelected,
    objects,
    handleUpdateObject,
  ]);

  // Save and Export Real Vector PDF
  const handleSaveAndExport = async () => {
    setIsExporting(true);

    try {
      let bytesToExport: ArrayBuffer | Uint8Array | null = originalBytes;
      if (
        !bytesToExport ||
        (bytesToExport instanceof ArrayBuffer && bytesToExport.byteLength === 0) ||
        (bytesToExport instanceof Uint8Array && bytesToExport.buffer.byteLength === 0)
      ) {
        // Fresh re-read from File to guarantee valid, non-detached ArrayBuffer
        bytesToExport = await file.arrayBuffer();
        setOriginalBytes(bytesToExport);
      }

      const outputBytes = await exportEditedPdf({
        originalPdfBytes: bytesToExport,
        objects,
        pages,
        bookmarks,
        attachments,
      });

      const blob = new Blob([outputBytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const cleanFilename = documentName.toLowerCase().endsWith('.pdf') ? documentName : `${documentName}.pdf`;

      if (onExportSuccess) {
        onExportSuccess({
          url: downloadUrl,
          filename: cleanFilename,
          sizeBytes: blob.size,
        });
      } else {
        // Direct download trigger
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = cleanFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      setIsExporting(false);
    } catch (err) {
      console.error('Failed to export edited PDF:', err);
      alert('An error occurred while compiling the PDF. Please check your edits and try again.');
      setIsExporting(false);
    }
  };

  // Stamp preset insertion
  const handleInsertStampPreset = (st: typeof STAMP_PRESETS[0]) => {
    const newStamp: StampEditorObject = {
      id: `stamp_${Date.now()}`,
      pageIndex: currentPageIndex,
      type: 'stamp',
      stampType: st.id,
      label: st.label,
      date: new Date().toLocaleDateString(),
      color: st.color,
      xPct: 0.35,
      yPct: 0.3,
      widthPct: 0.3,
      heightPct: 0.1,
      rotation: st.rotation,
    };
    handleAddObject(newStamp);
  };

  // Image Upload insertion
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const newImg: EditorObject = {
          id: `img_${Date.now()}`,
          pageIndex: currentPageIndex,
          type: 'image',
          dataUrl,
          mimeType: file.type,
          aspectRatio: 1,
          maintainAspect: true,
          xPct: 0.3,
          yPct: 0.3,
          widthPct: 0.35,
          heightPct: 0.25,
        } as any;
        handleAddObject(newImg);
      };
      reader.readAsDataURL(file);
    }
  };

  // Text Box manual addition
  const handleAddTextBox = () => {
    const newText: TextEditorObject = {
      id: `txt_${Date.now()}`,
      pageIndex: currentPageIndex,
      type: 'text',
      text: 'Click to edit text',
      xPct: 0.35,
      yPct: 0.4,
      widthPct: 0.3,
      heightPct: 0.06,
      fontSize,
      fontFamily,
      color: selectedColor || '#000000',
      bold: isBold,
      italic: isItalic,
      underline: isUnderline,
      strikethrough: isStrikethrough,
      align: textAlign,
    };
    handleAddObject(newText);
  };

  const selectedObject = objects.find((o) => o.id === selectedObjectId) || null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#F4F5F9] flex flex-col items-center justify-center gap-4">
        <Loader2 size={36} className="text-[#E5322D] animate-spin" />
        <div className="text-center">
          <p className="text-sm font-bold text-gray-800">Initializing PDF Editor...</p>
          <p className="text-xs text-gray-500">Rendering high-definition vector pages and extracting text layer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#F4F5F9] flex flex-col overflow-hidden font-sans">
      {/* 1. TOP PRIMARY NAVBAR */}
      <EditorTopNavbar
        documentName={documentName}
        onDocumentNameChange={setDocumentName}
        activeMode={activeMode}
        onModeChange={(m) => {
          setActiveMode(m);
          setSelectedObjectId(null);
        }}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        undoCount={historyIndex}
        redoCount={history.length - 1 - historyIndex}
        onSaveAndExport={handleSaveAndExport}
        isExporting={isExporting}
        onBack={() => {
          if (historyIndex > 0) setIsUnsavedModalOpen(true);
          else onExit();
        }}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
            setIsFullscreen(true);
          } else {
            document.exitFullscreen().catch(() => {});
            setIsFullscreen(false);
          }
        }}
      />

      {/* 2. DYNAMIC SECONDARY SUB-TOOLBAR */}
      <EditorSubToolbar
        activeMode={activeMode}
        activeAnnotateTool={activeAnnotateTool}
        onAnnotateToolChange={setActiveAnnotateTool}
        activeShapeTool={activeShapeTool}
        onShapeToolChange={setActiveShapeTool}
        activeFormTool={activeFormTool}
        onFormToolChange={setActiveFormTool}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        fillColor={fillColor}
        onFillColorChange={setFillColor}
        strokeWidth={strokeWidth}
        onStrokeWidthChange={setStrokeWidth}
        opacity={opacity}
        onOpacityChange={setOpacity}
        fontFamily={fontFamily}
        onFontFamilyChange={setFontFamily}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        isBold={isBold}
        onToggleBold={() => setIsBold(!isBold)}
        isItalic={isItalic}
        onToggleItalic={() => setIsItalic(!isItalic)}
        isUnderline={isUnderline}
        onToggleUnderline={() => setIsUnderline(!isUnderline)}
        isStrikethrough={isStrikethrough}
        onToggleStrikethrough={() => setIsStrikethrough(!isStrikethrough)}
        textAlign={textAlign}
        onTextAlignChange={setTextAlign}
        onOpenSignatureModal={(tab) => {
          setSignatureModalTab(tab || 'type');
          setIsSignatureModalOpen(true);
        }}
        onOpenCustomStampModal={() => setIsCustomStampModalOpen(true)}
        onOpenLinkModal={() => setIsLinkModalOpen(true)}
        onInsertStampPreset={handleInsertStampPreset}
        onImageUpload={handleImageUpload}
        onAddTextBox={handleAddTextBox}
      />

      {/* 3. MAIN WORKSPACE ROW */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT SIDEBAR */}
        <EditorLeftSidebar
          isOpen={isLeftSidebarOpen}
          onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          pages={pages}
          currentPageIndex={currentPageIndex}
          onSelectPage={setCurrentPageIndex}
          onRotatePage={handleRotatePage}
          onDeletePage={handleDeletePage}
          onReorderPages={handleReorderPages}
          onOpenInsertPageModal={() => setIsInsertPageModalOpen(true)}
          objects={objects}
          selectedObjectId={selectedObjectId}
          onSelectObject={setSelectedObjectId}
          onToggleObjectVisibility={(id) => {
            const obj = objects.find((o) => o.id === id);
            if (obj) handleUpdateObject(id, { visible: obj.visible === false });
          }}
          onToggleObjectLock={(id) => {
            const obj = objects.find((o) => o.id === id);
            if (obj) handleUpdateObject(id, { locked: !obj.locked });
          }}
          onDeleteObject={handleDeleteObject}
          onReorderObjectLayer={(id, dir) => {
            const idx = objects.findIndex((o) => o.id === id);
            if (idx < 0) return;
            const updated = [...objects];
            if (dir === 'up' && idx < updated.length - 1) {
              const tmp = updated[idx];
              updated[idx] = updated[idx + 1];
              updated[idx + 1] = tmp;
            } else if (dir === 'down' && idx > 0) {
              const tmp = updated[idx];
              updated[idx] = updated[idx - 1];
              updated[idx - 1] = tmp;
            }
            setObjects(updated);
          }}
          bookmarks={bookmarks}
          onAddBookmark={(title, pageNumber) => {
            setBookmarks([...bookmarks, { id: `bm_${Date.now()}`, title, pageNumber }]);
          }}
          onDeleteBookmark={(id) => setBookmarks(bookmarks.filter((b) => b.id !== id))}
          attachments={attachments}
          onAddAttachment={async (attFile) => {
            const ab = await attFile.arrayBuffer();
            setAttachments([
              ...attachments,
              {
                id: `att_${Date.now()}`,
                name: attFile.name,
                size: attFile.size,
                type: attFile.type,
                data: new Uint8Array(ab),
              },
            ]);
          }}
          onDeleteAttachment={(id) => setAttachments(attachments.filter((a) => a.id !== id))}
          savedSignatures={savedSignatures}
          onPlaceSavedSignature={(dataUrl, sigType) => {
            const newSig: SignatureEditorObject = {
              id: `sig_${Date.now()}`,
              pageIndex: currentPageIndex,
              type: 'signature',
              sigType,
              dataUrl,
              xPct: 0.35,
              yPct: 0.45,
              widthPct: 0.28,
              heightPct: 0.12,
            };
            handleAddObject(newSig);
          }}
          onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
          onToggleCommentStatus={(id) => {
            const obj = objects.find((o) => o.id === id) as any;
            if (obj) {
              handleUpdateObject(id, { status: obj.status === 'resolved' ? 'open' : 'resolved' });
            }
          }}
        />

        {/* CENTER INTERACTIVE WORKSPACE */}
        <EditorWorkspace
          pdfDoc={pdfDoc}
          pages={pages}
          currentPageIndex={currentPageIndex}
          onPageChange={setCurrentPageIndex}
          zoom={zoom}
          viewMode={viewMode}
          activeMode={activeMode}
          activeAnnotateTool={activeAnnotateTool}
          activeShapeTool={activeShapeTool}
          activeFormTool={activeFormTool}
          selectedColor={selectedColor}
          fillColor={fillColor}
          strokeWidth={strokeWidth}
          opacity={opacity}
          fontFamily={fontFamily}
          fontSize={fontSize}
          isBold={isBold}
          isItalic={isItalic}
          isUnderline={isUnderline}
          isStrikethrough={isStrikethrough}
          textAlign={textAlign}
          objects={objects}
          selectedObjectId={selectedObjectId}
          onSelectObject={setSelectedObjectId}
          onAddObject={handleAddObject}
          onUpdateObject={handleUpdateObject}
          onDeleteObject={handleDeleteObject}
          enableSnapping={enableSnapping}
        />

        {/* RIGHT PROPERTIES PANEL */}
        <EditorRightPropertiesPanel
          isOpen={isRightPanelOpen}
          onClose={() => setIsRightPanelOpen(false)}
          selectedObject={selectedObject}
          onUpdateObject={(props) => {
            if (selectedObjectId) handleUpdateObject(selectedObjectId, props);
          }}
          onDeleteSelectedObject={() => {
            if (selectedObjectId) handleDeleteObject(selectedObjectId);
          }}
          onDuplicateSelectedObject={handleDuplicateSelected}
          onBringForward={() => {
            if (selectedObjectId) {
              const idx = objects.findIndex((o) => o.id === selectedObjectId);
              if (idx >= 0 && idx < objects.length - 1) {
                const updated = [...objects];
                const tmp = updated[idx];
                updated[idx] = updated[idx + 1];
                updated[idx + 1] = tmp;
                setObjects(updated);
              }
            }
          }}
          onSendBackward={() => {
            if (selectedObjectId) {
              const idx = objects.findIndex((o) => o.id === selectedObjectId);
              if (idx > 0) {
                const updated = [...objects];
                const tmp = updated[idx];
                updated[idx] = updated[idx - 1];
                updated[idx - 1] = tmp;
                setObjects(updated);
              }
            }
          }}
          currentPageInfo={pages[currentPageIndex]}
          enableSnapping={enableSnapping}
          onToggleSnapping={() => setEnableSnapping(!enableSnapping)}
        />

        {/* FLOATING BOTTOM NAV BAR */}
        <EditorFloatingBottomBar
          currentPage={currentPageIndex + 1}
          totalPages={pages.length || 1}
          onPageChange={(p) => setCurrentPageIndex(p - 1)}
          zoom={zoom}
          onZoomChange={setZoom}
          onFitWidth={() => setZoom(100)}
          onFitPage={() => setZoom(75)}
          viewMode={viewMode}
          onToggleViewMode={() => setViewMode(viewMode === 'continuous' ? 'single' : 'continuous')}
        />
      </div>

      {/* MODALS */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        defaultTab={signatureModalTab}
        onSaveSignature={(dataUrl, sigType) => {
          const newSig: SignatureEditorObject = {
            id: `sig_${Date.now()}`,
            pageIndex: currentPageIndex,
            type: 'signature',
            sigType,
            dataUrl,
            xPct: 0.35,
            yPct: 0.45,
            widthPct: 0.28,
            heightPct: 0.12,
          };
          handleAddObject(newSig);

          // Also save to library
          setSavedSignatures((prev) => [
            ...prev,
            { id: `saved_sig_${Date.now()}`, dataUrl, type: sigType, label: `${sigType.toUpperCase()} Signature` },
          ]);
        }}
      />

      <CustomStampModal
        isOpen={isCustomStampModalOpen}
        onClose={() => setIsCustomStampModalOpen(false)}
        onSaveStamp={(st) => {
          const newStamp: StampEditorObject = {
            id: `stamp_${Date.now()}`,
            pageIndex: currentPageIndex,
            type: 'stamp',
            stampType: 'CUSTOM',
            label: st.label,
            date: st.date,
            color: st.color,
            borderStyle: st.borderStyle,
            xPct: 0.35,
            yPct: 0.35,
            widthPct: 0.32,
            heightPct: 0.11,
          };
          handleAddObject(newStamp);
        }}
      />

      <InsertPageModal
        isOpen={isInsertPageModalOpen}
        onClose={() => setIsInsertPageModalOpen(false)}
        currentPageNumber={currentPageIndex + 1}
        totalPages={pages.length}
        onInsertPage={handleInsertBlankPage}
      />

      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        totalPages={pages.length}
        onSaveLink={(linkData) => {
          const newLink: EditorObject = {
            id: `link_${Date.now()}`,
            pageIndex: currentPageIndex,
            type: 'link',
            url: linkData.url,
            targetPage: linkData.targetPage,
            xPct: 0.35,
            yPct: 0.4,
            widthPct: 0.2,
            heightPct: 0.05,
          } as any;
          handleAddObject(newLink);
        }}
      />

      <UnsavedChangesModal
        isOpen={isUnsavedModalOpen}
        onCancel={() => setIsUnsavedModalOpen(false)}
        onDiscard={() => {
          setIsUnsavedModalOpen(false);
          onExit();
        }}
        onSave={() => {
          setIsUnsavedModalOpen(false);
          handleSaveAndExport();
        }}
      />
    </div>
  );
}
