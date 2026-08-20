import React from 'react';
import { Link } from 'react-router-dom';
import {
  MousePointerClick,
  Smartphone,
  Copy,
  Workflow,
  ScanText,
  Users,
  Code2,
  UploadCloud,
  FileCheck2,
  FileSpreadsheet,
  Stamp,
  Download
} from 'lucide-react';

export function ProductivitySection() {
  const cards = [
    {
      icon: MousePointerClick,
      color: 'text-[#E5322D]',
      bg: 'bg-[#FFF0EE]',
      title: 'Easy to use',
      description: 'An intuitive interface requires zero training. Employees can drag and drop files and complete conversions or edits in just a few clicks.'
    },
    {
      icon: Smartphone,
      color: 'text-[#4285F4]',
      bg: 'bg-[#E8F0FE]',
      title: 'Work from any device',
      description: 'Access complete PDF tooling on Windows, macOS, Linux, iOS, and Android without needing to install native desktop software.'
    },
    {
      icon: Copy,
      color: 'text-[#9333EA]',
      bg: 'bg-[#F3E8FF]',
      title: 'Batch processing',
      description: 'Upload dozens of files simultaneously. Compress, convert, watermark, or split large batches in seconds to maximize operational throughput.'
    },
    {
      icon: Workflow,
      color: 'text-[#34A853]',
      bg: 'bg-[#E6F4EA]',
      title: 'Reusable workflows',
      description: 'Streamline standard multi-step routines. Chain compression, conversion, and watermarking sequentially to maintain team consistency.'
    },
    {
      icon: ScanText,
      color: 'text-[#FBBC05]',
      bg: 'bg-[#FEF7E0]',
      title: 'OCR & text recognition',
      description: 'Transform non-selectable scanned receipts, paper contracts, and PDFs into fully searchable, editable digital assets.'
    },
    {
      icon: Users,
      color: 'text-[#00C49F]',
      bg: 'bg-[#E6F9F5]',
      title: 'Team-ready document management',
      description: 'Organize project files, standardize document templates, and maintain clean record archives across departments.'
    },
    {
      icon: Code2,
      color: 'text-[#EA4335]',
      bg: 'bg-[#FCE8E6]',
      title: 'API automation',
      description: 'Integrate robust RESTful PDF transformation endpoints directly into your internal web portals, CRM, or backend pipelines.'
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-[#F7F8FC] border-b border-[#E0E2E8]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        {/* SECTION HEADER */}
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7657E8] bg-[#F3E8FF] px-3.5 py-1 rounded-full">
            Productivity Unleashed
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#272830] mt-4 mb-4">
            Make document work easier for your team
          </h2>
          <p className="text-base sm:text-lg text-[#686B74]">
            Designed to eliminate manual bottlenecks, save billable hours, and ensure seamless cross-functional document collaboration.
          </p>
        </div>

        {/* FEATURE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-[#E0E2E8] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-5 shrink-0`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-[#272830] mb-2.5">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[#686B74] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* WORKFLOW AUTOMATION SECTION */}
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-[#E0E2E8] shadow-sm">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4BA56A] bg-[#E6F4EA] px-3.5 py-1 rounded-full">
              Automated Sequences
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#272830] mt-3 mb-3">
              Automate repetitive PDF tasks
            </h3>
            <p className="text-sm sm:text-base text-[#686B74]">
              Chain multiple tool operations into one seamless execution flow so your team never has to re-upload files manually between steps.
            </p>
          </div>

          {/* VISUAL WORKFLOW CHAIN */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-center mb-8">
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#F7F8FC] border border-[#E0E2E8]">
              <div className="w-10 h-10 rounded-full bg-[#E8F0FE] text-[#4285F4] flex items-center justify-center mb-2">
                <UploadCloud size={20} />
              </div>
              <span className="text-xs font-bold uppercase text-[#737680] mb-1">Step 1</span>
              <span className="text-sm font-semibold text-[#272830]">Upload File</span>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#F7F8FC] border border-[#E0E2E8]">
              <div className="w-10 h-10 rounded-full bg-[#FFF0EE] text-[#E5322D] flex items-center justify-center mb-2">
                <FileCheck2 size={20} />
              </div>
              <span className="text-xs font-bold uppercase text-[#737680] mb-1">Step 2</span>
              <span className="text-sm font-semibold text-[#272830]">Compress PDF</span>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#F7F8FC] border border-[#E0E2E8]">
              <div className="w-10 h-10 rounded-full bg-[#F3E8FF] text-[#7657E8] flex items-center justify-center mb-2">
                <FileSpreadsheet size={20} />
              </div>
              <span className="text-xs font-bold uppercase text-[#737680] mb-1">Step 3</span>
              <span className="text-sm font-semibold text-[#272830]">Convert Format</span>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#F7F8FC] border border-[#E0E2E8]">
              <div className="w-10 h-10 rounded-full bg-[#FEF7E0] text-[#FBBC05] flex items-center justify-center mb-2">
                <Stamp size={20} />
              </div>
              <span className="text-xs font-bold uppercase text-[#737680] mb-1">Step 4</span>
              <span className="text-sm font-semibold text-[#272830]">Watermark</span>
            </div>

            <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex flex-col items-center text-center p-4 rounded-xl bg-[#E6F4EA] border border-[#A8DADC]">
              <div className="w-10 h-10 rounded-full bg-[#34A853] text-white flex items-center justify-center mb-2">
                <Download size={20} />
              </div>
              <span className="text-xs font-bold uppercase text-[#34A853] mb-1">Step 5</span>
              <span className="text-sm font-bold text-[#1B5E20]">Download Result</span>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/pdf-tools"
              className="inline-flex items-center justify-center h-11 px-6 bg-[#272830] hover:bg-[#111111] text-white font-semibold text-sm rounded-xl transition-colors"
            >
              Explore Tool Sequences
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
