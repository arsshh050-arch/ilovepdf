import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft, Wrench, BookOpen } from 'lucide-react';
import { SEO } from '../components/SEO';

export function NotFoundPage() {
  return (
    <>
      <SEO 
        title="404 Page Not Found - iLovePDF.in" 
        description="The requested page could not be found. Explore our free PDF conversion, compression, and editing tools."
        canonicalPath="/404"
        noIndex={true}
      />
      <main className="min-h-[75vh] flex items-center justify-center bg-[#F8F9FA] px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 text-[#E5322D] rounded-3xl mb-6 shadow-sm border border-red-100">
            <FileQuestion className="w-10 h-10" />
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-[#272830] tracking-tight mb-4">
            404 - Page Not Found
          </h1>

          <p className="text-base md:text-lg text-[#686B74] mb-8 max-w-lg mx-auto leading-relaxed">
            The page you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#E5322D] hover:bg-[#D02823] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Quick Tool Links */}
          <div className="bg-white border border-[#E0E2E8] rounded-2xl p-6 shadow-sm text-left">
            <h2 className="text-sm font-bold text-[#272830] uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-[#E5322D]" />
              <span>Popular PDF Tools</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <Link to="/merge-pdf" className="p-2.5 rounded-lg hover:bg-gray-50 text-[#272830] font-medium transition-colors border border-gray-100 block">
                Merge PDF
              </Link>
              <Link to="/split-pdf" className="p-2.5 rounded-lg hover:bg-gray-50 text-[#272830] font-medium transition-colors border border-gray-100 block">
                Split PDF
              </Link>
              <Link to="/compress-pdf" className="p-2.5 rounded-lg hover:bg-gray-50 text-[#272830] font-medium transition-colors border border-gray-100 block">
                Compress PDF
              </Link>
              <Link to="/pdf-to-word" className="p-2.5 rounded-lg hover:bg-gray-50 text-[#272830] font-medium transition-colors border border-gray-100 block">
                PDF to Word
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
