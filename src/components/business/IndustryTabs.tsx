import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Scale,
  DollarSign,
  Building,
  TrendingUp,
  GraduationCap,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export function IndustryTabs() {
  const [activeTab, setActiveTab] = useState<'hr' | 'legal' | 'finance' | 'realestate' | 'sales' | 'education'>('hr');

  const industries = [
    { id: 'hr', label: 'Human Resources', icon: Users },
    { id: 'legal', label: 'Legal', icon: Scale },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'realestate', label: 'Real Estate', icon: Building },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'education', label: 'Education', icon: GraduationCap }
  ];

  return (
    <section className="py-16 md:py-20 bg-[#F7F8FC] border-b border-[#E0E2E8]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E5322D] bg-[#FFF0EE] px-3.5 py-1 rounded-full">
            Tailored Industry Solutions
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#272830] mt-4 mb-4">
            PDF workflows for different teams
          </h2>
          <p className="text-base text-[#686B74]">
            Discover how departments across various industries optimize daily operations using ilovepdf.in.
          </p>
        </div>

        {/* TABS */}
        <div
          role="tablist"
          aria-label="Industry Solutions"
          className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar border-b border-[#E0E2E8]"
        >
          {industries.map(ind => {
            const Icon = ind.icon;
            const isActive = activeTab === ind.id;
            return (
              <button
                key={ind.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(ind.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#272830] text-white shadow-sm'
                    : 'bg-white text-[#55565B] border border-[#E0E2E8] hover:bg-[#E0E2E8] hover:text-[#272830]'
                }`}
              >
                <Icon size={18} />
                <span>{ind.label}</span>
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className="bg-white rounded-2xl border border-[#E0E2E8] p-8 md:p-12 shadow-sm">
          {activeTab === 'hr' && (
            <div>
              <h3 className="text-2xl font-bold text-[#272830] mb-3">
                Streamline HR Onboarding & Resume Review
              </h3>
              <p className="text-base text-[#686B74] leading-relaxed mb-6 max-w-3xl">
                Human resource teams manage massive batches of candidate resumes, offer letters, NDA agreements, and benefit packets daily. Merge scattered files into single onboarding handbooks, run OCR on scanned IDs, and sign offer letters digitally.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">Resume Merging</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">E-Sign Offer Letters</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">OCR Employee IDs</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">Compress Onboarding Packets</span>
              </div>
              <Link to="/merge-pdf" className="inline-flex items-center gap-2 text-sm font-bold text-[#E5322D] hover:underline">
                <span>Start Merging HR Bundles</span> <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {activeTab === 'legal' && (
            <div>
              <h3 className="text-2xl font-bold text-[#272830] mb-3">
                Precision Legal Filings, Redaction & Contract Comparison
              </h3>
              <p className="text-base text-[#686B74] leading-relaxed mb-6 max-w-3xl">
                Compare contract drafts side-by-side to highlight clause edits, redact sensitive client information permanently, and organize page indexes for court submissions.
              </p>

              <div className="p-4 rounded-xl bg-[#FFF8E1] border border-[#FFE082] text-xs text-[#8D6E63] flex items-start gap-3 mb-6">
                <AlertCircle size={18} className="shrink-0 text-[#F57F17] mt-0.5" />
                <p>
                  <strong>Disclaimer:</strong> Users are responsible for meeting any legal, confidentiality or records-management requirements applicable to their organization.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">Document Diff Comparison</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">Permanent Redaction</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">PDF/A Archival Conversion</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">Page Indexing</span>
              </div>
              <Link to="/redact-pdf" className="inline-flex items-center gap-2 text-sm font-bold text-[#7657E8] hover:underline">
                <span>Redact Confidential Legal Text</span> <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {activeTab === 'finance' && (
            <div>
              <h3 className="text-2xl font-bold text-[#272830] mb-3">
                Automate Audit Exports & PDF to Excel Conversion
              </h3>
              <p className="text-base text-[#686B74] leading-relaxed mb-6 max-w-3xl">
                Convert bank statements and audit PDFs directly into editable Excel spreadsheets. Encrypt quarterly financial reports with 256-bit AES protection before emailing board members.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">PDF to Excel Spreadsheet</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">AES Password Encryption</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">Financial Redaction</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">Audit Archiving</span>
              </div>
              <Link to="/pdf-to-excel" className="inline-flex items-center gap-2 text-sm font-bold text-[#4BA56A] hover:underline">
                <span>Convert PDF Statements to Excel</span> <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {activeTab === 'realestate' && (
            <div>
              <h3 className="text-2xl font-bold text-[#272830] mb-3">
                Accelerate Closing Packets & Inspection Reports
              </h3>
              <p className="text-base text-[#686B74] leading-relaxed mb-6 max-w-3xl">
                Combine property deeds, appraisal sheets, and inspection photos into neat client closing packages. Annotate floor plans and collect buyer signatures instantly.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">Property Pack Merging</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">Floor Plan Annotations</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">E-Sign Purchase Agreements</span>
              </div>
              <Link to="/sign-pdf" className="inline-flex items-center gap-2 text-sm font-bold text-[#E5322D] hover:underline">
                <span>Prepare Closing Packets</span> <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {activeTab === 'sales' && (
            <div>
              <h3 className="text-2xl font-bold text-[#272830] mb-3">
                Close Deals Faster with Custom Proposal Packs
              </h3>
              <p className="text-base text-[#686B74] leading-relaxed mb-6 max-w-3xl">
                Convert pitch slides to PDF, attach case studies, compress heavy file sizes for email delivery, and get buyer contracts signed promptly.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">PowerPoint to PDF</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">Compress Pitch Decks</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">Sign Sales Contracts</span>
              </div>
              <Link to="/compress-pdf" className="inline-flex items-center gap-2 text-sm font-bold text-[#7657E8] hover:underline">
                <span>Compress Proposal Decks</span> <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {activeTab === 'education' && (
            <div>
              <h3 className="text-2xl font-bold text-[#272830] mb-3">
                Organize Courseware & Student Assignment Submissions
              </h3>
              <p className="text-base text-[#686B74] leading-relaxed mb-6 max-w-3xl">
                Teachers and administrative staff compress large textbook chapters, run OCR on scanned library research papers, and organize study guides for online portals.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">OCR Research Scan</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">Compress Coursework</span>
                <span className="px-3 py-1.5 rounded-lg bg-[#F7F8FC] border border-[#E0E2E8] text-xs font-semibold text-[#272830]">Split Assignment Modules</span>
              </div>
              <Link to="/ocr-pdf" className="inline-flex items-center gap-2 text-sm font-bold text-[#4BA56A] hover:underline">
                <span>OCR Academic Scans</span> <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
