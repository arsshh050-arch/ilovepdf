import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';
import { PageCanvas } from './PageCanvas';
import { PDFDocument, degrees } from 'pdf-lib';
import { Download, Plus, Minus } from 'lucide-react';

import { RightPanel } from './RightPanel';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export type ToolMode = 'select' | 'text' | 'edit-text' | 'draw' | 'rect' | 'circle' | 'image' | 'stamp' | 'form-text' | 'form-check' | 'highlight' | 'eraser' | 'line' | 'arrow';

export function EditorWorkspace({ file }: { file: File }) {
  const [currentFile, setCurrentFile] = useState<File>(file);
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState(1);
  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [fontSize, setFontSize] = useState(16);
  
  // Ref to hold the modified PDF
  const [isExporting, setIsExporting] = useState(false);
  const canvasesRef = useRef<Record<number, any>>({}); // To store fabric instances

  useEffect(() => {
    const handleObjectSelected = (e: any) => {
      const { type, fill, stroke, strokeWidth, fontSize: newFontSize } = e.detail;
      
      // Update global properties to match selected object
      if (fill && typeof fill === 'string' && fill.startsWith('#')) setColor(fill);
      else if (stroke && typeof stroke === 'string' && stroke.startsWith('#')) setColor(stroke);
      
      if (strokeWidth) setBrushSize(Math.round(strokeWidth / scale));
      if (newFontSize) setFontSize(Math.round(newFontSize / scale));
    };

    window.addEventListener('OBJECT_SELECTED', handleObjectSelected);
    return () => window.removeEventListener('OBJECT_SELECTED', handleObjectSelected);
  }, [scale]);

  useEffect(() => {
    const handlePageAction = async (e: any) => {
      const { action, index } = e.detail;
      try {
        const arrayBuffer = await currentFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        
        if (action === 'delete') {
          if (pdfDoc.getPageCount() <= 1) {
            alert('Cannot delete the last page.');
            return;
          }
          pdfDoc.removePage(index);
        } else if (action === 'duplicate') {
          const [copiedPage] = await pdfDoc.copyPages(pdfDoc, [index]);
          pdfDoc.insertPage(index + 1, copiedPage);
        } else if (action === 'rotate') {
          const page = pdfDoc.getPage(index);
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + 90));
        }

        const pdfBytes = await pdfDoc.save();
        const newFile = new File([pdfBytes], currentFile.name, { type: 'application/pdf' });
        setCurrentFile(newFile);
        
        // Reset canvases for pages after the modified index if needed, 
        // but since react-pdf will unmount and remount we might be fine, 
        // though we should clear our canvasesRef to prevent ghosting.
        canvasesRef.current = {};
      } catch (err) {
        console.error('Error modifying PDF pages', err);
      }
    };

    window.addEventListener('PAGE_ACTION', handlePageAction);
    return () => window.removeEventListener('PAGE_ACTION', handlePageAction);
  }, [currentFile]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const arrayBuffer = await currentFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      // We will export fabric canvases as images or vector data.
      for (let i = 0; i < pages.length; i++) {
        const fabricCanvas = canvasesRef.current[i + 1];
        if (fabricCanvas) {
          // Find form fields and render them natively in pdf-lib instead of png rasterization
          const objects = fabricCanvas.getObjects();
          const formFields = objects.filter((o: any) => o.isFormField);
          
          if (formFields.length > 0) {
            const form = pdfDoc.getForm();
            formFields.forEach((field: any, idx: number) => {
              const page = pages[i];
              const { height } = page.getSize();
              // Fabric coordinates are from top-left, pdf-lib from bottom-left
              const y = height - (field.top! / scale) - (field.height! / scale);
              const x = field.left! / scale;
              const w = field.width! / scale;
              const h = field.height! / scale;
              
              if (field.formType === 'text') {
                const textField = form.createTextField(`field_${i}_${idx}`);
                textField.addToPage(page, { x, y, width: w, height: h });
              } else if (field.formType === 'checkbox') {
                const checkBox = form.createCheckBox(`check_${i}_${idx}`);
                checkBox.addToPage(page, { x, y, width: w, height: h });
              }
              // Remove the form fields from the canvas so they don't get rasterized
              fabricCanvas.remove(field);
            });
          }

          // Export text layers and masking rects natively
          const nativeObjects = objects.filter((o: any) => o.type === 'i-text' || o.type === 'rect');
          if (nativeObjects.length > 0) {
            for (const obj of nativeObjects) {
              const page = pages[i];
              const { height } = page.getSize();
              
              // Fabric coordinates are from top-left, pdf-lib from bottom-left
              const x = obj.left! / scale;
              const y = height - (obj.top! / scale) - ((obj.height || 0) / scale * (obj.scaleY || 1));
              
              if (obj.type === 'rect') {
                const w = ((obj.width || 0) * (obj.scaleX || 1)) / scale;
                const h = ((obj.height || 0) * (obj.scaleY || 1)) / scale;
                
                // Parse fill color
                let r=1, g=1, b=1, opacity=1;
                if (obj.fill === '#ffffff') {
                  r=1; g=1; b=1;
                } else if (typeof obj.fill === 'string' && obj.fill.startsWith('#')) {
                  const hex = obj.fill.replace('#', '');
                  r = parseInt(hex.substring(0, 2), 16) / 255 || 0;
                  g = parseInt(hex.substring(2, 4), 16) / 255 || 0;
                  b = parseInt(hex.substring(4, 6), 16) / 255 || 0;
                }
                
                // Draw mask rectangle
                import('pdf-lib').then(({ rgb }) => {
                   page.drawRectangle({
                    x, y, width: w, height: h,
                    color: rgb(r, g, b),
                  });
                });
              }
              // i-text is natively rendered if it's the injected text replacement, however,
              // for robust font handling in pdf-lib across multiple languages, we can just 
              // keep it in the rasterized PNG layer for perfectly identical visual reproduction,
              // BUT we will also inject invisible text underneath it for text selection/searchability!
              
              if (obj.type === 'i-text') {
                 // The text will be visually rasterized in the PNG to preserve exact font rendering,
                 // but we also add an invisible text layer to the PDF for search/selection.
                 const textStr = (obj as any).text || '';
                 const fontSize = ((obj as any).fontSize || 16) / scale;
                 
                 import('pdf-lib').then(async ({ rgb, StandardFonts }) => {
                   const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
                   page.drawText(textStr, {
                     x, 
                     y: y + (fontSize * 0.2), // baseline adjustment
                     size: fontSize,
                     font: helvetica,
                     color: rgb(0,0,0),
                     opacity: 0, // INVISIBLE TEXT FOR SEARCHABILITY!
                   });
                 });
              }
            }
          }

          const dataUrl = fabricCanvas.toDataURL({ format: 'png' });
          if (dataUrl === 'data:,') continue; // empty canvas
          
          const img = await pdfDoc.embedPng(dataUrl);
          const page = pages[i];
          const { width, height } = page.getSize();
          
          page.drawImage(img, {
            x: 0,
            y: 0,
            width: width,
            height: height,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `edited_${file.name}`;
      link.click();
    } catch (err) {
      console.error(err);
      alert('Error exporting PDF');
    }
    setIsExporting(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 overflow-hidden text-gray-800 font-sans">
      <Toolbar 
        activeTool={activeTool} 
        setActiveTool={setActiveTool} 
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onExport={handleExport}
        isExporting={isExporting}
        onUndo={() => window.dispatchEvent(new CustomEvent('UNDO_ACTION'))}
        onRedo={() => {}} // simple implementation just removes last object for undo
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar numPages={numPages} scale={scale} setScale={setScale} file={currentFile} />
        <div className="flex-1 overflow-auto bg-gray-300 relative flex flex-col items-center py-8 px-4" id="pdf-container">
          <Document
            file={currentFile}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="text-gray-500 font-medium">Loading document...</div>}
            className="flex flex-col items-center space-y-6 pb-24"
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div key={`page_${index + 1}`} className="relative shadow-2xl bg-white select-none">
                <Page
                  pageNumber={index + 1}
                  scale={scale}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  className="pdf-page-canvas"
                />
                <PageCanvas 
                  pageIndex={index + 1} 
                  file={currentFile}
                  scale={scale} 
                  activeTool={activeTool}
                  color={color}
                  brushSize={brushSize}
                  fontSize={fontSize}
                  onCanvasReady={(c) => {
                    canvasesRef.current[index + 1] = c;
                  }}
                />
              </div>
            ))}
          </Document>
          
          {/* Bottom Floating Controls */}
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-[#e5e7eb] px-6 py-3 flex items-center space-x-6 z-30">
            <div className="flex items-center space-x-2 border-r border-[#e5e7eb] pr-6">
              <span className="text-sm font-medium text-gray-500">Page</span>
              <input type="number" defaultValue="1" min="1" max={numPages} className="w-12 text-center text-sm font-medium border border-gray-200 rounded py-1 focus:outline-none focus:border-[#ef4444]" />
              <span className="text-sm font-medium text-gray-500">of {numPages}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button onClick={() => setScale(Math.max(0.25, scale - 0.25))} className="text-gray-500 hover:text-black transition-colors">
                <Minus size={20} />
              </button>
              <span className="text-sm font-medium text-gray-700 w-12 text-center">{Math.round(scale * 100)}%</span>
              <button onClick={() => setScale(Math.min(3, scale + 0.25))} className="text-gray-500 hover:text-black transition-colors">
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>
        <RightPanel 
          activeTool={activeTool} 
          color={color} 
          setColor={setColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          fontSize={fontSize}
          setFontSize={setFontSize}
        />
      </div>
    </div>
  );
}
