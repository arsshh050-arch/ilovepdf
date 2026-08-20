import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument, degrees } from 'pdf-lib';
import { Sidebar } from './Sidebar';
import { RightPanel } from './RightPanel';
import { PageCanvas } from './PageCanvas';
import { Toolbar } from './Toolbar';
import { Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export type ToolMode = 'select' | 'draw' | 'highlight' | 'eraser' | 'rect' | 'circle' | 'line' | 'arrow';

interface EditorWorkspaceProps {
  file: File;
}

export function EditorWorkspace({ file }: EditorWorkspaceProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState(1);
  const [activeTool, setActiveTool] = useState<ToolMode>('draw');
  const [color, setColor] = useState('#E5322D');
  const [brushSize, setBrushSize] = useState(3);
  const [opacity, setOpacity] = useState(1);
  const [currentFile, setCurrentFile] = useState<File>(file);
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const canvasesRef = useRef<Record<number, any>>({});

  useEffect(() => {
    const handleObjectSelected = (e: any) => {
      const { fill, stroke, strokeWidth, opacity: objOpacity } = e.detail;
      if (fill && typeof fill === 'string' && fill.startsWith('#') && fill !== 'transparent') setColor(fill);
      else if (stroke && typeof stroke === 'string' && stroke.startsWith('#') && stroke !== 'transparent') setColor(stroke);
      
      if (strokeWidth) setBrushSize(Math.round(strokeWidth / scale));
      if (objOpacity !== undefined) setOpacity(objOpacity);
    };
    
    window.addEventListener('OBJECT_SELECTED', handleObjectSelected);
    return () => window.removeEventListener('OBJECT_SELECTED', handleObjectSelected);
  }, [scale]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const scrollToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > numPages) return;
    setCurrentPage(pageNumber);
    const element = document.getElementById(`page-container-${pageNumber}`);
    if (element && scrollContainerRef.current) {
      // scroll to element
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const scrollPosition = scrollContainerRef.current.scrollTop;
    const elements = Array.from(document.querySelectorAll('.pdf-page-wrapper'));
    
    for (const el of elements) {
      const rect = (el as HTMLElement).getBoundingClientRect();
      if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
        const pageNum = parseInt((el as HTMLElement).dataset.pageNumber || '1', 10);
        if (pageNum !== currentPage) setCurrentPage(pageNum);
        break;
      }
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const arrayBuffer = await currentFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      for (let i = 0; i < pages.length; i++) {
        const fabricCanvas = canvasesRef.current[i + 1];
        if (fabricCanvas) {
          // Find path objects and manually draw lines/paths via pdf-lib for perfection or just rasterize.
          // For a drawing app, users expect exact visual parity. Rasterizing the drawing layer to PNG and embedding is safest for fabric brushes.
          
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
      link.download = `edited-pdf.pdf`;
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
        onExport={handleExport}
        isExporting={isExporting}
        onUndo={() => window.dispatchEvent(new CustomEvent('UNDO_ACTION'))}
        onRedo={() => window.dispatchEvent(new CustomEvent('REDO_ACTION'))} 
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar numPages={numPages} scale={scale} setScale={setScale} file={currentFile} />
        
        <div 
          className="flex-1 overflow-auto bg-[#e5e7eb] relative flex flex-col items-center py-8 px-4" 
          id="pdf-container"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          <Document
            file={currentFile}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="text-gray-500 font-medium mt-12">Loading document...</div>}
            className="flex flex-col items-center space-y-6 pb-24"
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div 
                key={`page_${index + 1}`} 
                id={`page-container-${index + 1}`}
                data-page-number={index + 1}
                className="relative shadow-2xl bg-white select-none pdf-page-wrapper"
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
                  file={currentFile}
                  scale={scale} 
                  activeTool={activeTool}
                  color={color}
                  brushSize={brushSize}
                  opacity={opacity}
                  onCanvasReady={(c) => {
                    canvasesRef.current[index + 1] = c;
                  }}
                />
              </div>
            ))}
          </Document>
          
          {/* Bottom Floating Controls */}
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-[#e5e7eb] px-6 py-3 flex items-center space-x-6 z-30">
            <div className="flex items-center space-x-3 border-r border-[#e5e7eb] pr-6">
              <button 
                onClick={() => scrollToPage(currentPage - 1)} 
                disabled={currentPage <= 1}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">Page</span>
                <input 
                  type="number" 
                  value={currentPage} 
                  min="1" max={numPages} 
                  onChange={(e) => scrollToPage(parseInt(e.target.value))}
                  className="w-12 text-center text-sm font-medium border border-gray-200 rounded py-1 focus:outline-none focus:border-[#ef4444]" 
                />
                <span className="text-sm font-medium text-gray-500">of {numPages}</span>
              </div>

              <button 
                onClick={() => scrollToPage(currentPage + 1)} 
                disabled={currentPage >= numPages}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="flex items-center space-x-4 pl-2">
              <button onClick={() => setScale(Math.max(0.25, scale - 0.25))} className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-black transition-colors">
                <Minus size={20} />
              </button>
              <span className="text-sm font-medium text-gray-700 w-12 text-center">{Math.round(scale * 100)}%</span>
              <button onClick={() => setScale(Math.min(3, scale + 0.25))} className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-black transition-colors">
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
          opacity={opacity}
          setOpacity={setOpacity}
        />
      </div>
    </div>
  );
}
