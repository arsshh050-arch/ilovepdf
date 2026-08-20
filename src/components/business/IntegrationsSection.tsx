import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Database, Cpu, Globe, Zap, ArrowRight, Code2 } from 'lucide-react';

export function IntegrationsSection() {
  const integrations = [
    {
      name: 'Google Drive',
      description: 'Import files directly from Google Drive cloud storage and save processed PDFs back.',
      status: 'Planned',
      icon: Cloud,
      color: 'text-blue-500'
    },
    {
      name: 'Dropbox',
      description: 'Sync document folders automatically for instant batch processing.',
      status: 'Planned',
      icon: Database,
      color: 'text-indigo-500'
    },
    {
      name: 'Google Workspace',
      description: 'Add-ons for Docs and Sheets to convert documents directly in your workspace.',
      status: 'Planned',
      icon: Globe,
      color: 'text-green-500'
    },
    {
      name: 'Zapier',
      description: 'Trigger PDF conversion sequences automatically from thousands of web apps.',
      status: 'Planned',
      icon: Zap,
      color: 'text-orange-500'
    },
    {
      name: 'Microsoft Power Automate',
      description: 'Build enterprise document pipelines within your Microsoft ecosystem.',
      status: 'Planned',
      icon: Cpu,
      color: 'text-cyan-500'
    },
    {
      name: 'WordPress Plugin',
      description: 'Allow site visitors to submit and convert files directly on your website.',
      status: 'Planned',
      icon: Globe,
      color: 'text-slate-600'
    },
    {
      name: 'Developer REST API',
      description: 'Full RESTful API access for programmatic PDF creation, merge, split, & OCR.',
      status: 'Available',
      icon: Code2,
      color: 'text-[#E5322D]'
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-white border-b border-[#E0E2E8]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4285F4] bg-[#E8F0FE] px-3.5 py-1 rounded-full">
            Ecosystem Integration
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#272830] mt-4 mb-4">
            Connect document workflows with the tools your team uses
          </h2>
          <p className="text-base text-[#686B74]">
            Build seamless document connectivity across your cloud storage ecosystem and internal tech stack.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {integrations.map((item, idx) => {
            const Icon = item.icon;
            const isAvailable = item.status === 'Available';
            return (
              <div
                key={idx}
                className="bg-[#F7F8FC] p-6 rounded-2xl border border-[#E0E2E8] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E0E2E8] flex items-center justify-center shrink-0">
                      <Icon size={20} className={item.color} />
                    </div>
                    {isAvailable ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#E6F4EA] text-[#34A853]">
                        Available
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F1F3F4] text-[#5F6368]">
                        Planned
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-[#272830] text-base mb-2">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#686B74] leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                {isAvailable && (
                  <Link
                    to="/developers"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5322D] hover:underline mt-2"
                  >
                    <span>View API Documentation</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* API HIGHLIGHT BANNER */}
        <div className="bg-[#272830] text-white rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F2C94C] bg-[#3E404D] px-3 py-1 rounded-full">
              Automate Document Processing
            </span>
            <h3 className="text-xl sm:text-2xl font-bold mt-3 mb-2">
              Automate document processing with REST API access
            </h3>
            <p className="text-sm text-gray-300 max-w-xl">
              Integrate PDF compression, format conversion, page merging, and text extraction into your custom backend systems.
            </p>
          </div>

          <Link
            to="/developers"
            className="inline-flex items-center justify-center h-12 px-8 bg-[#E5322D] hover:bg-[#d42d28] text-white font-semibold text-sm rounded-xl transition-all shrink-0"
          >
            View API documentation
          </Link>
        </div>
      </div>
    </section>
  );
}
