import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileDown, UploadCloud } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export function UploadSection({ onUpload }: { onUpload: (file: File) => void }) {
  const [isHovered, setIsHovered] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-[#F3F4F7] pt-24 pb-12 flex flex-col items-center justify-center px-4">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h1 className="text-[40px] font-bold text-[#272830] mb-4 leading-tight tracking-tight">Sign PDF documents</h1>
          <p className="text-xl text-gray-600">Sign yourself or request electronic signatures from others.</p>
        </div>

        <div 
          {...getRootProps()}
          className={`w-full max-w-4xl h-[400px] border-4 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden group
            ${isDragActive ? 'border-[#E5322D] bg-red-50/50' : 'border-[#E5322D] bg-[#E5322D]'}
          `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <input {...getInputProps()} />
          <div className={`absolute inset-0 bg-[#D72F2A] transition-transform duration-300 ${isHovered && !isDragActive ? 'scale-105' : 'scale-100 opacity-0'}`} />
          
          <div className="relative z-10 flex flex-col items-center">
            {isDragActive ? (
              <>
                <FileDown size={80} className="text-[#E5322D] mb-6 animate-bounce" />
                <p className="text-3xl font-bold text-[#E5322D]">Drop PDF here</p>
              </>
            ) : (
              <>
                <button className="bg-white text-[#272830] text-3xl font-bold py-6 px-12 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-4">
                  <span>Select PDF file</span>
                </button>
                <p className="text-white/80 font-medium mt-6">or drop PDF here</p>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
