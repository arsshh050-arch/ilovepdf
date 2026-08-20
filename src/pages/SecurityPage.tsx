import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Trash2, 
  EyeOff, 
  Key, 
  Server, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  FileText,
  Clock,
  Shield,
  Cpu,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { buildBreadcrumbSchema, buildWebPageSchema } from '../seo/schema';

export function SecurityPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([{ name: 'Security & Privacy', path: '/security' }], '/security');
  const webpageSchema = buildWebPageSchema({
    name: 'Security & Data Protection',
    slug: '/security',
    description: 'Learn how ilovepdf.in protects your files with 256-bit TLS encryption, automatic 2-hour file deletion, zero human access, and strict privacy standards.'
  });

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-[#272830] font-['Inter',sans-serif]">
      <SEO
        title="Security & Data Protection | ilovepdf.in"
        description="Learn how ilovepdf.in protects your files with 256-bit TLS encryption, automatic 2-hour file deletion, zero human access, and strict privacy standards."
        canonicalPath="/security"
        schema={[breadcrumbSchema, webpageSchema]}
      />

      {/* HERO SECTION */}
      <section className="bg-white border-b border-[#E0E2E8] pt-16 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F4EA] border border-[#A8DADC] text-[#34A853] text-sm font-semibold mb-6">
            <ShieldCheck size={18} />
            <span>Bank-Grade Security Guarantee</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#272830] tracking-tight leading-tight mb-6">
            Your document security & privacy is our highest priority.
          </h1>

          <p className="text-base sm:text-lg text-[#686B74] max-w-2xl mx-auto leading-relaxed mb-10">
            Millions of documents are processed on <strong>ilovepdf.in</strong>. Every file is protected by state-of-the-art encryption, processed in isolated execution environments, and automatically deleted.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/protect-pdf"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#E5322D] text-white font-semibold rounded-lg hover:bg-[#d42d28] transition-colors shadow-sm text-base"
            >
              <Lock size={18} />
              <span>Protect a PDF with Password</span>
            </Link>
            <Link
              to="/pdf-tools"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-[#D4D6DE] text-[#272830] font-semibold rounded-lg hover:bg-[#F5F6FA] transition-colors text-base"
            >
              Explore Security Tools
            </Link>
          </div>
        </div>
      </section>

      {/* KEY SECURITY METRICS */}
      <section className="py-12 bg-[#F5F6FA] border-b border-[#E0E2E8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-xl border border-[#E0E2E8] shadow-xs">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#34A853] mb-1">256-Bit</p>
              <p className="text-sm font-medium text-[#686B74]">TLS Encryption in Transit</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E0E2E8] shadow-xs">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#272830] mb-1">2 Hours</p>
              <p className="text-sm font-medium text-[#686B74]">Automated Permanent Purge</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E0E2E8] shadow-xs">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#E5322D] mb-1">Zero</p>
              <p className="text-sm font-medium text-[#686B74]">Human File Inspection</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E0E2E8] shadow-xs">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#4285F4] mb-1">100%</p>
              <p className="text-sm font-medium text-[#686B74]">Sandboxed Execution</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE SECURITY PILLARS */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#272830] mb-4">
              How We Protect Your Files at Every Stage
            </h2>
            <p className="text-[#686B74] max-w-2xl mx-auto">
              From the moment you upload a file to the second it is permanently removed, our system enforces strict cryptographic and operational boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-[#F8F9FA] p-8 rounded-2xl border border-[#E0E2E8] hover:border-[#34A853] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#E6F4EA] text-[#34A853] flex items-center justify-center mb-6">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#272830] mb-3">1. Encryption in Transit & Rest</h3>
              <p className="text-sm text-[#686B74] leading-relaxed mb-4">
                All communications between your web browser and our servers use 256-bit SSL/TLS protocol. Files are stored with AES-256 encryption during processing.
              </p>
              <ul className="space-y-2 text-xs text-[#272830] font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#34A853]" />
                  <span>Enforced HTTPS everywhere</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#34A853]" />
                  <span>TLS 1.3 cryptographic cipher suites</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#F8F9FA] p-8 rounded-2xl border border-[#E0E2E8] hover:border-[#E5322D] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#FFF2F2] text-[#E5322D] flex items-center justify-center mb-6">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#272830] mb-3">2. Automatic 2-Hour Purge</h3>
              <p className="text-sm text-[#686B74] leading-relaxed mb-4">
                Your processed files are kept strictly for you to download. After 2 hours, background purge routines permanently scrub all source and output files.
              </p>
              <ul className="space-y-2 text-xs text-[#272830] font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#E5322D]" />
                  <span>No lingering backup copies</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#E5322D]" />
                  <span>Instant manual deletion available</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#F8F9FA] p-8 rounded-2xl border border-[#E0E2E8] hover:border-[#4285F4] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#E8F0FE] text-[#4285F4] flex items-center justify-center mb-6">
                <EyeOff size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#272830] mb-3">3. Zero Human Access</h3>
              <p className="text-sm text-[#686B74] leading-relaxed mb-4">
                Processing is 100% automated by computer software. Neither our engineers nor third parties ever inspect, read, copy, or mine content from your files.
              </p>
              <ul className="space-y-2 text-xs text-[#272830] font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#4285F4]" />
                  <span>No AI model training on user files</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#4285F4]" />
                  <span>Strict access control logs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED SECURITY ARCHITECTURE */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#F8F9FA] border-t border-[#E0E2E8]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#272830] mb-3">
              Technical Security Standards
            </h2>
            <p className="text-[#686B74] max-w-2xl mx-auto">
              Our infrastructure is engineered in compliance with modern privacy and security regulations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-[#E0E2E8] shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <Server className="text-[#2563EB]" size={24} />
                <h3 className="text-lg font-bold text-[#272830]">Isolated Execution Environment</h3>
              </div>
              <p className="text-sm text-[#686B74] leading-relaxed mb-4">
                Every PDF operation (Merge, Compress, Split, Convert) runs in an isolated ephemeral micro-container. Memory is wiped immediately after processing completes, preventing cross-tenant data contamination.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#E0E2E8] shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <Key className="text-[#D97706]" size={24} />
                <h3 className="text-lg font-bold text-[#272830]">Password & Permission Encryption</h3>
              </div>
              <p className="text-sm text-[#686B74] leading-relaxed mb-4">
                When you password-protect or unlock a PDF, credentials are handled in memory using secure crypto routines. Passwords are never logged or stored in database tables.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#E0E2E8] shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-[#059669]" size={24} />
                <h3 className="text-lg font-bold text-[#272830]">GDPR & Privacy Compliance</h3>
              </div>
              <p className="text-sm text-[#686B74] leading-relaxed mb-4">
                We respect European Union GDPR directives and global data subject rights. You hold complete ownership and copyright of all documents uploaded to our platform.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#E0E2E8] shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="text-[#9333EA]" size={24} />
                <h3 className="text-lg font-bold text-[#272830]">Client-Side First Processing</h3>
              </div>
              <p className="text-sm text-[#686B74] leading-relaxed mb-4">
                Where possible, tasks like basic page rotation and PDF preview rendering happen directly inside your web browser via WebAssembly, minimizing unnecessary network transfers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY TOOLS BANNER */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white border-t border-[#E0E2E8]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#272830] mb-3">
              Dedicated PDF Security & Privacy Tools
            </h2>
            <p className="text-[#686B74] max-w-2xl mx-auto">
              Take direct control over your document rights and sensitive information.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/protect-pdf"
              className="bg-[#F8F9FA] p-6 rounded-xl border border-[#E0E2E8] hover:border-[#E5322D] hover:shadow-xs transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#FFF2F2] text-[#E5322D] flex items-center justify-center mb-4">
                <Lock size={20} />
              </div>
              <h3 className="font-bold text-[#272830] group-hover:text-[#E5322D] mb-1">Protect PDF</h3>
              <p className="text-xs text-[#686B74] mb-3">Encrypt PDFs with 256-bit AES passwords.</p>
              <span className="text-xs font-semibold text-[#E5322D] flex items-center gap-1">
                Protect now <ArrowRight size={12} />
              </span>
            </Link>

            <Link
              to="/unlock-pdf"
              className="bg-[#F8F9FA] p-6 rounded-xl border border-[#E0E2E8] hover:border-[#34A853] hover:shadow-xs transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#E6F4EA] text-[#34A853] flex items-center justify-center mb-4">
                <Key size={20} />
              </div>
              <h3 className="font-bold text-[#272830] group-hover:text-[#34A853] mb-1">Unlock PDF</h3>
              <p className="text-xs text-[#686B74] mb-3">Remove password security from files you own.</p>
              <span className="text-xs font-semibold text-[#34A853] flex items-center gap-1">
                Unlock now <ArrowRight size={12} />
              </span>
            </Link>

            <Link
              to="/sign-pdf"
              className="bg-[#F8F9FA] p-6 rounded-xl border border-[#E0E2E8] hover:border-[#4285F4] hover:shadow-xs transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#E8F0FE] text-[#4285F4] flex items-center justify-center mb-4">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-[#272830] group-hover:text-[#4285F4] mb-1">Sign PDF</h3>
              <p className="text-xs text-[#686B74] mb-3">Add secure electronic signatures to contracts.</p>
              <span className="text-xs font-semibold text-[#4285F4] flex items-center gap-1">
                Sign now <ArrowRight size={12} />
              </span>
            </Link>

            <Link
              to="/redact-pdf"
              className="bg-[#F8F9FA] p-6 rounded-xl border border-[#E0E2E8] hover:border-[#9333EA] hover:shadow-xs transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center mb-4">
                <EyeOff size={20} />
              </div>
              <h3 className="font-bold text-[#272830] group-hover:text-[#9333EA] mb-1">Redact PDF</h3>
              <p className="text-xs text-[#686B74] mb-3">Permanently blackout confidential text.</p>
              <span className="text-xs font-semibold text-[#9333EA] flex items-center gap-1">
                Redact now <ArrowRight size={12} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 px-4 sm:px-6 text-center bg-[#24252A] text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Have questions about document security?
          </h2>
          <p className="text-gray-300 mb-8 text-base">
            Check our FAQs or learn more about how ilovepdf.in maintains zero-knowledge privacy standards.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/faq"
              className="px-6 py-3 bg-[#E5322D] text-white font-semibold rounded-lg hover:bg-[#d42d28] transition-colors"
            >
              Read Security FAQs
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 bg-white/10 text-white border border-white/20 font-semibold rounded-lg hover:bg-white/20 transition-colors"
            >
              About ilovepdf.in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
