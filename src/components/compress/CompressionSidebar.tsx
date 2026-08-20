import React from 'react';
import { CompressionLevel, CompressionLevelOption } from './CompressionLevelOption';
import { CompressActionButton } from './CompressActionButton';

interface CompressionSidebarProps {
  selectedLevel: CompressionLevel;
  onSelectLevel: (level: CompressionLevel) => void;
  disabled: boolean;
  processing: boolean;
  onCompress: () => void;
}

export function CompressionSidebar({
  selectedLevel,
  onSelectLevel,
  disabled,
  processing,
  onCompress,
}: CompressionSidebarProps) {
  return (
    <div className="w-full md:w-[410px] h-full bg-white border-l border-[#DADCE3] flex flex-col shrink-0 shadow-sm z-10 overflow-hidden">
      {/* SIDEBAR HEADER */}
      <div className="h-[68px] min-h-[68px] border-b border-[#D9DCE3] flex items-center justify-center px-4 bg-white">
        <h2 className="text-[27px] md:text-[30px] font-semibold text-[#272830]">
          Compression level
        </h2>
      </div>

      {/* OPTIONS CONTAINER */}
      <div className="flex-1 overflow-y-auto flex flex-col" role="radiogroup" aria-label="Compression Level Options">
        <CompressionLevelOption
          level="extreme"
          title="Extreme Compression"
          subtitle="Smaller file, stronger compression"
          selected={selectedLevel === 'extreme'}
          onSelect={onSelectLevel}
        />

        <CompressionLevelOption
          level="recommended"
          title="Recommended Compression"
          subtitle="Good balance of quality and file size"
          selected={selectedLevel === 'recommended'}
          onSelect={onSelectLevel}
        />

        <CompressionLevelOption
          level="less"
          title="Less Compression"
          subtitle="Higher quality, lighter compression"
          selected={selectedLevel === 'less'}
          onSelect={onSelectLevel}
        />
      </div>

      {/* STICKY BOTTOM ACTION BUTTON */}
      <CompressActionButton
        onClick={onCompress}
        disabled={disabled}
        processing={processing}
      />
    </div>
  );
}
