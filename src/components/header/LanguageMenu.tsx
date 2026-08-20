import React from 'react';
import { Check } from 'lucide-react';

interface LanguageMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LanguageMenu({ isOpen, onClose }: LanguageMenuProps) {
  if (!isOpen) return null;

  const languages = [
    { code: 'en', label: 'English', selected: true },
    { code: 'hi', label: 'Hindi', selected: false },
    { code: 'pa', label: 'Punjabi', selected: false },
  ];

  return (
    <div className="absolute right-0 top-full mt-2 w-[200px] bg-white rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-[#E1E3E8] py-2 z-50">
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="w-full flex items-center justify-between px-4 py-2 text-[14px] text-[#30313A] hover:bg-[#F6F6F8] transition-colors"
        >
          <span>{lang.label}</span>
          {lang.selected && <Check size={16} className="text-[#E5322D]" />}
        </button>
      ))}
    </div>
  );
}
