import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { EditorWorkspace } from './EditPdf/EditorWorkspace';
import { UploadSection } from './EditPdf/UploadSection';

export function EditPdf() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-gray-50 overflow-hidden">
      <Helmet>
        <title>Edit PDF | Online PDF Editor</title>
      </Helmet>
      {!file ? (
        <UploadSection onUpload={(f) => setFile(f)} />
      ) : (
        <EditorWorkspace file={file} />
      )}
    </div>
  );
}
