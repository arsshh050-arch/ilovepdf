import React from 'react';
import { ArrowRight, Loader2, Info } from 'lucide-react';

interface MergePdfSidebarProps {
  totalFiles: number;
  isProcessing: boolean;
  onMerge: () => void;
}

export function MergePdfSidebar({ totalFiles, isProcessing, onMerge }: MergePdfSidebarProps) {
  const canMerge = totalFiles >= 2 && !isProcessing;

  return (
    <aside className="w-full md:w-[380px] lg:w-[410px] bg-white border-t md:border-t-0 md:border-l border-[#DADCE3] flex flex-col justify-between shrink-0 md:sticky md:top-0 md:h-[calc(100vh-60px)] z-20">
      {/* TOP HEADER */}
      <div>
        <div className="py-5 px-6 border-b border-[#DDDDDD] text-center">
          <h2 className="text-[26px] md:text-[30px] font-semibold text-[#272830] tracking-tight">
            Merge PDF
          </h2>
        </div>

        {/* INFO BOX WHEN LESS THAN 2 FILES */}
        <div className="p-6">
          {totalFiles < 2 ? (
            <div className="bg-[#DDF4FF] border border-[#B3E1FC] rounded-[6px] p-4 text-[13px] text-[#1B4B66] leading-relaxed flex items-start gap-3">
              <Info size={20} className="text-[#0284C7] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1 text-[#0369A1]">More files needed</p>
                <p>
                  Add at least one more PDF to create a merged document. Use the <strong>+</strong> button or select multiple files from your device.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-[#F4F6FA] border border-[#E0E2E8] rounded-[8px] p-4 text-[13px] text-[#525560]">
              <p className="font-semibold text-[#272830] mb-1">Files ready for merge ({totalFiles})</p>
              <p>
                Drag and drop cards in the main workspace to reorder files. Click ↻ to rotate individual documents.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MERGE BUTTON CONTAINER */}
      <div className="p-5 md:p-6 border-t md:border-t-0 border-[#E0E2E8]">
        <button
          type="button"
          onClick={onMerge}
          disabled={!canMerge}
          className={`w-full h-[64px] md:h-[74px] rounded-[10px] text-[20px] md:text-[22px] font-bold transition-all flex items-center justify-center gap-3 shadow-md ${
            isProcessing
              ? 'bg-[#E5322D] text-white cursor-wait opacity-90'
              : canMerge
              ? 'bg-[#E5322D] hover:bg-[#C92A26] text-white cursor-pointer shadow-[0_4px_14px_rgba(229,50,45,0.3)] hover:shadow-xl hover:-translate-y-0.5'
              : 'bg-[#F28F8D] text-white cursor-not-allowed opacity-80'
          }`}
          aria-label={
            isProcessing
              ? 'Merging PDFs in progress'
              : canMerge
              ? 'Merge PDF documents'
              : 'Merge PDF disabled - select at least 2 files'
          }
        >
          {isProcessing ? (
            <>
              <Loader2 size={26} className="animate-spin" />
              <span>Merging PDFs...</span>
            </>
          ) : (
            <>
              <span>Merge PDF</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight size={20} />
              </div>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
