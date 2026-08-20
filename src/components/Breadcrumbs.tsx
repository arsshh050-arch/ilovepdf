import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  // Always start with Home
  const allItems = [{ label: 'Home', path: '/' }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-[13px] text-[#737680] mb-6">
      <ol className="flex items-center space-x-2">
        {allItems.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <li><ChevronRight size={14} className="text-[#A0A2AB]" /></li>}
            <li>
              {index === allItems.length - 1 ? (
                <span className="text-[#30313A] font-[600]" aria-current="page">{item.label}</span>
              ) : (
                <Link to={item.path} className="hover:text-[#E5322D] transition-colors">{item.label}</Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
