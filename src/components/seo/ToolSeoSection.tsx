import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, HelpCircle, Shield, ArrowRight, Zap, Award } from 'lucide-react';
import { getToolSeoData, ToolSeoData } from '../../content/seo/toolsSeo';
import { PDF_TOOLS } from '../../config/pdfTools';
import { SEO } from '../SEO';
import { ToolFAQ } from './ToolFAQ';
import {
  buildWebApplicationSchema,
  buildBreadcrumbSchema,
  buildFaqSchema
} from '../../seo/schema';

interface ToolSeoSectionProps {
  slug: string;
  fallbackName?: string;
  fallbackDesc?: string;
  className?: string;
}

export function ToolSeoSection({ slug, fallbackName, fallbackDesc, className = '' }: ToolSeoSectionProps) {
  const seoData: ToolSeoData = getToolSeoData(slug, fallbackName, fallbackDesc);

  // Convert FAQ data to ToolFAQ item format
  const faqItems = seoData.faq.map((f, i) => ({
    id: `faq-${i}`,
    question: f.question,
    answer: f.answer,
    category: seoData.name
  }));

  // Find related tools
  const relatedTools = (seoData.relatedToolSlugs || [])
    .map(s => PDF_TOOLS.find(t => t.slug === s))
    .filter(Boolean);

  // Reusable Schemas via generators
  const appSchema = buildWebApplicationSchema({
    name: seoData.name,
    slug: seoData.slug,
    description: seoData.description,
    category: 'UtilitiesApplication'
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'PDF Tools', path: '/pdf-tools' },
    { name: seoData.name, path: seoData.slug }
  ], seoData.slug);

  const faqSchema = buildFaqSchema(seoData.faq, seoData.slug);

  const activeSchemas = [appSchema, breadcrumbSchema, faqSchema].filter(Boolean) as Record<string, any>[];

  return (
    <>
      <SEO
        title={seoData.title}
        description={seoData.description}
        canonicalPath={seoData.slug}
        schema={activeSchemas}
      />

      <article className={`bg-white border-t border-[#E0E2E8] py-16 md:py-20 ${className}`}>
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 space-y-16">
          
          {/* HOW-TO & BENEFITS GRID */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* HOW TO USE */}
            <div className="bg-[#F7F8FC] border border-[#E0E2E8] rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#FFF0EE] text-[#E5322D] flex items-center justify-center font-bold">
                  <Zap size={20} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-[#272830]">
                  {seoData.howTo.title}
                </h2>
              </div>

              <ol className="space-y-4">
                {seoData.howTo.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <span className="w-7 h-7 rounded-full bg-[#E5322D] text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-[#272830] text-base mb-0.5">
                        {step.title}
                      </h3>
                      <p className="text-sm text-[#686B74] leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* KEY BENEFITS */}
            <div className="space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF5EE] text-[#23A455] flex items-center justify-center font-bold">
                    <Award size={20} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#272830]">
                    Why Use Our {seoData.name} Tool?
                  </h2>
                </div>

                <div className="space-y-5">
                  {seoData.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-3.5">
                      <CheckCircle2 className="text-[#23A455] shrink-0 mt-0.5" size={20} />
                      <div>
                        <h3 className="font-bold text-[#272830] text-base">
                          {b.title}
                        </h3>
                        <p className="text-sm text-[#686B74] mt-0.5 leading-relaxed">
                          {b.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECURITY BANNED CARD */}
              <div className="p-4 rounded-xl bg-[#F4F6FA] border border-[#E0E2E8] flex items-center gap-3.5 text-xs text-[#525560] mt-6">
                <Shield size={24} className="text-[#E5322D] shrink-0" />
                <p>
                  <strong>Secure & Private:</strong> Uploads use 256-bit TLS encryption. Files are processed statelessly and deleted automatically after 2 hours.
                </p>
              </div>
            </div>
          </div>

          {/* PRACTICAL USE CASES */}
          {seoData.useCases && seoData.useCases.length > 0 && (
            <div className="border border-[#E0E2E8] rounded-2xl p-6 md:p-8 bg-[#FAFAFC]">
              <h2 className="text-xl md:text-2xl font-bold text-[#272830] mb-4">
                Common Use Cases
              </h2>
              <ul className="grid sm:grid-cols-3 gap-4">
                {seoData.useCases.map((useCase, idx) => (
                  <li key={idx} className="bg-white border border-[#E0E2E8] rounded-xl p-4 text-sm text-[#525560] flex items-start gap-2.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#E5322D] shrink-0 mt-1.5" />
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* UNIQUE FAQ ACCORDION */}
          <div>
            <ToolFAQ faqs={faqItems} title={`Frequently Asked Questions about ${seoData.name}`} standalone={false} />
          </div>

          {/* RELATED TOOLS GRID */}
          {relatedTools.length > 0 && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#272830] mb-6 border-b border-[#E0E2E8] pb-3">
                Related PDF Tools
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedTools.map(tool => (
                  <Link
                    key={tool!.id}
                    to={tool!.slug}
                    className="p-4 border border-[#E0E2E8] rounded-xl hover:border-[#E5322D] hover:shadow-md transition-all group bg-white flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-[#272830] group-hover:text-[#E5322D] text-base mb-1 flex items-center justify-between">
                        <span>{tool!.name}</span>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#E5322D]" />
                      </h3>
                      <p className="text-xs text-[#686B74] line-clamp-2 leading-relaxed">
                        {tool!.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </article>
    </>
  );
}
