import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Search, Grid, Wrench, FileCheck, Layers, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { PDF_TOOLS } from '../config/pdfTools';

export function AllPdfToolsPage() {
  const location = useLocation();
  const path = location.pathname;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (path.includes('convert-pdf')) setSelectedCategory('convert');
    else if (path.includes('organize-pdf-tools') || path.includes('edit-pdf-tools')) setSelectedCategory('organize');
    else if (path.includes('pdf-security') || path.includes('pdf-ai-tools')) setSelectedCategory('security');
    else setSelectedCategory('all');
  }, [path]);

  const categories = [
    { id: 'all', label: 'All Tools', icon: Grid },
    { id: 'organize', label: 'Organize & Edit', icon: Layers },
    { id: 'convert', label: 'Convert PDF', icon: FileCheck },
    { id: 'security', label: 'Security & AI', icon: ShieldCheck },
  ];

  const filteredTools = PDF_TOOLS.filter(tool => {
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch = tool.name.toLowerCase().includes(lowerQuery) ||
                          tool.description.toLowerCase().includes(lowerQuery) ||
                          (tool.keywords && tool.keywords.some(k => k.toLowerCase().includes(lowerQuery)));
    const matchesCategory = selectedCategory === 'all' || 
                            tool.category === selectedCategory ||
                            (selectedCategory === 'organize' && (tool.category === 'organize' || tool.category === 'edit' || tool.category === 'optimize')) ||
                            (selectedCategory === 'security' && (tool.category === 'security' || tool.category === 'ai'));
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEO 
        title="All PDF Tools - 100% Free Online PDF Converter & Editor" 
        description="Explore our complete suite of free online PDF tools. Optimize, convert, secure, and organize your documents instantly from any device."
        canonicalPath="/pdf-tools"
      />

      <main className="min-h-screen bg-[#F8F9FA] pb-20">
        {/* Hero Header */}
        <div className="bg-gradient-to-b from-white to-[#F8F9FA] border-b border-[#E0E2E8] pt-12 pb-10 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-red-50 border border-red-100 rounded-full text-[#E5322D] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Every Tool You Need</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-[#272830] tracking-tight mb-4">
              All PDF Tools
            </h1>

            <p className="text-base md:text-lg text-[#686B74] max-w-2xl mx-auto mb-8 leading-relaxed">
              A complete suite of document processing tools available directly in your browser. Fast, secure, and intuitive.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="w-5 h-5 text-[#686B74] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search PDF tools (e.g. Merge, Compress, Word to PDF)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#E0E2E8] focus:border-[#E5322D] focus:ring-2 focus:ring-red-100 rounded-2xl text-sm font-medium text-[#272830] shadow-sm transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-4 mt-8">
          {/* Category Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    isActive
                      ? 'bg-[#E5322D] text-white border-[#E5322D] shadow-md'
                      : 'bg-white text-[#686B74] border-[#E0E2E8] hover:bg-gray-50 hover:text-[#272830]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTools.map((tool) => {
                // @ts-ignore
                const IconComponent = Icons[tool.iconName] || Icons.FileText;
                return (
                  <Link
                    key={tool.id}
                    to={tool.slug}
                    className="group bg-white border border-[#E0E2E8] hover:border-[#E5322D] hover:shadow-lg rounded-2xl p-5 transition-all flex flex-col justify-between relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 bg-red-50 text-[#E5322D] rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        {tool.isNew && (
                          <span className="px-2 py-0.5 bg-red-100 text-[#E5322D] text-[10px] font-extrabold uppercase rounded-full">
                            NEW
                          </span>
                        )}
                      </div>

                      <h2 className="text-base font-bold text-[#272830] group-hover:text-[#E5322D] transition-colors mb-1.5 flex items-center justify-between">
                        <span>{tool.name}</span>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#E5322D] group-hover:translate-x-1 transition-all" />
                      </h2>

                      <p className="text-xs text-[#686B74] line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-[#E0E2E8] rounded-2xl">
              <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#272830] mb-1">No tools found</h3>
              <p className="text-xs text-[#686B74] mb-4">Try searching for a different keyword or select another category.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="px-4 py-2 bg-[#E5322D] text-white text-xs font-bold rounded-xl hover:bg-[#D02823] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
