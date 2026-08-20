import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';

export function ResultInfoBar() {
  return (
    <div className="w-full max-w-2xl bg-[#EEF1F8] border border-[#D0D5E2] rounded-xl p-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
      <div className="flex items-center gap-2.5">
        <LayoutGrid size={18} className="text-[#E5322D] shrink-0" />
        <p className="text-sm font-medium text-[#272830]">
          Need another document task? Explore all PDF tools.
        </p>
      </div>

      <Link
        to="/"
        className="px-4 py-2 bg-white hover:bg-gray-50 border border-[#D0D5E2] rounded-lg text-xs font-bold text-[#272830] transition-all hover:border-[#E5322D] shrink-0 shadow-2xs"
      >
        Browse all tools
      </Link>
    </div>
  );
}
