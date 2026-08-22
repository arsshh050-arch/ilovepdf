import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  numPages: number;
  file: File | null;
  currentPage: number;
  setCurrentPage: (p: number) => void;
}

export function Sidebar({ numPages, file, currentPage, setCurrentPage }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`relative bg-white border-r border-[#E0E2E8] transition-all duration-300 flex-shrink-0 z-10 flex ${isOpen ? 'w-64' : 'w-0'}`}>
      <div className={`flex-1 overflow-y-auto w-full ${!isOpen && 'hidden'}`}>
        <div className="p-4 space-y-4 pb-20">
          <Document file={file} className="flex flex-col items-center">
            {Array.from(new Array(numPages), (el, index) => (
              <div 
                key={`thumb_${index + 1}`} 
                onClick={() => setCurrentPage(index + 1)}
                className={`mb-4 cursor-pointer p-1 rounded-sm border-2 transition-colors ${currentPage === index + 1 ? 'border-[#E5322D]' : 'border-transparent hover:border-gray-300'}`}
              >
                <div className="relative overflow-hidden bg-gray-50 border border-gray-200 shadow-sm" style={{ width: 150 }}>
                  <Page
                    pageNumber={index + 1}
                    width={150}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                  <div className="absolute bottom-0 right-0 bg-black/50 text-white text-[10px] px-1 rounded-tl">
                    {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </Document>
        </div>
      </div>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-white border border-[#E0E2E8] rounded-r-md flex items-center justify-center shadow-sm text-gray-500 hover:text-gray-800 z-20"
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </div>
  );
}
