import React from 'react';
import { PdfPageCard } from './PdfPageCard';

interface RangeGroupContainerProps {
  key?: React.Key;
  rangeLabel: string;
  fromPage: number;
  toPage: number;
  file: File;
  totalPages: number;
}

export function RangeGroupContainer({
  rangeLabel,
  fromPage,
  toPage,
  file,
  totalPages,
}: RangeGroupContainerProps) {
  const validFrom = Math.max(1, Math.min(fromPage, totalPages));
  const validTo = Math.max(validFrom, Math.min(toPage, totalPages));

  const pages: number[] = [];
  for (let p = validFrom; p <= validTo; p++) {
    pages.push(p);
  }

  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl border border-dashed border-[#8A8D96] bg-white/60 shadow-xs transition-all">
      <div className="text-sm font-bold text-[#272830] flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#E5322D]" />
        <span>{rangeLabel}</span>
        <span className="text-xs font-normal text-[#72757E]">
          (Pages {validFrom} - {validTo})
        </span>
      </div>

      <div className="flex flex-wrap gap-4 pt-1">
        {pages.map((p) => (
          <PdfPageCard key={p} file={file} pageNumber={p} />
        ))}
      </div>
    </div>
  );
}
