import React from 'react';
import { Info } from 'lucide-react';
import { ExtractMode } from '../../types/split';

interface PagesSplitPanelProps {
  extractMode: ExtractMode;
  onChangeExtractMode: (mode: ExtractMode) => void;
  selectedPagesInput: string;
  onChangeSelectedPagesInput: (val: string) => void;
  mergeSelectedPages: boolean;
  onToggleMergeSelectedPages: (val: boolean) => void;
  totalPages: number;
  selectedPagesCount: number;
}

export function PagesSplitPanel({
  extractMode,
  onChangeExtractMode,
  selectedPagesInput,
  onChangeSelectedPagesInput,
  mergeSelectedPages,
  onToggleMergeSelectedPages,
  totalPages,
  selectedPagesCount,
}: PagesSplitPanelProps) {
  return (
    <div className="p-5 flex flex-col gap-6">
      {/* EXTRACT MODE SELECTOR */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#72757E] mb-2">
          Extract Mode
        </label>
        <div className="grid grid-cols-2 bg-[#F0F2F7] p-1 rounded-xl border border-[#D0D4DF]">
          <button
            type="button"
            onClick={() => onChangeExtractMode('all')}
            className={`py-2 text.xs md:text-sm font-semibold rounded-lg transition-all ${
              extractMode === 'all'
                ? 'bg-white text-[#272830] shadow-sm'
                : 'text-[#72757E] hover:text-[#272830]'
            }`}
          >
            Extract all pages
          </button>
          <button
            type="button"
            onClick={() => onChangeExtractMode('selected')}
            className={`py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${
              extractMode === 'selected'
                ? 'bg-white text-[#272830] shadow-sm'
                : 'text-[#72757E] hover:text-[#272830]'
            }`}
          >
            Select pages
          </button>
        </div>
      </div>

      {/* EXTRACT ALL PAGES INFO */}
      {extractMode === 'all' && (
        <div className="bg-[#DDF4FF] border border-[#B3E1FF] rounded-xl p-4 flex gap-3 text-[#00609C]">
          <Info size={20} className="shrink-0 mt-0.5" />
          <p className="text-xs font-medium leading-relaxed">
            Each page will be saved as a separate PDF file. ({totalPages} PDF files will be created).
          </p>
        </div>
      )}

      {/* SELECT PAGES INPUT */}
      {extractMode === 'selected' && (
        <div className="flex flex-col gap-4">
          <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#E0E3EB] flex flex-col gap-2">
            <label className="block text-xs font-bold text-[#72757E]">
              Pages to extract:
            </label>
            <input
              type="text"
              value={selectedPagesInput}
              onChange={(e) => onChangeSelectedPagesInput(e.target.value)}
              placeholder="e.g. 1,3,5-8"
              className="w-full px-3 py-2 bg-white border border-[#D0D4DF] rounded-lg text-sm font-medium text-[#272830] focus:ring-2 focus:ring-[#E5322D] outline-none"
            />
            <p className="text-[11px] text-[#72757E]">
              Type page numbers or ranges, or click page thumbnails directly in the workspace.
            </p>
          </div>

          {/* MERGE EXTRACTED PAGES CHECKBOX */}
          <div className="pt-2 border-t border-[#E0E3EB]">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={mergeSelectedPages}
                onChange={(e) => onToggleMergeSelectedPages(e.target.checked)}
                className="w-5 h-5 accent-[#E5322D] rounded border-[#C0C4D0]"
              />
              <span className="text-sm font-medium text-[#272830]">
                Merge extracted pages into one PDF file
              </span>
            </label>
          </div>

          {/* DYNAMIC COUNT INFO BOX */}
          <div className="bg-[#DDF4FF] border border-[#B3E1FF] rounded-xl p-4 flex gap-3 text-[#00609C]">
            <Info size={20} className="shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-relaxed">
              {selectedPagesCount} {selectedPagesCount === 1 ? 'page' : 'pages'} selected.{' '}
              {mergeSelectedPages
                ? '1 PDF file will be created.'
                : `${selectedPagesCount} PDF file${selectedPagesCount === 1 ? '' : 's'} will be created.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
