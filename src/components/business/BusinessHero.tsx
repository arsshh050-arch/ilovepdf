import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export function BusinessHero() {
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.getElementById('contact-sales');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-[#F7F8FC] border-b border-[#E0E2E8] py-12 md:py-20 px-6 md:px-10">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT COLUMN */}
        <div className="max-w-[650px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0EE] border border-[#FFD9D9] text-[#E5322D] text-sm font-semibold mb-6">
            <Sparkles size={16} />
            <span>Document Solutions for Modern Teams</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-bold text-[#272830] tracking-tight leading-[1.15] mb-6">
            Simplify document workflows for your business
          </h1>

          <p className="text-lg sm:text-[20px] text-[#55565B] leading-relaxed mb-8">
            Give your team a faster way to convert, organize, edit and manage PDF documents from one simple workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center h-13 px-8 bg-[#E5322D] hover:bg-[#d42d28] text-white font-semibold rounded-xl transition-all shadow-sm text-base text-center"
            >
              Get started
            </Link>

            <a
              href="#contact-sales"
              onClick={scrollToContact}
              className="inline-flex items-center justify-center h-13 px-8 bg-white border border-[#D4D6DE] text-[#272830] hover:bg-[#F0F2F7] font-semibold rounded-xl transition-all text-base text-center"
            >
              Contact sales
            </a>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-[#55565B]">
            <Link
              to="/pdf-tools"
              className="inline-flex items-center gap-1.5 text-[#E5322D] hover:underline font-semibold"
            >
              Explore business tools <ArrowRight size={16} />
            </Link>
            <div className="flex items-center gap-1.5 text-[#34A853]">
              <CheckCircle2 size={16} />
              <span>No software setup needed</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - ORIGINAL SVG ILLUSTRATION */}
        <div className="flex justify-center items-center">
          <div className="relative w-full max-w-[540px] aspect-[4/3] bg-white rounded-2xl p-6 border border-[#E0E2E8] shadow-sm flex items-center justify-center overflow-hidden">
            <svg
              viewBox="0 0 500 380"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full object-contain"
            >
              {/* Background Glow Elements */}
              <circle cx="250" cy="190" r="160" fill="#FFF0EE" opacity="0.6" />
              <circle cx="380" cy="90" r="60" fill="#EAE8FA" opacity="0.5" />
              <circle cx="100" cy="300" r="80" fill="#E6F4EA" opacity="0.5" />

              {/* Workspace Board / Dashboard */}
              <rect x="40" y="40" width="420" height="300" rx="16" fill="white" stroke="#E0E2E8" strokeWidth="3" />
              <rect x="40" y="40" width="420" height="48" rx="16" fill="#F7F8FC" />
              <line x1="40" y1="88" x2="460" y2="88" stroke="#E0E2E8" strokeWidth="2" />

              {/* Header Window Dots */}
              <circle cx="70" cy="64" r="6" fill="#E5322D" />
              <circle cx="90" cy="64" r="6" fill="#F2C94C" />
              <circle cx="110" cy="64" r="6" fill="#4BA56A" />

              {/* Search / Status Bar */}
              <rect x="140" y="54" width="200" height="20" rx="10" fill="#E0E2E8" opacity="0.5" />

              {/* Central PDF File Card 1 - Red */}
              <g transform="translate(70, 110)">
                <rect x="0" y="0" width="110" height="150" rx="8" fill="white" stroke="#E5322D" strokeWidth="2" />
                <path d="M0 0 H80 L110 30 V150 H0 Z" fill="#FFF0EE" opacity="0.3" />
                <path d="M80 0 V30 H110" fill="#FFD9D9" />
                <rect x="15" y="40" width="80" height="10" rx="3" fill="#E5322D" />
                <rect x="15" y="60" width="60" height="6" rx="2" fill="#7657E8" opacity="0.6" />
                <rect x="15" y="72" width="70" height="6" rx="2" fill="#686B74" opacity="0.4" />
                <rect x="15" y="84" width="50" height="6" rx="2" fill="#686B74" opacity="0.4" />
                <rect x="15" y="105" width="40" height="24" rx="4" fill="#E5322D" />
                <text x="35" y="121" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">PDF</text>
              </g>

              {/* Conversion Arrow Indicator */}
              <g transform="translate(195, 170)">
                <circle cx="20" cy="20" r="24" fill="#7657E8" />
                <path d="M12 20 H28 M22 14 L28 20 L22 26" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </g>

              {/* Converted Document Card 2 - Purple */}
              <g transform="translate(250, 110)">
                <rect x="0" y="0" width="110" height="150" rx="8" fill="white" stroke="#7657E8" strokeWidth="2" />
                <rect x="15" y="20" width="80" height="10" rx="3" fill="#7657E8" />
                <rect x="15" y="40" width="70" height="6" rx="2" fill="#4BA56A" opacity="0.7" />
                <rect x="15" y="52" width="60" height="6" rx="2" fill="#686B74" opacity="0.4" />
                <rect x="15" y="64" width="75" height="6" rx="2" fill="#686B74" opacity="0.4" />
                {/* Table representation */}
                <rect x="15" y="80" width="80" height="50" rx="4" fill="#F7F8FC" stroke="#7657E8" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="15" y1="95" x2="95" y2="95" stroke="#7657E8" strokeWidth="1" />
                <line x1="55" y1="80" x2="55" y2="130" stroke="#7657E8" strokeWidth="1" />
              </g>

              {/* Security Shield Badge */}
              <g transform="translate(380, 120)">
                <rect x="0" y="0" width="80" height="100" rx="8" fill="white" stroke="#4BA56A" strokeWidth="2" />
                <circle cx="40" cy="40" r="20" fill="#E6F4EA" />
                <path d="M40 28 L48 32 V42 C48 48 40 52 40 52 C40 52 32 48 32 42 V32 L40 28 Z" fill="#4BA56A" />
                <rect x="15" y="70" width="50" height="6" rx="2" fill="#4BA56A" />
                <rect x="20" y="82" width="40" height="5" rx="2" fill="#686B74" opacity="0.4" />
              </g>

              {/* OCR Sparkle Overlay */}
              <g transform="translate(330, 240)">
                <rect x="0" y="0" width="110" height="70" rx="8" fill="#272830" />
                <text x="55" y="30" fill="#F2C94C" fontSize="12" fontWeight="bold" textAnchor="middle">OCR Active</text>
                <text x="55" y="50" fill="white" fontSize="9" textAnchor="middle">Text Extracted</text>
              </g>

              {/* Team Collaboration Avatars */}
              <g transform="translate(80, 280)">
                <circle cx="15" cy="15" r="14" fill="#E5322D" stroke="white" strokeWidth="2" />
                <text x="15" y="19" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">JD</text>

                <circle cx="35" cy="15" r="14" fill="#4BA56A" stroke="white" strokeWidth="2" />
                <text x="35" y="19" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">AM</text>

                <circle cx="55" cy="15" r="14" fill="#7657E8" stroke="white" strokeWidth="2" />
                <text x="55" y="19" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">SK</text>

                <rect x="80" y="4" width="90" height="22" rx="11" fill="#FFF0EE" />
                <text x="125" y="19" fill="#E5322D" fontSize="10" fontWeight="semibold" textAnchor="middle">Team Ready</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
