import React from 'react';
import { Check, Image, Layers } from 'lucide-react';

interface PdfToJpgPanelProps {
  mode: 'pages' | 'extract';
  onModeChange: (m: 'pages' | 'extract') => void;
  quality: 'standard' | 'high' | 'maximum';
  onQualityChange: (q: 'standard' | 'high' | 'maximum') => void;
}

export function PdfToJpgPanel({
  mode,
  onModeChange,
  quality,
  onQualityChange
}: PdfToJpgPanelProps) {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h3 className="text-base font-bold text-[#272830] mb-1">IMAGE CONVERSION OPTIONS</h3>
        <p className="text-xs text-[#737680]">Choose how pages or embedded images will be exported.</p>
      </div>

      <div className="flex flex-col gap-3">
        {/* CONVERT EVERY PAGE */}
        <div
          onClick={() => onModeChange('pages')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col gap-1 select-none ${
            mode === 'pages'
              ? 'border-[#E5322D] bg-[#FFF0EE]/30 shadow-xs'
              : 'border-[#E8EAEF] hover:border-[#C0C3CE] bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-[#E5322D]" />
              <span className="text-sm font-bold text-[#272830]">PAGE TO JPG</span>
            </div>
            {mode === 'pages' && (
              <div className="w-5 h-5 rounded-full bg-[#E5322D] text-white flex items-center justify-center">
                <Check size={13} strokeWidth={3} />
              </div>
            )}
          </div>
          <p className="text-xs text-[#686B74]">
            Convert every selected page of this PDF into an image.
          </p>
        </div>

        {/* EXTRACT EMBEDDED IMAGES */}
        <div
          onClick={() => onModeChange('extract')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col gap-1 select-none ${
            mode === 'extract'
              ? 'border-[#E5322D] bg-[#FFF0EE]/30 shadow-xs'
              : 'border-[#E8EAEF] hover:border-[#C0C3CE] bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image size={16} className="text-[#1A73E8]" />
              <span className="text-sm font-bold text-[#272830]">EXTRACT IMAGES</span>
            </div>
            {mode === 'extract' && (
              <div className="w-5 h-5 rounded-full bg-[#E5322D] text-white flex items-center justify-center">
                <Check size={13} strokeWidth={3} />
              </div>
            )}
          </div>
          <p className="text-xs text-[#686B74]">
            Extract all embedded pictures inside the PDF document as separate image files.
          </p>
        </div>
      </div>

      {/* IMAGE QUALITY */}
      <div className="pt-2">
        <label className="text-xs font-bold text-[#272830] mb-2 block uppercase tracking-wider">Image Quality</label>
        <div className="grid grid-cols-3 gap-2">
          {(['standard', 'high', 'maximum'] as const).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onQualityChange(q)}
              className={`py-2 px-1 text-xs font-bold capitalize rounded-xl border transition-all cursor-pointer ${
                quality === q
                  ? 'border-[#E5322D] bg-[#FFF0EE] text-[#E5322D]'
                  : 'border-[#E8EAEF] bg-white text-[#272830] hover:bg-[#F4F5F9]'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
