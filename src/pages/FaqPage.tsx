import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { allFaqs } from '../content/faqs';
import { ToolFAQ } from '../components/seo/ToolFAQ';
import { SEO } from '../components/SEO';
import { buildBreadcrumbSchema, buildFaqSchema } from '../seo/schema';

const CATEGORIES = [
  'General', 'Merge', 'Split', 'Compress', 'Convert', 'Edit', 
  'Security', 'OCR', 'AI', 'Privacy', 'Troubleshooting'
];

export function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Group FAQs by category
  const faqsByCategory = useMemo(() => {
    const grouped = CATEGORIES.reduce((acc, cat) => {
      acc[cat] = allFaqs.filter(faq => faq.category === cat);
      return acc;
    }, {} as Record<string, typeof allFaqs>);
    return grouped;
  }, []);

  // Filter if search is active
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const lowerQuery = searchQuery.toLowerCase();
    return allFaqs.filter(faq => 
      faq.question.toLowerCase().includes(lowerQuery) || 
      faq.answer.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  // Generate structured data schema
  const activeSchemas = useMemo(() => {
    const breadcrumb = buildBreadcrumbSchema([{ name: 'FAQ', path: '/faq' }], '/faq');
    const faqSchema = buildFaqSchema(allFaqs, '/faq');
    return [breadcrumb, faqSchema].filter(Boolean) as Record<string, any>[];
  }, []);

  return (
    <>
      <SEO
        title="PDF Tools FAQ – Answers About Converting, Editing & Managing PDFs | ilovepdf.in"
        description="Find answers about merging, splitting, compressing, converting, editing, signing, protecting and managing PDF files with ilovepdf.in."
        canonicalPath="/faq"
        schema={activeSchemas}
      />

      <div className="min-h-screen bg-[#F7F7FA] pb-[100px]">
        {/* Header & Breadcrumb */}
        <div className="bg-white border-b border-[#E1E3E8] pt-[40px] pb-[60px]">
          <div className="max-w-[1050px] mx-auto px-4 md:px-6">
            <nav className="flex items-center text-[13px] text-[#737680] mb-[30px] font-[500]">
              <Link to="/" className="hover:text-[#E5322D]">Home</Link>
              <ChevronRight size={14} className="mx-2" />
              <span className="text-[#30313A]">FAQ</span>
            </nav>

            <h1 className="text-[32px] md:text-[42px] font-[700] text-[#33333B] mb-[16px] leading-[1.2]">
              Frequently Asked Questions About PDF Tools
            </h1>
            
            <p className="text-[16px] md:text-[18px] text-[#55565B] leading-[1.6] max-w-[800px] font-[400]">
              Welcome to our knowledge base. This page provides comprehensive answers to common questions regarding our online PDF utilities, document conversion processes, platform security, and technical troubleshooting. Whether you need help compressing a large file or understanding our strict auto-deletion privacy policies, you will find the required information below.
            </p>

            {/* Search Box */}
            <div className="mt-[40px] relative max-w-[600px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-[#999BA3]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PDF questions..."
                className="w-full pl-11 pr-4 py-4 bg-white border border-[#E0E2E8] rounded-[10px] text-[16px] text-[#33333B] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E5322D] focus:border-transparent transition-shadow"
              />
            </div>
          </div>
        </div>

        {/* Categories & Content */}
        <div className="max-w-[1050px] mx-auto px-4 md:px-6 mt-[40px]">
          {!searchQuery.trim() ? (
            <>
              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 md:gap-3 mb-[50px]">
                {CATEGORIES.map(category => (
                  <a 
                    key={category}
                    href={`#cat-${category.toLowerCase()}`}
                    className="px-5 py-2.5 bg-white border border-[#E0E2E8] rounded-full text-[14px] font-[600] text-[#55565B] hover:border-[#E5322D] hover:text-[#E5322D] transition-colors shadow-sm"
                  >
                    {category}
                  </a>
                ))}
              </div>

              {/* FAQ Sections */}
              <div className="flex flex-col gap-[60px]">
                {CATEGORIES.map(category => {
                  const faqs = faqsByCategory[category];
                  if (!faqs || faqs.length === 0) return null;

                  return (
                    <div key={category} id={`cat-${category.toLowerCase()}`} className="scroll-mt-[100px]">
                      <h2 className="text-[24px] font-[700] text-[#33333B] mb-[20px] pb-3 border-b border-[#E0E2E8]">
                        {category} Questions
                      </h2>
                      {/* Reuse the accordion logic, but we can't directly use ToolFAQ if we want to skip the gray background wrapper. Let's just render the questions directly here for perfect styling integration, or adapt ToolFAQ. Adapting is better. */}
                      <div className="mt-6">
                        <ToolFAQ faqs={faqs} title="" standalone={false} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Search Results */
            <div className="mt-[20px]">
              <h2 className="text-[20px] font-[600] text-[#33333B] mb-[20px]">
                {filteredFaqs && filteredFaqs.length > 0 
                  ? `Found ${filteredFaqs.length} result${filteredFaqs.length === 1 ? '' : 's'} for "${searchQuery}"`
                  : `No results found for "${searchQuery}"`}
              </h2>
              {filteredFaqs && filteredFaqs.length > 0 && (
                <div className="mt-4">
                  <ToolFAQ faqs={filteredFaqs} title="" standalone={false} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
