import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronDown, ChevronRight, Image, PenTool, FileCode2, Link as LinkIcon, CreditCard, Lock, LayoutGrid, Building2, HelpCircle, Globe } from 'lucide-react';
import { LanguageMenu } from './LanguageMenu';

interface MobileProductsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileProductsMenu({ isOpen, onClose }: MobileProductsMenuProps) {
  const [openSection, setOpenSection] = useState<string | null>('other');
  const [langOpen, setLangOpen] = useState(false);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="fixed inset-0 z-[70] bg-white xl:hidden overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-[#E1E3E8] sticky top-0 bg-white z-10">
        <span className="font-bold text-[18px] text-[#30313A]">Products</span>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          <X size={24} />
        </button>
      </div>

      <div className="flex flex-col p-4">
        {/* OTHER PRODUCTS */}
        <div className="border-b border-gray-100 py-3">
          <button 
            className="flex items-center justify-between w-full text-left font-[600] text-[#30313A]"
            onClick={() => toggleSection('other')}
          >
            OTHER PRODUCTS
            <ChevronDown size={20} className={`transition-transform ${openSection === 'other' ? 'rotate-180' : ''}`} />
          </button>
          
          {openSection === 'other' && (
            <div className="flex flex-col gap-4 mt-4">
              <Link to="/image-tools" onClick={onClose} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F6F6FA] rounded-md flex items-center justify-center shrink-0">
                  <Image className="text-blue-500" size={20} />
                </div>
                <span className="text-[15px] font-[500]">ilovepdf.in Image Tools</span>
              </Link>
              <Link to="/sign-pdf" onClick={onClose} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F6F6FA] rounded-md flex items-center justify-center shrink-0">
                  <PenTool className="text-blue-500" size={20} />
                </div>
                <span className="text-[15px] font-[500]">ilovepdf.in Sign</span>
              </Link>
              <Link to="/developers" onClick={onClose} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F6F6FA] rounded-md flex items-center justify-center shrink-0">
                  <FileCode2 className="text-cyan-500" size={20} />
                </div>
                <span className="text-[15px] font-[500]">ilovepdf.in API</span>
              </Link>
              <Link to="/integrations" onClick={onClose} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0 border border-gray-100">
                  <LinkIcon size={16} className="text-gray-500" />
                </div>
                <span className="text-[15px] font-[500]">Integrations</span>
              </Link>
            </div>
          )}
        </div>

        {/* SOLUTIONS */}
        <div className="border-b border-gray-100 py-3">
          <button 
            className="flex items-center justify-between w-full text-left font-[600] text-[#30313A]"
            onClick={() => toggleSection('solutions')}
          >
            SOLUTIONS
            <ChevronDown size={20} className={`transition-transform ${openSection === 'solutions' ? 'rotate-180' : ''}`} />
          </button>
          
          {openSection === 'solutions' && (
            <div className="flex flex-col gap-4 mt-4">
              <Link to="/business" onClick={onClose} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#F7F6FA] rounded-md flex items-center justify-center shrink-0 relative overflow-hidden">
                   <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="15" width="30" height="36" rx="4" fill="#FFC9C6" opacity="0.8"/>
                    <rect x="20" y="10" width="30" height="36" rx="4" fill="#E5322D"/>
                  </svg>
                </div>
                <span className="text-[15px] font-[500]">Business</span>
              </Link>
            </div>
          )}
        </div>

        {/* APPLICATIONS */}
        <div className="border-b border-gray-100 py-3">
          <button 
            className="flex items-center justify-between w-full text-left font-[600] text-[#30313A]"
            onClick={() => toggleSection('apps')}
          >
            APPLICATIONS
            <ChevronDown size={20} className={`transition-transform ${openSection === 'apps' ? 'rotate-180' : ''}`} />
          </button>
          
          {openSection === 'apps' && (
            <div className="flex flex-col gap-4 mt-4">
              <Link to="/desktop" onClick={onClose} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F6F6FA] rounded-md flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E5322D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <span className="text-[15px] font-[500]">Desktop App</span>
              </Link>
              <Link to="/mobile" onClick={onClose} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F6F6FA] rounded-md flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E5322D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                  </svg>
                </div>
                <span className="text-[15px] font-[500]">Mobile App</span>
              </Link>
            </div>
          )}
        </div>

        {/* OTHER */}
        <div className="py-3">
          <button 
            className="flex items-center justify-between w-full text-left font-[600] text-[#30313A]"
            onClick={() => toggleSection('other-links')}
          >
            COMPANY
            <ChevronDown size={20} className={`transition-transform ${openSection === 'other-links' ? 'rotate-180' : ''}`} />
          </button>
          
          {openSection === 'other-links' && (
            <div className="flex flex-col mt-2">
              <Link to="/pricing" onClick={onClose} className="flex items-center gap-3 py-3">
                <CreditCard size={18} className="text-[#737680]" />
                <span className="text-[15px] font-[500]">Pricing</span>
              </Link>
              <Link to="/security" onClick={onClose} className="flex items-center gap-3 py-3">
                <Lock size={18} className="text-[#737680]" />
                <span className="text-[15px] font-[500]">Security</span>
              </Link>
              <Link to="/features" onClick={onClose} className="flex items-center gap-3 py-3">
                <LayoutGrid size={18} className="text-[#737680]" />
                <span className="text-[15px] font-[500]">Features</span>
              </Link>
              <Link to="/about" onClick={onClose} className="flex items-center gap-3 py-3">
                <Building2 size={18} className="text-[#737680]" />
                <span className="text-[15px] font-[500]">About us</span>
              </Link>
              <Link to="/help" onClick={onClose} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <HelpCircle size={18} className="text-[#737680]" />
                  <span className="text-[15px] font-[500]">Help</span>
                </div>
                <ChevronRight size={16} className="text-[#A0A2AB]" />
              </Link>
              
              <div className="relative">
                <button 
                  onClick={() => setLangOpen(!langOpen)} 
                  className="flex items-center justify-between py-3 w-full"
                >
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-[#737680]" />
                    <span className="text-[15px] font-[500]">Language</span>
                  </div>
                  <ChevronRight size={16} className="text-[#A0A2AB]" />
                </button>
                <LanguageMenu isOpen={langOpen} onClose={() => setLangOpen(false)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
