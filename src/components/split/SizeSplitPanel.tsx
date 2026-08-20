import React from 'react';
import { Info } from 'lucide-react';
import { SizeUnit } from '../../types/split';
import { formatFileSize } from '../../utils/pdfPreview';

interface SizeSplitPanelProps {
  originalFileSize: number;
  totalPages: number;
  maxFileSize: number;
  onChangeMaxFileSize: (val: number) => void;
  sizeUnit: SizeUnit;
  onChangeSizeUnit: (unit: SizeUnit) => void;
  allowCompression: boolean;
  onToggleAllowCompression: (val: boolean) => void;
}

export function SizeSplitPanel({
  originalFileSize,
  totalPages,
  maxFileSize,
  onChangeMaxFileSize,
  sizeUnit,
  onChangeSizeUnit,
  allowCompression,
  onToggleAllowCompression,
}: SizeSplitPanelProps) {
  return (
    <div className="p-5 flex flex-col gap-6">
      {/* ORIGINAL FILE METADATA */}
      <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#E0E3EB] flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs text-[#72757E]">
          <span>Original file size:</span>
          <span className="font-bold text-[#272830]">{formatFileSize(originalFileSize)}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-[#72757E]">
          <span>Total pages:</span>
          <span className="font-bold text-[#272830]">{totalPages}</span>
        </div>
      </div>

      {/* MAXIMUM SIZE INPUT */}
      <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#E0E3EB] flex flex-col gap-3">
        <label className="block text-xs font-bold text-[#72757E]">
          Maximum size per file:
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={maxFileSize}
            onChange={(e) => onChangeMaxFileSize(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="flex-1 px-3 py-2 bg-white border border-[#D0D4DF] rounded-lg text-sm font-semibold text-[#272830] focus:ring-2 focus:ring-[#E5322D] outline-none"
          />
          <div className="flex bg-[#F0F2F7] p-1 rounded-lg border border-[#D0D4DF]">
            <button
              type="button"
              onClick={() => onChangeSizeUnit('KB')}
              className={`px-3 py-1.5 text-xs font-bold rounded ${
                sizeUnit === 'KB' ? 'bg-white text-[#272830] shadow-sm' : 'text-[#72757E]'
              }`}
            >
              KB
            </button>
            <button
              type="button"
              onClick={() => onChangeSizeUnit('MB')}
              className={`px-3 py-1.5 text-xs font-bold rounded ${
                sizeUnit === 'MB' ? 'bg-white text-[#272830] shadow-sm' : 'text-[#72757E]'
              }`}
            >
              MB
            </button>
          </div>
        </div>
      </div>

      {/* ALLOW COMPRESSION CHECKBOX */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={allowCompression}
            onChange={(e) => onToggleAllowCompression(e.target.checked)}
            className="w-5 h-5 accent-[#E5322D] rounded border-[#C0C4D0]"
          />
          <span className="text-sm font-medium text-[#272830]">
            Allow compression
          </span>
        </label>
      </div>

      {/* SIZE MODE INFO */}
      <div className="bg-[#DDF4FF] border border-[#B3E1FF] rounded-xl p-4 flex gap-3 text-[#00609C]">
        <Info size={20} className="shrink-0 mt-0.5" />
        <p className="text-xs font-medium leading-relaxed">
          This PDF will be split into files no larger than approximately {maxFileSize} {sizeUnit} each.
        </p>
      </div>
    </div>
  );
}
