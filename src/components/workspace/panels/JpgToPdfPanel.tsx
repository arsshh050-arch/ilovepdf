import React from 'react';

interface JpgToPdfPanelProps {
  orientation: 'portrait' | 'landscape' | 'auto';
  onOrientationChange: (val: 'portrait' | 'landscape' | 'auto') => void;
  pageSize: 'fit' | 'a4' | 'letter';
  onPageSizeChange: (val: 'fit' | 'a4' | 'letter') => void;
  margin: 'none' | 'small' | 'big';
  onMarginChange: (val: 'none' | 'small' | 'big') => void;
  mergeAll: boolean;
  onMergeAllChange: (val: boolean) => void;
}

export function JpgToPdfPanel({
  orientation,
  onOrientationChange,
  pageSize,
  onPageSizeChange,
  margin,
  onMarginChange,
  mergeAll,
  onMergeAllChange
}: JpgToPdfPanelProps) {
  return (
    <div className="flex flex-col gap-5 p-5">
      {/* ORIENTATION */}
      <div>
        <label className="text-xs font-bold text-[#272830] mb-2 block uppercase tracking-wider">Page Orientation</label>
        <div className="grid grid-cols-3 gap-2">
          {(['portrait', 'landscape', 'auto'] as const).map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => onOrientationChange(o)}
              className={`py-2 px-1 text-xs font-bold capitalize rounded-xl border transition-all cursor-pointer ${
                orientation === o
                  ? 'border-[#E5322D] bg-[#FFF0EE] text-[#E5322D]'
                  : 'border-[#E8EAEF] bg-white text-[#272830] hover:bg-[#F4F5F9]'
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* PAGE SIZE */}
      <div>
        <label className="text-xs font-bold text-[#272830] mb-2 block uppercase tracking-wider">Page Size</label>
        <div className="grid grid-cols-3 gap-2">
          {(['fit', 'a4', 'letter'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onPageSizeChange(s)}
              className={`py-2 px-1 text-xs font-bold uppercase rounded-xl border transition-all cursor-pointer ${
                pageSize === s
                  ? 'border-[#E5322D] bg-[#FFF0EE] text-[#E5322D]'
                  : 'border-[#E8EAEF] bg-white text-[#272830] hover:bg-[#F4F5F9]'
              }`}
            >
              {s === 'fit' ? 'Fit Image' : s}
            </button>
          ))}
        </div>
      </div>

      {/* MARGIN */}
      <div>
        <label className="text-xs font-bold text-[#272830] mb-2 block uppercase tracking-wider">Margin</label>
        <div className="grid grid-cols-3 gap-2">
          {(['none', 'small', 'big'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onMarginChange(m)}
              className={`py-2 px-1 text-xs font-bold capitalize rounded-xl border transition-all cursor-pointer ${
                margin === m
                  ? 'border-[#E5322D] bg-[#FFF0EE] text-[#E5322D]'
                  : 'border-[#E8EAEF] bg-white text-[#272830] hover:bg-[#F4F5F9]'
              }`}
            >
              {m === 'none' ? 'No Margin' : m}
            </button>
          ))}
        </div>
      </div>

      {/* MERGE ALL */}
      <label className="flex items-center gap-2.5 pt-2 border-t border-[#E8EAEF] cursor-pointer select-none">
        <input
          type="checkbox"
          checked={mergeAll}
          onChange={(e) => onMergeAllChange(e.target.checked)}
          className="w-4 h-4 accent-[#E5322D] rounded"
        />
        <span className="text-xs font-semibold text-[#272830]">Merge all images into one PDF file</span>
      </label>
    </div>
  );
}
