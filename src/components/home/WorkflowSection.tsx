import React from 'react';
import { Upload, Minimize, Stamp, Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function WorkflowSection() {
  return (
    <section className="py-20 md:py-28 bg-white border-b border-[#E1E3E8]">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-[28px] md:text-[36px] font-bold text-[#30313A] mb-4">
            Chain Multiple Document Tasks
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#737680] max-w-2xl mx-auto leading-relaxed">
            Process documents more efficiently by chaining multiple actions. Upload once, apply a sequence of operations like compression or watermarking, and download the finished product.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-12">
          {/* Step 1 */}
          <div className="w-full md:w-[180px] h-[160px] bg-white border border-[#E1E3E8] rounded-[16px] flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-[12px] bg-blue-50 text-blue-600 flex items-center justify-center">
              <Upload size={24} strokeWidth={2} />
            </div>
            <span className="font-[600] text-[#30313A] text-[15px]">Upload File</span>
          </div>

          {/* Step 2 */}
          <div className="w-full md:w-[180px] h-[160px] bg-white border border-[#E1E3E8] border-t-[3px] border-t-[#E5322D] rounded-[16px] flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-[12px] bg-green-50 text-green-600 flex items-center justify-center">
              <Minimize size={24} strokeWidth={2} />
            </div>
            <span className="font-[600] text-[#30313A] text-[15px]">Compress PDF</span>
          </div>

          {/* Step 3 */}
          <div className="w-full md:w-[180px] h-[160px] bg-white border border-[#E1E3E8] border-t-[3px] border-t-[#E5322D] rounded-[16px] flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-[12px] bg-purple-50 text-purple-600 flex items-center justify-center">
              <Stamp size={24} strokeWidth={2} />
            </div>
            <span className="font-[600] text-[#30313A] text-[15px]">Add Watermark</span>
          </div>

          {/* Step 4 */}
          <div className="w-full md:w-[180px] h-[160px] bg-white border border-[#E1E3E8] rounded-[16px] flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-[12px] bg-orange-50 text-orange-500 flex items-center justify-center">
              <Download size={24} strokeWidth={2} />
            </div>
            <span className="font-[600] text-[#30313A] text-[15px]">Save Document</span>
          </div>
        </div>

        <div className="flex justify-center">
          <Link 
            to="/workflows" 
            className="inline-flex items-center gap-2 bg-[#E5322D] hover:bg-[#d42d28] text-white font-[600] py-3.5 px-8 rounded-full text-[16px] shadow-sm transition-colors"
          >
            Start Building Now
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
