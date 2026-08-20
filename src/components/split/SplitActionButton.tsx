import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface SplitActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  processing: boolean;
}

export function SplitActionButton({ onClick, disabled, processing }: SplitActionButtonProps) {
  return (
    <div className="p-4 bg-white border-t border-[#D9DCE3] sticky bottom-0 z-20">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || processing}
        className={`w-full h-[74px] rounded-[10px] text-white font-bold text-[22px] transition-all flex items-center justify-center gap-3 shadow-lg ${
          disabled || processing
            ? 'bg-[#F28F8D] cursor-not-allowed opacity-90'
            : 'bg-[#E5322D] hover:bg-[#FF4B45] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
        }`}
      >
        {processing ? (
          <>
            <Loader2 size={26} className="animate-spin" />
            <span>Splitting PDF...</span>
          </>
        ) : (
          <>
            <span>Split PDF</span>
            <ArrowRight size={24} strokeWidth={2.5} />
          </>
        )}
      </button>
    </div>
  );
}
