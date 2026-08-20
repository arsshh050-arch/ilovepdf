import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductMenuItem } from './ProductMenuItem';
import { LanguageMenu } from './LanguageMenu';
import { Image, PenTool, FileCode2, Link as LinkIcon, CreditCard, Lock, LayoutGrid, Building2, ChevronRight, HelpCircle, Globe } from 'lucide-react';

interface ProductsMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductsMegaMenu = React.forwardRef<HTMLDivElement, ProductsMegaMenuProps>(({ isOpen, onClose }, ref) => {
  const [langOpen, setLangOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div 
      ref={ref}
      id="products-mega-menu"
      role="menu"
      className="absolute top-[calc(100%+14px)] right-[24px] w-[calc(100vw-32px)] md:w-[740px] xl:w-[1050px] max-w-[calc(100vw-30px)] bg-white rounded-[14px] shadow-[0_8px_28px_rgba(0,0,0,0.10)] z-[10000] hidden md:block border border-[#E5E7EB]"
    >
      <div className="absolute top-[-9px] right-[20px] w-[18px] h-[18px] bg-white border-t border-l border-[#E5E7EB] transform rotate-45"></div>

      <div className="p-[32px] flex flex-wrap xl:grid xl:grid-cols-[1.25fr_1.3fr_0.75fr] gap-[24px] min-h-[395px]">
        {/* LEFT COLUMN */}
        <div className="flex flex-col w-[100%] md:w-[calc(50%-12px)] xl:w-auto">
          <h3 className="text-[14px] font-[600] text-[#737680] uppercase mb-[20px] tracking-wide">Other Products</h3>
          <div className="flex flex-col gap-[14px]">
            <ProductMenuItem
              to="/image-tools"
              title="ilovepdf.in Image Tools"
              subtitle="Effortless image editing"
              onClick={onClose}
              icon={<Image className="text-blue-500" size={24} strokeWidth={1.5} />}
            />
            <ProductMenuItem
              to="/sign-pdf"
              title="ilovepdf.in Sign"
              subtitle="e-Signing made simple"
              onClick={onClose}
              icon={<PenTool className="text-blue-500" size={24} strokeWidth={1.5} />}
            />
            <ProductMenuItem
              to="/developers"
              title="ilovepdf.in API"
              subtitle="Document automation for developers"
              onClick={onClose}
              icon={<FileCode2 className="text-cyan-500" size={24} strokeWidth={1.5} />}
            />
          </div>

          <Link to="/integrations" onClick={onClose} className="mt-[24px] w-full max-w-[285px] h-[58px] border border-[#C9CDD7] rounded-[9px] bg-white hover:bg-[#FAFAFC] hover:border-[#777] transition-all flex items-center px-[16px] gap-[12px] group">
            <div className="w-[32px] h-[32px] bg-gray-50 rounded-full flex items-center justify-center shrink-0 border border-gray-100">
              <LinkIcon size={16} className="text-gray-500 group-hover:text-gray-700" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[14px] font-[600] text-[#30313A] leading-tight">Integrations</span>
              <span className="text-[12px] text-[#777A84] mt-[2px] leading-tight">Zapier, Make, WordPress...</span>
            </div>
          </Link>
        </div>

        {/* CENTER COLUMN */}
        <div className="flex flex-col w-[100%] md:w-[calc(50%-12px)] xl:w-auto md:border-l md:border-[#D9DCE3] md:pl-[24px]">
          <h3 className="text-[14px] font-[600] text-[#737680] uppercase mb-[20px] tracking-wide">Solutions</h3>
          
          <Link to="/business" onClick={onClose} className="flex items-start gap-[16px] p-2 -ml-2 rounded-[7px] transition-colors duration-150 hover:bg-[#F6F6F8] group">
            <div className="w-[98px] h-[98px] bg-[#F7F6FA] rounded-[8px] flex items-center justify-center shrink-0 relative overflow-hidden">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="15" width="30" height="36" rx="4" fill="#FFC9C6" opacity="0.8"/>
                <rect x="20" y="10" width="30" height="36" rx="4" fill="#E5322D"/>
                <path d="M28 22H42" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M28 28H42" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M28 34H36" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex flex-col mt-2">
              <span className="text-[18px] font-[600] text-[#30313A] leading-tight">Business</span>
              <span className="text-[14px] text-[#777A84] mt-[6px] leading-[1.4] max-w-[180px]">Streamlined PDF editing and workflows for business teams</span>
            </div>
          </Link>

          <h3 className="text-[14px] font-[600] text-[#737680] uppercase mt-[32px] mb-[16px] tracking-wide">Applications</h3>
          <div className="flex flex-col gap-[12px]">
            <ProductMenuItem
              to="/desktop"
              title="Desktop App"
              subtitle="Available for Mac and Windows"
              onClick={onClose}
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E5322D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              }
            />
            <ProductMenuItem
              to="/mobile"
              title="Mobile App"
              subtitle="Available for iOS and Android"
              onClick={onClose}
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E5322D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                  <line x1="12" y1="18" x2="12.01" y2="18"></line>
                </svg>
              }
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col w-[100%] xl:w-auto xl:border-l xl:border-[#D9DCE3] xl:pl-[24px] md:mt-6 xl:mt-0 pt-6 md:border-t xl:border-t-0 xl:pt-0 border-[#D9DCE3]">
          <div className="flex flex-col xl:h-[184px] md:flex-row xl:flex-col md:flex-wrap xl:flex-nowrap gap-x-4">
            <Link to="/pricing" onClick={onClose} className="flex items-center gap-[12px] h-[40px] px-2 -ml-2 rounded-[7px] hover:bg-[#F6F6F8] transition-colors text-[15px] font-[500] text-[#30313A] group md:w-[calc(50%-8px)] xl:w-auto">
              <CreditCard size={18} className="text-[#737680] group-hover:text-[#30313A]" />
              Pricing
            </Link>
            <Link to="/security" onClick={onClose} className="flex items-center gap-[12px] h-[40px] px-2 -ml-2 rounded-[7px] hover:bg-[#F6F6F8] transition-colors text-[15px] font-[500] text-[#30313A] group md:w-[calc(50%-8px)] xl:w-auto">
              <Lock size={18} className="text-[#737680] group-hover:text-[#30313A]" />
              Security
            </Link>
            <Link to="/features" onClick={onClose} className="flex items-center gap-[12px] h-[40px] px-2 -ml-2 rounded-[7px] hover:bg-[#F6F6F8] transition-colors text-[15px] font-[500] text-[#30313A] group md:w-[calc(50%-8px)] xl:w-auto">
              <LayoutGrid size={18} className="text-[#737680] group-hover:text-[#30313A]" />
              Features
            </Link>
            <Link to="/about" onClick={onClose} className="flex items-center gap-[12px] h-[40px] px-2 -ml-2 rounded-[7px] hover:bg-[#F6F6F8] transition-colors text-[15px] font-[500] text-[#30313A] group md:w-[calc(50%-8px)] xl:w-auto">
              <Building2 size={18} className="text-[#737680] group-hover:text-[#30313A]" />
              About us
            </Link>
          </div>

          <div className="mt-[20px] mb-[15px] border-t border-[#D7DAE1] hidden xl:block"></div>

          <div className="flex flex-col relative md:flex-row xl:flex-col gap-x-4 md:mt-2 xl:mt-0">
            <Link to="/help" onClick={onClose} className="flex items-center justify-between h-[40px] px-2 -ml-2 rounded-[7px] hover:bg-[#F6F6F8] transition-colors text-[15px] font-[500] text-[#30313A] group md:w-[calc(50%-8px)] xl:w-auto">
              <div className="flex items-center gap-[12px]">
                <HelpCircle size={18} className="text-[#737680] group-hover:text-[#30313A]" />
                Help
              </div>
              <ChevronRight size={16} className="text-[#A0A2AB]" />
            </Link>

            <div className="relative md:w-[calc(50%-8px)] xl:w-auto">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLangOpen(!langOpen); }}
                className="flex items-center justify-between h-[40px] w-full px-2 -ml-2 rounded-[7px] hover:bg-[#F6F6F8] transition-colors text-[15px] font-[500] text-[#30313A] group"
              >
                <div className="flex items-center gap-[12px]">
                  <Globe size={18} className="text-[#737680] group-hover:text-[#30313A]" />
                  Language
                </div>
                <ChevronRight size={16} className="text-[#A0A2AB]" />
              </button>
              <LanguageMenu isOpen={langOpen} onClose={() => setLangOpen(false)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
ProductsMegaMenu.displayName = 'ProductsMegaMenu';
