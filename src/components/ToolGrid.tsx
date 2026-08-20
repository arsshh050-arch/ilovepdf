import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { PDF_TOOLS, ToolCategory } from '../config/pdfTools';

export type FilterType = ToolCategory | 'all' | 'workflows';

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'ALL', value: 'all' },
  { label: 'ORGANIZE PDF', value: 'organize' },
  { label: 'OPTIMIZE PDF', value: 'optimize' },
  { label: 'CONVERT PDF', value: 'convert_from' }, 
  { label: 'EDIT PDF', value: 'edit' },
  { label: 'PDF SECURITY', value: 'security' },
  { label: 'PDF INTELLIGENCE', value: 'ai' },
];

export function CategoryFilters({ activeFilter, onFilterChange }: { activeFilter: FilterType, onFilterChange: (f: FilterType) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto px-4 mb-12">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
            activeFilter === filter.value
              ? 'bg-[#2A2B30] text-white border border-[#2A2B30]'
              : 'bg-white text-gray-700 border border-[#D5D7DF] hover:bg-gray-50'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export function ToolGrid({ activeFilter }: { activeFilter: FilterType }) {
  const displayTools = PDF_TOOLS.filter((tool) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'workflows') return false; 
    if (activeFilter === 'convert_from') return tool.category === 'convert_from' || tool.category === 'convert_to';
    return tool.category === activeFilter;
  });

  const renderedTools = [...displayTools];
  
  if (activeFilter === 'all' || activeFilter === 'workflows') {
    renderedTools.push({
      id: 'create-workflow',
      name: 'Create a workflow',
      slug: '/user/workflows/new',
      description: 'Create custom workflows using your favorite PDF tools, automate repetitive tasks and reuse them anytime.',
      iconName: 'Settings2',
      iconColor: 'text-[#E5322D]',
      category: 'organize' 
    } as any);
  }

  return (
    <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-[16px] max-w-[1800px] mx-auto px-6 md:px-12 items-stretch">
      {renderedTools.map((tool) => {
        const Icon = Icons[tool.iconName as keyof typeof Icons] as React.ElementType || Icons.File;
        const isWorkflow = tool.id === 'create-workflow';
        
        return (
          <Link 
            key={tool.id} 
            to={tool.slug}
            className={`w-full h-[210px] min-[480px]:h-[230px] md:h-[250px] rounded-[14px] p-[30px] border hover:border-[#444] transition-all duration-300 hover:-translate-y-[2px] flex flex-col cursor-pointer box-border relative overflow-hidden ${
              isWorkflow ? 'bg-[#FFE2DA] border-[#F3C5BA]' : 'bg-white border-[#D9DAE0]'
            }`}
          >
            {tool.isNew && (
              <div className="absolute top-[12px] right-[12px] bg-[#DDF4FF] text-[#1B5E80] text-[12px] font-bold px-[8px] py-[2px] rounded-[4px]">
                New!
              </div>
            )}
            
            <div className={`mb-[18px] ${tool.iconColor}`}>
              <Icon size={48} strokeWidth={1.5} />
            </div>
            
            <h3 className={`font-[600] text-[22px] mb-[10px] leading-[1.2] ${isWorkflow ? 'text-[#33333B]' : 'text-[#2D2E35]'}`}>
              {tool.name}
            </h3>
            
            <p className={`text-[14px] leading-[1.45] line-clamp-4 overflow-hidden ${isWorkflow ? 'text-[#555]' : 'text-[#777A84]'}`}>
              {tool.description}
            </p>
            
            {isWorkflow && (
              <div className="mt-auto font-bold text-[#E5322D] flex items-center gap-1 text-[14px]">
                Create workflow <span className="ml-1 text-[16px]">↗</span>
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
