import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  ShieldCheck, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Clock,
  HelpCircle
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { buildBreadcrumbSchema, buildWebPageSchema } from '../seo/schema';

export function TermsPage() {
  const effectiveDate = "August 11, 2026";

  const breadcrumbSchema = buildBreadcrumbSchema([{ name: 'Terms of Service', path: '/terms' }], '/terms');
  const webpageSchema = buildWebPageSchema({
    name: 'Terms & Conditions',
    slug: '/terms',
    description: 'Review the Terms and Conditions of service for ilovepdf.in. Understand document rights, acceptable use, user obligations, and intellectual property terms.'
  });

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-[#272830] font-['Inter',sans-serif]">
      <SEO
        title="Terms & Conditions | ilovepdf.in"
        description="Review the Terms and Conditions of service for ilovepdf.in. Understand document rights, acceptable use, user obligations, and intellectual property terms."
        canonicalPath="/terms"
        schema={[breadcrumbSchema, webpageSchema]}
      />

      {/* HERO HEADER */}
      <section className="bg-white border-b border-[#E0E2E8] pt-14 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F0FE] border border-[#B3D1FF] text-[#1A73E8] text-xs sm:text-sm font-semibold mb-6">
            <Scale size={18} />
            <span>Terms of Service Agreement</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#272830] tracking-tight leading-tight mb-4">
            Terms & Conditions
          </h1>

          <p className="text-sm sm:text-base text-[#686B74] max-w-2xl mx-auto mb-6 leading-relaxed">
            Welcome to <strong>ilovepdf.in</strong>. By accessing or using our website and services, you agree to be bound by the terms outlined below.
          </p>

          <p className="text-xs font-semibold text-[#888A92] uppercase tracking-wider">
            Effective Date: {effectiveDate}
          </p>
        </div>
      </section>

      {/* QUICK RULES GRID */}
      <section className="py-10 bg-[#F1F3F7] border-b border-[#E0E2E8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-[#E0E2E8] shadow-xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6F4EA] text-[#34A853] flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-[#272830] uppercase mb-1">100% File Ownership</h2>
                <p className="text-xs text-[#686B74] leading-normal">You retain complete ownership and intellectual property rights over all your files.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E0E2E8] shadow-xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF2F2] text-[#E5322D] flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-[#272830] uppercase mb-1">Acceptable Use Only</h2>
                <p className="text-xs text-[#686B74] leading-normal">No uploading illegal content, malware, copyrighted material without rights, or spam.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E0E2E8] shadow-xs flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-[#272830] uppercase mb-1">Privacy Guarantee</h2>
                <p className="text-xs text-[#686B74] leading-normal">Files are handled automatically and permanently deleted 2 hours after processing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED TERMS BODY */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-[#E0E2E8] shadow-xs space-y-12 leading-relaxed text-[#4A4C54]">

          {/* SECTION 1 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#272830] text-white font-bold flex items-center justify-center text-sm shrink-0">
                1
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#272830]">
                Acceptance of Terms
              </h2>
            </div>
            <p className="text-sm sm:text-base">
              By visiting, browsing, or utilizing any online software tools on <strong>ilovepdf.in</strong> (including Merge PDF, Split PDF, Compress PDF, Convert PDF, Protect PDF, Unlock PDF, and related document tools), you confirm that you have read, understood, and agree to be bound by these Terms and Conditions and our <Link to="/privacy-policy" className="text-[#E5322D] font-semibold hover:underline">Privacy Policy</Link>. If you do not agree with any part of these terms, you must discontinue using our platform immediately.
            </p>
          </div>

          <hr className="border-[#E0E2E8]" />

          {/* SECTION 2 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#272830] text-white font-bold flex items-center justify-center text-sm shrink-0">
                2
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#272830]">
                Description of Service
              </h2>
            </div>
            <p className="text-sm sm:text-base mb-4">
              <strong>ilovepdf.in</strong> provides web-based software utilities that allow users to upload, edit, merge, compress, split, convert, sign, protect, and process PDF files and digital documents directly through their web browsers.
            </p>
            <p className="text-sm text-[#686B74]">
              We continuously improve our platform. We reserve the right to modify, update, enhance, or discontinue tools or features at any time without prior notice.
            </p>
          </div>

          <hr className="border-[#E0E2E8]" />

          {/* SECTION 3 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#272830] text-white font-bold flex items-center justify-center text-sm shrink-0">
                3
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#272830]">
                User Content & Intellectual Property Ownership
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-[#E6F4EA] border border-[#A8DADC] p-5 rounded-2xl">
                <h3 className="text-sm font-bold text-[#2E7D32] mb-1 flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  Your Files Belong Entirely To You
                </h3>
                <p className="text-xs sm:text-sm text-[#272830] leading-relaxed">
                  You retain 100% of all rights, titles, ownership, and copyright in any file uploaded to or created on ilovepdf.in. We claim <strong>zero ownership, copyright, or licensing rights</strong> over your uploaded documents or converted outputs.
                </p>
              </div>

              <p className="text-sm">
                By uploading a file, you grant ilovepdf.in a temporary, non-exclusive, world-wide technical permission strictly limited to processing, converting, and temporarily hosting the file as requested by you during your session.
              </p>
            </div>
          </div>

          <hr className="border-[#E0E2E8]" />

          {/* SECTION 4 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#272830] text-white font-bold flex items-center justify-center text-sm shrink-0">
                4
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#272830]">
                Acceptable Use & User Responsibilities
              </h2>
            </div>

            <p className="text-sm mb-4">
              You agree to use ilovepdf.in responsibly and in full compliance with local, national, and international laws. You explicitly agree <strong>NOT</strong> to:
            </p>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-start gap-2 text-[#C92A26] bg-[#FFF0EE] p-3 rounded-xl border border-[#FADBD8]">
                <XCircle size={16} className="shrink-0 mt-0.5" />
                <span>Upload files containing viruses, malware, trojans, ransomware, or malicious code.</span>
              </div>
              <div className="flex items-start gap-2 text-[#C92A26] bg-[#FFF0EE] p-3 rounded-xl border border-[#FADBD8]">
                <XCircle size={16} className="shrink-0 mt-0.5" />
                <span>Upload copyrighted documents, confidential data, or personal information without explicit legal authority or permission.</span>
              </div>
              <div className="flex items-start gap-2 text-[#C92A26] bg-[#FFF0EE] p-3 rounded-xl border border-[#FADBD8]">
                <XCircle size={16} className="shrink-0 mt-0.5" />
                <span>Attempt to bypass platform rate-limits, scrape the site automatically, or reverse-engineer API interfaces.</span>
              </div>
              <div className="flex items-start gap-2 text-[#C92A26] bg-[#FFF0EE] p-3 rounded-xl border border-[#FADBD8]">
                <XCircle size={16} className="shrink-0 mt-0.5" />
                <span>Use the platform to distribute spam, fraudulent documents, or illegal materials.</span>
              </div>
            </div>
          </div>

          <hr className="border-[#E0E2E8]" />

          {/* SECTION 5 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#272830] text-white font-bold flex items-center justify-center text-sm shrink-0">
                5
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#272830]">
                Disclaimer of Warranties
              </h2>
            </div>

            <p className="text-sm leading-relaxed text-[#686B74]">
              The services provided by <strong>ilovepdf.in</strong> are delivered on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis without warranties of any kind, whether express or implied. While we employ rigorous quality assurance and modern PDF libraries, we do not warrant that file conversion, OCR output, compression ratios, or document formatting will be 100% error-free in every edge-case document scenario. Users are encouraged to verify important documents after conversion.
            </p>
          </div>

          <hr className="border-[#E0E2E8]" />

          {/* SECTION 6 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#272830] text-white font-bold flex items-center justify-center text-sm shrink-0">
                6
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#272830]">
                Limitation of Liability
              </h2>
            </div>

            <p className="text-sm leading-relaxed text-[#686B74]">
              To the maximum extent permitted by applicable law, ilovepdf.in, its operators, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, goodwill, or business opportunity arising out of your access to or inability to use the service.
            </p>
          </div>

          <hr className="border-[#E0E2E8]" />

          {/* SECTION 7 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#272830] text-white font-bold flex items-center justify-center text-sm shrink-0">
                7
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#272830]">
                Governing Law & Contact Information
              </h2>
            </div>

            <p className="text-sm mb-4">
              These Terms and Conditions shall be governed by and construed in accordance with applicable governing laws.
            </p>

            <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-[#EAECEF] inline-block text-sm text-[#272830]">
              <p className="font-bold">ilovepdf.in Legal & Compliance</p>
              <p className="text-[#686B74]">Legal Inquiries: <a href="mailto:legal@ilovepdf.in" className="text-[#1A73E8] font-semibold hover:underline">legal@ilovepdf.in</a></p>
              <p className="text-[#686B74]">Privacy Standards: <Link to="/privacy-policy" className="text-[#E5322D] font-semibold hover:underline">ilovepdf.in/privacy-policy</Link></p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
