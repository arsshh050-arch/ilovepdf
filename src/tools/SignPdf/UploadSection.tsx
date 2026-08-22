import React from 'react';
import { Uploader } from '../../components/Uploader';
import { Helmet } from 'react-helmet-async';

export function UploadSection({ onUpload }: { onUpload: (file: File) => void }) {
  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-y-auto">
      <Helmet>
        <title>Sign PDF online - ilovepdf.in</title>
        <meta name="description" content="Sign yourself or request electronic signatures from others." />
      </Helmet>
      
      {/* Tool Header Section */}
      <section className="pt-20 pb-12 px-4 bg-[#F3F4F7]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#272830] mb-4">
            Sign PDF documents
          </h1>
          <p className="text-xl text-[#5B5E6B] max-w-2xl mx-auto">
            Sign yourself or request electronic signatures from others.
          </p>
        </div>
      </section>

      {/* Uploader Section */}
      <section className="pb-20 px-4 bg-[#F3F4F7] flex-1">
        <div className="max-w-3xl mx-auto">
          <Uploader 
            onFilesAccepted={(files) => {
              if (files && files.length > 0) {
                onUpload(files[0]);
              }
            }}
            multiple={false}
            buttonText="Select PDF file"
          />
        </div>
      </section>
    </div>
  );
}
