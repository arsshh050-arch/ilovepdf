import React from 'react';
import { RotateCw, Check, ZoomIn } from 'lucide-react';

export interface PageItem {
  pageNumber: number;
  thumbnailUrl: string;
  rotation: number;
  selected: boolean;
}

interface PageCanvasProps {
  pages: PageItem[];
  onTogglePageSelect: (pageNumber: number) => void;
  onRotatePage?: (pageNumber: number) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onSelectOdd?: () => void;
  onSelectEven?: () => void;
  showSelectionToolbar?: boolean;
}

export function PageCanvas({
  pages,
  onTogglePageSelect,
  onRotatePage,
  onSelectAll,
  onDeselectAll,
  onSelectOdd,
  onSelectEven,
  showSelectionToolbar = true,
}: PageCanvasProps) {
  const selectedCount = pages.filter(p => p.selected).length;

  return (
    <div className="flex flex-col gap-4">
      {/* SELECTION QUICK ACTION TOOLBAR */}
      {showSelectionToolbar && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-2xl border border-[#E8EAEF] shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#272830]">
            <span>Selection:</span>
            <span className="text-[#E5322D] bg-[#FFF0EE] px-2 py-0.5 rounded-full border border-[#FADBD8]">
              {selectedCount} of {pages.length} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onSelectAll && (
              <button
                type="button"
                onClick={onSelectAll}
                className="text-xs font-medium text-[#555760] hover:text-[#E5322D] hover:bg-[#F4F5F9] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Select All
              </button>
            )}
            {onDeselectAll && (
              <button
                type="button"
                onClick={onDeselectAll}
                className="text-xs font-medium text-[#555760] hover:text-[#E5322D] hover:bg-[#F4F5F9] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Deselect All
              </button>
            )}
            {onSelectOdd && (
              <button
                type="button"
                onClick={onSelectOdd}
                className="text-xs font-medium text-[#555760] hover:text-[#E5322D] hover:bg-[#F4F5F9] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Odd Pages
              </button>
            )}
            {onSelectEven && (
              <button
                type="button"
                onClick={onSelectEven}
                className="text-xs font-medium text-[#555760] hover:text-[#E5322D] hover:bg-[#F4F5F9] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Even Pages
              </button>
            )}
          </div>
        </div>
      )}

      {/* PAGE GRID */}
      <div className="flex flex-wrap gap-5 justify-center md:justify-start items-start pt-2 pb-24">
        {pages.map((p) => (
          <div
            key={p.pageNumber}
            onClick={() => onTogglePageSelect(p.pageNumber)}
            className={`relative group bg-white rounded-2xl p-3 w-[165px] min-h-[220px] shadow-xs hover:shadow-md transition-all cursor-pointer border-2 select-none flex flex-col justify-between ${
              p.selected
                ? 'border-[#E5322D] bg-[#FFF0EE]/30'
                : 'border-[#E8EAEF] hover:border-[#C0C3CE]'
            }`}
          >
            {/* SELECTION CHECKMARK BADGE */}
            <div
              className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all z-10 ${
                p.selected
                  ? 'bg-[#E5322D] text-white shadow-sm scale-110'
                  : 'bg-white/80 border border-[#C0C3CE] text-transparent group-hover:text-[#A0A3AE]'
              }`}
            >
              <Check size={14} strokeWidth={3} />
            </div>

            {/* PAGE THUMBNAIL */}
            <div className="w-full h-[150px] bg-[#FAFBFD] border border-[#EAECEF] rounded-xl flex items-center justify-center overflow-hidden relative">
              <img
                src={p.thumbnailUrl}
                alt={`Page ${p.pageNumber}`}
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{ transform: `rotate(${p.rotation}deg)` }}
              />

              {/* HOVER ROTATE OVERLAY */}
              {onRotatePage && (
                <div className="absolute inset-0 bg-[#202126]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRotatePage(p.pageNumber);
                    }}
                    className="w-8 h-8 rounded-full bg-white text-[#272830] hover:text-[#E5322D] flex items-center justify-center shadow-md transition-all hover:scale-110 cursor-pointer"
                    title="Rotate page 90°"
                  >
                    <RotateCw size={15} />
                  </button>
                </div>
              )}
            </div>

            {/* PAGE NUMBER LABEL */}
            <div className="mt-2 text-center">
              <span className={`text-[12px] font-bold ${p.selected ? 'text-[#E5322D]' : 'text-[#555760]'}`}>
                Page {p.pageNumber}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
