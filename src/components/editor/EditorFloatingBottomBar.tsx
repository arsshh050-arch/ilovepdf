import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  Columns,
  Rows,
  ChevronUp,
} from 'lucide-react';

interface EditorFloatingBottomBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onFitWidth: () => void;
  onFitPage: () => void;
  viewMode: 'continuous' | 'single';
  onToggleViewMode: () => void;
}

const ZOOM_PRESETS = [25, 50, 75, 100, 125, 150, 200, 300];

export function EditorFloatingBottomBar({
  currentPage,
  totalPages,
  onPageChange,
  zoom,
  onZoomChange,
  onFitWidth,
  onFitPage,
  viewMode,
  onToggleViewMode,
}: EditorFloatingBottomBarProps) {
  const [showZoomDropdown, setShowZoomDropdown] = useState(false);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-[#E8EAEF] shadow-lg flex items-center gap-3 text-xs select-none animate-in fade-in slide-in-from-bottom-2">
      {/* PAGE CONTROLS */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="p-1 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-colors"
          title="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1 font-bold text-gray-800">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val >= 1 && val <= totalPages) onPageChange(val);
            }}
            className="w-10 px-1 py-0.5 text-center font-bold border border-[#E8EAEF] rounded-md outline-hidden text-xs"
          />
          <span className="text-gray-400 font-normal">/</span>
          <span className="text-gray-600 font-medium">{totalPages}</span>
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="p-1 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-colors"
          title="Next Page"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="h-4 w-[1px] bg-gray-200" />

      {/* ZOOM CONTROLS */}
      <div className="flex items-center gap-1 relative">
        <button
          onClick={() => onZoomChange(Math.max(25, zoom - 15))}
          className="p-1 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={15} />
        </button>

        {/* ZOOM PERCENT DROPDOWN */}
        <button
          onClick={() => setShowZoomDropdown(!showZoomDropdown)}
          className="px-2 py-0.5 rounded-lg text-gray-800 font-bold hover:bg-gray-100 min-w-[52px] text-center"
          title="Zoom Presets"
        >
          {zoom}%
        </button>

        {showZoomDropdown && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-28 bg-white rounded-xl shadow-xl border border-[#E8EAEF] p-1.5 z-50 animate-in fade-in">
            {ZOOM_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  onZoomChange(preset);
                  setShowZoomDropdown(false);
                }}
                className={`w-full text-left px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  zoom === preset ? 'bg-[#FFF0EE] text-[#E5322D] font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => onZoomChange(Math.min(300, zoom + 15))}
          className="p-1 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={15} />
        </button>
      </div>

      <div className="h-4 w-[1px] bg-gray-200 hidden sm:block" />

      {/* FIT CONTROLS */}
      <div className="hidden sm:flex items-center gap-1">
        <button
          onClick={onFitWidth}
          className="px-2 py-1 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-[11px] font-semibold transition-colors"
          title="Fit to Width"
        >
          Fit Width
        </button>
        <button
          onClick={onFitPage}
          className="px-2 py-1 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-[11px] font-semibold transition-colors"
          title="Fit Page"
        >
          Fit Page
        </button>
      </div>

      <div className="h-4 w-[1px] bg-gray-200" />

      {/* VIEW MODE TOGGLE */}
      <button
        onClick={onToggleViewMode}
        className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        title={viewMode === 'continuous' ? 'Switch to Single Page' : 'Switch to Continuous Scroll'}
      >
        {viewMode === 'continuous' ? <Rows size={16} /> : <Columns size={16} />}
      </button>
    </div>
  );
}
