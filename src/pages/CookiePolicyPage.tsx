import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Cookie, 
  ShieldCheck, 
  CheckCircle2, 
  Settings, 
  Lock, 
  BarChart2, 
  HelpCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { buildBreadcrumbSchema, buildWebPageSchema } from '../seo/schema';

export function CookiePolicyPage() {
  const lastUpdated = "August 11, 2026";
  const [functionalCookies, setFunctionalCookies] = useState(true);
  const [analyticsCookies, setAnalyticsCookies] = useState(false);

  const breadcrumbSchema = buildBreadcrumbSchema([{ name: 'Cookie Policy', path: '/cookie-policy' }], '/cookie-policy');
  const webpageSchema = buildWebPageSchema({
    name: 'Cookie Policy',
    slug: '/cookie-policy',
    description: 'Read the Cookie Policy for ilovepdf.in. Learn how we use essential cookies to power our web tools, manage sessions, and protect user security.'
  });

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-[#272830] font-['Inter',sans-serif]">
      <SEO
        title="Cookie Policy | ilovepdf.in"
        description="Read the Cookie Policy for ilovepdf.in. Learn how we use essential cookies to power our web tools, manage sessions, and protect user security."
        canonicalPath="/cookie-policy"
        schema={[breadcrumbSchema, webpageSchema]}
      />

      {/* HERO HEADER */}
      <section className="bg-white border-b border-[#E0E2E8] pt-14 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF2F2] border border-[#FADBD8] text-[#E5322D] text-xs sm:text-sm font-semibold mb-6">
            <Cookie size={18} />
            <span>Transparent Cookie Standards</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#272830] tracking-tight leading-tight mb-4">
            Cookie Policy
          </h1>

          <p className="text-sm sm:text-base text-[#686B74] max-w-2xl mx-auto mb-6 leading-relaxed">
            This policy explains how <strong>ilovepdf.in</strong> uses cookies and similar storage technologies to provide a smooth, secure, and seamless online document processing experience.
          </p>

          <p className="text-xs font-semibold text-[#888A92] uppercase tracking-wider">
            Last Updated: {lastUpdated}
          </p>
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
                What Are Cookies?
              </h2>
            </div>

            <p className="text-sm sm:text-base leading-relaxed mb-4">
              Cookies are small text files that websites store on your computer or mobile device when you visit them. They allow web applications to remember your preferences, keep you securely signed in, and remember active workspace tasks as you interact with the site.
            </p>
            <p className="text-sm text-[#686B74]">
              We also use modern browser storage technologies such as <code>localStorage</code> and <code>sessionStorage</code> for client-side state management (such as storing temporary PDF page order previews during active workspace sessions).
            </p>
          </div>

          <hr className="border-[#E0E2E8]" />

          {/* SECTION 2 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#E5322D] text-white font-bold flex items-center justify-center text-sm shrink-0">
                2
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#272830]">
                Types of Cookies We Use
              </h2>
            </div>

            <p className="text-sm mb-6">
              We group cookies and browser storage into three straightforward categories:
            </p>

            <div className="space-y-4">
              {/* Essential Cookies */}
              <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-[#EAECEF]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Lock size={18} className="text-[#E5322D]" />
                    <h3 className="text-base font-bold text-[#272830]">1. Strictly Necessary / Essential Cookies</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E5322D] text-white text-[10px] font-bold uppercase">Always Active</span>
                </div>
                <p className="text-xs sm:text-sm text-[#686B74] leading-relaxed">
                  These cookies are mandatory for the website to function correctly. They enable core security protections, prevent cross-site request forgery (CSRF), and power session authentication via Firebase Auth / Google OAuth.
                </p>
              </div>

              {/* Functional Cookies */}
              <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-[#EAECEF]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Settings size={18} className="text-[#34A853]" />
                    <h3 className="text-base font-bold text-[#272830]">2. Preferences & Functional Cookies</h3>
                  </div>
                  <button 
                    onClick={() => setFunctionalCookies(!functionalCookies)}
                    className="text-[#34A853] hover:opacity-80 transition-opacity"
                  >
                    {functionalCookies ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-[#A0A4B0]" />}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-[#686B74] leading-relaxed">
                  These allow the platform to remember your active settings (such as selected PDF compression preset, page orientation, or UI language preference) across sessions.
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-[#EAECEF]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart2 size={18} className="text-[#1A73E8]" />
                    <h3 className="text-base font-bold text-[#272830]">3. Performance & Analytics Cookies</h3>
                  </div>
                  <button 
                    onClick={() => setAnalyticsCookies(!analyticsCookies)}
                    className="text-[#1A73E8] hover:opacity-80 transition-opacity"
                  >
                    {analyticsCookies ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-[#A0A4B0]" />}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-[#686B74] leading-relaxed">
                  These help us collect anonymized aggregate statistics on website visits, performance speed, and tool usage popularity to continuously optimize our processing pipelines. No document content is ever tracked.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-[#E0E2E8]" />

          {/* SECTION 3 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#E5322D] text-white font-bold flex items-center justify-center text-sm shrink-0">
                3
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#272830]">
                How to Manage Cookies in Your Browser
              </h2>
            </div>

            <p className="text-sm mb-4">
              You can control and disable cookies directly through your web browser settings. Please note that disabling essential cookies may prevent workspace tools and user login features from functioning properly.
            </p>

            <ul className="space-y-2 text-xs sm:text-sm text-[#272830] font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#34A853]" />
                <span><strong>Google Chrome:</strong> Settings &gt; Privacy and Security &gt; Third-party cookies</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#34A853]" />
                <span><strong>Mozilla Firefox:</strong> Options &gt; Privacy &amp; Security &gt; Cookies and Site Data</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#34A853]" />
                <span><strong>Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#34A853]" />
                <span><strong>Microsoft Edge:</strong> Settings &gt; Cookies and Site Permissions</span>
              </li>
            </ul>
          </div>

          <hr className="border-[#E0E2E8]" />

          {/* SECTION 4 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#E5322D] text-white font-bold flex items-center justify-center text-sm shrink-0">
                4
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#272830]">
                Questions & Contact
              </h2>
            </div>

            <p className="text-sm mb-4">
              If you have any questions regarding our cookie practices, feel free to contact us:
            </p>

            <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-[#EAECEF] inline-block text-sm text-[#272830]">
              <p className="font-bold">ilovepdf.in Support Team</p>
              <p className="text-[#686B74]">Email: <a href="mailto:privacy@ilovepdf.in" className="text-[#E5322D] font-semibold hover:underline">privacy@ilovepdf.in</a></p>
              <p className="text-[#686B74]">Privacy Policy: <Link to="/privacy-policy" className="text-[#1A73E8] font-semibold hover:underline">ilovepdf.in/privacy-policy</Link></p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
