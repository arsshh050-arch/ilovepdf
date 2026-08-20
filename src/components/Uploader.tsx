import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, HardDrive } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GoogleDrivePickerModal } from './drive/GoogleDrivePickerModal';

interface UploaderProps {
  onFilesAccepted: (files: File[]) => void;
  accept?: Record<string, string[]>;
  acceptedTypes?: string[];
  multiple?: boolean;
  className?: string;
  buttonText?: string;
}

export function Uploader({ 
  onFilesAccepted, 
  accept, 
  acceptedTypes,
  multiple = true,
  className,
  buttonText = "Select files"
}: UploaderProps) {
  const [driveModalOpen, setDriveModalOpen] = useState(false);

  const computedAccept = accept || (acceptedTypes ? acceptedTypes.reduce((acc, curr) => {
    if (curr.startsWith('.')) {
      if (!acc['*/*']) acc['*/*'] = [];
      acc['*/*'].push(curr);
    } else {
      if (!acc[curr]) acc[curr] = [];
    }
    return acc;
  }, {} as Record<string, string[]>) : { 'application/pdf': ['.pdf'] });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFilesAccepted(acceptedFiles);
    }
  }, [onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files: File[]) => onDrop(files),
    accept: computedAccept,
    multiple,
    noClick: false,
  } as any);

  const handleOpenDriveModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDriveModalOpen(true);
  };

  return (
    <>
      <div 
        {...getRootProps()} 
        className={twMerge(
          "border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 transition-colors cursor-pointer bg-[#F7F7FA] hover:bg-gray-50 relative",
          isDragActive ? "border-[#E5322D] bg-red-50/50" : "border-[#DADCE3]",
          className
        )}
      >
        <input {...getInputProps()} />
        
        <div className="bg-[#E5322D] text-white p-4 rounded-full mb-6 shadow-md">
          <Upload size={32} />
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <button 
            type="button"
            className="bg-[#E5322D] hover:bg-[#FF4B45] text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            {buttonText}
          </button>

          {/* GOOGLE DRIVE SELECT BUTTON */}
          <button
            type="button"
            onClick={handleOpenDriveModal}
            className="w-[52px] h-[52px] bg-[#E5322D] hover:bg-[#FF4B45] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 shrink-0"
            title="Select from Google Drive"
            aria-label="Select from Google Drive"
          >
            <HardDrive size={22} />
          </button>
        </div>
        
        <p className="text-gray-500 text-sm">
          or drop PDFs here
        </p>
      </div>

      <GoogleDrivePickerModal
        isOpen={driveModalOpen}
        onClose={() => setDriveModalOpen(false)}
        onFilesSelected={(files) => onFilesAccepted(files)}
        multiSelect={multiple}
      />
    </>
  );
}

