import React from 'react';
import { SplitMode, RangeMode, ExtractMode, SplitRange, SizeUnit } from '../../types/split';
import { SplitModeTabs } from './SplitModeTabs';
import { RangeSplitPanel } from './RangeSplitPanel';
import { PagesSplitPanel } from './PagesSplitPanel';
import { SizeSplitPanel } from './SizeSplitPanel';
import { SplitActionButton } from './SplitActionButton';

interface SplitSidebarProps {
  activeMode: SplitMode;
  onSelectMode: (mode: SplitMode) => void;
  // Range state
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
  // Pages state
  extractMode: ExtractMode;
  onChangeExtractMode: (mode: ExtractMode) => void;
  selectedPagesInput: string;
  onChangeSelectedPagesInput: (val: string) => void;
  mergeSelectedPages: boolean;
  onToggleMergeSelectedPages: (val: boolean) => void;
  selectedPagesCount: number;
  // Size state
  originalFileSize: number;
  maxFileSize: number;
  onChangeMaxFileSize: (val: number) => void;
  sizeUnit: SizeUnit;
  onChangeSizeUnit: (unit: SizeUnit) => void;
  allowCompression: boolean;
  onToggleAllowCompression: (val: boolean) => void;
  // Overall state
  totalPages: number;
  processing: boolean;
  disabled: boolean;
  onProcessSplit: () => void;
}

export function SplitSidebar({
  activeMode,
  onSelectMode,
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
  extractMode,
  onChangeExtractMode,
  selectedPagesInput,
  onChangeSelectedPagesInput,
  mergeSelectedPages,
  onToggleMergeSelectedPages,
  selectedPagesCount,
  originalFileSize,
  maxFileSize,
  onChangeMaxFileSize,
  sizeUnit,
  onChangeSizeUnit,
  allowCompression,
  onToggleAllowCompression,
  totalPages,
  processing,
  disabled,
  onProcessSplit,
}: SplitSidebarProps) {
  return (
    <div className="w-full md:w-[405px] h-full bg-white border-l border-[#DADCE3] flex flex-col shrink-0 shadow-sm z-10 overflow-hidden">
      {/* SIDEBAR HEADER */}
      <div className="h-[66px] min-h-[66px] border-b border-[#D9DCE3] flex items-center justify-center px-4 bg-white">
        <h2 className="text-[28px] font-semibold text-[#272830]">Split</h2>
      </div>

      {/* MODE TABS */}
      <SplitModeTabs activeMode={activeMode} onSelectMode={onSelectMode} />

      {/* SCROLLABLE CONTROL BODY */}
      <div className="flex-1 overflow-y-auto">
        {activeMode === 'range' && (
          <RangeSplitPanel
            rangeMode={rangeMode}
            onChangeRangeMode={onChangeRangeMode}
            ranges={ranges}
            onUpdateRange={onUpdateRange}
            onAddRange={onAddRange}
            onRemoveRange={onRemoveRange}
            fixedPages={fixedPages}
            onChangeFixedPages={onChangeFixedPages}
            mergeRanges={mergeRanges}
            onToggleMergeRanges={onToggleMergeRanges}
            totalPages={totalPages}
          />
        )}

        {activeMode === 'pages' && (
          <PagesSplitPanel
            extractMode={extractMode}
            onChangeExtractMode={onChangeExtractMode}
            selectedPagesInput={selectedPagesInput}
            onChangeSelectedPagesInput={onChangeSelectedPagesInput}
            mergeSelectedPages={mergeSelectedPages}
            onToggleMergeSelectedPages={onToggleMergeSelectedPages}
            totalPages={totalPages}
            selectedPagesCount={selectedPagesCount}
          />
        )}

        {activeMode === 'size' && (
          <SizeSplitPanel
            originalFileSize={originalFileSize}
            totalPages={totalPages}
            maxFileSize={maxFileSize}
            onChangeMaxFileSize={onChangeMaxFileSize}
            sizeUnit={sizeUnit}
            onChangeSizeUnit={onChangeSizeUnit}
            allowCompression={allowCompression}
            onToggleAllowCompression={onToggleAllowCompression}
          />
        )}
      </div>

      {/* STICKY BOTTOM ACTION BUTTON */}
      <SplitActionButton
        onClick={onProcessSplit}
        disabled={disabled}
        processing={processing}
      />
    </div>
  );
}
