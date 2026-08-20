import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FaqItem } from '../../types/faq';

interface ToolFAQProps {
  faqs: FaqItem[];
  title?: string;
}

export function ToolFAQ({ faqs, title = "Frequently Asked Questions", standalone = true }: ToolFAQProps & { standalone?: boolean }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!faqs || faqs.length === 0) return null;

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const Wrapper = standalone ? 'section' : 'div';
  const wrapperClass = standalone ? "w-full bg-[#F7F7FA] py-[60px] md:py-[80px]" : "w-full";

  return (
    <Wrapper className={wrapperClass}>
      <div className={standalone ? "max-w-[1050px] mx-auto px-4 md:px-6" : "w-full"}>
        {title && (
          <h2 className="text-center text-[28px] md:text-[34px] font-[700] text-[#33333B] mb-[40px]">
            {title}
          </h2>
        )}
        
        <div className="flex flex-col">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div 
                key={faq.id} 
                className="bg-white border border-[#E0E2E8] rounded-[10px] mb-[12px] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left px-[22px] py-[20px] flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#E5322D] focus:ring-inset"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <span className="text-[17px] font-[600] text-[#33333B] pr-4">
                    {faq.question}
                  </span>
                  <span className="text-[#E5322D] flex-shrink-0">
                    {isOpen ? <Minus size={20} strokeWidth={2.5} /> : <Plus size={20} strokeWidth={2.5} />}
                  </span>
                </button>
                
                <div 
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  className={`px-[22px] overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] pb-[22px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p 
                    className="text-[15px] leading-[1.65] text-[#5C5E67]"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Wrapper>
  );
}
