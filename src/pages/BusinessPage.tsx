import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { BusinessHero } from '../components/business/BusinessHero';
import { TrustBar } from '../components/business/TrustBar';
import { BusinessBenefits } from '../components/business/BusinessBenefits';
import { ProductivitySection } from '../components/business/ProductivitySection';
import { FeatureTabs } from '../components/business/FeatureTabs';
import { EnterpriseSection } from '../components/business/EnterpriseSection';
import { SecuritySection } from '../components/business/SecuritySection';
import { IndustryTabs } from '../components/business/IndustryTabs';
import { IntegrationsSection } from '../components/business/IntegrationsSection';
import { ContactSalesForm } from '../components/business/ContactSalesForm';
import { BusinessFAQ, BUSINESS_FAQS } from '../components/business/BusinessFAQ';
import { SEO } from '../components/SEO';
import {
  buildWebApplicationSchema,
  buildBreadcrumbSchema,
  buildFaqSchema
} from '../seo/schema';

export function BusinessPage() {
  const faqSchema = buildFaqSchema(BUSINESS_FAQS, '/business');

  const breadcrumbSchema = buildBreadcrumbSchema([{ name: 'Business', path: '/business' }], '/business');

  const softwareAppSchema = buildWebApplicationSchema({
    name: 'ilovepdf.in Business',
    slug: '/business',
    description: 'Streamline document workflows with PDF conversion, editing, OCR, security, and team automation tools.',
    category: 'BusinessApplication'
  });

  const activeSchemas = [softwareAppSchema, breadcrumbSchema, faqSchema].filter(Boolean) as Record<string, any>[];

  return (
    <>
      <SEO
        title="PDF Tools for Business & Teams | ilovepdf.in"
        description="Streamline document workflows with PDF conversion, editing, OCR, security, automation and team tools designed for modern businesses."
        canonicalPath="/business"
        schema={activeSchemas}
      />

      <main className="min-h-screen bg-white">
        {/* BREADCRUMB */}
        <div className="bg-[#F7F8FC] border-b border-[#E0E2E8] py-3 px-6 md:px-10 text-xs font-medium text-[#737680]">
          <div className="max-w-[1280px] mx-auto flex items-center gap-1.5">
            <Link to="/" className="hover:text-[#E5322D] transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-[#A0A2AB]" />
            <span className="text-[#272830] font-semibold">Business</span>
          </div>
        </div>

        {/* HERO SECTION */}
        <BusinessHero />

        {/* TRUST INDICATORS */}
        <TrustBar />

        {/* BUSINESS VALUE (3 MAJOR BLOCKS) */}
        <BusinessBenefits />

        {/* PRODUCTIVITY & WORKFLOW AUTOMATION */}
        <ProductivitySection />

        {/* TOOL SHOWCASE (INTERACTIVE TABS) */}
        <FeatureTabs />

        {/* ENTERPRISE CAPABILITIES */}
        <EnterpriseSection />

        {/* SECURITY & PRIVACY */}
        <SecuritySection />

        {/* INDUSTRY SOLUTIONS */}
        <IndustryTabs />

        {/* INTEGRATIONS & API */}
        <IntegrationsSection />

        {/* CONTACT SALES FORM */}
        <ContactSalesForm />

        {/* FAQ SECTION */}
        <BusinessFAQ />

        {/* BUSINESS PLAN FINAL CTA BANNER */}
        <section className="py-16 bg-[#272830] text-white">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Bring PDF productivity to your team
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Empower employees to convert, edit, sign, and organize documents with ease. Start using ilovepdf.in today or speak with our sales team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/pricing"
                className="w-full sm:w-auto h-12 px-8 bg-[#E5322D] hover:bg-[#d42d28] text-white font-bold rounded-xl transition-all flex items-center justify-center"
              >
                Start free
              </Link>
              <a
                href="#contact-sales"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact-sales')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto h-12 px-8 bg-white text-[#272830] hover:bg-gray-100 font-bold rounded-xl transition-all flex items-center justify-center"
              >
                Contact sales
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
