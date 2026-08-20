import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

export function UploadSection({ onUpload }: { onUpload: (file: File) => void }) {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        onUpload(file);
      } else {
        alert('Please upload a valid PDF file.');
      }
    }
  }, [onUpload]);

  return (
    <div 
      className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Draw on PDF
        </h1>
        <p className="text-xl text-gray-600 font-medium max-w-lg mx-auto">
          Draw, annotate, highlight and add shapes to your PDF online.
        </p>
        <label className="relative inline-flex flex-col items-center justify-center cursor-pointer group">
          <div className="absolute inset-0 bg-[#E5322D] rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition duration-300"></div>
          <div className="relative px-12 py-6 bg-[#E5322D] text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
            <Upload size={32} />
            <span className="text-2xl font-semibold">Select PDF file</span>
          </div>
          <input 
            type="file" 
            accept="application/pdf" 
            className="hidden" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onUpload(e.target.files[0]);
              }
            }}
          />
        </label>
        
        <p className="text-sm text-gray-500">
          or drop PDF here
        </p>
      </div>
    </div>
  );
}
