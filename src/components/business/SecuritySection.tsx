import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Shield, Clock, Key, ArrowRight } from 'lucide-react';

export function SecuritySection() {
  const practices = [
    {
      icon: Lock,
      title: 'HTTPS TLS Encryption',
      description: 'Every file upload and download is shielded using industry-standard TLS 1.3 cryptographic transport protocols.'
    },
    {
      icon: Clock,
      title: 'Automatic File Deletion',
      description: 'Uploaded and processed documents are automatically scrubbed permanently from servers within 2 hours.'
    },
    {
      icon: Key,
      title: 'Password & Session Security',
      description: 'Protected PDFs are processed statelessly with secure session identifiers and salt-hashed access credentials.'
    },
    {
      icon: Shield,
      title: 'Granular Access Controls',
      description: 'Strict rate limiting, origin verification, and isolated sandbox containers prevent unauthorized access.'
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-white border-b border-[#E0E2E8]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT SUMMARY */}
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#34A853] bg-[#E6F4EA] px-3.5 py-1 rounded-full">
              Privacy & Safeguards
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#272830] mt-4 mb-4">
              Protect business documents
            </h2>
            <p className="text-base text-[#686B74] leading-relaxed mb-8">
              We treat your corporate documents with extreme confidentiality. Files are never analyzed, sold, or retained beyond the necessary processing window.
            </p>

            <Link
              to="/security"
              className="inline-flex items-center gap-2 h-12 px-6 bg-[#34A853] hover:bg-[#2d9247] text-white font-semibold rounded-xl text-sm transition-all"
            >
              <span>Learn about security</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* RIGHT PRACTICES GRID */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {practices.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#F7F8FC] p-6 rounded-2xl border border-[#E0E2E8]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E6F4EA] text-[#34A853] flex items-center justify-center mb-4 shrink-0">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-bold text-[#272830] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#686B74] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
