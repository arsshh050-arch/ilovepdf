import React, { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { renderSinglePageThumbnail } from '../../utils/pdfPageRenderer';

interface PdfPageCardProps {
  key?: React.Key;
  file: File;
  pageNumber: number;
  selected?: boolean;
  onClick?: () => void;
  selectable?: boolean;
}

export function PdfPageCard({
  file,
  pageNumber,
  selected = false,
  onClick,
  selectable = false,
}: PdfPageCardProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    renderSinglePageThumbnail(file, pageNumber, 160)
      .then((url) => {
        if (isMounted) {
          setThumbnailUrl(url);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [file, pageNumber]);

  return (
    <div
      onClick={selectable && onClick ? onClick : undefined}
      className={`relative group bg-white rounded-lg p-2 flex flex-col items-center justify-between border-2 transition-all shadow-sm ${
        selectable ? 'cursor-pointer hover:shadow-md' : ''
      } ${
        selected
          ? 'border-[#23A455] bg-green-50/20'
          : 'border-transparent hover:border-gray-200'
      }`}
      style={{ width: '160px', height: '210px' }}
    >
      {/* SELECTION CHECKMARK BADGE */}
      {selectable && (
        <div
          className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
            selected
              ? 'bg-[#23A455] text-white shadow-sm'
              : 'bg-white/80 text-gray-300 border border-gray-200 group-hover:border-gray-400'
          }`}
        >
          <Check size={14} strokeWidth={3} />
        </div>
      )}

      {/* THUMBNAIL PREVIEW CANVAS CONTAINER */}
      <div className="w-full flex-1 flex items-center justify-center overflow-hidden bg-[#FAFAFC] rounded border border-gray-100">
        {loading ? (
          <Loader2 size={24} className="text-gray-400 animate-spin" />
        ) : thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`Page ${pageNumber}`}
            className="max-h-full max-w-full object-contain shadow-xs"
          />
        ) : (
          <div className="text-xs text-gray-400">Page {pageNumber}</div>
        )}
      </div>

      {/* PAGE NUMBER BADGE */}
      <div className="mt-2 text-xs font-semibold text-[#272830]">
        {pageNumber}
      </div>
    </div>
  );
}
