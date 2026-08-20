import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { StampPreset } from '../../../config/stampPresets';

interface CustomStampModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveStamp: (stamp: { label: string; date?: string; color: string; borderStyle: 'solid' | 'dashed' | 'double' }) => void;
}

const STAMP_COLORS = ['#EF4444', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#1F2937'];

export function CustomStampModal({ isOpen, onClose, onSaveStamp }: CustomStampModalProps) {
  const [label, setLabel] = useState('CUSTOM STAMP');
  const [includeDate, setIncludeDate] = useState(true);
  const [dateText, setDateText] = useState(new Date().toLocaleDateString());
  const [color, setColor] = useState('#EF4444');
  const [borderStyle, setBorderStyle] = useState<'solid' | 'dashed' | 'double'>('solid');

  if (!isOpen) return null;

  const handleApply = () => {
    if (!label.trim()) return;
    onSaveStamp({
      label: label.trim().toUpperCase(),
      date: includeDate ? dateText : undefined,
      color,
      borderStyle,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E8EAEF] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="p-4 px-6 border-b border-[#E8EAEF] flex items-center justify-between bg-[#FAFBFD]">
          <h3 className="text-lg font-bold text-[#272830]">Create Custom Stamp</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 flex flex-col gap-4">
          {/* LIVE PREVIEW BOX */}
          <div className="p-6 bg-gray-50 rounded-2xl flex items-center justify-center border border-[#E8EAEF]">
            <div
              style={{
                borderColor: color,
                borderStyle: borderStyle,
                color: color,
              }}
              className="px-6 py-3 border-4 rounded-md font-black tracking-widest text-center transform -rotate-3 bg-white/90 shadow-sm"
            >
              <div className="text-xl uppercase font-extrabold">{label || 'STAMP'}</div>
              {includeDate && <div className="text-xs font-semibold mt-0.5 opacity-90">{dateText}</div>}
            </div>
          </div>

          {/* STAMP TEXT */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Stamp Text</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. APPROVED FOR PRODUCTION"
              className="w-full px-3.5 py-2 border border-[#E8EAEF] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E5322D]/20 focus:border-[#E5322D]"
            />
          </div>

          {/* INCLUDE DATE */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeDate}
                onChange={(e) => setIncludeDate(e.target.checked)}
                className="w-4 h-4 text-[#E5322D] rounded-sm focus:ring-[#E5322D]"
              />
              Include Date Stamp
            </label>
            {includeDate && (
              <input
                type="text"
                value={dateText}
                onChange={(e) => setDateText(e.target.value)}
                className="w-36 px-2 py-1 text-xs border border-[#E8EAEF] rounded-lg text-right"
              />
            )}
          </div>

          {/* COLOR */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Color</label>
            <div className="flex items-center gap-2">
              {STAMP_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    color === c ? 'scale-125 border-gray-900 shadow-xs' : 'border-white'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* BORDER STYLE */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Border Style</label>
            <div className="grid grid-cols-3 gap-2">
              {(['solid', 'dashed', 'double'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setBorderStyle(style)}
                  className={`py-1.5 px-3 text-xs font-semibold rounded-lg border capitalize ${
                    borderStyle === style
                      ? 'border-[#E5322D] bg-[#FFF0EE] text-[#E5322D]'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {style}
                </button>
              ))}
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
            <Check size={16} />
            Insert Custom Stamp
          </button>
        </div>
      </div>
    </div>
  );
}
