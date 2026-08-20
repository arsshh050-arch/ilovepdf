import React from 'react';
import { Globe, Shield, Laptop, Lock, Trash2, ShieldCheck, Smartphone } from 'lucide-react';

export function FeaturesOverviewSection() {
  return (
    <div className="flex flex-col w-full">
      {/* BAND 1: Work Anywhere */}
      <section className="py-20 bg-[#F7F7FA]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h2 className="text-[28px] md:text-[32px] font-bold text-[#30313A] text-center mb-12">
            Work From Anywhere
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white p-8 rounded-[16px] border border-[#E1E3E8] shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <Globe size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-[18px] font-bold text-[#30313A] mb-3">Zero Installation</h3>
              <p className="text-[14px] text-[#737680] leading-relaxed">
                Perform advanced document manipulation instantly in your browser, completely bypassing the need for desktop applications.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[16px] border border-[#E1E3E8] shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <Shield size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-[18px] font-bold text-[#30313A] mb-3">Data Privacy First</h3>
              <p className="text-[14px] text-[#737680] leading-relaxed">
                All files are securely transmitted via TLS encryption and automatically deleted from our processing servers after two hours.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[16px] border border-[#E1E3E8] shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-6">
                <Laptop size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-[18px] font-bold text-[#30313A] mb-3">Cross-Platform Access</h3>
              <p className="text-[14px] text-[#737680] leading-relaxed">
                Whether you are on a Mac, Windows PC, or mobile device, our platform provides a consistent and seamless experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BAND 2: Built for Speed */}
      <section className="py-20 bg-white border-y border-[#E1E3E8]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-[28px] md:text-[32px] font-bold text-[#30313A] mb-6 leading-tight">
            Built for speed, designed for security
          </h2>
          <p className="text-[16px] text-[#737680] max-w-2xl mx-auto leading-relaxed mb-12">
            We help individuals and businesses streamline their digital paperwork with a highly responsive, privacy-focused online workspace.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-2 text-[13px] font-[500] text-[#55565B]">
              <Lock size={18} className="text-[#E5322D]" strokeWidth={2} />
              <span>TLS encrypted transfers</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] font-[500] text-[#55565B]">
              <Trash2 size={18} className="text-[#E5322D]" strokeWidth={2} />
              <span>Auto-expiring storage</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] font-[500] text-[#55565B]">
              <ShieldCheck size={18} className="text-[#E5322D]" strokeWidth={2} />
              <span>Privacy-first architecture</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] font-[500] text-[#55565B]">
              <Smartphone size={18} className="text-[#E5322D]" strokeWidth={2} />
              <span>Responsive on all screens</span>
            </div>
          </div>
        </div>
      </section>

      {/* BAND 3: How it works */}
      <section className="py-20 bg-[#F7F7FA]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h2 className="text-[28px] md:text-[32px] font-bold text-[#30313A] text-center mb-16">
            Simple Three-Step Process
          </h2>

          <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-8">
            <div className="flex flex-col items-center text-center max-w-[280px] mx-auto">
              <div className="w-16 h-16 rounded-full border-2 border-[#E5322D] text-[#E5322D] flex items-center justify-center text-[24px] font-bold mb-6 bg-white shadow-sm">
                1
              </div>
              <h3 className="text-[18px] font-bold text-[#30313A] mb-3">Select your action</h3>
              <p className="text-[14px] text-[#737680] leading-relaxed">
                Choose the specific document utility you require from our intuitive workspace dashboard.
              </p>
            </div>

            <div className="flex flex-col items-center text-center max-w-[280px] mx-auto">
              <div className="w-16 h-16 rounded-full border-2 border-[#E5322D] text-[#E5322D] flex items-center justify-center text-[24px] font-bold mb-6 bg-white shadow-sm">
                2
              </div>
              <h3 className="text-[18px] font-bold text-[#30313A] mb-3">Drop your documents</h3>
              <p className="text-[14px] text-[#737680] leading-relaxed">
                Upload your documents securely into our browser-based processing engine.
              </p>
            </div>

            <div className="flex flex-col items-center text-center max-w-[280px] mx-auto">
              <div className="w-16 h-16 rounded-full border-2 border-[#E5322D] text-[#E5322D] flex items-center justify-center text-[24px] font-bold mb-6 bg-white shadow-sm">
                3
              </div>
              <h3 className="text-[18px] font-bold text-[#30313A] mb-3">Download instantly</h3>
              <p className="text-[14px] text-[#737680] leading-relaxed">
                Retrieve your modified files immediately after processing finishes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
