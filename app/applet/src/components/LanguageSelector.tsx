import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { LANGUAGES, getLanguageByCode } from '../i18n/languages';
import { useTranslation } from 'react-i18next';

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const currentLang = getLanguageByCode(i18n.language || 'en');

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    
    // Update HTML lang and dir attributes
    const lang = getLanguageByCode(langCode);
    document.documentElement.lang = lang.code;
    document.documentElement.dir = lang.direction;
    
    // Save preference
    localStorage.setItem('i18nextLng', langCode);
    
    // Calculate new URL
    // Our routing logic: default 'en' is at root /, localized is at /:locale/
    // We parse the current location to swap the locale
    const currentPath = location.pathname;
    
    // Match current possible locales at start of path
    const pathParts = currentPath.split('/').filter(Boolean);
    const supportedCodes = LANGUAGES.map(l => l.code);
    
    let isCurrentPathLocalized = false;
    let pathWithoutLocale = currentPath;
    
    if (pathParts.length > 0 && supportedCodes.includes(pathParts[0])) {
      isCurrentPathLocalized = true;
      pathWithoutLocale = '/' + pathParts.slice(1).join('/');
    }
    
    if (pathWithoutLocale === '') pathWithoutLocale = '/';
    
    let newUrl = pathWithoutLocale;
    if (langCode !== 'en') {
      newUrl = `/${langCode}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    }
    
    // Preserve search params and hash
    newUrl += location.search + location.hash;
    
    navigate(newUrl);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors py-2"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="language-menu"
      >
        <Globe size={18} />
        <span className="text-sm font-medium">{currentLang.nativeName}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Mobile Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Panel */}
          <div 
            id="language-menu"
            className="fixed md:absolute bottom-0 md:bottom-full left-0 md:left-0 w-full md:w-[480px] md:mb-2 bg-white rounded-t-2xl md:rounded-xl shadow-2xl z-50 overflow-hidden transform transition-all duration-300 ease-out flex flex-col max-h-[85vh] md:max-h-none"
            role="menu"
          >
            {/* Mobile Header */}
            <div className="md:hidden p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="font-semibold text-gray-900 text-lg">Choose language</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-900 bg-gray-50 rounded-full"
                aria-label="Close language selector"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="p-2 md:p-4 overflow-y-auto overscroll-contain">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    role="menuitem"
                    className={`flex items-center justify-between px-4 md:px-3 py-3 md:py-2 text-sm rounded-lg hover:bg-red-50 hover:text-[#E5322D] transition-colors text-left min-h-[44px] ${
                      currentLang.code === lang.code 
                        ? 'bg-red-50 text-[#E5322D] font-medium' 
                        : 'text-gray-700'
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    {currentLang.code === lang.code && (
                      <Check size={16} className="text-[#E5322D] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
