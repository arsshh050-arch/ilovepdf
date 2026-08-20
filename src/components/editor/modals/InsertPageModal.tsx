import React, { useState } from 'react';
import { X, Plus, FileText } from 'lucide-react';

interface InsertPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPageNumber: number;
  totalPages: number;
  onInsertPage: (options: {
    pageSize: 'A4' | 'Letter';
    orientation: 'portrait' | 'landscape';
    position: 'before' | 'after' | 'end';
    targetPage: number;
  }) => void;
}

export function InsertPageModal({
  isOpen,
  onClose,
  currentPageNumber,
  totalPages,
  onInsertPage,
}: InsertPageModalProps) {
  const [pageSize, setPageSize] = useState<'A4' | 'Letter'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [position, setPosition] = useState<'before' | 'after' | 'end'>('after');
  const [targetPage, setTargetPage] = useState(currentPageNumber);

  if (!isOpen) return null;

  const handleApply = () => {
    onInsertPage({
      pageSize,
      orientation,
      position,
      targetPage,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E8EAEF] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="p-4 px-6 border-b border-[#E8EAEF] flex items-center justify-between bg-[#FAFBFD]">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[#E5322D]" />
            <h3 className="text-lg font-bold text-[#272830]">Insert Blank Page</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 flex flex-col gap-4">
          {/* POSITION */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Insert Position</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPosition('before')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  position === 'before'
                    ? 'border-[#E5322D] bg-[#FFF0EE] text-[#E5322D]'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Before Page
              </button>
              <button
                type="button"
                onClick={() => setPosition('after')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  position === 'after'
                    ? 'border-[#E5322D] bg-[#FFF0EE] text-[#E5322D]'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                After Page
              </button>
              <button
                type="button"
                onClick={() => setPosition('end')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  position === 'end'
                    ? 'border-[#E5322D] bg-[#FFF0EE] text-[#E5322D]'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                At Document End
              </button>
            </div>
          </div>

          {position !== 'end' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Target Page Number</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={targetPage}
                  onChange={(e) => setTargetPage(Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1)))}
                  className="w-24 px-3 py-2 border border-[#E8EAEF] rounded-xl text-sm font-semibold"
                />
                <span className="text-xs text-gray-500">out of {totalPages} pages</span>
              </div>
            </div>
          )}

          {/* PAGE SIZE */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Page Size</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPageSize('A4')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  pageSize === 'A4'
                    ? 'border-[#E5322D] bg-[#FFF0EE] text-[#E5322D]'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                A4 (210 × 297 mm)
              </button>
              <button
                type="button"
                onClick={() => setPageSize('Letter')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  pageSize === 'Letter'
                    ? 'border-[#E5322D] bg-[#FFF0EE] text-[#E5322D]'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Letter (8.5 × 11 in)
              </button>
            </div>
          </div>

          {/* ORIENTATION */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Orientation</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrientation('portrait')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  orientation === 'portrait'
                    ? 'border-[#E5322D] bg-[#FFF0EE] text-[#E5322D]'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Portrait 📄
              </button>
              <button
                type="button"
                onClick={() => setOrientation('landscape')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  orientation === 'landscape'
                    ? 'border-[#E5322D] bg-[#FFF0EE] text-[#E5322D]'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Landscape 📃
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 px-6 border-t border-[#E8EAEF] bg-[#FAFBFD] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 text-sm font-bold text-white bg-[#E5322D] hover:bg-[#CC2521] rounded-xl shadow-xs flex items-center gap-2"
          >
            <Plus size={16} />
            Insert Page
          </button>
        </div>
      </div>
    </div>
  );
}
