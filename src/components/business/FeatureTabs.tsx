import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileEdit,
  ArrowRightLeft,
  ScanText,
  ShieldCheck,
  GitCompare,
  Combine,
  Check,
  ArrowRight
} from 'lucide-react';

export function FeatureTabs() {
  const [activeTab, setActiveTab] = useState<'edit' | 'convert' | 'ocr' | 'sign' | 'compare' | 'merge'>('edit');

  const tabs = [
    { id: 'edit', label: 'Edit PDF', icon: FileEdit },
    { id: 'convert', label: 'Convert PDF', icon: ArrowRightLeft },
    { id: 'ocr', label: 'OCR', icon: ScanText },
    { id: 'sign', label: 'Sign & Protect', icon: ShieldCheck },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'merge', label: 'Merge & Split', icon: Combine }
  ];

  return (
    <section className="py-16 md:py-20 bg-white border-b border-[#E0E2E8]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E5322D] bg-[#FFF0EE] px-3.5 py-1 rounded-full">
            Tool Showcase
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#272830] mt-4 mb-4">
            Powerful tools for demanding document workflows
          </h2>
          <p className="text-base text-[#686B74]">
            Select a module below to inspect the dedicated capabilities available for your organization.
          </p>
        </div>

        {/* TABS HEADER */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar border-b border-[#E0E2E8]">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                role="tab"
                aria-selected={isActive}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#E5322D] text-white shadow-sm'
                    : 'bg-[#F7F8FC] text-[#55565B] hover:bg-[#E0E2E8] hover:text-[#272830]'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT PANELS */}
        <div className="bg-[#F7F8FC] rounded-2xl border border-[#E0E2E8] p-8 md:p-12">
          {activeTab === 'edit' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E5322D] bg-[#FFF0EE] px-3 py-1 rounded-full mb-4">
                  Edit PDF Documents
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#272830] mb-4">
                  Full control over PDF text, images & formatting
                </h3>
                <p className="text-base text-[#686B74] leading-relaxed mb-6">
                  Update contract terms, insert new paragraphs, add custom images, or correct typos directly inside your browser without converting back to Word.
                </p>

                <ul className="space-y-3 mb-8 text-sm font-medium text-[#272830]">
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#34A853] text-white flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Add and update document text and headings cleanly</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#34A853] text-white flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Insert text annotations, company logos, and highlights</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#34A853] text-white flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Organize pages, crop margins, and apply security watermarks</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#34A853] text-white flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Prepare finalized PDF packages ready for instant external distribution</span>
                  </li>
                </ul>

                <Link
                  to="/edit-pdf"
                  className="inline-flex items-center gap-2 h-12 px-6 bg-[#E5322D] hover:bg-[#d42d28] text-white font-semibold rounded-xl text-sm transition-all"
                >
                  <span>Launch PDF Editor</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#E0E2E8] shadow-sm flex flex-col gap-3">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-gray-100 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
                <div className="h-24 bg-[#FFF0EE] border border-[#FFD9D9] rounded-lg p-3 flex items-center justify-center text-[#E5322D] text-sm font-semibold">
                  Interactive In-Browser PDF Text & Graphic Editing Engine
                </div>
                <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
              </div>
            </div>
          )}

          {activeTab === 'convert' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7657E8] bg-[#F3E8FF] px-3 py-1 rounded-full mb-4">
                  Convert PDF & Office Documents
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#272830] mb-4">
                  Flawless bidirectional format transformation
                </h3>
                <p className="text-base text-[#686B74] leading-relaxed mb-6">
                  Convert PDF documents back to editable Microsoft Office formats while preserving exact formatting, formulas, vector graphics, and fonts.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="p-3 bg-white rounded-lg border border-[#E0E2E8] text-sm font-semibold text-[#272830]">
                    PDF ↔ Word (.docx)
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E0E2E8] text-sm font-semibold text-[#272830]">
                    PDF ↔ Excel (.xlsx)
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E0E2E8] text-sm font-semibold text-[#272830]">
                    PDF ↔ PowerPoint (.pptx)
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E0E2E8] text-sm font-semibold text-[#272830]">
                    PDF ↔ High-Res JPG/PNG
                  </div>
                </div>

                <Link
                  to="/pdf-tools"
                  className="inline-flex items-center gap-2 h-12 px-6 bg-[#7657E8] hover:bg-[#6344d4] text-white font-semibold rounded-xl text-sm transition-all"
                >
                  <span>Explore Converters</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#E0E2E8] shadow-sm flex flex-col items-center justify-center gap-4 py-12">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 rounded-lg bg-[#E5322D] text-white flex items-center justify-center font-bold text-lg">
                    PDF
                  </div>
                  <ArrowRightLeft size={28} className="text-[#7657E8]" />
                  <div className="w-16 h-20 rounded-lg bg-[#2B579A] text-white flex items-center justify-center font-bold text-lg">
                    DOCX
                  </div>
                </div>
                <p className="text-xs text-[#737680] font-medium text-center max-w-xs mt-2">
                  High-fidelity conversion preserves layout, margin sizes, and table alignments.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ocr' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4BA56A] bg-[#E6F4EA] px-3 py-1 rounded-full mb-4">
                  Optical Character Recognition (OCR)
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#272830] mb-4">
                  Turn scanned paper into searchable PDFs
                </h3>
                <p className="text-base text-[#686B74] leading-relaxed mb-6">
                  Extract readable text from scanned receipts, invoices, legal filings, and legacy physical archives with advanced multi-language OCR recognition.
                </p>

                <ul className="space-y-3 mb-8 text-sm font-medium text-[#272830]">
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#34A853] text-white flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Multi-language OCR engine support</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#34A853] text-white flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Converts flat image PDFs into fully selectable text</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#34A853] text-white flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Enables instant CTR+F text search across digitized paper documents</span>
                  </li>
                </ul>

                <Link
                  to="/ocr-pdf"
                  className="inline-flex items-center gap-2 h-12 px-6 bg-[#4BA56A] hover:bg-[#3d8c58] text-white font-semibold rounded-xl text-sm transition-all"
                >
                  <span>Run OCR on Scanned File</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#E0E2E8] shadow-sm flex flex-col justify-center gap-3">
                <div className="p-3 bg-gray-100 rounded text-xs font-mono text-gray-500">
                  [SCAN_INPUT_IMAGE.PNG] → OCR Processing...
                </div>
                <div className="p-4 bg-[#E6F4EA] rounded border border-[#A8DADC] text-xs font-mono text-[#1B5E20]">
                  "INVOICE #98214 - Total Amount: $4,250.00 - Date: August 11, 2026..."
                </div>
                <span className="text-xs text-[#34A853] font-semibold text-right">✓ Text layer successfully generated</span>
              </div>
            </div>
          )}

          {activeTab === 'sign' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E5322D] bg-[#FFF0EE] px-3 py-1 rounded-full mb-4">
                  Sign & Protect Documents
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#272830] mb-4">
                  Enterprise security & electronic signoff
                </h3>
                <p className="text-base text-[#686B74] leading-relaxed mb-6">
                  Sign vendor agreements, encrypt proprietary business reports with 256-bit AES passwords, and redact confidential PII or financial figures.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  <Link to="/sign-pdf" className="p-3 bg-white hover:border-[#E5322D] rounded-lg border border-[#E0E2E8] text-sm font-semibold text-[#272830]">
                    Sign PDF Contracts
                  </Link>
                  <Link to="/protect-pdf" className="p-3 bg-white hover:border-[#E5322D] rounded-lg border border-[#E0E2E8] text-sm font-semibold text-[#272830]">
                    Protect & Encrypt
                  </Link>
                  <Link to="/unlock-pdf" className="p-3 bg-white hover:border-[#E5322D] rounded-lg border border-[#E0E2E8] text-sm font-semibold text-[#272830]">
                    Unlock PDF Passwords
                  </Link>
                  <Link to="/redact-pdf" className="p-3 bg-white hover:border-[#E5322D] rounded-lg border border-[#E0E2E8] text-sm font-semibold text-[#272830]">
                    Permanent Redaction
                  </Link>
                </div>

                <Link
                  to="/sign-pdf"
                  className="inline-flex items-center gap-2 h-12 px-6 bg-[#E5322D] hover:bg-[#d42d28] text-white font-semibold rounded-xl text-sm transition-all"
                >
                  <span>Sign or Protect PDF</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#E0E2E8] shadow-sm flex flex-col items-center justify-center p-8">
                <ShieldCheck size={56} className="text-[#4BA56A] mb-3" />
                <span className="font-bold text-[#272830] text-base mb-1">AES-256 Bit Encryption</span>
                <p className="text-xs text-[#737680] text-center max-w-xs">
                  Your team controls access passwords and client document permissions.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'compare' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7657E8] bg-[#F3E8FF] px-3 py-1 rounded-full mb-4">
                  Compare PDF Versions
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#272830] mb-4">
                  Side-by-side contract revision review
                </h3>
                <p className="text-base text-[#686B74] leading-relaxed mb-6">
                  Instantly spot modified clauses, added sentences, or deleted terms between two contract drafts or legal revisions.
                </p>

                <ul className="space-y-3 mb-8 text-sm font-medium text-[#272830]">
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#34A853] text-white flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Visual split-screen diff comparison</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#34A853] text-white flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Highlights additions, removals, and formatting changes</span>
                  </li>
                </ul>

                <Link
                  to="/compare-pdf"
                  className="inline-flex items-center gap-2 h-12 px-6 bg-[#7657E8] hover:bg-[#6344d4] text-white font-semibold rounded-xl text-sm transition-all"
                >
                  <span>Compare Documents</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#E0E2E8] shadow-sm grid grid-cols-2 gap-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  <span className="font-bold block mb-1">Draft v1.0</span>
                  "The client agrees to pay within 30 business days..."
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                  <span className="font-bold block mb-1">Revision v1.1</span>
                  "The client agrees to pay within <strong>14 business days</strong>..."
                </div>
              </div>
            </div>
          )}

          {activeTab === 'merge' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4BA56A] bg-[#E6F4EA] px-3 py-1 rounded-full mb-4">
                  Merge & Split Documents
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#272830] mb-4">
                  Reorganize pages & combine multi-source files
                </h3>
                <p className="text-base text-[#686B74] leading-relaxed mb-6">
                  Combine distinct reports, presentation slides, and spreadsheet exports into a unified document pack or extract exact page ranges for sharing.
                </p>

                <div className="flex items-center gap-4 mb-8">
                  <Link
                    to="/merge-pdf"
                    className="inline-flex items-center justify-center h-12 px-6 bg-[#4BA56A] hover:bg-[#3d8c58] text-white font-semibold rounded-xl text-sm transition-all"
                  >
                    Merge PDFs
                  </Link>
                  <Link
                    to="/split-pdf"
                    className="inline-flex items-center justify-center h-12 px-6 bg-white border border-[#D4D6DE] text-[#272830] hover:bg-[#F0F2F7] font-semibold rounded-xl text-sm transition-all"
                  >
                    Split PDF
                  </Link>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#E0E2E8] shadow-sm flex items-center justify-center gap-3">
                <div className="w-16 h-20 bg-gray-100 border border-gray-300 rounded flex items-center justify-center font-bold text-xs">Doc A</div>
                <span className="text-lg font-bold text-[#4BA56A]">+</span>
                <div className="w-16 h-20 bg-gray-100 border border-gray-300 rounded flex items-center justify-center font-bold text-xs">Doc B</div>
                <span className="text-lg font-bold text-[#4BA56A]">=</span>
                <div className="w-20 h-24 bg-[#E6F4EA] border border-[#34A853] rounded flex items-center justify-center font-bold text-xs text-[#1B5E20]">Unified PDF</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
