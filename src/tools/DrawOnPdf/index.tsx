import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { EditorWorkspace } from './EditorWorkspace';
import { UploadSection } from './UploadSection';

export function DrawOnPdf() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-gray-50 overflow-hidden">
      <Helmet>
        <title>Draw on PDF Online – Free PDF Drawing Tool</title>
        <meta name="description" content="Draw, highlight, annotate and add shapes to PDF files online. Upload a PDF and draw directly on every page with our free PDF drawing tool." />
      </Helmet>
      
      {!file ? (
        <UploadSection onUpload={(f) => setFile(f)} />
      ) : (
        <EditorWorkspace file={file} />
      )}
    </div>
  );
}
