import React, { useState, useRef, useEffect } from 'react';
import { Plus, Monitor, HardDrive, Box } from 'lucide-react';
import { GoogleDrivePickerModal } from '../drive/GoogleDrivePickerModal';

interface AddPdfButtonProps {
  totalFiles: number;
  onFilesSelected: (files: File[]) => void;
  onShowToast: (msg: string) => void;
}

export function AddPdfButton({ totalFiles, onFilesSelected, onShowToast }: AddPdfButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside or ESC key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLocalFileClick = () => {
    setIsOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files) as File[];
      onFilesSelected(filesArray);
      // Reset input value so re-uploading same file works
      e.target.value = '';
    }
  };

  const handleGoogleDriveClick = () => {
    setIsOpen(false);
    setDriveModalOpen(true);
  };

  const handleCloudClick = (providerName: string) => {
    setIsOpen(false);
    onShowToast(`${providerName} integration requires account connection.`);
  };

  return (
    <>
      <div ref={containerRef} className="relative z-40">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
        />

        {/* EXPANDED MENU */}
        {isOpen && (
          <div className="absolute right-0 bottom-16 flex flex-col items-center gap-3 bg-white p-3 rounded-2xl shadow-2xl border border-[#E0E2E8] animate-in fade-in slide-in-from-bottom-2 duration-200 min-w-[200px] z-50">
            {/* LOCAL COMPUTER */}
            <button
              type="button"
              onClick={handleLocalFileClick}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F5F9] text-[#272830] transition-colors text-left group cursor-pointer"
              title="Select PDF files from your computer"
            >
              <div className="w-9 h-9 rounded-full bg-[#FFF0EE] text-[#E5322D] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Monitor size={18} />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[13px] text-[#272830]">From Computer</span>
                <span className="text-[11px] text-[#737680]">Local device files</span>
              </div>
            </button>

            {/* GOOGLE DRIVE */}
            <button
              type="button"
              onClick={handleGoogleDriveClick}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F5F9] text-[#272830] transition-colors text-left group cursor-pointer"
              title="Add from Google Drive"
            >
              <div className="w-9 h-9 rounded-full bg-[#EBF3FE] text-[#1A73E8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <HardDrive size={18} />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[13px] text-[#272830]">Google Drive</span>
                <span className="text-[11px] text-[#737680]">Import from cloud</span>
              </div>
            </button>

            {/* DROPBOX */}
            <button
              type="button"
              onClick={() => handleCloudClick('Dropbox')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F4F5F9] text-[#272830] transition-colors text-left group cursor-pointer"
              title="Add from Dropbox"
            >
              <div className="w-9 h-9 rounded-full bg-[#EEF5FC] text-[#0061FF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Box size={18} />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[13px] text-[#272830]">Dropbox</span>
                <span className="text-[11px] text-[#737680]">Import from Dropbox</span>
              </div>
            </button>
          </div>
        )}

        {/* MAIN RED (+) FLOATING BUTTON */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-[52px] h-[52px] bg-[#E5322D] hover:bg-[#C92A26] text-white rounded-full flex items-center justify-center shadow-[0_3px_8px_rgba(0,0,0,0.18)] hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer ${
              isOpen ? 'rotate-45' : ''
            }`}
            aria-label="Add more PDF files"
            title="Add more files"
          >
            <Plus size={28} className="transition-transform duration-200" />
          </button>

          {/* COUNTER BADGE */}
          {totalFiles > 0 && (
            <div
              className="absolute -top-1 -left-1 bg-[#202126] text-white border-2 border-[#E5322D] rounded-full min-w-[22px] h-[22px] px-1 text-[11px] font-bold flex items-center justify-center shadow-sm pointer-events-none"
              aria-label={`Current files: ${totalFiles}`}
            >
              {totalFiles}
            </div>
          )}
        </div>
      </div>

      <GoogleDrivePickerModal
        isOpen={driveModalOpen}
        onClose={() => setDriveModalOpen(false)}
        onFilesSelected={(files) => onFilesSelected(files)}
        multiSelect={true}
      />
    </>
  );
}
