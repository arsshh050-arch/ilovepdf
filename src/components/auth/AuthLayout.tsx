import React from 'react';
import { Link } from 'react-router-dom';
import { AuthIllustration } from './AuthIllustration';
import { Layers } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  illustrationTitle: string;
  illustrationDescription: string;
}

export function AuthLayout({ children, illustrationTitle, illustrationDescription }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full bg-white font-['Inter',sans-serif]">
      {/* LEFT SIDE (Form) */}
      <div className="w-full md:w-[60%] lg:w-[60%] flex flex-col justify-center items-center p-6 md:p-12 relative min-h-screen md:min-h-0">
        
        {/* Logo top left for mobile, or centered if preferred, let's keep it top left as standard */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-[#E5322D] p-1.5 rounded-md">
              <Layers className="text-white" size={24} />
            </div>
            <span className="text-[22px] font-bold text-[#30313A]">ilovepdf<span className="text-[#E5322D]">.in</span></span>
          </Link>
        </div>

        <div className="w-full max-w-[440px] mt-16 md:mt-0">
          {children}
        </div>
      </div>

      {/* RIGHT SIDE (Illustration panel) */}
      <div className="hidden md:flex w-full md:w-[40%] lg:w-[40%] bg-[#F5F6FA] flex-col justify-center items-center p-12 text-center border-l border-[#E1E3E8]">
        <AuthIllustration />
        
        <h2 className="text-[24px] font-[600] text-[#272830] mt-8 mb-4 max-w-[360px]">
          {illustrationTitle}
        </h2>
        
        <p className="text-[16px] text-[#686B74] leading-relaxed max-w-[360px] mb-8">
          {illustrationDescription}
        </p>
        
        <Link 
          to="/pdf-tools" 
          className="inline-flex items-center text-[#E5322D] font-[600] hover:text-[#d42d28] transition-colors"
        >
          See all tools ↓
        </Link>
      </div>
    </div>
  );
}
