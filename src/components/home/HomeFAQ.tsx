import React from 'react';
import { Link } from 'react-router-dom';
import { allFaqs } from '../../content/faqs';
import { ToolFAQ } from '../seo/ToolFAQ';

export function HomeFAQ() {
  // Select ~6 high-level general questions for the homepage
  const homeFaqIds = ['gen-1', 'gen-10', 'gen-3', 'priv-1', 'gen-4', 'priv-3'];
  const homeFaqs = homeFaqIds.map(id => allFaqs.find(f => f.id === id)).filter(Boolean) as typeof allFaqs;

  return (
    <div className="w-full flex flex-col items-center pb-[80px] bg-[#F7F7FA]">
      <ToolFAQ faqs={homeFaqs} title="Frequently Asked Questions" />
      
      <Link 
        to="/faq" 
        className="mt-6 inline-flex items-center justify-center font-[600] text-[16px] text-[#E5322D] hover:text-[#d42d28] transition-colors"
      >
        View all FAQs →
      </Link>
    </div>
  );
}
