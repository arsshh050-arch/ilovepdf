import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Layers, ShieldCheck, ArrowRight } from 'lucide-react';

export function BusinessBenefits() {
  return (
    <section className="py-16 md:py-20 bg-white border-b border-[#E0E2E8]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E5322D] bg-[#FFF0EE] px-3.5 py-1 rounded-full">
            Complete Capability
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#272830] mt-4 mb-4">
            One workspace for everyday document tasks
          </h2>
          <p className="text-base sm:text-lg text-[#686B74]">
            Consolidate your business document software. Convert, organize, edit, and secure PDFs without juggling multiple subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* BLOCK 1 */}
          <div className="bg-[#F7F8FC] p-8 rounded-2xl border border-[#E0E2E8] flex flex-col justify-between hover:border-[#E5322D] transition-colors group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FFF0EE] text-[#E5322D] flex items-center justify-center mb-6">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#272830] mb-3">
                Convert & Optimize Documents
              </h3>
              <p className="text-sm text-[#686B74] leading-relaxed mb-6">
                Seamlessly transform Office files to PDF and vice versa while preserving original fonts, tables, and graphic layouts. Reduce file sizes for fast email attachments.
              </p>

              <div className="space-y-2.5 text-sm font-medium mb-8">
                <Link to="/pdf-to-word" className="flex items-center justify-between text-[#272830] hover:text-[#E5322D] p-2 rounded-lg hover:bg-white transition-colors">
                  <span>PDF to Word & Word to PDF</span>
                  <ArrowRight size={14} className="text-[#999BA3]" />
                </Link>
                <Link to="/pdf-to-excel" className="flex items-center justify-between text-[#272830] hover:text-[#E5322D] p-2 rounded-lg hover:bg-white transition-colors">
                  <span>PDF to Excel & Excel to PDF</span>
                  <ArrowRight size={14} className="text-[#999BA3]" />
                </Link>
                <Link to="/pdf-to-powerpoint" className="flex items-center justify-between text-[#272830] hover:text-[#E5322D] p-2 rounded-lg hover:bg-white transition-colors">
                  <span>PDF to PowerPoint & PPT to PDF</span>
                  <ArrowRight size={14} className="text-[#999BA3]" />
                </Link>
                <Link to="/compress-pdf" className="flex items-center justify-between text-[#272830] hover:text-[#E5322D] p-2 rounded-lg hover:bg-white transition-colors">
                  <span>Smart Compress PDF (up to 90%)</span>
                  <ArrowRight size={14} className="text-[#999BA3]" />
                </Link>
              </div>
            </div>

            <Link
              to="/pdf-tools"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#E5322D] hover:underline"
            >
              <span>Explore Converter Tools</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* BLOCK 2 */}
          <div className="bg-[#F7F8FC] p-8 rounded-2xl border border-[#E0E2E8] flex flex-col justify-between hover:border-[#7657E8] transition-colors group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] text-[#7657E8] flex items-center justify-center mb-6">
                <Layers size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#272830] mb-3">
                Edit & Organize PDFs
              </h3>
              <p className="text-sm text-[#686B74] leading-relaxed mb-6">
                Modify text, insert images, add company watermarks, page numbers, and reorganize pages effortlessly. Combine multiple files or split large reports into sections.
              </p>

              <div className="space-y-2.5 text-sm font-medium mb-8">
                <Link to="/edit-pdf" className="flex items-center justify-between text-[#272830] hover:text-[#7657E8] p-2 rounded-lg hover:bg-white transition-colors">
                  <span>Edit PDF Text & Add Annotations</span>
                  <ArrowRight size={14} className="text-[#999BA3]" />
                </Link>
                <Link to="/merge-pdf" className="flex items-center justify-between text-[#272830] hover:text-[#7657E8] p-2 rounded-lg hover:bg-white transition-colors">
                  <span>Merge Multiple PDFs into One</span>
                  <ArrowRight size={14} className="text-[#999BA3]" />
                </Link>
                <Link to="/split-pdf" className="flex items-center justify-between text-[#272830] hover:text-[#7657E8] p-2 rounded-lg hover:bg-white transition-colors">
                  <span>Split & Extract Specific Pages</span>
                  <ArrowRight size={14} className="text-[#999BA3]" />
                </Link>
                <Link to="/watermark-pdf" className="flex items-center justify-between text-[#272830] hover:text-[#7657E8] p-2 rounded-lg hover:bg-white transition-colors">
                  <span>Rotate, Crop, & Stamp Watermarks</span>
                  <ArrowRight size={14} className="text-[#999BA3]" />
                </Link>
              </div>
            </div>

            <Link
              to="/edit-pdf"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#7657E8] hover:underline"
            >
              <span>Explore Editor Tools</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* BLOCK 3 */}
          <div className="bg-[#F7F8FC] p-8 rounded-2xl border border-[#E0E2E8] flex flex-col justify-between hover:border-[#4BA56A] transition-colors group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#E6F4EA] text-[#4BA56A] flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#272830] mb-3">
                Protect & Review Documents
              </h3>
              <p className="text-sm text-[#686B74] leading-relaxed mb-6">
                Secure confidential financial and contract data with AES passwords, digital signatures, and permanent redaction. Use OCR to turn scanned papers into searchable PDFs.
              </p>

              <div className="space-y-2.5 text-sm font-medium mb-8">
                <Link to="/protect-pdf" className="flex items-center justify-between text-[#272830] hover:text-[#4BA56A] p-2 rounded-lg hover:bg-white transition-colors">
                  <span>Protect & Password Encrypt PDF</span>
                  <ArrowRight size={14} className="text-[#999BA3]" />
                </Link>
                <Link to="/sign-pdf" className="flex items-center justify-between text-[#272830] hover:text-[#4BA56A] p-2 rounded-lg hover:bg-white transition-colors">
                  <span>Sign Contracts & E-Signatures</span>
                  <ArrowRight size={14} className="text-[#999BA3]" />
                </Link>
                <Link to="/ocr-pdf" className="flex items-center justify-between text-[#272830] hover:text-[#4BA56A] p-2 rounded-lg hover:bg-white transition-colors">
                  <span>OCR Scanned Text Extraction</span>
                  <ArrowRight size={14} className="text-[#999BA3]" />
                </Link>
                <Link to="/redact-pdf" className="flex items-center justify-between text-[#272830] hover:text-[#4BA56A] p-2 rounded-lg hover:bg-white transition-colors">
                  <span>Redact & Blackout Sensitive Text</span>
                  <ArrowRight size={14} className="text-[#999BA3]" />
                </Link>
              </div>
            </div>

            <Link
              to="/security"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#4BA56A] hover:underline"
            >
              <span>Explore Security Suite</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
