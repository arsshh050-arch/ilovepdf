import React from 'react';
import { Link } from 'react-router-dom';

interface ProductMenuItemProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  to: string;
  onClick?: () => void;
}

export function ProductMenuItem({ title, subtitle, icon, to, onClick }: ProductMenuItemProps) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-4 p-2 -ml-2 rounded-[7px] transition-colors duration-150 hover:bg-[#F6F6F8] group">
      <div className="w-[48px] h-[48px] bg-[#F6F6FA] rounded-[6px] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex flex-col justify-center">
        <span className="text-[16px] font-[500] text-[#30313A] leading-tight">{title}</span>
        <span className="text-[13px] text-[#777A84] mt-[3px] leading-tight">{subtitle}</span>
      </div>
    </Link>
  );
}
