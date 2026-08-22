import React, { useState } from 'react';
import { UploadSection } from './UploadSection';
import { EditorWorkspace } from './EditorWorkspace';
import { Helmet } from 'react-helmet-async';

export function SignPdf() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="h-[calc(100vh-64px)] w-full flex flex-col overflow-hidden bg-[#F3F4F7]">
      <Helmet>
        <title>Sign PDF online - ilovepdf.in</title>
        <meta name="description" content="Sign yourself or request electronic signatures from others." />
      </Helmet>
      {!file ? (
        <UploadSection onUpload={setFile} />
      ) : (
        <EditorWorkspace file={file} onReset={() => setFile(null)} />
      )}
    </div>
  );
}
