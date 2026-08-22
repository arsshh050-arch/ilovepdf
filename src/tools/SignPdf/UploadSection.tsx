import React from 'react';
import { Uploader } from '../../components/Uploader';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ToolSeoSection } from '../../components/seo/ToolSeoSection';

export function UploadSection({ onUpload }: { onUpload: (file: File) => void }) {
  return (
    <main className="flex-1 flex flex-col bg-[#F7F8FC] h-full overflow-y-auto">
      <Helmet>
        <title>Sign PDF Online – Add Electronic Signatures Free | ilovepdf.in</title>
        <meta name="description" content="Sign PDF documents online for free. Draw, type, or upload your electronic signature to sign PDF contracts and agreements in seconds." />
      </Helmet>
      
      <div className="pt-8 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <Breadcrumbs
            items={[
              { label: 'PDF Tools', path: '/pdf-tools' },
              { label: 'Sign PDF', path: '/sign-pdf' }
            ]}
          />

          <div className="text-center mb-10">
            <h1 className="text-[32px] md:text-[42px] font-bold text-[#272830] mb-3 leading-tight tracking-tight">
              Sign PDF Documents Online
            </h1>
            <p className="text-base md:text-lg text-[#686B74] max-w-2xl mx-auto leading-relaxed">
              Add electronic signatures to your PDF agreements and contracts. Draw your signature freehand, type a styled signature, or upload an image signature to complete documents online without printing.
            </p>
          </div>

          <Uploader 
            onFilesAccepted={(files) => {
              if (files && files.length > 0) {
                onUpload(files[0]);
              }
            }}
            multiple={false}
            className="min-h-[350px] md:min-h-[400px] shadow-xs bg-white border border-[#E8EAEF] rounded-3xl"
            buttonText="Select files"
          />
        </div>
      </div>

      {/* SUPPORTING SEO CONTENT BELOW HERO */}
      <ToolSeoSection slug="/sign-pdf" fallbackName="Sign PDF" fallbackDesc="Sign PDF documents online" />
    </main>
  );
}
