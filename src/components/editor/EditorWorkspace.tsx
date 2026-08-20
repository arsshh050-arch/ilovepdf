import React, { useState, useEffect, useRef } from 'react';
import {
  EditorMode,
  AnnotateSubTool,
  ShapeSubTool,
  FormSubTool,
  EditorObject,
  PageInfo,
} from '../../types/pdfEditor';
import { EditorPageStage } from './EditorPageStage';

interface EditorWorkspaceProps {
  pdfDoc: any; // PDF.js loaded doc instance
  pages: PageInfo[];
  currentPageIndex: number;
  onPageChange: (index: number) => void;
  zoom: number;
  viewMode: 'continuous' | 'single';
  activeMode: EditorMode;
  activeAnnotateTool: AnnotateSubTool;
  activeShapeTool: ShapeSubTool;
  activeFormTool: FormSubTool;
  // Style defaults
  selectedColor: string;
  fillColor: string;
  strokeWidth: number;
  opacity: number;
  fontFamily: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  // State & Mutators
  objects: EditorObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string | null) => void;
  onAddObject: (object: EditorObject) => void;
  onUpdateObject: (id: string, updated: Partial<EditorObject>) => void;
  onDeleteObject: (id: string) => void;
  enableSnapping: boolean;
}

export function EditorWorkspace({
  pdfDoc,
  pages,
  currentPageIndex,
  onPageChange,
  zoom,
  viewMode,
  activeMode,
  activeAnnotateTool,
  activeShapeTool,
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
}: EditorWorkspaceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Spacebar pan listener
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{
    x: number;
    y: number;
    scrollLeft: number;
    scrollTop: number;
  } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Hand / Spacebar pan handlers
  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (activeMode === 'hand' || isSpacePressed) {
      if (!containerRef.current) return;
      setIsPanning(true);
      setPanStart({
        x: e.clientX,
        y: e.clientY,
        scrollLeft: containerRef.current.scrollLeft,
        scrollTop: containerRef.current.scrollTop,
      });
    }
  };

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (isPanning && panStart && containerRef.current) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      containerRef.current.scrollLeft = panStart.scrollLeft - dx;
      containerRef.current.scrollTop = panStart.scrollTop - dy;
    }
  };

  const handleContainerMouseUp = () => {
    setIsPanning(false);
    setPanStart(null);
  };

  // Cursor style calculation
  let cursorClass = 'cursor-default';
  if (activeMode === 'hand' || isSpacePressed) {
    cursorClass = isPanning ? 'cursor-grabbing' : 'cursor-grab';
  } else if (activeMode === 'annotate') {
    cursorClass = 'cursor-crosshair';
  } else if (activeMode === 'shapes' || activeMode === 'whiteout') {
    cursorClass = 'cursor-crosshair';
  } else if (activeMode === 'edit-text') {
    cursorClass = 'cursor-text';
  }

  // Scroll to current page when page changes in single mode
  useEffect(() => {
    if (viewMode === 'single' && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [currentPageIndex, viewMode]);

  return (
    <div
      ref={containerRef}
      id="pdf-editor-workspace"
      onMouseDown={handleContainerMouseDown}
      onMouseMove={handleContainerMouseMove}
      onMouseUp={handleContainerMouseUp}
      className={`flex-1 w-full h-full bg-[#E5E7EB] overflow-auto flex flex-col items-center p-8 gap-8 relative select-none ${cursorClass}`}
    >
      {pages.map((pageInfo, pageIdx) => {
        if (viewMode === 'single' && pageIdx !== currentPageIndex) return null;

        // Persistent unique key per page prevents DOM reuse glitches
        const pageKey = pageInfo.id || `page_${pageInfo.originalIndex}_${pageIdx}`;

        return (
          <div
            key={pageKey}
            className="flex flex-col items-center gap-2 group"
            onClick={() => onPageChange(pageIdx)}
          >
            {/* Page Number Indicator in Continuous View */}
            {viewMode === 'continuous' && (
              <div className="text-[11px] font-semibold text-gray-500 bg-white/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full shadow-2xs">
                Page {pageIdx + 1} of {pages.length}
              </div>
            )}

            <EditorPageStage
              pageInfo={pageInfo}
              pageIdx={pageIdx}
              pdfDoc={pdfDoc}
              zoom={zoom}
              activeMode={activeMode}
              activeAnnotateTool={activeAnnotateTool}
              activeShapeTool={activeShapeTool}
              isSpacePressed={isSpacePressed}
              selectedColor={selectedColor}
              fillColor={fillColor}
              strokeWidth={strokeWidth}
              fontSize={fontSize}
              fontFamily={fontFamily}
              isBold={isBold}
              isItalic={isItalic}
              isUnderline={isUnderline}
              isStrikethrough={isStrikethrough}
              textAlign={textAlign}
              objects={objects}
              selectedObjectId={selectedObjectId}
              onSelectObject={onSelectObject}
              onAddObject={onAddObject}
              onUpdateObject={onUpdateObject}
              enableSnapping={enableSnapping}
            />
          </div>
        );
      })}
    </div>
  );
}
