import React, { useState } from 'react';

interface WatermarkPanelProps {
  text: string;
  onTextChange: (t: string) => void;
  fontSize: number;
  onFontSizeChange: (s: number) => void;
  color: string;
  onColorChange: (c: string) => void;
  opacity: number;
  onOpacityChange: (o: number) => void;
  rotation: number;
  onRotationChange: (r: number) => void;
  position: string;
  onPositionChange: (p: string) => void;
}

export function WatermarkPanel({
  text,
  onTextChange,
  fontSize,
  onFontSizeChange,
  color,
  onColorChange,
  opacity,
  onOpacityChange,
  rotation,
  onRotationChange,
  position,
  onPositionChange
}: WatermarkPanelProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');

  const positions = [
    'top-left', 'top-center', 'top-right',
    'center-left', 'center', 'center-right',
    'bottom-left', 'bottom-center', 'bottom-right'
  ];

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* TABS */}
      <div className="flex bg-[#F4F5F9] p-1 rounded-xl border border-[#E8EAEF]">
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
            activeTab === 'text' ? 'bg-white text-[#272830] shadow-xs' : 'text-[#737680]'
          }`}
        >
          TEXT WATERMARK
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('image')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
            activeTab === 'image' ? 'bg-white text-[#272830] shadow-xs' : 'text-[#737680]'
          }`}
        >
          IMAGE WATERMARK
        </button>
      </div>

      {activeTab === 'text' ? (
        <div className="flex flex-col gap-4">
          {/* TEXT INPUT */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#272830]">Watermark Text:</label>
            <input
              type="text"
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="e.g. CONFIDENTIAL / DO NOT COPY"
              className="w-full h-10 px-3 border border-[#E8EAEF] rounded-xl text-xs font-bold text-[#272830] outline-none focus:border-[#E5322D]"
            />
          </div>

          {/* FONT SIZE & COLOR */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#272830]">Font Size ({fontSize}px):</label>
              <input
                type="range"
                min={16}
                max={96}
                value={fontSize}
                onChange={(e) => onFontSizeChange(Number(e.target.value))}
                className="accent-[#E5322D]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#272830]">Text Color:</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-[#E8EAEF]"
                />
                <span className="text-xs font-mono text-[#555760]">{color}</span>
              </div>
            </div>
          </div>

          {/* OPACITY */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#272830]">Transparency ({Math.round(opacity * 100)}%):</label>
            <input
              type="range"
              min={0.1}
              max={1.0}
              step={0.05}
              value={opacity}
              onChange={(e) => onOpacityChange(Number(e.target.value))}
              className="accent-[#E5322D]"
            />
          </div>

          {/* 9-GRID POSITION */}
          <div>
            <label className="text-xs font-bold text-[#272830] mb-2 block">Position Grid:</label>
            <div className="grid grid-cols-3 gap-1.5 w-36 mx-auto bg-[#F4F5F9] p-2 rounded-xl border border-[#E8EAEF]">
              {positions.map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => onPositionChange(pos)}
                  className={`w-9 h-9 rounded-lg border transition-all cursor-pointer ${
                    position === pos ? 'bg-[#E5322D] border-[#E5322D]' : 'bg-white border-[#E8EAEF] hover:bg-[#EAECEF]'
                  }`}
                  title={pos}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-[#FAFBFD] border border-dashed border-[#C0C3CE] rounded-2xl text-center flex flex-col items-center justify-center gap-2">
          <p className="text-xs font-bold text-[#272830]">Upload Watermark Image</p>
          <span className="text-[11px] text-[#737680]">PNG with transparent background recommended</span>
          <button
            type="button"
            className="mt-2 py-2 px-4 bg-white border border-[#E8EAEF] hover:border-[#E5322D] text-[#E5322D] text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Select Image
          </button>
        </div>
      )}
    </div>
  );
}
