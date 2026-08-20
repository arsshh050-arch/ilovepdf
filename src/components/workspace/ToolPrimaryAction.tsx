import React from 'react';
import { Loader2 } from 'lucide-react';

interface ToolPrimaryActionProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  disabledReason?: string;
  isProcessing?: boolean;
}

export function ToolPrimaryAction({
  label,
  onClick,
  disabled = false,
  disabledReason,
  isProcessing = false
}: ToolPrimaryActionProps) {
  // Ensure string format ends with " →" if not already present
  const displayLabel = label.endsWith('→') ? label : `${label} →`;

  return (
    <div className="p-4 bg-white border-t border-[#E8EAEF] shrink-0 sticky bottom-0 z-20">
      {disabledReason && disabled && (
        <p className="text-xs text-[#E5322D] text-center mb-2 font-medium bg-[#FFF0EE] py-1.5 px-3 rounded-lg border border-[#FADBD8]">
          {disabledReason}
        </p>
      )}

      <button
        type="button"
        onClick={onClick}
        disabled={disabled || isProcessing}
        className={`w-full h-[72px] rounded-[10px] text-[20px] font-bold text-white transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer ${
          disabled || isProcessing
            ? 'bg-[#E5322D]/60 cursor-not-allowed shadow-none'
            : 'bg-[#E5322D] hover:bg-[#D12924]'
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="animate-spin shrink-0" size={26} />
            <span>Processing...</span>
          </>
        ) : (
          <span>{displayLabel}</span>
        )}
      </button>
    </div>
  );
}
