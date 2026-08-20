import React from 'react';
import { SlidersHorizontal, FileText, HardDrive, Check } from 'lucide-react';
import { SplitMode } from '../../types/split';

interface SplitModeTabsProps {
  activeMode: SplitMode;
  onSelectMode: (mode: SplitMode) => void;
}

export function SplitModeTabs({ activeMode, onSelectMode }: SplitModeTabsProps) {
  return (
    <div role="tablist" aria-label="Split PDF Modes" className="grid grid-cols-3 border-b border-[#D9DCE3] bg-[#FAFBFD]">
      {/* RANGE TAB */}
      <button
        type="button"
        role="tab"
        aria-selected={activeMode === 'range'}
        onClick={() => onSelectMode('range')}
        className={`h-[96px] flex flex-col items-center justify-center gap-2 border-r border-[#D9DCE3] transition-all relative cursor-pointer ${
          activeMode === 'range'
            ? 'bg-white text-[#272830] font-semibold'
            : 'text-[#8B8E98] hover:text-[#272830] hover:bg-gray-50'
        }`}
      >
        <SlidersHorizontal size={22} className={activeMode === 'range' ? 'text-[#E5322D]' : 'text-[#8B8E98]'} />
        <span className="text-[13px] uppercase tracking-wider font-bold">Range</span>
        {activeMode === 'range' && (
          <div className="absolute top-2 right-2 w-4 h-4 bg-[#23A455] text-white rounded-full flex items-center justify-center">
            <Check size={10} strokeWidth={3} />
          </div>
        )}
      </button>

      {/* PAGES TAB */}
      <button
        type="button"
        role="tab"
        aria-selected={activeMode === 'pages'}
        onClick={() => onSelectMode('pages')}
        className={`h-[96px] flex flex-col items-center justify-center gap-2 border-r border-[#D9DCE3] transition-all relative cursor-pointer ${
          activeMode === 'pages'
            ? 'bg-white text-[#272830] font-semibold'
            : 'text-[#8B8E98] hover:text-[#272830] hover:bg-gray-50'
        }`}
      >
        <FileText size={22} className={activeMode === 'pages' ? 'text-[#E5322D]' : 'text-[#8B8E98]'} />
        <span className="text-[13px] uppercase tracking-wider font-bold">Pages</span>
        {activeMode === 'pages' && (
          <div className="absolute top-2 right-2 w-4 h-4 bg-[#23A455] text-white rounded-full flex items-center justify-center">
            <Check size={10} strokeWidth={3} />
          </div>
        )}
      </button>

      {/* SIZE TAB */}
      <button
        type="button"
        role="tab"
        aria-selected={activeMode === 'size'}
        onClick={() => onSelectMode('size')}
        className={`h-[96px] flex flex-col items-center justify-center gap-2 transition-all relative cursor-pointer ${
          activeMode === 'size'
            ? 'bg-white text-[#272830] font-semibold'
            : 'text-[#8B8E98] hover:text-[#272830] hover:bg-gray-50'
        }`}
      >
        <HardDrive size={22} className={activeMode === 'size' ? 'text-[#E5322D]' : 'text-[#8B8E98]'} />
        <span className="text-[13px] uppercase tracking-wider font-bold">Size</span>
        {activeMode === 'size' && (
          <div className="absolute top-2 right-2 w-4 h-4 bg-[#23A455] text-white rounded-full flex items-center justify-center">
            <Check size={10} strokeWidth={3} />
          </div>
        )}
      </button>
    </div>
  );
}
