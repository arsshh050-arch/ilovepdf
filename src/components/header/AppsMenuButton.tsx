import React from 'react';
import { Grid3X3 } from 'lucide-react';

interface AppsMenuButtonProps {
  isOpen: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const AppsMenuButton = React.forwardRef<HTMLButtonElement, AppsMenuButtonProps>(
  ({ isOpen, onClick }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        aria-label="Products and applications"
        aria-expanded={isOpen}
        aria-controls="products-mega-menu"
        className={`w-[44px] h-[52px] flex items-center justify-center rounded-[8px] transition-colors cursor-pointer ${
          isOpen ? 'bg-[#F4F4F6] text-[#111111]' : 'bg-transparent text-[#111111] hover:bg-[#F4F4F6]'
        }`}
      >
        <div className="grid grid-cols-3 gap-[3px]">
          <div className="w-[4px] h-[4px] rounded-full bg-current"></div>
          <div className="w-[4px] h-[4px] rounded-full bg-current"></div>
          <div className="w-[4px] h-[4px] rounded-full bg-current"></div>
          <div className="w-[4px] h-[4px] rounded-full bg-current"></div>
          <div className="w-[4px] h-[4px] rounded-full bg-current"></div>
          <div className="w-[4px] h-[4px] rounded-full bg-current"></div>
          <div className="w-[4px] h-[4px] rounded-full bg-current"></div>
          <div className="w-[4px] h-[4px] rounded-full bg-current"></div>
          <div className="w-[4px] h-[4px] rounded-full bg-current"></div>
        </div>
      </button>
    );
  }
);
AppsMenuButton.displayName = 'AppsMenuButton';
