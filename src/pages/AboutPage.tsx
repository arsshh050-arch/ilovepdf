import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Zap, 
  Smile, 
  Lock, 
  FileText, 
  Users, 
  Globe2, 
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Cpu
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { buildBreadcrumbSchema, buildWebPageSchema, buildOrganizationSchema } from '../seo/schema';

export function AboutPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([{ name: 'About Us', path: '/about' }], '/about');
  const webpageSchema = buildWebPageSchema({
    name: 'About Us',
    slug: '/about',
    description: 'Discover the mission and vision behind ilovepdf.in. Explore our commitment to delivering fast, accessible, and secure document processing tools directly from your browser.'
  });
  const orgSchema = buildOrganizationSchema();

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-[#272830] font-['Inter',sans-serif]">
      <SEO
        title="About Us | ilovepdf.in"
        description="Discover the mission and vision behind ilovepdf.in. Explore our commitment to delivering fast, accessible, and secure document processing tools directly from your browser."
        canonicalPath="/about"
        schema={[breadcrumbSchema, webpageSchema, orgSchema]}
      />

      {/* HERO SECTION */}
      <section className="bg-white border-b border-[#E0E2E8] pt-16 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF2F2] border border-[#FFD9D9] text-[#E5322D] text-sm font-semibold mb-6">
            <Sparkles size={16} />
            <span>Empowering Your Document Workflow</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#272830] tracking-tight leading-tight mb-6">
            Making PDF management simple, fast, and secure for everyone.
          </h1>

          <p className="text-base sm:text-lg text-[#686B74] max-w-3xl mx-auto leading-relaxed mb-10">
            <strong>ilovepdf.in</strong> is dedicated to simplifying everyday document workflows. Our platform provides a lightweight, highly responsive suite of tools designed to handle common PDF tasks—from merging to compressing—without relying on heavy desktop software.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/pdf-tools"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#E5322D] text-white font-semibold rounded-lg hover:bg-[#d42d28] transition-colors shadow-sm text-base"
            >
              <span>Explore All PDF Tools</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-[#D4D6DE] text-[#272830] font-semibold rounded-lg hover:bg-[#F5F6FA] transition-colors text-base"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 bg-[#F5F6FA] border-b border-[#E0E2E8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-xl border border-[#E0E2E8] shadow-xs">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#E5322D] mb-1">25+</p>
              <p className="text-sm font-medium text-[#686B74]">Online PDF Tools</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E0E2E8] shadow-xs">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#272830] mb-1">100%</p>
              <p className="text-sm font-medium text-[#686B74]">Free & Accessible</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E0E2E8] shadow-xs">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#34A853] mb-1">256-Bit</p>
              <p className="text-sm font-medium text-[#686B74]">TLS Encryption</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E0E2E8] shadow-xs">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#4285F4] mb-1">2 Hours</p>
              <p className="text-sm font-medium text-[#686B74]">Auto File Cleanup</p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR MISSION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#272830] mb-4">
                Our Mission & Vision
              </h2>
              <p className="text-[#686B74] leading-relaxed mb-4">
                Document friction shouldn't hold you back. Students applying for exams, professionals submitting contracts, and small business owners sending invoices all deserve quick, reliable tools that work smoothly on any device.
              </p>
              <p className="text-[#686B74] leading-relaxed mb-6">
                By focusing entirely on performance, user privacy, and an uncluttered interface, <strong>ilovepdf.in</strong> empowers you to accomplish document tasks instantly. We remove unnecessary barriers and software installations to prioritize your productivity.
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#34A853] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#272830] font-medium">No installation or software configuration required</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#34A853] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#272830] font-medium">Optimized for low-bandwidth environments</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#34A853] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#272830] font-medium">Cross-platform capability across Chrome, Safari, Edge, & Firefox</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#F5F6FA] p-8 rounded-2xl border border-[#E0E2E8]">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#E5322D] p-2.5 rounded-lg text-white">
                  <Layers size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#272830]">Built for Precision</h3>
                  <p className="text-xs text-[#686B74]">Engineered for high accuracy output</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-[#686B74]">
                <div className="bg-white p-4 rounded-lg border border-[#E0E2E8]">
                  <p className="font-semibold text-[#272830] mb-1">High-Quality Rendering</p>
                  <p>Preserves exact fonts, formatting, and layout integrity across document conversions.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#E0E2E8]">
                  <p className="font-semibold text-[#272830] mb-1">Smart File Compression</p>
                  <p>Reduces file sizes dramatically while maintaining optimal visual clarity.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#E0E2E8]">
                  <p className="font-semibold text-[#272830] mb-1">OCR & Text Recognition</p>
                  <p>Extracts editable text from scanned documents with advanced character recognition.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PILLARS */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#F8F9FA] border-t border-[#E0E2E8]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#272830] mb-3">
              Our Core Platform Values
            </h2>
            <p className="text-[#686B74] max-w-2xl mx-auto">
              Our core principles guide every tool we engineer and every feature we deploy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-[#E0E2E8] shadow-xs">
              <div className="w-12 h-12 rounded-lg bg-[#E6F4EA] flex items-center justify-center text-[#34A853] mb-6">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#272830] mb-3">Privacy & Security</h3>
              <p className="text-sm text-[#686B74] leading-relaxed">
                Your data security is paramount. All document transfers are encrypted using 256-bit TLS protocol. Files are processed automatically and permanently deleted from our servers after 2 hours.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-[#E0E2E8] shadow-xs">
              <div className="w-12 h-12 rounded-lg bg-[#FFF2F2] flex items-center justify-center text-[#E5322D] mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#272830] mb-3">Lightning Fast</h3>
              <p className="text-sm text-[#686B74] leading-relaxed">
                We leverage optimized server architecture and client-side processing to deliver blazing fast processing times, even for large PDF documents.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-[#E0E2E8] shadow-xs">
              <div className="w-12 h-12 rounded-lg bg-[#E8F0FE] flex items-center justify-center text-[#4285F4] mb-6">
                <Smile size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#272830] mb-3">User-Friendly Design</h3>
              <p className="text-sm text-[#686B74] leading-relaxed">
                No steep learning curves or complicated menus. Drag and drop your files, select your desired options, and download your processed result in two clicks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY COMMITMENT */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white border-t border-[#E0E2E8]">
        <div className="max-w-4xl mx-auto bg-[#24252A] text-white p-8 sm:p-12 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#E5322D] mb-6">
              <ShieldCheck size={16} />
              <span>Security Guarantee</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Your files are 100% safe with us.
            </h2>
            
            <p className="text-gray-300 leading-relaxed mb-6 text-sm sm:text-base max-w-2xl">
              We do not inspect, copy, or analyze your files. Our automated processing environment handles millions of files securely every day with zero human access.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-700 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#34A853]" />
                <span>Encrypted HTTPS File Uploads</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#34A853]" />
                <span>Automatic 2-Hour File Deletion</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#34A853]" />
                <span>No Third-Party File Sharing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#34A853]" />
                <span>Strict Privacy Policy Adherence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 px-4 sm:px-6 text-center bg-[#F5F6FA] border-t border-[#E0E2E8]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#272830] mb-4">
            Ready to streamline your documents?
          </h2>
          <p className="text-[#686B74] mb-8 text-base">
            Experience the difference of a streamlined, browser-first document toolkit.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/pdf-tools"
              className="px-6 py-3 bg-[#E5322D] text-white font-semibold rounded-lg hover:bg-[#d42d28] transition-colors"
            >
              Start Processing PDFs
            </Link>
            <Link
              to="/faq"
              className="px-6 py-3 bg-white border border-[#D4D6DE] text-[#272830] font-semibold rounded-lg hover:bg-[#F5F6FA] transition-colors"
            >
              Read FAQs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
