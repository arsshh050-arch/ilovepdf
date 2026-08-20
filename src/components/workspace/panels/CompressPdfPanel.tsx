import React from 'react';
import { Check, ShieldCheck, Zap } from 'lucide-react';

interface CompressPdfPanelProps {
  level: 'extreme' | 'recommended' | 'less';
  onLevelChange: (level: 'extreme' | 'recommended' | 'less') => void;
}

export function CompressPdfPanel({ level, onLevelChange }: CompressPdfPanelProps) {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h3 className="text-base font-bold text-[#272830] mb-1">COMPRESSION LEVEL</h3>
        <p className="text-xs text-[#737680]">Select the balance between file size and quality.</p>
      </div>

      <div className="flex flex-col gap-3">
        {/* EXTREME */}
        <div
          onClick={() => onLevelChange('extreme')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col gap-1 select-none ${
            level === 'extreme'
              ? 'border-[#E5322D] bg-[#FFF0EE]/30 shadow-xs'
              : 'border-[#E8EAEF] hover:border-[#C0C3CE] bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-[#E5322D]" />
              <span className="text-sm font-bold text-[#272830]">EXTREME COMPRESSION</span>
            </div>
            {level === 'extreme' && (
              <div className="w-5 h-5 rounded-full bg-[#E5322D] text-white flex items-center justify-center">
                <Check size={13} strokeWidth={3} />
              </div>
            )}
          </div>
          <p className="text-xs text-[#686B74]">
            Minimum 80% file size reduction while maintaining high visual quality.
          </p>
        </div>

        {/* RECOMMENDED (DEFAULT) */}
        <div
          onClick={() => onLevelChange('recommended')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col gap-1 select-none ${
            level === 'recommended'
              ? 'border-[#E5322D] bg-[#FFF0EE]/30 shadow-xs'
              : 'border-[#E8EAEF] hover:border-[#C0C3CE] bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#2E7D32]" />
              <span className="text-sm font-bold text-[#272830]">RECOMMENDED COMPRESSION</span>
            </div>
            {level === 'recommended' && (
              <div className="w-5 h-5 rounded-full bg-[#E5322D] text-white flex items-center justify-center">
                <Check size={13} strokeWidth={3} />
              </div>
            )}
          </div>
          <p className="text-xs text-[#686B74]">
            Minimum 60% file size reduction with excellent balanced quality.
          </p>
        </div>

        {/* LESS */}
        <div
          onClick={() => onLevelChange('less')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col gap-1 select-none ${
            level === 'less'
              ? 'border-[#E5322D] bg-[#FFF0EE]/30 shadow-xs'
              : 'border-[#E8EAEF] hover:border-[#C0C3CE] bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#272830]">LESS COMPRESSION</span>
            {level === 'less' && (
              <div className="w-5 h-5 rounded-full bg-[#E5322D] text-white flex items-center justify-center">
                <Check size={13} strokeWidth={3} />
              </div>
            )}
          </div>
          <p className="text-xs text-[#686B74]">
            Minimum 50% file size reduction. Maximum pristine image quality.
          </p>
        </div>
      </div>
    </div>
  );
}
