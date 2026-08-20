import React, { useState, useEffect } from 'react';
import { getAllPdfPageThumbnails, PageThumbnailData } from '../../utils/pdfPreview';

interface DualPdfPreviewCanvasProps {
  files: File[];
}

export function DualPdfPreviewCanvas({ files }: DualPdfPreviewCanvasProps) {
  const [docAThumb, setDocAThumb] = useState<PageThumbnailData | null>(null);
  const [docBThumb, setDocBThumb] = useState<PageThumbnailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      files[0] ? getAllPdfPageThumbnails(files[0], 450) : Promise.resolve([]),
      files[1] ? getAllPdfPageThumbnails(files[1], 450) : Promise.resolve([])
    ]).then(([a, b]) => {
      if (active) {
        setDocAThumb(a[0] || null);
        setDocBThumb(b[0] || null);
        setLoading(false);
      }
    });

    return () => { active = false; };
  }, [files]);

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-6 items-center justify-center p-4">
      {/* DOCUMENT A */}
      <div className="flex-1 w-full bg-white rounded-2xl border border-[#E8EAEF] shadow-sm p-4 flex flex-col items-center">
        <div className="w-full text-center pb-3 mb-3 border-b border-[#E8EAEF]">
          <span className="text-xs font-bold text-[#272830] uppercase tracking-wider">
            Document A: {files[0]?.name || 'File 1'}
          </span>
        </div>
        <div className="h-[450px] flex items-center justify-center overflow-hidden">
          {loading ? (
            <div className="w-[280px] h-[380px] bg-[#F4F5F9] animate-pulse rounded-xl" />
          ) : docAThumb ? (
            <img src={docAThumb.thumbnailUrl} alt="Doc A" className="max-h-full object-contain rounded-lg border border-[#E8EAEF]" />
          ) : (
            <span className="text-xs text-[#737680]">No document selected</span>
          )}
        </div>
      </div>

      {/* DOCUMENT B */}
      <div className="flex-1 w-full bg-white rounded-2xl border border-[#E8EAEF] shadow-sm p-4 flex flex-col items-center">
        <div className="w-full text-center pb-3 mb-3 border-b border-[#E8EAEF]">
          <span className="text-xs font-bold text-[#E5322D] uppercase tracking-wider">
            Document B: {files[1]?.name || 'File 2'}
          </span>
        </div>
        <div className="h-[450px] flex items-center justify-center overflow-hidden">
          {loading ? (
            <div className="w-[280px] h-[380px] bg-[#F4F5F9] animate-pulse rounded-xl" />
          ) : docBThumb ? (
            <img src={docBThumb.thumbnailUrl} alt="Doc B" className="max-h-full object-contain rounded-lg border border-[#E8EAEF]" />
          ) : (
            <span className="text-xs text-[#737680]">Add a second PDF to compare</span>
          )}
        </div>
      </div>
    </div>
  );
}
