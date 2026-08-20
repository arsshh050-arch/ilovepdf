import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolGrid, CategoryFilters, FilterType } from '../components/ToolGrid';
import { TrustSection } from '../components/home/TrustSection';
import { WorkflowSection } from '../components/home/WorkflowSection';
import { FeaturesOverviewSection } from '../components/home/FeaturesOverviewSection';
import { HomeFAQ } from '../components/home/HomeFAQ';
import { PopularTools } from '../components/home/PopularTools';
import { SEO } from '../components/SEO';
import { buildWebsiteSchema, buildOrganizationSchema } from '../seo/schema';

export function Home() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const websiteSchema = buildWebsiteSchema(
    'Use browser-based tools to merge, split, compress, convert, edit and prepare PDF documents for everyday work.'
  );
  const orgSchema = buildOrganizationSchema();

  return (
    <>
      <SEO
        title="Online PDF Tools for Everyday Document Tasks | iLovePDF.in"
        description="Use browser-based tools to merge, split, compress, convert, edit and prepare PDF documents for everyday work."
        canonicalPath="/"
        schema={[websiteSchema, orgSchema]}
      />

      <div className="relative bg-[#F7F7FB] min-h-[calc(100vh-56px)]">
        
        {/* Background aesthetic shapes */}
        <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[100px] -left-[100px] w-[500px] h-[500px] bg-red-100/30 rounded-full blur-3xl"></div>
          <div className="absolute top-[50px] right-[50px] w-[600px] h-[600px] bg-purple-100/30 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Section */}
        <section className="pt-20 pb-12 px-4 md:px-6 text-center max-w-[1000px] mx-auto relative z-10">
          <h1 className="text-[30px] md:text-[36px] lg:text-[48px] font-bold text-[#111111] mb-6 tracking-tight leading-tight">
            Online PDF Tools for Everyday Document Tasks
          </h1>
          <p className="text-[16px] md:text-[18px] lg:text-[20px] text-[#55565B] max-w-[800px] mx-auto leading-relaxed">
            Convert, organize, compress, edit and prepare documents with simple browser-based tools built for your common PDF needs.
          </p>
        </section>

        <section className="relative z-10">
          <PopularTools />
        </section>

        <section className="relative z-10">
          <CategoryFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </section>

        {/* Tool Grid Section */}
        <section className="pb-24 relative z-10">
          <ToolGrid activeFilter={activeFilter} />
        </section>
      </div>
      
      <WorkflowSection />
      
      <FeaturesOverviewSection />
      
      <HomeFAQ />

      <TrustSection />
    </>
  );
}
