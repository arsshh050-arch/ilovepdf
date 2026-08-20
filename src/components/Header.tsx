import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ChevronDown, X, Grid3X3, LogOut, User as UserIcon } from 'lucide-react';
import { ConvertPdfDropdown } from './ConvertPdfDropdown';
import { AllToolsMegaMenu } from './AllToolsMegaMenu';
import { AppsMenuButton } from './header/AppsMenuButton';
import { ProductsMegaMenu } from './header/ProductsMegaMenu';
import { MobileProductsMenu } from './header/MobileProductsMenu';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export function Header() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState<'convert' | 'all' | 'launcher' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAppsMenuOpen, setMobileAppsMenuOpen] = useState(false);

  const isMergeActive = location.pathname.startsWith('/merge-pdf');
  const isSplitActive = location.pathname.startsWith('/split-pdf');
  const isCompressActive = location.pathname.startsWith('/compress-pdf');
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const launcherRef = useRef<HTMLDivElement>(null);
  const launcherBtnRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = (menu: 'convert' | 'all') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (activeDropdown !== 'launcher') {
      setActiveDropdown(menu);
    }
  };

  const handleMouseLeave = () => {
    if (activeDropdown === 'launcher') return; // Don't auto-close launcher on mouse leave
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleLauncher = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeDropdown === 'launcher') {
      setActiveDropdown(null);
    } else {
      setActiveDropdown('launcher');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
        setMobileAppsMenuOpen(false);
        if (activeDropdown === 'launcher' && launcherBtnRef.current) {
          launcherBtnRef.current.focus();
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (activeDropdown === 'launcher') {
        if (
          launcherRef.current && 
          !launcherRef.current.contains(e.target as Node) &&
          launcherBtnRef.current &&
          !launcherBtnRef.current.contains(e.target as Node)
        ) {
          setActiveDropdown(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-[#E1E3E8] h-[56px] flex items-center relative">
        <div className="w-full px-4 md:px-6 flex items-center justify-between h-full">
          <div className="flex items-center h-full">
            {/* Logo */}
            <Link to="/" className="flex items-center mr-6 md:mr-10 h-full" onClick={() => setActiveDropdown(null)}>
              <img
                src={theme?.branding?.primaryLogo || '/ilovepdf.svg'}
                alt={theme?.branding?.logoAltText || 'iLovePDF.in'}
                style={{
                  width: theme?.branding?.desktopLogoWidth ? `${theme.branding.desktopLogoWidth}px` : 'auto',
                  maxHeight: '34px'
                }}
                className="h-7 md:h-[30px] object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/ilovepdf.svg';
                }}
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center h-full">
              <Link to="/merge-pdf" onClick={() => setActiveDropdown(null)} className={`px-[20px] h-full flex items-center text-[14px] font-[600] transition-colors ${isMergeActive ? 'text-[#E5322D]' : 'text-[#111111] hover:text-[#E5322D]'}`}>
                MERGE PDF
              </Link>
              <Link to="/split-pdf" onClick={() => setActiveDropdown(null)} className={`px-[20px] h-full flex items-center text-[14px] font-[600] transition-colors ${isSplitActive ? 'text-[#E5322D]' : 'text-[#111111] hover:text-[#E5322D]'}`}>
                SPLIT PDF
              </Link>
              <Link to="/compress-pdf" onClick={() => setActiveDropdown(null)} className={`px-[20px] h-full flex items-center text-[14px] font-[600] transition-colors ${isCompressActive ? 'text-[#E5322D]' : 'text-[#111111] hover:text-[#E5322D]'}`}>
                COMPRESS PDF
              </Link>

              {/* Convert Dropdown trigger */}
              <div 
                className="relative h-full"
                onMouseEnter={() => handleMouseEnter('convert')}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  className={`px-[20px] h-full flex items-center gap-1 text-[14px] font-[600] transition-colors ${activeDropdown === 'convert' ? 'text-[#E5322D]' : 'text-[#111111] hover:text-[#E5322D]'}`}
                  aria-expanded={activeDropdown === 'convert'}
                >
                  CONVERT PDF <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'convert' ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* All Tools Dropdown trigger */}
              <div 
                className="h-full"
                onMouseEnter={() => handleMouseEnter('all')}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  className={`px-[20px] h-full flex items-center gap-1 text-[14px] font-[600] transition-colors ${activeDropdown === 'all' ? 'text-[#E5322D]' : 'text-[#111111] hover:text-[#E5322D]'}`}
                  aria-expanded={activeDropdown === 'all'}
                >
                  ALL PDF TOOLS <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'all' ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </nav>
          </div>

          {/* Right Nav */}
          <div className="flex items-center gap-2 md:gap-4 h-full">
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-[14px] font-[500] text-[#55565B] flex items-center gap-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full" />
                  ) : (
                    <UserIcon size={16} />
                  )}
                  {user.displayName || user.email}
                </span>
                <button onClick={signOut} className="text-[#111111] hover:text-[#E5322D] transition-colors p-2" title="Sign Out">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="hidden md:flex items-center px-2 py-2 text-[14px] font-[600] text-[#111111] hover:text-[#E5322D] transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="hidden md:flex items-center justify-center bg-[#E5322D] text-white hover:bg-[#d42d28] transition-colors text-[14px] font-[600] rounded-[8px] px-[16px] py-[8px]">
                  Sign up
                </Link>
              </>
            )}
            
            <div className="hidden xl:block relative h-full flex items-center ml-2">
              <AppsMenuButton 
                ref={launcherBtnRef}
                isOpen={activeDropdown === 'launcher'} 
                onClick={toggleLauncher} 
              />
              <ProductsMegaMenu 
                ref={launcherRef}
                isOpen={activeDropdown === 'launcher'} 
                onClose={() => setActiveDropdown(null)} 
              />
            </div>

            {/* Mobile Header Buttons */}
            <div className="flex items-center xl:hidden gap-1">
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setMobileAppsMenuOpen(true)}
              >
                <Grid3X3 size={24} className="text-[#111111]" />
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} className="text-[#111111]" />
              </button>
            </div>
          </div>
        </div>

        {/* Render Hover Dropdowns */}
        {activeDropdown === 'convert' && (
          <ConvertPdfDropdown isOpen={true} onMouseEnter={() => handleMouseEnter('convert')} onMouseLeave={handleMouseLeave} />
        )}
        {activeDropdown === 'all' && (
          <AllToolsMegaMenu isOpen={true} onMouseEnter={() => handleMouseEnter('all')} onMouseLeave={handleMouseLeave} />
        )}
      </header>

      {/* Mobile Apps Menu Overlay */}
      <MobileProductsMenu isOpen={mobileAppsMenuOpen} onClose={() => setMobileAppsMenuOpen(false)} />

      {/* Mobile Main Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white xl:hidden overflow-y-auto pb-10">
          <div className="flex items-center justify-between p-4 border-b border-[#E1E3E8]">
            <Link to="/" className="flex items-center h-full max-w-[135px]" onClick={() => setMobileMenuOpen(false)}>
              <img src="/ilovepdf.svg" alt="iLovePDF.in" className="h-7 object-contain" />
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col p-4 text-[16px] font-bold text-[#111111] space-y-4">
            <Link to="/merge-pdf" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#E5322D]">MERGE PDF</Link>
            <Link to="/split-pdf" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#E5322D]">SPLIT PDF</Link>
            <Link to="/compress-pdf" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#E5322D]">COMPRESS PDF</Link>
            
            <div className="border-t border-gray-100 pt-4 mt-2">
              <span className="text-gray-400 text-[12px] uppercase tracking-wide">All Tools</span>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-3 hover:text-[#E5322D]">Go to Tools Grid</Link>
            </div>

            <div className="flex flex-col gap-3 pt-6">
              {user ? (
                <>
                  <div className="py-3 text-center text-[#55565B] flex flex-col items-center gap-2">
                    {user.photoURL && <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full" />}
                    <span>{user.displayName || user.email}</span>
                  </div>
                  <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="py-3 text-center border border-gray-300 rounded-[8px] flex items-center justify-center gap-2">
                    <LogOut size={18} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full py-3 text-center border border-gray-300 rounded-[8px]">Login</Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full py-3 text-center bg-[#E5322D] text-white rounded-[8px]">Sign up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
