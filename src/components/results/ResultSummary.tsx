import React from 'react';
import { ResultSessionData } from '../../utils/sessionStore';
import { FileText, CheckCircle2, Zap, Layers, Split, FileSpreadsheet, Lock, ShieldCheck } from 'lucide-react';

interface ResultSummaryProps {
  toolId: string;
  sessionData: ResultSessionData;
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ResultSummary({ toolId, sessionData }: ResultSummaryProps) {
  const meta = sessionData.metadata || {};

  // 1. COMPRESS PDF SUMMARY
  if (toolId === 'compress-pdf') {
    const origBytes = meta.originalBytes || sessionData.sizeBytes * 1.8;
    const compBytes = meta.compressedBytes || sessionData.sizeBytes;
    const savedPercent = meta.savedPercent ?? Math.round(((origBytes - compBytes) / origBytes) * 100);

    return (
      <div className="w-full max-w-2xl bg-white rounded-xl p-6 border border-[#DADCE3] shadow-xs my-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* CIRCULAR SAVINGS BADGE */}
        <div className="w-24 h-24 rounded-full border-4 border-[#23A455] bg-green-50 flex flex-col items-center justify-center shrink-0">
          <span className="text-2xl font-black text-[#23A455] leading-none">
            {savedPercent}%
          </span>
          <span className="text-[10px] font-bold text-[#23A455] tracking-wider uppercase mt-0.5">
            SAVED
          </span>
        </div>

        {/* DETAILS */}
        <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
          <p className="text-lg font-bold text-[#272830]">
            Your PDF is now <span className="text-[#23A455]">{savedPercent}% smaller</span>!
          </p>
          <div className="flex items-center gap-3 text-sm text-[#525560] font-medium mt-1">
            <span className="line-through text-gray-400">{formatBytes(origBytes)}</span>
            <span className="text-gray-400">→</span>
            <span className="text-[#23A455] font-bold">{formatBytes(compBytes)}</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. MERGE PDF SUMMARY
  if (toolId === 'merge-pdf') {
    const mergedCount = meta.mergedCount || meta.fileCount || 2;
    const pageCount = meta.pageCount || meta.totalPages || 1;

    return (
      <div className="w-full max-w-2xl bg-white rounded-xl p-6 border border-[#DADCE3] shadow-xs my-6 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase font-semibold text-[#72757E] tracking-wider mb-1">
            Files Merged
          </span>
          <span className="text-2xl font-bold text-[#272830] flex items-center gap-1.5">
            <Layers size={20} className="text-[#E5322D]" />
            {mergedCount} PDFs
          </span>
        </div>

        <div className="hidden sm:block w-px h-10 bg-[#D9DCE3]" />

        <div className="flex flex-col items-center">
          <span className="text-xs uppercase font-semibold text-[#72757E] tracking-wider mb-1">
            Total Pages
          </span>
          <span className="text-2xl font-bold text-[#272830]">
            {pageCount} {pageCount === 1 ? 'page' : 'pages'}
          </span>
        </div>

        <div className="hidden sm:block w-px h-10 bg-[#D9DCE3]" />

        <div className="flex flex-col items-center">
          <span className="text-xs uppercase font-semibold text-[#72757E] tracking-wider mb-1">
            Final Size
          </span>
          <span className="text-2xl font-bold text-[#23A455]">
            {formatBytes(sessionData.sizeBytes)}
          </span>
        </div>
      </div>
    );
  }

  // 3. SPLIT PDF SUMMARY
  if (toolId === 'split-pdf') {
    const splitCount = meta.splitCount || meta.outputCount || 1;
    const mode = meta.mode || 'Custom ranges';

    return (
      <div className="w-full max-w-2xl bg-white rounded-xl p-6 border border-[#DADCE3] shadow-xs my-6 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase font-semibold text-[#72757E] tracking-wider mb-1">
            Split Mode
          </span>
          <span className="text-lg font-bold text-[#272830] capitalize flex items-center gap-1.5">
            <Split size={18} className="text-[#E5322D]" />
            {mode}
          </span>
        </div>

        <div className="hidden sm:block w-px h-10 bg-[#D9DCE3]" />

        <div className="flex flex-col items-center">
          <span className="text-xs uppercase font-semibold text-[#72757E] tracking-wider mb-1">
            Output Files
          </span>
          <span className="text-2xl font-bold text-[#272830]">
            {splitCount} {splitCount === 1 ? 'PDF' : 'PDFs'}
          </span>
        </div>

        <div className="hidden sm:block w-px h-10 bg-[#D9DCE3]" />

        <div className="flex flex-col items-center">
          <span className="text-xs uppercase font-semibold text-[#72757E] tracking-wider mb-1">
            Total Output Size
          </span>
          <span className="text-2xl font-bold text-[#23A455]">
            {formatBytes(sessionData.sizeBytes)}
          </span>
        </div>
      </div>
    );
  }

  // 4. CONVERSIONS (PDF to Word, Excel, PPT, JPG, etc.)
  if (toolId.includes('to-') || toolId.includes('convert')) {
    const outputType = meta.outputType || sessionData.filename.split('.').pop()?.toUpperCase() || 'DOCUMENT';
    const pageCount = meta.pageCount || 1;

    return (
      <div className="w-full max-w-2xl bg-white rounded-xl p-6 border border-[#DADCE3] shadow-xs my-6 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase font-semibold text-[#72757E] tracking-wider mb-1">
            Conversion Status
          </span>
          <span className="text-lg font-bold text-[#23A455] flex items-center gap-1.5">
            <CheckCircle2 size={18} /> Complete
          </span>
        </div>

        <div className="hidden sm:block w-px h-10 bg-[#D9DCE3]" />

        <div className="flex flex-col items-center">
          <span className="text-xs uppercase font-semibold text-[#72757E] tracking-wider mb-1">
            Format
          </span>
          <span className="text-xl font-bold text-[#272830]">
            {outputType}
          </span>
        </div>

        <div className="hidden sm:block w-px h-10 bg-[#D9DCE3]" />

        <div className="flex flex-col items-center">
          <span className="text-xs uppercase font-semibold text-[#72757E] tracking-wider mb-1">
            File Size
          </span>
          <span className="text-2xl font-bold text-[#272830]">
            {formatBytes(sessionData.sizeBytes)}
          </span>
        </div>
      </div>
    );
  }

  // 5. OCR PDF
  if (toolId === 'ocr-pdf') {
    return (
      <div className="w-full max-w-2xl bg-white rounded-xl p-6 border border-[#DADCE3] shadow-xs my-6 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase font-semibold text-[#72757E] tracking-wider mb-1">
            OCR Processing
          </span>
          <span className="text-lg font-bold text-[#23A455] flex items-center gap-1">
            <CheckCircle2 size={18} /> Complete
          </span>
        </div>

        <div className="hidden sm:block w-px h-10 bg-[#D9DCE3]" />

        <div className="flex flex-col items-center">
          <span className="text-xs uppercase font-semibold text-[#72757E] tracking-wider mb-1">
            Language
          </span>
          <span className="text-xl font-bold text-[#272830]">
            {meta.language || 'English'}
          </span>
        </div>

        <div className="hidden sm:block w-px h-10 bg-[#D9DCE3]" />

        <div className="flex flex-col items-center">
          <span className="text-xs uppercase font-semibold text-[#72757E] tracking-wider mb-1">
            Searchable PDF
          </span>
          <span className="text-lg font-bold text-[#272830]">
            Created
          </span>
        </div>
      </div>
    );
  }

  // 6. GENERIC / EDIT / PROTECT / UNLOCK / ROTATE / WATERMARK / ETC.
  return (
    <div className="w-full max-w-2xl bg-white rounded-xl p-6 border border-[#DADCE3] shadow-xs my-6 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
      <div className="flex flex-col items-center">
        <span className="text-xs uppercase font-semibold text-[#72757E] tracking-wider mb-1">
          Status
        </span>
        <span className="text-lg font-bold text-[#23A455] flex items-center gap-1.5">
          <CheckCircle2 size={18} /> Task Completed
        </span>
      </div>

      <div className="hidden sm:block w-px h-10 bg-[#D9DCE3]" />

      <div className="flex flex-col items-center">
        <span className="text-xs uppercase font-semibold text-[#72757E] tracking-wider mb-1">
          File Name
        </span>
        <span className="text-sm font-bold text-[#272830] truncate max-w-[180px]" title={sessionData.filename}>
          {sessionData.filename}
        </span>
      </div>

      <div className="hidden sm:block w-px h-10 bg-[#D9DCE3]" />

      <div className="flex flex-col items-center">
        <span className="text-xs uppercase font-semibold text-[#72757E] tracking-wider mb-1">
          Output Size
        </span>
        <span className="text-xl font-bold text-[#272830]">
          {formatBytes(sessionData.sizeBytes)}
        </span>
      </div>
    </div>
  );
}
