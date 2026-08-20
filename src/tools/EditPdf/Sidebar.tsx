import React from 'react';
import { Document, Page } from 'react-pdf';
import { Trash2, Copy, RotateCw } from 'lucide-react';

interface SidebarProps {
  numPages: number;
  scale: number;
  setScale: (scale: number) => void;
  file: File;
}

export function Sidebar({ numPages, scale, setScale, file }: SidebarProps) {
  
  const scrollToPage = (pageIndex: number) => {
    const pageEl = document.querySelector(`.pdf-page-canvas[data-page-number="${pageIndex}"]`);
    if (pageEl) {
      pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAction = (e: React.MouseEvent, action: string, index: number) => {
    e.stopPropagation();
    // Dispatch event to workspace to handle page mutations
    window.dispatchEvent(new CustomEvent('PAGE_ACTION', { detail: { action, index } }));
  };

  return (
    <div className="w-[240px] bg-[#f8fafc] border-r border-[#e5e7eb] flex flex-col h-full z-10 hidden md:flex">
      <div className="p-4 border-b border-[#e5e7eb] bg-white flex justify-between items-center shadow-sm z-10 h-12">
        <h3 className="font-semibold text-gray-900 text-sm">Thumbnails</h3>
        <span className="text-xs text-gray-500 font-medium">{numPages} Pages</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Document file={file} className="flex flex-col items-center space-y-6">
          {Array.from(new Array(numPages), (el, index) => (
            <div 
              key={`thumb_${index + 1}`}
              onClick={() => scrollToPage(index + 1)}
              className="cursor-pointer group relative w-full flex flex-col items-center"
            >
              <div className="w-full bg-white border border-[#e5e7eb] shadow-sm hover:shadow-md rounded-xl p-3 transition-all group-hover:border-[#ef4444] group-hover:ring-1 group-hover:ring-[#ef4444] overflow-hidden flex justify-center items-center relative min-h-[140px]">
                <Page 
                  pageNumber={index + 1} 
                  width={140} 
                  renderAnnotationLayer={false} 
                  renderTextLayer={false}
                  className="shadow-sm"
                />
                
                <div className="absolute top-2 right-2 flex flex-col space-y-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => handleAction(e, 'rotate', index)} className="p-1.5 bg-white/90 backdrop-blur border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 hover:text-black transition-colors"><RotateCw size={14} /></button>
                  <button onClick={(e) => handleAction(e, 'duplicate', index)} className="p-1.5 bg-white/90 backdrop-blur border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 hover:text-black transition-colors"><Copy size={14} /></button>
                  <button onClick={(e) => handleAction(e, 'delete', index)} className="p-1.5 bg-white/90 backdrop-blur border border-red-100 rounded-lg shadow-sm hover:bg-red-50 text-red-600 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="mt-2 text-xs font-medium text-gray-500 group-hover:text-[#ef4444]">
                {index + 1}
              </div>
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
}
