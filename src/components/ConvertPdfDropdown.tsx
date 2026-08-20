import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { PDF_TOOLS } from '../config/pdfTools';

export function ConvertPdfDropdown({ isOpen, onMouseEnter, onMouseLeave }: { isOpen: boolean; onMouseEnter: () => void; onMouseLeave: () => void }) {
  if (!isOpen) return null;

  const convertTo = PDF_TOOLS.filter(t => t.category === 'convert_to');
  const convertFrom = PDF_TOOLS.filter(t => t.category === 'convert_from');

  return (
    <div 
      className="absolute top-[56px] left-1/2 -translate-x-1/2 w-[500px] bg-white border border-[#E1E3E8] rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-[30px] flex gap-8 z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex-1">
        <h3 className="text-[11px] font-bold text-gray-400 tracking-wider mb-4 uppercase">Convert to PDF</h3>
        <div className="flex flex-col">
          {convertTo.map(tool => {
            const Icon = Icons[tool.iconName as keyof typeof Icons] as React.ElementType || Icons.File;
            return (
              <Link 
                key={tool.id} 
                to={tool.slug}
                className="flex items-center gap-3 h-[38px] px-2 hover:bg-[#F5F5F7] rounded-[6px] transition-colors"
              >
                <Icon size={16} className={tool.iconColor} />
                <span className="text-[14px] text-[#33333B] font-medium">{tool.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className="text-[11px] font-bold text-gray-400 tracking-wider mb-4 uppercase">Convert from PDF</h3>
        <div className="flex flex-col">
          {convertFrom.map(tool => {
            const Icon = Icons[tool.iconName as keyof typeof Icons] as React.ElementType || Icons.File;
            return (
              <Link 
                key={tool.id} 
                to={tool.slug}
                className="flex items-center gap-3 h-[38px] px-2 hover:bg-[#F5F5F7] rounded-[6px] transition-colors"
              >
                <Icon size={16} className={tool.iconColor} />
                <span className="text-[14px] text-[#33333B] font-medium">{tool.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
}
