import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { PDF_TOOLS } from '../../config/pdfTools';

const POPULAR_SLUGS = [
  'pdf-to-word',
  'compress-pdf',
  'merge-pdf',
  'jpg-to-pdf',
  'edit-pdf',
  'split-pdf'
];

export function PopularTools() {
  const popularTools = POPULAR_SLUGS.map(slug => PDF_TOOLS.find(t => t.slug === slug)).filter(Boolean);

  return (
    <section className="mb-16 px-4 md:px-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-[#111111] mb-8">Popular PDF Tools</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
        {popularTools.map((tool) => {
          if (!tool) return null;
          const Icon = (Icons as any)[tool.iconName] || Icons.File;
          
          return (
            <Link 
              key={tool.id}
              to={tool.slug.startsWith('/') ? tool.slug : `/${tool.slug}`}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow group flex flex-col items-center text-center"
            >
              <div className={`p-4 rounded-full mb-4 bg-gray-50 ${tool.iconColor || 'text-[#E53935]'} group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#111111] mb-2">{tool.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{tool.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
