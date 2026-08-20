import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { getAllPdfPageThumbnails, PageThumbnailData } from '../../utils/pdfPreview';

interface SinglePdfPreviewCanvasProps {
  file: File;
  overlayElement?: React.ReactNode;
  activePage?: number;
  onPageChange?: (page: number) => void;
}

export function SinglePdfPreviewCanvas({
  file,
  overlayElement,
  activePage: externalActivePage,
  onPageChange
}: SinglePdfPreviewCanvasProps) {
  const [pages, setPages] = useState<PageThumbnailData[]>([]);
  const [internalPage, setInternalPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);

  const currentPage = externalActivePage ?? internalPage;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getAllPdfPageThumbnails(file, 600).then(res => {
      if (isMounted) {
        setPages(res);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [file]);

  const handlePageSelect = (p: number) => {
    if (p >= 1 && p <= pages.length) {
      setInternalPage(p);
      if (onPageChange) onPageChange(p);
    }
  };

  const currentThumbnail = pages.find(p => p.pageNumber === currentPage);

  return (
    <div className="flex flex-col items-center justify-between w-full h-full min-h-[500px] gap-4">
      {/* CANVAS NAVIGATION BAR */}
      <div className="w-full max-w-2xl bg-white px-4 py-2.5 rounded-2xl border border-[#E8EAEF] shadow-xs flex items-center justify-between z-10">
        {/* PAGE PREV/NEXT */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => handlePageSelect(currentPage - 1)}
            className="p-1.5 rounded-lg border border-[#E8EAEF] hover:bg-[#F4F5F9] text-[#272830] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Previous Page"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs font-semibold text-[#272830]">
            Page {currentPage} of {pages.length || 1}
          </span>
          <button
            type="button"
            disabled={currentPage >= pages.length}
            onClick={() => handlePageSelect(currentPage + 1)}
            className="p-1.5 rounded-lg border border-[#E8EAEF] hover:bg-[#F4F5F9] text-[#272830] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Next Page"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* ZOOM CONTROLS */}
        <div className="flex items-center gap-2 border-l border-[#E8EAEF] pl-4">
          <button
            type="button"
            onClick={() => setZoom(z => Math.max(50, z - 15))}
            className="p-1.5 rounded-lg border border-[#E8EAEF] hover:bg-[#F4F5F9] text-[#272830] cursor-pointer transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-medium text-[#555760] w-12 text-center">
            {zoom}%
          </span>
          <button
            type="button"
            onClick={() => setZoom(z => Math.min(200, z + 15))}
            className="p-1.5 rounded-lg border border-[#E8EAEF] hover:bg-[#F4F5F9] text-[#272830] cursor-pointer transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            type="button"
            onClick={() => setZoom(100)}
            className="p-1.5 rounded-lg border border-[#E8EAEF] hover:bg-[#F4F5F9] text-[#555760] hover:text-[#272830] cursor-pointer transition-colors ml-1"
            title="Reset Zoom"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* MAIN DOCUMENT STAGE */}
      <div className="flex-1 w-full flex items-center justify-center p-4 overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center gap-3 animate-pulse">
            <div className="w-[320px] h-[450px] bg-white rounded-2xl shadow-md border border-[#E8EAEF]" />
            <span className="text-xs text-[#737680]">Rendering high resolution preview...</span>
          </div>
        ) : currentThumbnail ? (
          <div
            className="relative bg-white shadow-xl rounded-xl border border-[#E8EAEF] transition-transform duration-200"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center center',
            }}
          >
            <img
              src={currentThumbnail.thumbnailUrl}
              alt={`Page ${currentPage}`}
              className="max-h-[600px] w-auto object-contain rounded-xl select-none"
            />

            {/* INTERACTIVE OVERLAY */}
            {overlayElement && (
              <div className="absolute inset-0 pointer-events-auto rounded-xl overflow-hidden">
                {overlayElement}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-[#E8EAEF] text-center text-sm text-[#737680]">
            Unable to render page preview.
          </div>
        )}
      </div>
    </div>
  );
}
