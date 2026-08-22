import React from 'react';
import { Uploader } from '../../components/Uploader';
import { Helmet } from 'react-helmet-async';

export function UploadSection({ onUpload }: { onUpload: (file: File) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 h-full overflow-y-auto">
      <Helmet>
        <title>Sign PDF online - ilovepdf.in</title>
        <meta name="description" content="Sign yourself or request electronic signatures from others." />
      </Helmet>
      <div className="max-w-2xl w-full text-center space-y-8 mb-16">
        <h1 className="text-4xl md:text-[40px] font-bold text-gray-900 tracking-tight">
          Sign PDF documents
        </h1>
        <p className="text-xl text-gray-600 font-medium max-w-lg mx-auto">
          Sign yourself or request electronic signatures from others.
        </p>
        <Uploader 
          onFilesAccepted={(files) => {
            if (files && files.length > 0) {
              onUpload(files[0]);
            }
          }}
          multiple={false}
        />
      </div>
    </div>
  );
}
