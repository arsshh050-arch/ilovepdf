import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { PDF_TOOLS } from '../config/pdfTools';

export function AllToolsMegaMenu({ isOpen, onMouseEnter, onMouseLeave }: { isOpen: boolean; onMouseEnter: () => void; onMouseLeave: () => void }) {
  if (!isOpen) return null;

  const cols = [
    { title: 'ORGANIZE PDF', cat: 'organize' },
    { title: 'OPTIMIZE PDF', cat: 'optimize' },
    { title: 'CONVERT TO PDF', cat: 'convert_to' },
    { title: 'CONVERT FROM PDF', cat: 'convert_from' },
    { title: 'EDIT PDF', cat: 'edit' },
    { title: 'PDF SECURITY', cat: 'security' },
    { title: 'PDF INTELLIGENCE', cat: 'ai' },
  ];

  return (
    <div 
      className="absolute top-[56px] left-1/2 -translate-x-1/2 w-[calc(100%-80px)] max-w-[1800px] bg-white border border-[#E1E3E8] rounded-b-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.10)] p-[30px_36px] z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
        {cols.map(col => {
          const tools = PDF_TOOLS.filter(t => t.category === col.cat);
          return (
            <div key={col.title}>
              <h3 className="text-[12px] font-bold text-gray-500 tracking-wide mb-4">{col.title}</h3>
              <div className="flex flex-col gap-1">
                {tools.map(tool => {
                  const Icon = Icons[tool.iconName as keyof typeof Icons] as React.ElementType || Icons.File;
                  return (
                    <Link 
                      key={tool.id} 
                      to={tool.slug}
                      className="flex items-center gap-3 py-1.5 px-2 hover:bg-[#F5F5F7] rounded-[6px] transition-colors group"
                    >
                      <Icon size={16} className={`${tool.iconColor} opacity-80 group-hover:opacity-100`} />
                      <span className="text-[13px] text-[#33333B] font-medium leading-tight truncate">{tool.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
