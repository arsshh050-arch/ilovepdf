import React from 'react';
import { ArrowLeft, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export function Toolbar({ 
  onBack, 
  fileName,
  scale,
  setScale,
  onFullscreen
}: { 
  onBack: () => void;
  fileName: string;
  scale: number;
  setScale: (s: number) => void;
  onFullscreen?: () => void;
}) {
  return (
    <div className="h-16 bg-white border-b border-[#E0E2E8] flex items-center justify-between px-4 z-20 flex-shrink-0 relative">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Back"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <span className="font-semibold text-gray-800 hidden sm:block truncate max-w-xs">{fileName}</span>
      </div>

      <div className="flex items-center bg-gray-100 rounded-lg p-1">
        <button 
          onClick={() => setScale(Math.max(0.25, scale - 0.25))}
          className="p-1.5 hover:bg-white rounded hover:shadow-sm text-gray-600 transition-all"
        >
          <ZoomOut size={18} />
        </button>
        <span className="text-sm font-medium text-gray-700 w-16 text-center select-none">
          {Math.round(scale * 100)}%
        </span>
        <button 
          onClick={() => setScale(Math.min(3, scale + 0.25))}
          className="p-1.5 hover:bg-white rounded hover:shadow-sm text-gray-600 transition-all"
        >
          <ZoomIn size={18} />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        {onFullscreen && (
          <button 
            onClick={onFullscreen}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
            title="Fullscreen"
          >
            <Maximize size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
