import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const BUSINESS_FAQS = [
  {
    question: 'What PDF tools are available for business teams?',
    answer: 'ilovepdf.in offers a comprehensive set of web tools including PDF merging, splitting, compressing, PDF to Word/Excel/PowerPoint conversion, full-text PDF editing, electronic signing, password encryption, redaction, and multi-language OCR.'
  },
  {
    question: 'Can multiple employees use ilovepdf.in?',
    answer: 'Yes! Employees across your startup, department, or company can access the web application simultaneously from any modern desktop or mobile web browser.'
  },
  {
    question: 'Can we automate PDF workflows?',
    answer: 'Yes. You can chain multi-step sequences like compression, format conversion, and watermarking sequentially to streamline repetitive document prep routines.'
  },
  {
    question: 'Does ilovepdf.in provide an API?',
    answer: 'Yes. We offer developer API documentation allowing you to programmatically perform conversions, merges, splits, and OCR text extraction within your internal company applications.'
  },
  {
    question: 'Can teams process scanned documents with OCR?',
    answer: 'Yes. Our Optical Character Recognition (OCR) engine converts scanned paper contracts, invoices, and receipts into searchable, selectable PDF text layers.'
  },
  {
    question: 'How are uploaded business documents handled?',
    answer: 'All file transfers use 256-bit TLS encryption. Uploaded documents are processed statelessly in secure isolated environments and automatically deleted permanently within 2 hours.'
  },
  {
    question: 'Can we use ilovepdf.in on mobile devices?',
    answer: 'Yes. All PDF tools are fully optimized for touch navigation on iOS, iPadOS, Android, and mobile web browsers.'
  },
  {
    question: 'Can businesses request custom integrations?',
    answer: 'Yes. You can contact our business solutions team using the contact form above to discuss custom API setups, enterprise workflows, or dedicated requirements.'
  },
  {
    question: 'Can we use PDF tools without installing software?',
    answer: 'Absolutely. All tools run 100% inside your web browser. No desktop software downloads, plugins, or administrative installations are required.'
  },
  {
    question: 'Does ilovepdf.in support batch processing?',
    answer: 'Yes! You can upload multiple documents at once to convert, compress, or watermark large document batches in seconds.'
  }
];

export function BusinessFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 md:py-20 bg-white border-b border-[#E0E2E8]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-[#FFF0EE] text-[#E5322D] flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={24} />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#272830] mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-[#686B74]">
            Everything you need to know about using ilovepdf.in for your team or organization.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {BUSINESS_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-[#E0E2E8] rounded-xl overflow-hidden bg-white transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-[#272830] text-base hover:bg-[#F7F8FC] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`text-[#737680] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#E5322D]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-[#686B74] leading-relaxed border-t border-[#F0F2F7]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
