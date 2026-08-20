import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { renderSinglePageThumbnail, getAllPagesMetadata } from '../../utils/pdfPageRenderer';
import { formatFileSize } from '../../utils/pdfPreview';

interface CompressPdfCardProps {
  key?: React.Key;
  file: File;
  onRemove: () => void;
}

export function CompressPdfCard({ file, onRemove }: CompressPdfCardProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageCount, setPageCount] = useState<number>(1);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getAllPagesMetadata(file).then((meta) => {
      if (isMounted) {
        setPageCount(meta.pageCount);
      }
    });

    renderSinglePageThumbnail(file, 1, 160)
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
  }, [file]);

  return (
    <div
      className="relative group bg-white rounded-[7px] border border-[#D8DAE0] p-3 flex flex-col items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-md transition-all"
      style={{ width: '180px', minHeight: '225px' }}
    >
      {/* DELETE BUTTON */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-white hover:bg-[#E5322D] text-gray-500 hover:text-white rounded-full border border-gray-200 hover:border-[#E5322D] flex items-center justify-center shadow-sm transition-all cursor-pointer"
        title="Remove file"
      >
        <X size={14} />
      </button>

      {/* THUMBNAIL CONTAINER */}
      <div className="w-full flex-1 flex items-center justify-center overflow-hidden bg-[#FAFAFC] rounded border border-gray-100 min-h-[150px] mb-2 relative">
        {loading ? (
          <Loader2 size={24} className="text-gray-400 animate-spin" />
        ) : thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={file.name}
            className="max-h-[150px] max-w-full object-contain shadow-xs"
          />
        ) : (
          <div className="text-xs text-gray-400">Preview not available</div>
        )}
      </div>

      {/* FILE INFO */}
      <div className="w-full text-center flex flex-col gap-0.5 px-1">
        <p
          className="text-xs font-bold text-[#272830] truncate w-full"
          title={file.name}
        >
          {file.name}
        </p>
        <p className="text-[11px] text-[#72757E]">
          {formatFileSize(file.size)} • {pageCount} {pageCount === 1 ? 'page' : 'pages'}
        </p>
      </div>
    </div>
  );
}
