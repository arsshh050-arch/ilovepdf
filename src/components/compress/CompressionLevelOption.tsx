import React from 'react';
import { Check } from 'lucide-react';

export type CompressionLevel = 'extreme' | 'recommended' | 'less';

interface CompressionLevelOptionProps {
  level: CompressionLevel;
  title: string;
  subtitle: string;
  selected: boolean;
  onSelect: (level: CompressionLevel) => void;
}

export function CompressionLevelOption({
  level,
  title,
  subtitle,
  selected,
  onSelect,
}: CompressionLevelOptionProps) {
  return (
    <div
      onClick={() => onSelect(level)}
      className={`w-full min-h-[72px] px-5 py-4 border-b border-[#D9DCE3] flex items-center justify-between cursor-pointer transition-colors select-none ${
        selected ? 'bg-[#F2F2F8]' : 'bg-white hover:bg-[#F7F7FA]'
      }`}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          onSelect(level);
        }
      }}
    >
      <div className="flex flex-col gap-0.5">
        <h4 className="text-[14px] md:text-[15px] font-bold uppercase tracking-wide text-[#E5322D]">
          {title}
        </h4>
        <p className="text-[13px] md:text-[14px] text-[#525560]">
          {subtitle}
        </p>
      </div>

      <div className="shrink-0 ml-3">
        {selected ? (
          <div className="w-6 h-6 rounded-full bg-[#23A455] text-white flex items-center justify-center shadow-xs">
            <Check size={14} strokeWidth={3} />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
        )}
      </div>
    </div>
  );
}
