import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { v4 as uuidv4 } from 'uuid';
import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';
import { RightPanel, FieldType } from './RightPanel';
import { PageCanvas } from './PageCanvas';
import { SignatureModal } from './SignatureModal';
import { SignatureRequestModal } from './SignatureRequestModal';
import { PDFDocument } from 'pdf-lib';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export interface FieldData {
  id: string;
  type: FieldType['type'];
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  value?: string; // Data URL for images/signatures, string for text
}

export function EditorWorkspace({ file, onReset }: { file: File, onReset: () => void }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [fields, setFields] = useState<FieldData[]>([]);
  const [showSigModal, setShowSigModal] = useState(false);
  const [pendingFieldId, setPendingFieldId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // When adding a new field, it drops in the center of the current page viewport
  const handleAddField = (type: FieldType['type']) => {
    const newField: FieldData = {
      id: uuidv4(),
      type,
      pageIndex: currentPage,
      x: 100, // Default coordinates, would ideally be centered based on current scroll
      y: 100,
      width: type === 'signature' || type === 'stamp' ? 200 : 150,
      height: type === 'signature' || type === 'stamp' ? 80 : 40,
    };
    
    setFields(prev => [...prev, newField]);

    if (type === 'signature' || type === 'initials') {
      setPendingFieldId(newField.id);
      setShowSigModal(true);
    }
  };

  const handleUpdateField = (id: string, data: Partial<FieldData>) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
  };

  const handleRemoveField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
  };

  const handleApplySignature = (dataUrl: string) => {
    if (pendingFieldId) {
      handleUpdateField(pendingFieldId, { value: dataUrl });
      setPendingFieldId(null);
    }
  };

  const handleSignDoc = async () => {
    setIsExporting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      for (const field of fields) {
        const page = pages[field.pageIndex - 1];
        if (!page) continue;
        
        const { height } = page.getSize();
        // PDF-lib coordinates are bottom-left based. Our UI is top-left based.
        const pdfY = height - field.y - field.height;

        if ((field.type === 'signature' || field.type === 'stamp') && field.value) {
          // It's an image
          const isPng = field.value.startsWith('data:image/png');
          const img = isPng 
            ? await pdfDoc.embedPng(field.value)
            : await pdfDoc.embedJpg(field.value); // Though we enforced PNG in modal

          page.drawImage(img, {
            x: field.x,
            y: pdfY,
            width: field.width,
            height: field.height,
          });
        } else if (field.value) {
          // Text fields
          // For a production app, we would dynamically load standard fonts
          page.drawText(field.value, {
            x: field.x,
            y: pdfY + (field.height * 0.2), // Adjust baseline visually
            size: field.height * 0.5, // approximate font size
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `signed_${file.name}`;
      link.click();
      
      // Optionally show a success screen here
    } catch (e) {
      console.error(e);
      alert('Failed to sign PDF.');
    }
    setIsExporting(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 overflow-hidden font-sans">
      <Toolbar 
        onBack={onReset} 
        fileName={file.name} 
        scale={scale} 
        setScale={setScale} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          numPages={numPages} 
          file={file} 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        
        <div className="flex-1 overflow-auto bg-[#D5D8DC] relative flex flex-col items-center py-8 px-4" id="pdf-container">
          <Document
            file={file}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<div className="text-gray-500 font-medium mt-10">Loading document...</div>}
            className="flex flex-col items-center space-y-8 pb-24"
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div 
                key={`page_${index + 1}`} 
                id={`page-${index + 1}`}
                className={`relative shadow-2xl bg-white select-none transition-shadow ${currentPage === index + 1 ? 'ring-2 ring-[#E5322D]' : ''}`}
                onMouseEnter={() => setCurrentPage(index + 1)}
              >
                <Page
                  pageNumber={index + 1}
                  scale={scale}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  className="pdf-page-canvas"
                />
                <PageCanvas 
                  pageIndex={index + 1}
                  scale={scale}
                  fields={fields.filter(f => f.pageIndex === index + 1)}
                  onUpdateField={handleUpdateField}
                  onRemoveField={handleRemoveField}
                  onEditSignature={(id) => { setPendingFieldId(id); setShowSigModal(true); }}
                />
              </div>
            ))}
          </Document>
        </div>

        <RightPanel 
          onAddField={handleAddField}
          onSignDoc={handleSignDoc}
          onMultiSign={() => setShowRequestModal(true)}
          isReady={fields.length > 0}
        />
      </div>

      {showSigModal && (
        <SignatureModal 
          onClose={() => {
            setShowSigModal(false);
            if (pendingFieldId) {
              // Only remove if it's a new empty field
              const field = fields.find(f => f.id === pendingFieldId);
              if (field && !field.value) {
                handleRemoveField(pendingFieldId);
              }
              setPendingFieldId(null);
            }
          }} 
          onApply={handleApplySignature} 
        />
      )}
      {showRequestModal && (
        <SignatureRequestModal onClose={() => setShowRequestModal(false)} />
      )}
    </div>
  );
}
