import React from 'react';
import { Check, Sparkles } from 'lucide-react';

interface PdfToExcelPanelProps {
  mode: 'no-ocr' | 'ocr';
  onModeChange: (mode: 'no-ocr' | 'ocr') => void;
}

export function PdfToExcelPanel({ mode, onModeChange }: PdfToExcelPanelProps) {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h3 className="text-base font-bold text-[#272830] mb-1">CONVERSION OPTIONS</h3>
        <p className="text-xs text-[#737680]">Choose how text will be extracted into Excel.</p>
      </div>

      <div className="flex flex-col gap-3">
        {/* NO OCR (DEFAULT) */}
        <div
          onClick={() => onModeChange('no-ocr')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col gap-1 select-none ${
            mode === 'no-ocr'
              ? 'border-[#E5322D] bg-[#FFF0EE]/30 shadow-xs'
              : 'border-[#E8EAEF] hover:border-[#C0C3CE] bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#272830]">NO OCR</span>
            {mode === 'no-ocr' && (
              <div className="w-5 h-5 rounded-full bg-[#E5322D] text-white flex items-center justify-center">
                <Check size={13} strokeWidth={3} />
              </div>
            )}
          </div>
          <p className="text-xs text-[#686B74]">
            Convert PDFs containing selectable text into editable Excel spreadsheets instantly.
          </p>
        </div>

        {/* OCR (PREMIUM / ADVANCED) */}
        <div
          onClick={() => onModeChange('ocr')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col gap-1 select-none ${
            mode === 'ocr'
              ? 'border-[#E5322D] bg-[#FFF0EE]/30 shadow-xs'
              : 'border-[#E8EAEF] hover:border-[#C0C3CE] bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#272830]">OCR</span>
              <span className="bg-[#1A73E8]/10 text-[#1A73E8] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles size={11} />
                PRO
              </span>
            </div>
            {mode === 'ocr' && (
              <div className="w-5 h-5 rounded-full bg-[#E5322D] text-white flex items-center justify-center">
                <Check size={13} strokeWidth={3} />
              </div>
            )}
          </div>
          <p className="text-xs text-[#686B74]">
            Recognize scanned PDF pages with optical character recognition into editable Excel cells.
          </p>
        </div>
      </div>
    </div>
  );
}
