import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ProgressOverlayProps {
  isVisible: boolean;
  title?: string;
  subtitle?: string;
}

export function ProgressOverlay({ isVisible, title = 'Processing files...', subtitle = 'Please wait while we process your document' }: ProgressOverlayProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 300);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [isVisible]);

  if (!isVisible && progress !== 100) return null;
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 flex flex-col items-center text-center">
        <Loader2 className="w-12 h-12 text-[#E5322D] animate-spin mb-4" />
        <h3 className="text-xl font-bold text-[#272830] mb-2">{title}</h3>
        <p className="text-sm text-[#686B74] mb-6">{subtitle}</p>
        
        <div className="w-full bg-[#F0F2F5] rounded-full h-3 mb-2 overflow-hidden">
          <div 
            className="bg-[#E5322D] h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="w-full flex justify-between text-xs font-bold text-[#686B74]">
          <span>0%</span>
          <span className="text-[#E5322D]">{progress}%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}