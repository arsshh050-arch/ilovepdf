import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Gift, 
  HelpCircle, 
  ArrowRight,
  Clock,
  Layers,
  Star
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { buildBreadcrumbSchema, buildWebPageSchema } from '../seo/schema';

export function PricingPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([{ name: 'Pricing', path: '/pricing' }], '/pricing');
  const webpageSchema = buildWebPageSchema({
    name: 'Pricing & Plans',
    slug: '/pricing',
    description: 'All core utilities on ilovepdf.in are currently 100% free! Optimize, convert, and secure your documents without subscription fees or credit cards.'
  });

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-[#272830] font-['Inter',sans-serif]">
      <SEO
        title="Pricing & Plans | ilovepdf.in - 100% Free Access"
        description="All core utilities on ilovepdf.in are currently 100% free! Optimize, convert, and secure your documents without subscription fees or credit cards."
        canonicalPath="/pricing"
        schema={[breadcrumbSchema, webpageSchema]}
      />

      {/* HERO SECTION */}
      <section className="bg-white border-b border-[#E0E2E8] pt-16 pb-20 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF2F2] border border-[#FFD9D9] text-[#E5322D] text-sm font-semibold mb-6 animate-pulse">
            <Gift size={18} />
            <span>Limited Time Special Offer • 100% Free Access</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#272830] tracking-tight mb-6">
            Simple, transparent plans for all your PDF needs.
          </h1>

          <p className="text-base sm:text-lg text-[#686B74] max-w-2xl mx-auto leading-relaxed mb-8">
            During our launch period, all premium features, high-speed batch conversions, and advanced PDF security tools are <strong>100% free for everyone</strong>. No credit card required.
          </p>

          <div className="inline-flex items-center gap-2 bg-[#F5F6FA] border border-[#E0E2E8] px-4 py-2 rounded-lg text-sm text-[#686B74]">
            <Clock size={16} className="text-[#E5322D]" />
            <span>No ads, no hidden fees, no subscription traps.</span>
          </div>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* PLAN 1: BASIC FREE */}
          <div className="bg-white p-8 rounded-2xl border border-[#E0E2E8] shadow-xs flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#686B74] bg-[#F5F6FA] px-3 py-1 rounded-full">
                  Free Forever
                </span>
                <h2 className="text-2xl font-bold text-[#272830] mt-4 mb-2">Web Standard</h2>
                <p className="text-sm text-[#686B74]">For individuals handling basic PDF tasks quickly.</p>
              </div>

              <div className="mb-6 pb-6 border-b border-[#E0E2E8]">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#272830]">$0</span>
                  <span className="text-sm font-medium text-[#686B74]">/ month</span>
                </div>
                <p className="text-xs text-[#34A853] font-semibold mt-1">Free for life</p>
              </div>

              <ul className="space-y-3.5 text-sm text-[#272830] mb-8">
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-[#34A853] shrink-0" />
                  <span>Access to 25+ essential PDF tools</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-[#34A853] shrink-0" />
                  <span>Single-file conversions & edits</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-[#34A853] shrink-0" />
                  <span>Up to 100MB per file</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-[#34A853] shrink-0" />
                  <span>256-bit TLS secure file encryption</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-[#34A853] shrink-0" />
                  <span>2-hour automated file deletion</span>
                </li>
              </ul>
            </div>

            <Link
              to="/pdf-tools"
              className="w-full py-3.5 bg-[#F5F6FA] hover:bg-[#EAEBFF] text-[#272830] font-semibold rounded-xl text-center border border-[#D4D6DE] transition-colors"
            >
              Start Free
            </Link>
          </div>

          {/* PLAN 2: PREMIUM PRO (PROMO) */}
          <div className="bg-white p-8 rounded-2xl border-2 border-[#E5322D] shadow-lg flex flex-col justify-between relative transform md:-translate-y-4">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#E5322D] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Star size={12} className="fill-white" />
              <span>Most Popular • 100% Free Promo</span>
            </div>

            <div>
              <div className="mb-6 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E5322D] bg-[#FFF2F2] px-3 py-1 rounded-full">
                  Full Premium Suite
                </span>
                <h2 className="text-2xl font-bold text-[#272830] mt-4 mb-2">Premium Pro</h2>
                <p className="text-sm text-[#686B74]">For power users requiring unlimited speed & OCR.</p>
              </div>

              <div className="mb-6 pb-6 border-b border-[#E0E2E8]">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-[#AEB2BC] line-through">$12</span>
                  <span className="text-5xl font-extrabold text-[#E5322D]">$0</span>
                  <span className="text-sm font-medium text-[#686B74]">/ month</span>
                </div>
                <p className="text-xs text-[#E5322D] font-bold mt-1">100% Free Limited-Time Promotion!</p>
              </div>

              <ul className="space-y-3.5 text-sm text-[#272830] mb-8">
                <li className="flex items-center gap-3 font-semibold">
                  <Check size={18} className="text-[#E5322D] shrink-0" />
                  <span>Unlimited batch processing</span>
                </li>
                <li className="flex items-center gap-3 font-semibold">
                  <Check size={18} className="text-[#E5322D] shrink-0" />
                  <span>OCR Scanned Text Recognition</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-[#E5322D] shrink-0" />
                  <span>Maximum compression ratio</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-[#E5322D] shrink-0" />
                  <span>Up to 1GB file size limit</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-[#E5322D] shrink-0" />
                  <span>Zero advertisements or watermarks</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-[#E5322D] shrink-0" />
                  <span>Priority processing server queue</span>
                </li>
              </ul>
            </div>

            <Link
              to="/signup"
              className="w-full py-3.5 bg-[#E5322D] hover:bg-[#d42d28] text-white font-semibold rounded-xl text-center transition-colors shadow-sm"
            >
              Get Free Pro Access Now
            </Link>
          </div>

          {/* PLAN 3: BUSINESS & TEAMS */}
          <div className="bg-white p-8 rounded-2xl border border-[#E0E2E8] shadow-xs flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4285F4] bg-[#E8F0FE] px-3 py-1 rounded-full">
                  Team Workflows
                </span>
                <h2 className="text-2xl font-bold text-[#272830] mt-4 mb-2">Team & Business</h2>
                <p className="text-sm text-[#686B74]">For teams and companies sharing PDF operations.</p>
              </div>

              <div className="mb-6 pb-6 border-b border-[#E0E2E8]">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-[#AEB2BC] line-through">$29</span>
                  <span className="text-4xl font-extrabold text-[#272830]">$0</span>
                  <span className="text-sm font-medium text-[#686B74]">/ month</span>
                </div>
                <p className="text-xs text-[#34A853] font-semibold mt-1">Included in promo</p>
              </div>

              <ul className="space-y-3.5 text-sm text-[#272830] mb-8">
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-[#34A853] shrink-0" />
                  <span>All Premium Pro features included</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-[#34A853] shrink-0" />
                  <span>Shared workspace & saved preferences</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-[#34A853] shrink-0" />
                  <span>Custom company watermark templates</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-[#34A853] shrink-0" />
                  <span>Dedicated customer support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className="text-[#34A853] shrink-0" />
                  <span>Bank-grade 256-bit AES encryption</span>
                </li>
              </ul>
            </div>

            <Link
              to="/pdf-tools"
              className="w-full py-3.5 bg-[#F5F6FA] hover:bg-[#EAEBFF] text-[#272830] font-semibold rounded-xl text-center border border-[#D4D6DE] transition-colors"
            >
              Use Team Features
            </Link>
          </div>

        </div>
      </section>

      {/* WHY IS IT FREE BANNER */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white border-t border-[#E0E2E8]">
        <div className="max-w-4xl mx-auto bg-[#F5F6FA] p-8 sm:p-12 rounded-2xl border border-[#E0E2E8]">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#E5322D] p-2.5 rounded-xl text-white">
              <Sparkles size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[#272830]">Why is ilovepdf.in free right now?</h2>
          </div>
          <p className="text-[#686B74] leading-relaxed mb-6">
            We believe that basic document utilities should be universally accessible without paywalls, sign-up locks, or trial limits. As we expand our infrastructure and launch new features, we want everyone to experience the full power of our high-speed PDF engine at zero cost.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-semibold text-[#272830]">
            <div className="flex items-center gap-2 bg-white p-3.5 rounded-lg border border-[#E0E2E8]">
              <Check size={18} className="text-[#34A853]" />
              <span>No Credit Card Needed</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-3.5 rounded-lg border border-[#E0E2E8]">
              <Check size={18} className="text-[#34A853]" />
              <span>No Automatic Billing</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-3.5 rounded-lg border border-[#E0E2E8]">
              <Check size={18} className="text-[#34A853]" />
              <span>Full High-Speed Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING FAQ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#F8F9FA] border-t border-[#E0E2E8]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#272830] mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-[#686B74]">Everything you need to know about our free pricing model.</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-[#E0E2E8]">
              <h3 className="font-bold text-lg text-[#272830] mb-2">Is ilovepdf.in really 100% free?</h3>
              <p className="text-sm text-[#686B74] leading-relaxed">
                Yes! All features—including PDF Merging, Splitting, Compression, PDF to Word conversion, OCR, and Password Security—are completely free to use without any hidden fees.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E0E2E8]">
              <h3 className="font-bold text-lg text-[#272830] mb-2">Do I need to enter credit card information?</h3>
              <p className="text-sm text-[#686B74] leading-relaxed">
                No credit card, debit card, or payment details are required. You can start converting and editing files immediately.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E0E2E8]">
              <h3 className="font-bold text-lg text-[#272830] mb-2">Are there limits on how many files I can process?</h3>
              <p className="text-sm text-[#686B74] leading-relaxed">
                No strict limits! You can merge, split, and convert as many documents as you need for personal, educational, or professional work.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E0E2E8]">
              <h3 className="font-bold text-lg text-[#272830] mb-2">Will my documents remain private?</h3>
              <p className="text-sm text-[#686B74] leading-relaxed">
                Absolutely. All uploads are encrypted with 256-bit TLS protocol and are automatically permanently deleted from our servers after 2 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 px-4 sm:px-6 text-center bg-[#24252A] text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Start using ilovepdf.in for free today
          </h2>
          <p className="text-gray-300 mb-8 text-base">
            No registration or credit card required. Experience fast, simple PDF management now.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/pdf-tools"
              className="px-6 py-3 bg-[#E5322D] text-white font-semibold rounded-lg hover:bg-[#d42d28] transition-colors"
            >
              Explore All PDF Tools
            </Link>
            <Link
              to="/signup"
              className="px-6 py-3 bg-white/10 text-white border border-white/20 font-semibold rounded-lg hover:bg-white/20 transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
