import React from 'react';
export function TrustSection() {
  return (
    <section aria-labelledby="trust-heading" className="w-full bg-white pt-[60px] pb-[80px]">
      <div className="max-w-[1100px] mx-auto px-4 md:px-6">
        <h2 
          id="trust-heading" 
          className="text-[#33333B] font-[700] text-center text-[28px] md:text-[34px] lg:text-[40px] leading-[1.2] mb-[20px]"
        >
          Reliable document processing without the wait
        </h2>
        
        <p className="text-[#55565B] text-center text-[16px] md:text-[18px] lg:text-[20px] leading-[1.6] max-w-[900px] mx-auto font-[400]">
          Manage your files securely through our simplified browser-based workspace. Join other professionals who use our platform to efficiently merge, compress, and edit their daily documents.
        </p>
        
        <div className="mt-[60px] md:mt-[80px] flex flex-col md:flex-row justify-center items-center gap-[40px] md:gap-[80px]">
          {/* SECURE SSL */}
          <div className="flex items-center opacity-80 hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 160 40" width="160" height="40" fill="#33333B" xmlns="http://www.w3.org/2000/svg">
              <path d="M26 18 v-4 a8 8 0 0 0 -16 0 v4 h-2 v14 a2 2 0 0 0 2 2 h16 a2 2 0 0 0 2 -2 v-14 h-2 z m-12 -4 a4 4 0 0 1 8 0 v4 h-8 v-4 z" fill="#33333B" />
              <path d="M14 24 l3 3 l5 -6" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <text x="36" y="19" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="15" fill="#33333B">256-BIT TLS</text>
              <text x="36" y="30" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="9" fill="#33333B" letterSpacing="0.5">SECURE CONNECTION</text>
            </svg>
          </div>
          {/* PRIVACY */}
          <div className="flex items-center opacity-80 hover:opacity-100 transition-opacity">
             <svg viewBox="0 0 160 40" width="160" height="40" fill="#33333B" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4 L8 9 V18 C8 25 13 32 20 36 C27 32 32 25 32 18 V9 L20 4 Z" fill="none" stroke="#33333B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 20 l4 4 l8 -8" stroke="#33333B" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <text x="42" y="19" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="15" fill="#33333B">AUTO-DELETE</text>
              <text x="42" y="30" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="9" fill="#33333B" letterSpacing="0.5">FILES PURGED</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
