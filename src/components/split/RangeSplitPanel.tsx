import React from 'react';
import { Plus, Trash2, Info } from 'lucide-react';
import { RangeMode, SplitRange } from '../../types/split';

interface RangeSplitPanelProps {
  rangeMode: RangeMode;
  onChangeRangeMode: (mode: RangeMode) => void;
  ranges: SplitRange[];
  onUpdateRange: (id: string, field: 'from' | 'to', value: number) => void;
  onAddRange: () => void;
  onRemoveRange: (id: string) => void;
  fixedPages: number;
  onChangeFixedPages: (val: number) => void;
  mergeRanges: boolean;
  onToggleMergeRanges: (val: boolean) => void;
  totalPages: number;
}

export function RangeSplitPanel({
  rangeMode,
  onChangeRangeMode,
  ranges,
  onUpdateRange,
  onAddRange,
  onRemoveRange,
  fixedPages,
  onChangeFixedPages,
  mergeRanges,
  onToggleMergeRanges,
  totalPages,
}: RangeSplitPanelProps) {
  return (
    <div className="p-5 flex flex-col gap-6">
      {/* RANGE MODE SELECTOR */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#72757E] mb-2">
          Range Mode
        </label>
        <div className="grid grid-cols-3 bg-[#F0F2F7] p-1 rounded-xl border border-[#D0D4DF]">
          <button
            type="button"
            onClick={() => onChangeRangeMode('custom')}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              rangeMode === 'custom'
                ? 'bg-white text-[#272830] shadow-sm'
                : 'text-[#72757E] hover:text-[#272830]'
            }`}
          >
            Custom
          </button>
          <button
            type="button"
            onClick={() => onChangeRangeMode('fixed')}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              rangeMode === 'fixed'
                ? 'bg-white text-[#272830] shadow-sm'
                : 'text-[#72757E] hover:text-[#272830]'
            }`}
          >
            Fixed
          </button>
          <button
            type="button"
            onClick={() => onChangeRangeMode('smart')}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              rangeMode === 'smart'
                ? 'bg-white text-[#272830] shadow-sm'
                : 'text-[#72757E] hover:text-[#272830]'
            }`}
          >
            Smart
          </button>
        </div>
      </div>

      {/* CUSTOM RANGE MODE */}
      {rangeMode === 'custom' && (
        <div className="flex flex-col gap-4">
          {ranges.map((range, index) => (
            <div key={range.id} className="bg-[#FAFBFD] p-4 rounded-xl border border-[#E0E3EB]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-[#272830]">Range {index + 1}</span>
                {ranges.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveRange(range.id)}
                    className="text-gray-400 hover:text-[#E5322D] p-1 rounded transition-colors"
                    title="Remove range"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#72757E] mb-1">
                    from page
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={range.from || ''}
                    onChange={(e) => onUpdateRange(range.id, 'from', parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 bg-white border border-[#D0D4DF] rounded-lg text-sm font-medium text-[#272830] focus:ring-2 focus:ring-[#E5322D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#72757E] mb-1">
                    to
                  </label>
                  <input
                    type="number"
                    min={range.from || 1}
                    max={totalPages}
                    value={range.to || ''}
                    onChange={(e) => onUpdateRange(range.id, 'to', parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 bg-white border border-[#D0D4DF] rounded-lg text-sm font-medium text-[#272830] focus:ring-2 focus:ring-[#E5322D] outline-none"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* ADD RANGE BUTTON */}
          <button
            type="button"
            onClick={onAddRange}
            className="w-full py-3 bg-white border border-[#E5322D] text-[#E5322D] hover:bg-red-50 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Range</span>
          </button>
        </div>
      )}

      {/* FIXED RANGE MODE */}
      {rangeMode === 'fixed' && (
        <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#E0E3EB] flex flex-col gap-3">
          <label className="block text-xs font-semibold text-[#72757E]">
            Split every:
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={totalPages}
              value={fixedPages}
              onChange={(e) => onChangeFixedPages(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-24 px-3 py-2 bg-white border border-[#D0D4DF] rounded-lg text-sm font-semibold text-[#272830] focus:ring-2 focus:ring-[#E5322D] outline-none"
            />
            <span className="text-sm font-medium text-[#272830]">pages</span>
          </div>

          <p className="text-xs text-[#72757E] mt-1">
            Will create approx {Math.ceil(totalPages / (fixedPages || 1))} PDF file(s).
          </p>
        </div>
      )}

      {/* SMART RANGE MODE */}
      {rangeMode === 'smart' && (
        <div className="bg-[#FFF8EC] border border-[#FEE6C2] rounded-xl p-4 flex gap-3 text-[#A86400]">
          <Info size={20} className="shrink-0 mt-0.5" />
          <p className="text-xs font-medium leading-relaxed">
            Smart range splitting is not available yet.
          </p>
        </div>
      )}

      {/* MERGE RANGES CHECKBOX */}
      {rangeMode !== 'smart' && (
        <div className="pt-2 border-t border-[#E0E3EB]">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={mergeRanges}
              onChange={(e) => onToggleMergeRanges(e.target.checked)}
              className="w-5 h-5 accent-[#E5322D] rounded border-[#C0C4D0]"
            />
            <span className="text-sm font-medium text-[#272830]">
              Merge all ranges into one PDF file
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
