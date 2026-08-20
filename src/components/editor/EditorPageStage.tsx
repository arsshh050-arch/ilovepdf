import React, { useState, useEffect, useRef } from 'react';
import {
  EditorMode,
  AnnotateSubTool,
  ShapeSubTool,
  EditorObject,
  PageInfo,
  TextEditorObject,
  ShapeEditorObject,
  DrawingEditorObject,
  AnnotationMarkupObject,
  ImageEditorObject,
  StampEditorObject,
  SignatureEditorObject,
  WhiteoutEditorObject,
  FormFieldEditorObject,
  DetectedTextBlock,
} from '../../types/pdfEditor';
import { screenToNormalized, snapToGuides } from '../../utils/pdfCoordinates';
import { extractPageTextBlocks } from '../../utils/pdfTextDetection';

interface EditorPageStageProps {
  pageInfo: PageInfo;
  pageIdx: number;
  pdfDoc: any;
  zoom: number;
  activeMode: EditorMode;
  activeAnnotateTool: AnnotateSubTool;
  activeShapeTool: ShapeSubTool;
  isSpacePressed: boolean;
  selectedColor: string;
  fillColor: string;
  strokeWidth: number;
  fontSize: number;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  objects: EditorObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string | null) => void;
  onAddObject: (object: EditorObject) => void;
  onUpdateObject: (id: string, updated: Partial<EditorObject>) => void;
  enableSnapping: boolean;
}

export function EditorPageStage({
  pageInfo,
  pageIdx,
  pdfDoc,
  zoom,
  activeMode,
  activeAnnotateTool,
  activeShapeTool,
  isSpacePressed,
  selectedColor,
  fillColor,
  strokeWidth,
  fontSize,
  fontFamily,
  isBold,
  isItalic,
  isUnderline,
  isStrikethrough,
  textAlign,
  objects,
  selectedObjectId,
  onSelectObject,
  onAddObject,
  onUpdateObject,
  enableSnapping,
}: EditorPageStageProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);

  // Text layer cache for this page
  const [detectedTextBlocks, setDetectedTextBlocks] = useState<DetectedTextBlock[]>([]);
  const [isRendering, setIsRendering] = useState(false);

  // Freehand stroke state
  const [isFreehandDrawing, setIsFreehandDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Array<{ xPct: number; yPct: number }> | null>(null);

  // Creation state
  const [isCreating, setIsCreating] = useState(false);
  const [creationStart, setCreationStart] = useState<{ xPct: number; yPct: number } | null>(null);
  const [currentCreationRect, setCurrentCreationRect] = useState<{
    xPct: number;
    yPct: number;
    widthPct: number;
    heightPct: number;
  } | null>(null);

  // Drag / resize state
  const [isDraggingObject, setIsDraggingObject] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ xPct: number; yPct: number } | null>(null);
  const [activeGuide, setActiveGuide] = useState<{ guideX?: number; guideY?: number }>({});
  const [activeResizeHandle, setActiveResizeHandle] = useState<string | null>(null);
  const [resizeInitialRect, setResizeInitialRect] = useState<{
    xPct: number;
    yPct: number;
    widthPct: number;
    heightPct: number;
  } | null>(null);

  // 1. PDF.js Canvas Rendering with strict cancellation & cleanups
  useEffect(() => {
    let isCancelled = false;

    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch {
        // ignore cancel error
      }
      renderTaskRef.current = null;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderPage = async () => {
      const origIdx = pageInfo.originalIndex;
      const totalRotation = (pageInfo.rotation || 0) % 360;
      const isRotated90or270 = totalRotation === 90 || totalRotation === 270;
      const baseWidth = isRotated90or270 ? (pageInfo.height || 841.89) : (pageInfo.width || 595.28);
      const baseHeight = isRotated90or270 ? (pageInfo.width || 595.28) : (pageInfo.height || 841.89);

      if (!pdfDoc || origIdx < 0 || origIdx >= pdfDoc.numPages) {
        // Blank page rendering
        const scale = zoom / 100;
        const w = Math.round(baseWidth * scale);
        const h = Math.round(baseHeight * scale);

        canvas.width = w;
        canvas.height = h;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, w, h);
        }
        setDetectedTextBlocks([]);
        return;
      }

      setIsRendering(true);

      try {
        const pdfPage = await pdfDoc.getPage(origIdx + 1);
        if (isCancelled) return;

        const pixelRatio = window.devicePixelRatio || 1;
        const dprMultiplier = pixelRatio > 1 ? 1.5 : 1;
        const docPageRotation = pdfPage.rotate || 0;
        const effectiveRotation = (docPageRotation + (pageInfo.rotation || 0)) % 360;

        const renderScale = (zoom / 100) * dprMultiplier;
        const viewport = pdfPage.getViewport({ scale: renderScale, rotation: effectiveRotation });

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${viewport.width / dprMultiplier}px`;
        canvas.style.height = `${viewport.height / dprMultiplier}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const renderTask = pdfPage.render({
          canvasContext: ctx,
          viewport,
        });
        renderTaskRef.current = renderTask;

        await renderTask.promise;
        if (isCancelled) return;

        // Extract text blocks for this page for interactive text editing/annotations
        try {
          const extracted = await extractPageTextBlocks(pdfDoc, origIdx);
          if (!isCancelled) {
            setDetectedTextBlocks(extracted.blocks || []);
          }
        } catch {
          // ignore text extraction failures
        }
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn(`Failed to render page ${pageIdx + 1}:`, err);
        }
      } finally {
        if (!isCancelled) {
          setIsRendering(false);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
        renderTaskRef.current = null;
      }
    };
  }, [pdfDoc, pageInfo.originalIndex, pageInfo.rotation, pageInfo.width, pageInfo.height, zoom, pageIdx]);

  // Compute container dimensions accounting for rotation
  const totalRotation = (pageInfo.rotation || 0) % 360;
  const isRotated90or270 = totalRotation === 90 || totalRotation === 270;
  const stageWidth = (isRotated90or270 ? (pageInfo.height || 841.89) : (pageInfo.width || 595.28)) * (zoom / 100);
  const stageHeight = (isRotated90or270 ? (pageInfo.width || 595.28) : (pageInfo.height || 841.89)) * (zoom / 100);

  // Mouse Handlers on Page
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeMode === 'hand' || isSpacePressed) return;
    if (!stageRef.current) return;

    const pageRect = stageRef.current.getBoundingClientRect();
    const { xPct, yPct } = screenToNormalized(e.clientX, e.clientY, pageRect);

    // 1. FREEHAND PEN OR MARKER
    if (activeMode === 'annotate' && (activeAnnotateTool === 'freehand' || activeAnnotateTool === 'marker')) {
      setIsFreehandDrawing(true);
      setCurrentStroke([{ xPct, yPct }]);
      return;
    }

    // 2. SHAPE CREATION
    if (activeMode === 'shapes') {
      setIsCreating(true);
      setCreationStart({ xPct, yPct });
      setCurrentCreationRect({ xPct, yPct, widthPct: 0.01, heightPct: 0.01 });
      return;
    }

    // 3. WHITEOUT CREATION
    if (activeMode === 'whiteout') {
      setIsCreating(true);
      setCreationStart({ xPct, yPct });
      setCurrentCreationRect({ xPct, yPct, widthPct: 0.01, heightPct: 0.01 });
      return;
    }

    // 4. STICKY NOTE COMMENT PLACEMENT
    if (activeMode === 'annotate' && activeAnnotateTool === 'comment') {
      const newComment: EditorObject = {
        id: `comment_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        pageIndex: pageIdx,
        type: 'comment',
        xPct,
        yPct,
        widthPct: 0.05,
        heightPct: 0.04,
        author: 'User',
        text: 'Add your note here...',
        date: new Date().toLocaleDateString(),
        status: 'open',
        color: selectedColor || '#F59E0B',
      } as any;
      onAddObject(newComment);
      return;
    }

    // 5. TEXT BOX CREATION
    if (activeMode === 'edit-text') {
      const newText: TextEditorObject = {
        id: `txt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        pageIndex: pageIdx,
        type: 'text',
        text: 'Click to edit text',
        xPct,
        yPct,
        widthPct: 0.28,
        heightPct: 0.05,
        fontSize,
        fontFamily,
        color: selectedColor || '#000000',
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        strikethrough: isStrikethrough,
        align: textAlign,
      };
      onAddObject(newText);
      return;
    }

    // Otherwise deselect if clicked empty background
    if (activeMode === 'select') {
      onSelectObject(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!stageRef.current) return;
    const pageRect = stageRef.current.getBoundingClientRect();
    const { xPct, yPct } = screenToNormalized(e.clientX, e.clientY, pageRect);

    // Freehand drawing in progress
    if (isFreehandDrawing && currentStroke) {
      setCurrentStroke((prev) => (prev ? [...prev, { xPct, yPct }] : [{ xPct, yPct }]));
      return;
    }

    // Creation in progress
    if (isCreating && creationStart) {
      const minX = Math.min(creationStart.xPct, xPct);
      const minY = Math.min(creationStart.yPct, yPct);
      const w = Math.max(0.01, Math.abs(xPct - creationStart.xPct));
      const h = Math.max(0.01, Math.abs(yPct - creationStart.yPct));
      setCurrentCreationRect({ xPct: minX, yPct: minY, widthPct: w, heightPct: h });
      return;
    }

    // Dragging selected object
    if (isDraggingObject && selectedObjectId && dragOffset) {
      const obj = objects.find((o) => o.id === selectedObjectId);
      if (obj && obj.pageIndex === pageIdx) {
        let newXPct = Math.max(0, Math.min(1 - obj.widthPct, xPct - dragOffset.xPct));
        let newYPct = Math.max(0, Math.min(1 - obj.heightPct, yPct - dragOffset.yPct));

        if (enableSnapping) {
          const snapped = snapToGuides(newXPct, newYPct, obj.widthPct, obj.heightPct);
          newXPct = snapped.xPct;
          newYPct = snapped.yPct;
          setActiveGuide({ guideX: snapped.guideX, guideY: snapped.guideY });
        }

        onUpdateObject(obj.id, { xPct: newXPct, yPct: newYPct });
      }
      return;
    }

    // Resizing selected object
    if (activeResizeHandle && selectedObjectId && resizeInitialRect) {
      const obj = objects.find((o) => o.id === selectedObjectId);
      if (obj && obj.pageIndex === pageIdx) {
        const { xPct: origX, yPct: origY, widthPct: origW, heightPct: origH } = resizeInitialRect;
        let newX = origX;
        let newY = origY;
        let newW = origW;
        let newH = origH;

        if (activeResizeHandle.includes('e')) {
          newW = Math.max(0.02, xPct - origX);
        }
        if (activeResizeHandle.includes('s')) {
          newH = Math.max(0.02, yPct - origY);
        }
        if (activeResizeHandle.includes('w')) {
          const right = origX + origW;
          newX = Math.min(right - 0.02, xPct);
          newW = right - newX;
        }
        if (activeResizeHandle.includes('n')) {
          const bottom = origY + origH;
          newY = Math.min(bottom - 0.02, yPct);
          newH = bottom - newY;
        }

        onUpdateObject(obj.id, { xPct: newX, yPct: newY, widthPct: newW, heightPct: newH });
      }
    }
  };

  const handleMouseUp = () => {
    // Finish freehand drawing
    if (isFreehandDrawing && currentStroke && currentStroke.length > 1) {
      const newDrawing: DrawingEditorObject = {
        id: `draw_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        pageIndex: pageIdx,
        type: 'drawing',
        points: currentStroke,
        strokeColor: selectedColor || '#000000',
        strokeWidth: strokeWidth || 2,
        isMarker: activeAnnotateTool === 'marker',
        xPct: 0,
        yPct: 0,
        widthPct: 1,
        heightPct: 1,
      };
      onAddObject(newDrawing);
      setCurrentStroke(null);
      setIsFreehandDrawing(false);
      return;
    }

    // Finish shape creation
    if (isCreating && currentCreationRect && creationStart) {
      if (activeMode === 'shapes') {
        const newShape: ShapeEditorObject = {
          id: `shape_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          pageIndex: pageIdx,
          type: 'shape',
          shapeType: activeShapeTool,
          xPct: currentCreationRect.xPct,
          yPct: currentCreationRect.yPct,
          widthPct: currentCreationRect.widthPct,
          heightPct: currentCreationRect.heightPct,
          strokeColor: selectedColor || '#E5322D',
          fillColor: fillColor || 'transparent',
          strokeWidth: strokeWidth || 2,
        };
        onAddObject(newShape);
      } else if (activeMode === 'whiteout') {
        const newWhiteout: WhiteoutEditorObject = {
          id: `wo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          pageIndex: pageIdx,
          type: 'whiteout',
          xPct: currentCreationRect.xPct,
          yPct: currentCreationRect.yPct,
          widthPct: currentCreationRect.widthPct,
          heightPct: currentCreationRect.heightPct,
          color: fillColor || '#FFFFFF',
        };
        onAddObject(newWhiteout);
      }
      setIsCreating(false);
      setCreationStart(null);
      setCurrentCreationRect(null);
      return;
    }

    setIsDraggingObject(false);
    setDragOffset(null);
    setActiveResizeHandle(null);
    setResizeInitialRect(null);
    setActiveGuide({});
  };

  // Convert detected original text block to editable text object
  const handleEditOriginalTextBlock = (block: DetectedTextBlock) => {
    const newEditableText: TextEditorObject = {
      id: `edit_orig_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      pageIndex: pageIdx,
      type: 'text',
      text: block.text,
      xPct: block.xPct,
      yPct: block.yPct,
      widthPct: block.widthPct,
      heightPct: block.heightPct,
      fontSize: block.fontSize,
      fontFamily: block.fontFamily,
      color: block.color || '#000000',
      backgroundColor: '#FFFFFF',
      isOriginalEdit: true,
      originalText: block.text,
      originalBounds: block.pdfPoints,
    };
    onAddObject(newEditableText);
    onSelectObject(newEditableText.id);
  };

  // Direct text annotation
  const handleAnnotateOriginalText = (
    block: DetectedTextBlock,
    annotType: 'highlight' | 'underline' | 'strikeout' | 'squiggly'
  ) => {
    const annotObj: AnnotationMarkupObject = {
      id: `annot_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      pageIndex: pageIdx,
      type: 'annotation',
      annotationType: annotType,
      rects: [{ xPct: block.xPct, yPct: block.yPct, widthPct: block.widthPct, heightPct: block.heightPct }],
      color: selectedColor || '#FFD600',
      textSnippet: block.text,
      xPct: block.xPct,
      yPct: block.yPct,
      widthPct: block.widthPct,
      heightPct: block.heightPct,
    };
    onAddObject(annotObj);
  };

  const pageObjects = objects.filter((o) => o.pageIndex === pageIdx);

  return (
    <div
      ref={stageRef}
      id={`editor-page-${pageIdx}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative bg-white shadow-2xl rounded-xs border border-gray-300 select-none overflow-visible transition-shadow"
      style={{
        width: `${stageWidth}px`,
        height: `${stageHeight}px`,
      }}
    >
      {/* 1. PDF.JS CANVAS RENDER LAYER */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none block"
      />

      {/* 2. TEXT DETECTION & INTERACTION LAYER */}
      {detectedTextBlocks.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {detectedTextBlocks.map((block) => (
            <div
              key={block.id}
              onClick={(e) => {
                e.stopPropagation();
                if (activeMode === 'edit-text') {
                  handleEditOriginalTextBlock(block);
                } else if (
                  activeMode === 'annotate' &&
                  ['highlight', 'underline', 'strikeout', 'squiggly'].includes(activeAnnotateTool)
                ) {
                  handleAnnotateOriginalText(block, activeAnnotateTool as any);
                }
              }}
              style={{
                left: `${block.xPct * 100}%`,
                top: `${block.yPct * 100}%`,
                width: `${block.widthPct * 100}%`,
                height: `${block.heightPct * 100}%`,
              }}
              className={`absolute transition-colors ${
                activeMode === 'edit-text'
                  ? 'pointer-events-auto hover:border-2 hover:border-[#E5322D] hover:bg-[#E5322D]/10 cursor-text rounded-xs'
                  : activeMode === 'annotate' &&
                    ['highlight', 'underline', 'strikeout', 'squiggly'].includes(activeAnnotateTool)
                  ? 'pointer-events-auto hover:bg-[#FFD600]/30 cursor-pointer rounded-xs'
                  : ''
              }`}
              title={
                activeMode === 'edit-text'
                  ? 'Click to edit this text in place'
                  : activeMode === 'annotate'
                  ? 'Click to highlight/annotate text'
                  : undefined
              }
            />
          ))}
        </div>
      )}

      {/* 3. EDITOR OBJECTS LAYER */}
      <div className="absolute inset-0 pointer-events-auto">
        {pageObjects.map((obj) => {
          if (obj.visible === false) return null;
          const isSelected = selectedObjectId === obj.id;

          return (
            <div
              key={obj.id}
              id={`editor-obj-${obj.id}`}
              onMouseDown={(e) => {
                if (activeMode !== 'select' && activeMode !== 'edit-text') return;
                e.stopPropagation();
                onSelectObject(obj.id);
                if (!obj.locked && stageRef.current) {
                  const rect = stageRef.current.getBoundingClientRect();
                  const { xPct, yPct } = screenToNormalized(e.clientX, e.clientY, rect);
                  setIsDraggingObject(true);
                  setDragOffset({ xPct: xPct - obj.xPct, yPct: yPct - obj.yPct });
                }
              }}
              style={{
                left: `${obj.xPct * 100}%`,
                top: `${obj.yPct * 100}%`,
                width: `${obj.widthPct * 100}%`,
                height: `${obj.heightPct * 100}%`,
                opacity: obj.opacity !== undefined ? obj.opacity : 1,
                transform: obj.rotation ? `rotate(${obj.rotation}deg)` : undefined,
                zIndex: obj.zIndex || 10,
              }}
              className={`absolute ${
                isSelected
                  ? 'ring-2 ring-[#E5322D] ring-offset-1 shadow-md'
                  : 'hover:ring-1 hover:ring-blue-400'
              } ${obj.locked ? 'cursor-not-allowed' : 'cursor-move'}`}
            >
              {/* A. TEXT OBJECT */}
              {obj.type === 'text' && (
                <div
                  style={{
                    fontFamily: (obj as TextEditorObject).fontFamily,
                    fontSize: `${((obj as TextEditorObject).fontSize || 14) * (zoom / 100)}px`,
                    color: (obj as TextEditorObject).color || '#000000',
                    backgroundColor: (obj as TextEditorObject).backgroundColor || 'transparent',
                    fontWeight: (obj as TextEditorObject).bold ? 'bold' : 'normal',
                    fontStyle: (obj as TextEditorObject).italic ? 'italic' : 'normal',
                    textDecoration: [
                      (obj as TextEditorObject).underline ? 'underline' : '',
                      (obj as TextEditorObject).strikethrough ? 'line-through' : '',
                    ].join(' '),
                    textAlign: (obj as TextEditorObject).align || 'left',
                  }}
                  className="w-full h-full p-1 whitespace-pre-wrap break-words outline-hidden select-text"
                  contentEditable={isSelected}
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdateObject(obj.id, { text: e.currentTarget.innerText })}
                >
                  {(obj as TextEditorObject).text}
                </div>
              )}

              {/* B. WHITEOUT OBJECT */}
              {obj.type === 'whiteout' && (
                <div
                  style={{ backgroundColor: (obj as WhiteoutEditorObject).color || '#FFFFFF' }}
                  className="w-full h-full shadow-xs"
                />
              )}

              {/* C. SHAPE OBJECT */}
              {obj.type === 'shape' && (
                <svg className="w-full h-full overflow-visible pointer-events-none">
                  {(obj as ShapeEditorObject).shapeType === 'rectangle' && (
                    <rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      stroke={(obj as ShapeEditorObject).strokeColor || '#E5322D'}
                      strokeWidth={(obj as ShapeEditorObject).strokeWidth || 2}
                      fill={(obj as ShapeEditorObject).fillColor || 'transparent'}
                    />
                  )}
                  {(obj as ShapeEditorObject).shapeType === 'circle' && (
                    <ellipse
                      cx="50%"
                      cy="50%"
                      rx="48%"
                      ry="48%"
                      stroke={(obj as ShapeEditorObject).strokeColor || '#E5322D'}
                      strokeWidth={(obj as ShapeEditorObject).strokeWidth || 2}
                      fill={(obj as ShapeEditorObject).fillColor || 'transparent'}
                    />
                  )}
                  {(obj as ShapeEditorObject).shapeType === 'line' && (
                    <line
                      x1="0"
                      y1="0"
                      x2="100%"
                      y2="100%"
                      stroke={(obj as ShapeEditorObject).strokeColor || '#E5322D'}
                      strokeWidth={(obj as ShapeEditorObject).strokeWidth || 2}
                    />
                  )}
                  {(obj as ShapeEditorObject).shapeType === 'arrow' && (
                    <g>
                      <line
                        x1="0"
                        y1="0"
                        x2="100%"
                        y2="100%"
                        stroke={(obj as ShapeEditorObject).strokeColor || '#E5322D'}
                        strokeWidth={(obj as ShapeEditorObject).strokeWidth || 2}
                      />
                      <circle
                        cx="100%"
                        cy="100%"
                        r={(obj as ShapeEditorObject).strokeWidth * 2 || 4}
                        fill={(obj as ShapeEditorObject).strokeColor || '#E5322D'}
                      />
                    </g>
                  )}
                </svg>
              )}

              {/* D. ANNOTATION OBJECT */}
              {obj.type === 'annotation' && (
                <div
                  style={{
                    backgroundColor:
                      (obj as AnnotationMarkupObject).annotationType === 'highlight'
                        ? (obj as AnnotationMarkupObject).color || '#FFD600'
                        : 'transparent',
                    borderBottom:
                      (obj as AnnotationMarkupObject).annotationType === 'underline'
                        ? `2px solid ${(obj as AnnotationMarkupObject).color || '#E5322D'}`
                        : (obj as AnnotationMarkupObject).annotationType === 'squiggly'
                        ? `2px dashed ${(obj as AnnotationMarkupObject).color || '#E5322D'}`
                        : undefined,
                  }}
                  className="w-full h-full mix-blend-multiply opacity-80"
                />
              )}

              {/* E. STAMP OBJECT */}
              {obj.type === 'stamp' && (
                <div
                  style={{
                    borderColor: (obj as StampEditorObject).color || '#E5322D',
                    color: (obj as StampEditorObject).color || '#E5322D',
                  }}
                  className="w-full h-full border-4 rounded-md flex flex-col items-center justify-center p-2 text-center bg-white/90 shadow-sm"
                >
                  <span className="font-black tracking-widest text-sm uppercase truncate">
                    {(obj as StampEditorObject).label}
                  </span>
                  {(obj as StampEditorObject).date && (
                    <span className="text-[10px] font-semibold opacity-90 mt-0.5">
                      {(obj as StampEditorObject).date}
                    </span>
                  )}
                </div>
              )}

              {/* F. IMAGE & SIGNATURE OBJECT */}
              {(obj.type === 'image' || obj.type === 'signature') && (
                <img
                  src={(obj as ImageEditorObject | SignatureEditorObject).dataUrl}
                  alt="Inserted object"
                  className="w-full h-full object-contain pointer-events-none"
                />
              )}

              {/* G. COMMENT OBJECT */}
              {obj.type === 'comment' && (
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg border-2 border-white text-sm">
                  💬
                </div>
              )}

              {/* H. FORM FIELD OBJECT */}
              {obj.type === 'form-field' && (
                <div className="w-full h-full bg-[#F9FAFB] border border-[#9CA3AF] rounded p-1 flex items-center justify-center text-xs font-semibold text-gray-700 shadow-2xs">
                  {(obj as FormFieldEditorObject).fieldType === 'checkbox' ? (
                    <input type="checkbox" className="w-4 h-4 text-[#E5322D]" />
                  ) : (obj as FormFieldEditorObject).fieldType === 'signature' ? (
                    <span className="text-[#E5322D] text-[11px] font-bold">✍️ Sign Here</span>
                  ) : (
                    <span className="truncate text-gray-500">
                      {(obj as FormFieldEditorObject).placeholder || (obj as FormFieldEditorObject).name}
                    </span>
                  )}
                </div>
              )}

              {/* RESIZE HANDLES FOR SELECTED OBJECT */}
              {isSelected && !obj.locked && (
                <>
                  {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map((handle) => (
                    <div
                      key={handle}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setActiveResizeHandle(handle);
                        setResizeInitialRect({
                          xPct: obj.xPct,
                          yPct: obj.yPct,
                          widthPct: obj.widthPct,
                          heightPct: obj.heightPct,
                        });
                      }}
                      className={`absolute w-3 h-3 bg-white border-2 border-[#E5322D] rounded-full shadow-xs z-30 ${
                        handle === 'nw'
                          ? '-top-1.5 -left-1.5 cursor-nwse-resize'
                          : handle === 'n'
                          ? '-top-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize'
                          : handle === 'ne'
                          ? '-top-1.5 -right-1.5 cursor-nesw-resize'
                          : handle === 'e'
                          ? 'top-1/2 -right-1.5 -translate-y-1/2 cursor-ew-resize'
                          : handle === 'se'
                          ? '-bottom-1.5 -right-1.5 cursor-nwse-resize'
                          : handle === 's'
                          ? '-bottom-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize'
                          : handle === 'sw'
                          ? '-bottom-1.5 -left-1.5 cursor-nesw-resize'
                          : 'top-1/2 -left-1.5 -translate-y-1/2 cursor-ew-resize'
                      }`}
                    />
                  ))}
                </>
              )}
            </div>
          );
        })}

        {/* LIVE FREEHAND STROKE PREVIEW */}
        {isFreehandDrawing && currentStroke && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-40">
            <path
              d={currentStroke
                .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.xPct * 100}% ${pt.yPct * 100}%`)
                .join(' ')}
              stroke={selectedColor || '#000000'}
              strokeWidth={strokeWidth || 2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={activeAnnotateTool === 'marker' ? 0.35 : 1}
            />
          </svg>
        )}

        {/* LIVE SHAPE/WHITEOUT CREATION RECTANGLE */}
        {isCreating && currentCreationRect && (
          <div
            style={{
              left: `${currentCreationRect.xPct * 100}%`,
              top: `${currentCreationRect.yPct * 100}%`,
              width: `${currentCreationRect.widthPct * 100}%`,
              height: `${currentCreationRect.heightPct * 100}%`,
              borderColor: selectedColor || '#E5322D',
              backgroundColor: activeMode === 'whiteout' ? '#FFFFFF' : 'rgba(229, 50, 45, 0.1)',
            }}
            className="absolute border-2 border-dashed pointer-events-none z-40"
          />
        )}

        {/* SMART ALIGNMENT GUIDES */}
        {activeGuide.guideX !== undefined && (
          <div
            style={{ left: `${activeGuide.guideX * 100}%` }}
            className="absolute top-0 bottom-0 w-[1px] bg-red-500 pointer-events-none z-50 border-r border-dashed border-red-500"
          />
        )}
        {activeGuide.guideY !== undefined && (
          <div
            style={{ top: `${activeGuide.guideY * 100}%` }}
            className="absolute left-0 right-0 h-[1px] bg-red-500 pointer-events-none z-50 border-b border-dashed border-red-500"
          />
        )}
      </div>
    </div>
  );
}
