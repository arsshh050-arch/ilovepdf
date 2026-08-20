import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { PDF_TOOLS } from '../../config/pdfTools';

interface RelatedToolsGridProps {
  relatedToolIds: string[];
}

export function RelatedToolsGrid({ relatedToolIds }: RelatedToolsGridProps) {
  // Map IDs to actual tool configs
  const tools = relatedToolIds
    .map((id) => PDF_TOOLS.find((t) => t.id === id || t.slug.replace('/', '') === id))
    .filter(Boolean)
    .slice(0, 6);

  // Fallback to top tools if fewer than 6
  if (tools.length < 6) {
    const remaining = PDF_TOOLS.filter((t) => !tools.some((existing) => existing?.id === t.id)).slice(
      0,
      6 - tools.length
    );
    // @ts-ignore
    tools.push(...remaining);
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-[9px] p-6 border border-[#DADCE3] shadow-[0_1px_4px_rgba(0,0,0,0.04)] mt-7">
      <h3 className="text-xl font-bold text-[#272830] mb-5">Continue to...</h3>

      {/* 3x2 GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {tools.map((tool) => {
          if (!tool) return null;
          const IconComponent = (Icons[tool.iconName as keyof typeof Icons] as React.ElementType) || Icons.File;

          return (
            <Link
              key={tool.id}
              to={tool.slug}
              className="p-3.5 bg-[#F7F7FC] hover:bg-white border border-[#E0E2E8] hover:border-[#E5322D] rounded-lg text-[#272830] transition-all flex items-center justify-between group shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-center gap-3 truncate pr-2">
                <div className={`p-1.5 rounded-md bg-white border border-gray-100 shrink-0 ${tool.iconColor}`}>
                  <IconComponent size={18} strokeWidth={1.8} />
                </div>
                <span className="font-semibold text-sm truncate">{tool.name}</span>
              </div>
              <ChevronRight
                size={16}
                className="text-[#888A93] group-hover:text-[#E5322D] group-hover:translate-x-0.5 transition-all shrink-0"
              />
            </Link>
          );
        })}
      </div>

      {/* SEE MORE LINK */}
      <div className="w-full text-right pt-1 border-t border-gray-100">
        <Link
          to="/"
          className="text-xs font-bold text-[#E5322D] hover:text-[#C92A26] inline-flex items-center gap-1 hover:underline"
        >
          <span>See more tools</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
