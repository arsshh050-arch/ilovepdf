import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export interface SplitRange {
  from: number;
  to: number;
}

interface SplitPdfPanelProps {
  totalPages: number;
  mode: 'range' | 'pages' | 'size';
  onModeChange: (mode: 'range' | 'pages' | 'size') => void;
  // Range settings
  rangeMode: 'custom' | 'fixed';
  onRangeModeChange: (rm: 'custom' | 'fixed') => void;
  ranges: SplitRange[];
  onRangesChange: (ranges: SplitRange[]) => void;
  fixedPages: number;
  onFixedPagesChange: (pages: number) => void;
  mergeRanges: boolean;
  onMergeRangesChange: (val: boolean) => void;
  // Pages settings
  extractMode: 'selected' | 'all';
  onExtractModeChange: (mode: 'selected' | 'all') => void;
  selectedPagesInput: string;
  onSelectedPagesInputChange: (val: string) => void;
  mergeSelected: boolean;
  onMergeSelectedChange: (val: boolean) => void;
  // Size settings
  maxMb: number;
  onMaxMbChange: (val: number) => void;
  allowCompression: boolean;
  onAllowCompressionChange: (val: boolean) => void;
}

export function SplitPdfPanel({
  totalPages,
  mode,
  onModeChange,
  rangeMode,
  onRangeModeChange,
  ranges,
  onRangesChange,
  fixedPages,
  onFixedPagesChange,
  mergeRanges,
  onMergeRangesChange,
  extractMode,
  onExtractModeChange,
  selectedPagesInput,
  onSelectedPagesInputChange,
  mergeSelected,
  onMergeSelectedChange,
  maxMb,
  onMaxMbChange,
  allowCompression,
  onAllowCompressionChange
}: SplitPdfPanelProps) {
  const addRange = () => {
    const last = ranges[ranges.length - 1];
    const newFrom = last ? Math.min(last.to + 1, totalPages) : 1;
    const newTo = Math.min(newFrom + 1, totalPages);
    onRangesChange([...ranges, { from: newFrom, to: newTo }]);
  };

  const removeRange = (index: number) => {
    if (ranges.length <= 1) return;
    onRangesChange(ranges.filter((_, idx) => idx !== index));
  };

  const updateRange = (index: number, key: 'from' | 'to', value: number) => {
    const updated = ranges.map((r, idx) => {
      if (idx === index) {
        return { ...r, [key]: Math.max(1, Math.min(totalPages, value)) };
      }
      return r;
    });
    onRangesChange(updated);
  };

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* MODE TABS */}
      <div className="flex bg-[#F4F5F9] p-1 rounded-xl border border-[#E8EAEF]">
        <button
          type="button"
          onClick={() => onModeChange('range')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mode === 'range' ? 'bg-white text-[#272830] shadow-xs' : 'text-[#737680] hover:text-[#272830]'
          }`}
        >
          RANGE
        </button>
        <button
          type="button"
          onClick={() => onModeChange('pages')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mode === 'pages' ? 'bg-white text-[#272830] shadow-xs' : 'text-[#737680] hover:text-[#272830]'
          }`}
        >
          PAGES
        </button>
        <button
          type="button"
          onClick={() => onModeChange('size')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mode === 'size' ? 'bg-white text-[#272830] shadow-xs' : 'text-[#737680] hover:text-[#272830]'
          }`}
        >
          SIZE
        </button>
      </div>

      {/* MODE 1: RANGE */}
      {mode === 'range' && (
        <div className="flex flex-col gap-4">
          <div className="flex bg-[#FAFBFD] p-1 rounded-xl border border-[#EAECEF]">
            <button
              type="button"
              onClick={() => onRangeModeChange('custom')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                rangeMode === 'custom' ? 'bg-white text-[#272830] shadow-xs' : 'text-[#737680]'
              }`}
            >
              Custom ranges
            </button>
            <button
              type="button"
              onClick={() => onRangeModeChange('fixed')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                rangeMode === 'fixed' ? 'bg-white text-[#272830] shadow-xs' : 'text-[#737680]'
              }`}
            >
              Fixed ranges
            </button>
          </div>

          {rangeMode === 'custom' ? (
            <div className="flex flex-col gap-3">
              {ranges.map((r, idx) => (
                <div key={idx} className="p-3 bg-white border border-[#E8EAEF] rounded-xl flex items-center gap-2">
                  <span className="text-xs font-bold text-[#888A92] shrink-0">Range {idx + 1}:</span>
                  <div className="flex items-center gap-1.5 flex-1">
                    <span className="text-xs text-[#737680]">From</span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={r.from}
                      onChange={(e) => updateRange(idx, 'from', parseInt(e.target.value, 10) || 1)}
                      className="w-16 h-8 border border-[#E8EAEF] rounded-lg text-center text-xs font-bold text-[#272830] focus:border-[#E5322D] outline-none"
                    />
                    <span className="text-xs text-[#737680]">To</span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={r.to}
                      onChange={(e) => updateRange(idx, 'to', parseInt(e.target.value, 10) || totalPages)}
                      className="w-16 h-8 border border-[#E8EAEF] rounded-lg text-center text-xs font-bold text-[#272830] focus:border-[#E5322D] outline-none"
                    />
                  </div>
                  {ranges.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRange(idx)}
                      className="text-[#9DA0A8] hover:text-[#E5322D] p-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addRange}
                className="w-full py-2.5 bg-white border border-dashed border-[#C0C3CE] hover:border-[#E5322D] text-[#E5322D] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus size={16} /> Add Range
              </button>
            </div>
          ) : (
            <div className="p-4 bg-white border border-[#E8EAEF] rounded-xl flex flex-col gap-2">
              <label className="text-xs font-bold text-[#272830]">Split in page groups of:</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={fixedPages}
                  onChange={(e) => onFixedPagesChange(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-20 h-9 border border-[#E8EAEF] rounded-lg text-center text-sm font-bold text-[#272830] outline-none focus:border-[#E5322D]"
                />
                <span className="text-xs text-[#737680]">pages</span>
              </div>
            </div>
          )}

          <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={mergeRanges}
              onChange={(e) => onMergeRangesChange(e.target.checked)}
              className="w-4 h-4 accent-[#E5322D] rounded"
            />
            <span className="text-xs font-semibold text-[#272830]">Merge all ranges into one PDF file</span>
          </label>
        </div>
      )}

      {/* MODE 2: PAGES */}
      {mode === 'pages' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              onClick={() => onExtractModeChange('all')}
              className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between select-none ${
                extractMode === 'all' ? 'border-[#E5322D] bg-[#FFF0EE]/30' : 'border-[#E8EAEF] bg-white'
              }`}
            >
              <span className="text-xs font-bold text-[#272830]">Extract all pages</span>
              <input type="radio" checked={extractMode === 'all'} onChange={() => onExtractModeChange('all')} className="accent-[#E5322D]" />
            </label>

            <label
              onClick={() => onExtractModeChange('selected')}
              className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between select-none ${
                extractMode === 'selected' ? 'border-[#E5322D] bg-[#FFF0EE]/30' : 'border-[#E8EAEF] bg-white'
              }`}
            >
              <span className="text-xs font-bold text-[#272830]">Select pages to extract</span>
              <input type="radio" checked={extractMode === 'selected'} onChange={() => onExtractModeChange('selected')} className="accent-[#E5322D]" />
            </label>
          </div>

          {extractMode === 'selected' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#272830]">Page range input:</label>
              <input
                type="text"
                placeholder="e.g. 1, 3, 5-8"
                value={selectedPagesInput}
                onChange={(e) => onSelectedPagesInputChange(e.target.value)}
                className="w-full h-10 px-3 border border-[#E8EAEF] rounded-xl text-xs font-semibold text-[#272830] outline-none focus:border-[#E5322D]"
              />
              <span className="text-[11px] text-[#737680]">Or click thumbnails on the left canvas to select.</span>
            </div>
          )}

          <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={mergeSelected}
              onChange={(e) => onMergeSelectedChange(e.target.checked)}
              className="w-4 h-4 accent-[#E5322D] rounded"
            />
            <span className="text-xs font-semibold text-[#272830]">Merge extracted pages into one PDF file</span>
          </label>
        </div>
      )}

      {/* MODE 3: SIZE */}
      {mode === 'size' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-white border border-[#E8EAEF] rounded-xl flex flex-col gap-2">
            <label className="text-xs font-bold text-[#272830]">Maximum size per file (MB):</label>
            <input
              type="number"
              min={1}
              value={maxMb}
              onChange={(e) => onMaxMbChange(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full h-10 px-3 border border-[#E8EAEF] rounded-xl text-sm font-bold text-[#272830] outline-none focus:border-[#E5322D]"
            />
          </div>

          <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allowCompression}
              onChange={(e) => onAllowCompressionChange(e.target.checked)}
              className="w-4 h-4 accent-[#E5322D] rounded"
            />
            <span className="text-xs font-semibold text-[#272830]">Allow compression to meet size target</span>
          </label>
        </div>
      )}
    </div>
  );
}
