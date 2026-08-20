import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RotateCw, X, FileText, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { MergeFile } from '../../types/merge';
import { formatFileSize } from '../../utils/pdfPreview';

interface MergePdfCardProps {
  key?: string;
  file: MergeFile;
  index: number;
  totalFiles: number;
  onRotate: (id: string) => void;
  onRemove: (id: string) => void;
  onMoveLeft?: (index: number) => void;
  onMoveRight?: (index: number) => void;
}

export function MergePdfCard({
  file,
  index,
  totalFiles,
  onRotate,
  onRemove,
  onMoveLeft,
  onMoveRight
}: MergePdfCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: file.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
    opacity: isDragging ? 0.85 : 1,
    zIndex: isDragging ? 50 : 1,
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  const handleRotateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRotate(file.id);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(file.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group select-none flex flex-col items-center bg-white border border-[#C7C9D0] rounded-[7px] p-2.5 w-[185px] min-h-[225px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow ${
        isDragging ? 'scale-[1.02] shadow-xl border-[#E5322D]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...attributes}
      {...listeners}
    >
      {/* HOVER TOOLTIP */}
      {isHovered && !isDragging && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#44454D] text-white text-[12px] py-1.5 px-2.5 rounded-[4px] whitespace-nowrap shadow-md z-30 pointer-events-none flex items-center gap-1.5 animate-fadeIn">
          <span>{formatFileSize(file.size)}</span>
          <span className="opacity-60">•</span>
          <span>{file.pageCount} {file.pageCount === 1 ? 'page' : 'pages'}</span>
          {/* Downward Triangle */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-[#44454D] w-0 h-0" />
        </div>
      )}

      {/* TOP CONTROLS (ROTATE & REMOVE) */}
      <div className="w-full flex items-center justify-end gap-1.5 mb-1 z-10">
        <button
          type="button"
          onClick={handleRotateClick}
          className="w-7 h-7 rounded-full bg-white hover:bg-[#F0F2F6] border border-[#DCDEE4] text-[#555760] hover:text-[#E5322D] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          title="Rotate 90°"
          aria-label={`Rotate ${file.name}`}
        >
          <RotateCw size={14} />
        </button>
        <button
          type="button"
          onClick={handleRemoveClick}
          className="w-7 h-7 rounded-full bg-white hover:bg-[#FFF0EE] border border-[#DCDEE4] text-[#555760] hover:text-[#E5322D] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          title="Remove file"
          aria-label={`Remove ${file.name}`}
        >
          <X size={15} />
        </button>
      </div>

      {/* PREVIEW CONTAINER (PAGE 1 THUMBNAIL) */}
      <div className="w-[165px] h-[135px] bg-[#FAFBFD] border border-[#E8EAEF] rounded-[5px] flex items-center justify-center overflow-hidden relative mb-2.5">
        {file.loadingPreview ? (
          <div className="flex flex-col items-center gap-1.5 text-[#888A93]">
            <Loader2 size={22} className="animate-spin text-[#E5322D]" />
            <span className="text-[11px]">Loading preview...</span>
          </div>
        ) : file.thumbnailUrl ? (
          <img
            src={file.thumbnailUrl}
            alt={`Page 1 of ${file.name}`}
            className="max-w-full max-h-full object-contain transition-transform duration-300"
            style={{ transform: `rotate(${file.rotation}deg)` }}
          />
        ) : (
          <div
            className="flex flex-col items-center gap-1 text-[#686B74] transition-transform duration-300"
            style={{ transform: `rotate(${file.rotation}deg)` }}
          >
            <FileText size={44} className="text-[#E5322D] stroke-[1.2]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#888A93]">PDF</span>
          </div>
        )}
      </div>

      {/* FILE NAME */}
      <div className="w-full text-center px-1">
        <p
          className="text-[12px] font-medium text-[#555760] truncate max-w-full"
          title={file.name}
        >
          {file.name}
        </p>
      </div>

      {/* ACCESSIBILITY REORDER BUTTONS FOR KEYBOARD / TOUCH */}
      <div className="opacity-0 group-focus-within:opacity-100 transition-opacity absolute bottom-1 left-0 right-0 flex justify-between px-2 pointer-events-auto">
        {index > 0 && onMoveLeft && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onMoveLeft(index); }}
            className="bg-white border border-[#CBD0DD] text-[#333] p-1 rounded hover:bg-gray-100 shadow-xs cursor-pointer"
            aria-label={`Move ${file.name} left`}
          >
            <ChevronLeft size={12} />
          </button>
        )}
        {index < totalFiles - 1 && onMoveRight && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onMoveRight(index); }}
            className="bg-white border border-[#CBD0DD] text-[#333] p-1 rounded hover:bg-gray-100 shadow-xs cursor-pointer ml-auto"
            aria-label={`Move ${file.name} right`}
          >
            <ChevronRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
