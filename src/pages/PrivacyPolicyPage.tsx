import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Trash2, 
  EyeOff, 
  FileText, 
  Database, 
  UserCheck, 
  HelpCircle,
  Clock,
  HardDrive,
  CheckCircle2
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { buildBreadcrumbSchema, buildWebPageSchema } from '../seo/schema';

export function PrivacyPolicyPage() {
  const lastUpdated = "August 11, 2026";

  const breadcrumbSchema = buildBreadcrumbSchema([{ name: 'Privacy Policy', path: '/privacy-policy' }], '/privacy-policy');
  const webpageSchema = buildWebPageSchema({
    name: 'Privacy Policy',
    slug: '/privacy-policy',
    description: 'Read the ilovepdf.in Privacy Policy. Learn how we safeguard your data, enforce 2-hour automatic file deletion, zero human access, and compliance with GDPR and CCPA.'
  });

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-[#272830] font-['Inter',sans-serif]">
      <SEO
        title="Privacy Policy | ilovepdf.in"
        description="Read the ilovepdf.in Privacy Policy. Learn how we safeguard your data, enforce 2-hour automatic file deletion, zero human access, and compliance with GDPR and CCPA."
        canonicalPath="/privacy-policy"
        schema={[breadcrumbSchema, webpageSchema]}
      />

      {/* HERO HEADER */}
      <section className="bg-white border-b border-[#E0E2E8] pt-14 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F4EA] border border-[#A8DADC] text-[#34A853] text-xs sm:text-sm font-semibold mb-6">
            <ShieldCheck size={18} />
            <span>Strict Zero-Knowledge Privacy Standard</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#272830] tracking-tight leading-tight mb-4">
            Privacy Policy
          </h1>

          <p className="text-sm sm:text-base text-[#686B74] max-w-2xl mx-auto mb-6 leading-relaxed">
            Your trust is our foundation. Here is exactly how we handle, process, and protect your information at <strong>ilovepdf.in</strong>.
          </p>

          <p className="text-xs font-semibold text-[#888A92] uppercase tracking-wider">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* QUICK HIGHLIGHTS GRID */}
      <section className="py-10 bg-[#F1F3F7] border-b border-[#E0E2E8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E0E2E8] shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF2F2] text-[#E5322D] flex items-center justify-center shrink-0">
                <Trash2 size={18} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-[#272830] uppercase mb-1">2-Hour Auto Delete</h2>
                <p className="text-xs text-[#686B74] leading-normal">All uploaded & processed files are permanently purged within 2 hours.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E0E2E8] shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E8F0FE] text-[#4285F4] flex items-center justify-center shrink-0">
                <EyeOff size={18} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-[#272830] uppercase mb-1">Zero Human Inspection</h2>
                <p className="text-xs text-[#686B74] leading-normal">100% automated software routines. Nobody ever views your files.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E0E2E8] shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E6F4EA] text-[#34A853] flex items-center justify-center shrink-0">
                <Lock size={18} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-[#272830] uppercase mb-1">256-Bit TLS Encryption</h2>
                <p className="text-xs text-[#686B74] leading-normal">Bank-grade encrypted file transmission and processing pipelines.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E0E2E8] shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-[#272830] uppercase mb-1">No AI Training</h2>
                <p className="text-xs text-[#686B74] leading-normal">Your files are never used to train machine learning or AI models.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED CONTENT BODY */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-[#E0E2E8] shadow-xs space-y-12 leading-relaxed text-[#4A4C54]">
          
          {/* SECTION 1 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#E5322D] text-white font-bold flex items-center justify-center text-sm shrink-0">
                1
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#272830]">
                Information We Collect
              </h2>
            </div>

            <p className="mb-4">
              When you use <strong>ilovepdf.in</strong>, we prioritize minimizing the amount of data we collect to only what is necessary to operate our document service efficiently and securely.
            </p>

            <div className="space-y-4">
              <div className="bg-[#F8F9FA] p-4 sm:p-5 rounded-2xl border border-[#EAECEF]">
                <h3 className="text-sm font-bold text-[#272830] mb-2 flex items-center gap-2">
                  <FileText size={16} className="text-[#E5322D]" />
                  A. Document & File Content
                </h3>
                <p className="text-xs sm:text-sm text-[#686B74]">
                  When you upload files (PDFs, images, Word documents, Excel sheets) to perform operations such as merging, compressing, splitting, or converting, those files are temporarily stored in secure, encrypted storage solely for the purpose of executing your requested action. We do not extract, analyze, or index the contents of your documents for marketing or profiling.
                </p>
              </div>

              <div className="bg-[#F8F9FA] p-4 sm:p-5 rounded-2xl border border-[#EAECEF]">
                <h3 className="text-sm font-bold text-[#272830] mb-2 flex items-center gap-2">
                  <Database size={16} className="text-[#1A73E8]" />
                  B. Account & Profile Information
                </h3>
                <p className="text-xs sm:text-sm text-[#686B74]">
                  If you register for an account, we collect your email address, display name, and password hash (managed securely via Google Firebase Authentication). If you choose to sign in via Google OAuth, we receive basic public profile information permitted by your consent prompt.
                </p>
              </div>

              <div className="bg-[#F8F9FA] p-4 sm:p-5 rounded-2xl border border-[#EAECEF]">
                <h3 className="text-sm font-bold text-[#272830] mb-2 flex items-center gap-2">
                  <HardDrive size={16} className="text-[#34A853]" />
                  C. Technical & Telemetry Data
                </h3>
                <p className="text-xs sm:text-sm text-[#686B74]">
                  Like most modern web services, we automatically collect basic non-identifiable technical logs including IP addresses, browser specifications, operating system type, referring URLs, and timestamps. This data is used strictly for rate limiting, DDoS prevention, and service diagnostics.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-[#E0E2E8]" />

          {/* SECTION 2 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#E5322D] text-white font-bold flex items-center justify-center text-sm shrink-0">
                2
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#272830]">
                How We Use Your Data
              </h2>
            </div>

            <p className="mb-4">
              We process information strictly to fulfill legitimate business and service obligations:
            </p>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#34A853] shrink-0 mt-0.5" />
                <span><strong>File Processing:</strong> Executing user-requested document tasks (combining files, compressing size, converting formats, adding watermarks).</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#34A853] shrink-0 mt-0.5" />
                <span><strong>Security & Fraud Prevention:</strong> Detecting automated abuse, preventing rate-limit violations, and ensuring network stability.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#34A853] shrink-0 mt-0.5" />
                <span><strong>Account Services:</strong> Managing user login sessions, password resets, and premium features.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#34A853] shrink-0 mt-0.5" />
                <span><strong>Legal Compliance:</strong> Responding to lawful requests and complying with regulatory standards.</span>
              </li>
            </ul>
          </div>

          <hr className="border-[#E0E2E8]" />

          {/* SECTION 3 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#E5322D] text-white font-bold flex items-center justify-center text-sm shrink-0">
                3
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#272830]">
                Automated 2-Hour File Retention & Purge Policy
              </h2>
            </div>

            <p className="mb-4">
              We enforce a strict <strong>Automated File Lifetime Policy</strong> across our entire server fleet:
            </p>

            <div className="bg-[#FFF0EE] border border-[#FADBD8] p-5 rounded-2xl mb-4">
              <div className="flex items-center gap-2 text-[#E5322D] font-bold text-sm mb-2">
                <Clock size={18} />
                <span>2-Hour Automatic Permanent Scrub</span>
              </div>
              <p className="text-xs sm:text-sm text-[#272830] leading-relaxed">
                All source files uploaded by users, along with generated output files, are automatically and irrevocably deleted from our temporary server drives exactly <strong>2 hours</strong> after processing. You may also click the manual "Delete File Now" button on the completion screen to trigger immediate deletion instantly.
              </p>
            </div>

            <p className="text-sm">
              We do not maintain secondary backup servers, offline tapes, or shadow copies of your processed documents. Once purged, files cannot be recovered by anyone, including our engineering team.
            </p>
          </div>

          <hr className="border-[#E0E2E8]" />

          {/* SECTION 4 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#E5322D] text-white font-bold flex items-center justify-center text-sm shrink-0">
                4
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#272830]">
                Data Sharing & Third Parties
              </h2>
            </div>

            <p className="mb-4">
              <strong>We NEVER sell, rent, monetize, or trade your personal data or document content.</strong>
            </p>

            <p className="text-sm mb-4">
              Third-party service involvement is strictly limited to infrastructure essential to running the application:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 bg-[#F8F9FA] rounded-xl border border-[#EAECEF]">
                <strong className="block text-[#272830] mb-1">Cloud Infrastructure:</strong>
                Hosted on enterprise Google Cloud Platform (Cloud Run & Firestore) with SOC 2 Type II and ISO 27001 certifications.
              </div>
              <div className="p-4 bg-[#F8F9FA] rounded-xl border border-[#EAECEF]">
                <strong className="block text-[#272830] mb-1">Authentication Providers:</strong>
                Firebase Authentication and Google Identity Services for user authorization.
              </div>
            </div>
          </div>

          <hr className="border-[#E0E2E8]" />

          {/* SECTION 5 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#E5322D] text-white font-bold flex items-center justify-center text-sm shrink-0">
                5
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#272830]">
                Your Rights (GDPR & CCPA)
              </h2>
            </div>

            <p className="mb-4">
              Under applicable privacy laws, including the European Union General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you maintain full control over your personal data:
            </p>

            <ul className="space-y-2 text-sm text-[#272830]">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#34A853]" />
                <span><strong>Right to Access:</strong> You may request copies of personal data associated with your account.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#34A853]" />
                <span><strong>Right to Erasure ("Right to be Forgotten"):</strong> You may request complete deletion of your user account and profile data at any time.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#34A853]" />
                <span><strong>Right to Object & Restrict:</strong> You may opt out of promotional communications at any time.</span>
              </li>
            </ul>
          </div>

          <hr className="border-[#E0E2E8]" />

          {/* SECTION 6 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#E5322D] text-white font-bold flex items-center justify-center text-sm shrink-0">
                6
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#272830]">
                Contact & Support
              </h2>
            </div>

            <p className="text-sm mb-4">
              If you have any questions, concerns, or data privacy requests, please contact our dedicated Data Protection Officer:
            </p>

            <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-[#EAECEF] inline-block text-sm text-[#272830]">
              <p className="font-bold">ilovepdf.in Privacy Team</p>
              <p className="text-[#686B74]">Email: <a href="mailto:privacy@ilovepdf.in" className="text-[#E5322D] font-semibold hover:underline">privacy@ilovepdf.in</a></p>
              <p className="text-[#686B74]">Security Portal: <Link to="/security" className="text-[#1A73E8] font-semibold hover:underline">ilovepdf.in/security</Link></p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
