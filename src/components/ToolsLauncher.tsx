import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { PDF_TOOLS } from '../config/pdfTools';

export function ToolsLauncher({ isOpen, onMouseEnter, onMouseLeave }: { isOpen: boolean; onMouseEnter: () => void; onMouseLeave: () => void }) {
  if (!isOpen) return null;

  const frequentIds = ['merge-pdf', 'split-pdf', 'compress-pdf', 'pdf-to-word', 'pdf-to-jpg', 'jpg-to-pdf', 'edit-pdf', 'sign-pdf'];
  const frequentTools = frequentIds.map(id => PDF_TOOLS.find(t => t.id === id)!).filter(Boolean);

  return (
    <div 
      className="absolute top-[56px] right-0 w-[320px] bg-white border border-[#E1E3E8] rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-4 z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="grid grid-cols-3 gap-2">
        {frequentTools.map(tool => {
          const Icon = Icons[tool.iconName as keyof typeof Icons] as React.ElementType || Icons.File;
          return (
            <Link 
              key={tool.id} 
              to={tool.slug}
              className="flex flex-col items-center justify-center gap-2 p-3 hover:bg-[#F5F5F7] rounded-[8px] transition-colors group text-center"
            >
              <Icon size={24} className={`${tool.iconColor} opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform`} strokeWidth={1.5} />
              <span className="text-[11px] text-[#33333B] font-medium leading-tight">{tool.name}</span>
            </Link>
          )
        })}
        <Link 
          to="/"
          className="flex flex-col items-center justify-center gap-2 p-3 hover:bg-[#F5F5F7] rounded-[8px] transition-colors group text-center col-span-3 mt-2 bg-gray-50"
        >
          <span className="text-[13px] text-[#E5322D] font-bold">All PDF Tools</span>
        </Link>
      </div>
    </div>
  );
}
