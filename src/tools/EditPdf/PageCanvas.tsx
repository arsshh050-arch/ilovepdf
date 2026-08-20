import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { pdfjs } from 'react-pdf';

interface PageCanvasProps {
  pageIndex: number;
  file?: File;
  scale: number;
  activeTool: string;
  color: string;
  brushSize: number;
  fontSize: number;
  onCanvasReady: (canvas: fabric.Canvas) => void;
}

export function PageCanvas({ pageIndex, file, scale, activeTool, color, brushSize, fontSize, onCanvasReady }: PageCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    // We need to wait for react-pdf to render the page to get its size
    // For now we use ResizeObserver on the container
    const container = containerRef.current;
    if (!container) return;

    let canvas = canvasRef.current;
    
    if (!canvas) {
      canvas = new fabric.Canvas(`fabric-canvas-${pageIndex}`, {
        isDrawingMode: false,
        selection: false,
      });
      canvasRef.current = canvas;
      onCanvasReady(canvas);
    }

    const parent = container.parentElement;
    if (parent) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            canvas!.setDimensions({ width, height });
            // Update zoom based on scale
            canvas!.setZoom(scale);
          }
        }
      });
      resizeObserver.observe(parent);
      return () => resizeObserver.disconnect();
    }
  }, [pageIndex, onCanvasReady]);

  // Handle Tool Changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = activeTool === 'draw' || activeTool === 'highlight';
    canvas.selection = activeTool === 'select';
    
    // Set individual objects selectable based on active tool
    canvas.forEachObject((obj) => {
      obj.selectable = activeTool === 'select';
      obj.evented = activeTool === 'select';
    });

    if (canvas.isDrawingMode) {
      if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      }
      if (activeTool === 'highlight') {
        canvas.freeDrawingBrush.color = `${color}66`; // 40% opacity hex
        canvas.freeDrawingBrush.width = 15 * scale;
      } else {
        canvas.freeDrawingBrush.color = color;
        canvas.freeDrawingBrush.width = brushSize * scale;
      }
    }
    
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
      activeObject.set('fill', color);
      canvas.renderAll();
    }

    // Unbind previous events
    canvas.off('mouse:down');
    
    // Unbind previous move/up for tools
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    
    if (activeTool === 'text') {
      canvas.on('mouse:down', (o) => {
        if (activeTool !== 'text') return;
        const pointer = canvas.getScenePoint(o.e);
        const text = new fabric.IText('Type here', {
          left: pointer.x / scale,
          top: pointer.y / scale,
          fontFamily: 'Helvetica',
          fontSize: fontSize,
          fill: color,
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        text.selectAll();
      });
    } else if (activeTool === 'edit-text') {
      let isExtracting = false;
      canvas.on('mouse:down', async (o) => {
        if (activeTool !== 'edit-text' || isExtracting || !file) return;
        isExtracting = true;
        const pointer = canvas.getScenePoint(o.e);
        const clickX = pointer.x / scale;
        const clickY = pointer.y / scale;

        try {
          const loadingTask = pdfjs.getDocument(URL.createObjectURL(file));
          const pdf = await loadingTask.promise;
          const page = await pdf.getPage(pageIndex);
          const textContent = await page.getTextContent();
          
          let closestItem = null;
          let minDistance = Infinity;
          
          for (const item of textContent.items) {
            if (!('transform' in item)) continue;
            
            const itemX = item.transform[4];
            const itemY = page.getViewport({ scale: 1 }).height - item.transform[5];
            
            const dist = Math.sqrt(Math.pow(clickX - itemX, 2) + Math.pow(clickY - itemY, 2));
            if (dist < minDistance && dist < 50) {
              minDistance = dist;
              closestItem = item;
            }
          }
          
          if (closestItem) {
            const itemX = closestItem.transform[4];
            const itemY = page.getViewport({ scale: 1 }).height - closestItem.transform[5];
            const itemHeight = closestItem.height || 12;
            const itemWidth = closestItem.width || 50;

            const rect = new fabric.Rect({
              left: itemX,
              top: itemY - itemHeight,
              width: itemWidth + 4,
              height: itemHeight + 4,
              fill: '#ffffff',
              selectable: false,
              evented: false,
            });
            
            const text = new fabric.IText(closestItem.str, {
              left: itemX,
              top: itemY - itemHeight,
              fontFamily: closestItem.fontName || 'Helvetica',
              fontSize: itemHeight,
              fill: '#000000',
            });
            
            canvas.add(rect, text);
            canvas.setActiveObject(text);
            text.enterEditing();
            text.selectAll();
            canvas.renderAll();
          } else {
            // OCR Fallback for scanned PDFs / Images
            import('tesseract.js').then((Tesseract) => {
              const pageElement = document.querySelector(`[data-page-number="${pageIndex}"] canvas`) as HTMLCanvasElement;
              if (!pageElement) return;

              // Show loading indicator
              const loadingText = new fabric.IText('Detecting text (OCR)...', {
                left: clickX,
                top: clickY,
                fontFamily: 'Helvetica',
                fontSize: 12,
                fill: '#ef4444',
              });
              canvas.add(loadingText);
              canvas.renderAll();

              // Capture a region around the click for faster OCR
              const cropSize = 150 * scale;
              const cropCanvas = document.createElement('canvas');
              cropCanvas.width = cropSize;
              cropCanvas.height = cropSize;
              const ctx = cropCanvas.getContext('2d');
              
              if (ctx) {
                // Source x,y are based on the scaled canvas rendered by react-pdf
                const sx = (clickX * scale) - (cropSize / 2);
                const sy = (clickY * scale) - (cropSize / 2);
                
                ctx.drawImage(pageElement, sx, sy, cropSize, cropSize, 0, 0, cropSize, cropSize);
                
                Tesseract.recognize(cropCanvas.toDataURL(), 'eng')
                  .then(({ data: { text } }) => {
                    canvas.remove(loadingText);
                    const cleanText = text.trim();
                    
                    if (cleanText) {
                      const rect = new fabric.Rect({
                        left: clickX - 30,
                        top: clickY - 10,
                        width: Math.max(80, cleanText.length * 8),
                        height: 24,
                        fill: '#ffffff',
                        selectable: false,
                        evented: false,
                      });
                      
                      const newText = new fabric.IText(cleanText, {
                        left: clickX - 30,
                        top: clickY - 10,
                        fontFamily: 'Helvetica',
                        fontSize: 14,
                        fill: '#000000',
                      });
                      
                      canvas.add(rect, newText);
                      canvas.setActiveObject(newText);
                      newText.enterEditing();
                      newText.selectAll();
                    } else {
                      // fallback to standard empty text if OCR fails
                      const newText = new fabric.IText('Type here', {
                        left: clickX,
                        top: clickY,
                        fontFamily: 'Helvetica',
                        fontSize: 14,
                        fill: color,
                      });
                      canvas.add(newText);
                      canvas.setActiveObject(newText);
                      newText.enterEditing();
                    }
                    canvas.renderAll();
                  })
                  .catch(err => {
                    console.error("OCR Failed:", err);
                    canvas.remove(loadingText);
                    canvas.renderAll();
                  });
              }
            });
          }
        } catch (e) {
          console.error(e);
        }
        isExtracting = false;
      });
    } else if (activeTool === 'rect') {
      canvas.on('mouse:down', (o) => {
        if (activeTool !== 'rect') return;
        const pointer = canvas.getScenePoint(o.e);
        const rect = new fabric.Rect({
          left: pointer.x / scale,
          top: pointer.y / scale,
          width: 100,
          height: 100,
          fill: 'transparent',
          stroke: color,
          strokeWidth: brushSize,
        });
        canvas.add(rect);
        canvas.setActiveObject(rect);
      });
    } else if (activeTool === 'circle') {
      canvas.on('mouse:down', (o) => {
        if (activeTool !== 'circle') return;
        const pointer = canvas.getScenePoint(o.e);
        const circle = new fabric.Circle({
          left: pointer.x / scale,
          top: pointer.y / scale,
          radius: 50,
          fill: 'transparent',
          stroke: color,
          strokeWidth: brushSize,
        });
        canvas.add(circle);
        canvas.setActiveObject(circle);
      });
    } else if (activeTool === 'form-text') {
      canvas.on('mouse:down', (o) => {
        if (activeTool !== 'form-text') return;
        const pointer = canvas.getScenePoint(o.e);
        const rect = new fabric.Rect({
          left: pointer.x / scale,
          top: pointer.y / scale,
          width: 150,
          height: 30,
          fill: '#e5f3ff',
          stroke: '#0078d4',
          strokeWidth: 1,
          opacity: 0.7
        });
        const text = new fabric.IText('Text Field', {
          left: (pointer.x / scale) + 5,
          top: (pointer.y / scale) + 5,
          fontFamily: 'Helvetica',
          fontSize: 14,
          fill: '#0078d4',
        });
        const group = new fabric.Group([rect, text], {
          left: pointer.x / scale,
          top: pointer.y / scale,
        });
        (group as any).isFormField = true;
        (group as any).formType = 'text';
        canvas.add(group);
        canvas.setActiveObject(group);
      });
    } else if (activeTool === 'line') {
      let isDrawing = false;
      let line: fabric.Line;
      canvas.on('mouse:down', (o) => {
        isDrawing = true;
        const pointer = canvas.getScenePoint(o.e);
        const currentX = pointer.x / scale;
        const currentY = pointer.y / scale;
        line = new fabric.Line([currentX, currentY, currentX, currentY], {
          stroke: color,
          strokeWidth: brushSize,
        });
        canvas.add(line);
      });
      canvas.on('mouse:move', (o) => {
        if (!isDrawing) return;
        const pointer = canvas.getScenePoint(o.e);
        line.set({ x2: pointer.x / scale, y2: pointer.y / scale });
        canvas.renderAll();
      });
      canvas.on('mouse:up', () => {
        isDrawing = false;
        canvas.setActiveObject(line);
      });
    } else if (activeTool === 'arrow') {
      let isDrawing = false;
      let line: fabric.Line;
      let triangle: fabric.Triangle;
      let group: fabric.Group;
      
      canvas.on('mouse:down', (o) => {
        isDrawing = true;
        const pointer = canvas.getScenePoint(o.e);
        const currentX = pointer.x / scale;
        const currentY = pointer.y / scale;
        line = new fabric.Line([currentX, currentY, currentX, currentY], {
          stroke: color,
          strokeWidth: brushSize,
          originX: 'center',
          originY: 'center',
        });
        triangle = new fabric.Triangle({
          width: brushSize * 4,
          height: brushSize * 4,
          fill: color,
          left: currentX,
          top: currentY,
          originX: 'center',
          originY: 'center',
        });
        canvas.add(line, triangle);
      });
      canvas.on('mouse:move', (o) => {
        if (!isDrawing) return;
        const pointer = canvas.getScenePoint(o.e);
        const currentX = pointer.x / scale;
        const currentY = pointer.y / scale;
        line.set({ x2: currentX, y2: currentY });
        triangle.set({ left: currentX, top: currentY });
        
        const dx = currentX - line.x1;
        const dy = currentY - line.y1;
        let angle = Math.atan2(dy, dx) * 180 / Math.PI;
        triangle.set({ angle: angle + 90 });
        
        canvas.renderAll();
      });
      canvas.on('mouse:up', () => {
        isDrawing = false;
        // Group them
        canvas.remove(line, triangle);
        group = new fabric.Group([line, triangle]);
        canvas.add(group);
        canvas.setActiveObject(group);
      });
    } else if (activeTool === 'eraser') {
      canvas.on('mouse:down', (o) => {
        if (o.target) {
          canvas.remove(o.target);
        }
      });
    } else if (activeTool === 'form-check') {
      canvas.on('mouse:down', (o) => {
        if (activeTool !== 'form-check') return;
        const pointer = canvas.getScenePoint(o.e);
        const rect = new fabric.Rect({
          left: pointer.x / scale,
          top: pointer.y / scale,
          width: 20,
          height: 20,
          fill: '#e5f3ff',
          stroke: '#0078d4',
          strokeWidth: 1,
        });
        (rect as any).isFormField = true;
        (rect as any).formType = 'checkbox';
        canvas.add(rect);
        canvas.setActiveObject(rect);
      });
    }

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (!canvas) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          // Do not delete if currently editing text
          if (activeObject.type === 'i-text' && (activeObject as fabric.IText).isEditing) {
            return;
          }
          canvas.remove(activeObject);
          canvas.discardActiveObject();
        }
      }
      
      // Undo (Ctrl+Z or Cmd+Z)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('UNDO_ACTION'));
      }
      
      // Copy (Ctrl+C or Cmd+C)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        const activeObject = canvas.getActiveObject();
        if (activeObject && !(activeObject.type === 'i-text' && (activeObject as fabric.IText).isEditing)) {
          activeObject.clone().then((cloned) => {
            (window as any)._clipboard = cloned;
          });
        }
      }

      // Paste (Ctrl+V or Cmd+V)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        const clipboard = (window as any)._clipboard;
        if (clipboard) {
          clipboard.clone().then((clonedObj: any) => {
            canvas.discardActiveObject();
            clonedObj.set({
              left: clonedObj.left + 20,
              top: clonedObj.top + 20,
              evented: true,
            });
            if (clonedObj.type === 'activeSelection') {
              clonedObj.canvas = canvas;
              clonedObj.forEachObject((obj: any) => {
                canvas.add(obj);
              });
              clonedObj.setCoords();
            } else {
              canvas.add(clonedObj);
            }
            (window as any)._clipboard = clonedObj;
            canvas.setActiveObject(clonedObj);
            canvas.renderAll();
          });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const handleAddStamp = (e: any) => {
      if (!canvas) return;
      const text = e.detail;
      const stamp = new fabric.IText(text, {
        left: 50 * scale,
        top: 50 * scale,
        fontFamily: 'Helvetica',
        fontSize: 32 * scale,
        fill: '#E5322D',
        fontWeight: 'bold',
        opacity: 0.8,
        angle: -15
      });
      canvas.add(stamp);
      canvas.setActiveObject(stamp);
    };

    const handleAddImage = (e: any) => {
      if (!canvas) return;
      const dataUrl = e.detail;
      fabric.FabricImage.fromURL(dataUrl).then((img) => {
        img.scaleToWidth(200 * scale);
        img.set({
          left: 50 * scale,
          top: 50 * scale
        });
        canvas.add(img);
        canvas.setActiveObject(img);
      });
    };

    const handleFormatText = (e: any) => {
      if (!canvas) return;
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === 'i-text') {
        const textObj = activeObject as fabric.IText;
        const format = e.detail;
        if (format === 'bold') {
          textObj.set('fontWeight', textObj.fontWeight === 'bold' ? 'normal' : 'bold');
        } else if (format === 'italic') {
          textObj.set('fontStyle', textObj.fontStyle === 'italic' ? 'normal' : 'italic');
        } else if (format === 'underline') {
          textObj.set('underline', !textObj.underline);
        }
        canvas.renderAll();
      }
    };

    const handleUpdateTextStyle = (e: any) => {
      if (!canvas) return;
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === 'i-text') {
        activeObject.set(e.detail);
        canvas.renderAll();
      }
    };

    window.addEventListener('ADD_STAMP', handleAddStamp);
    window.addEventListener('ADD_IMAGE', handleAddImage);
    window.addEventListener('FORMAT_TEXT', handleFormatText);
    window.addEventListener('UPDATE_TEXT_STYLE', handleUpdateTextStyle);

    // Basic undo/redo via object state tracking (for a single canvas, a robust one is complex)
    // We can at least hook up a simple object remove for 'undo' if we wanted, 
    // but full state history per page is complex. We will implement simple undo/redo event listeners.
    const handleUndo = () => {
      if (!canvas) return;
      const objects = canvas.getObjects();
      if (objects.length > 0) {
        const last = objects[objects.length - 1];
        canvas.remove(last);
      }
    };
    
    window.addEventListener('UNDO_ACTION', handleUndo);

    // Send selection updates back to window to sync with RightPanel if we had one
    const handleSelection = () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        window.dispatchEvent(new CustomEvent('OBJECT_SELECTED', { 
          detail: { 
            type: activeObject.type, 
            fill: activeObject.fill,
            stroke: activeObject.stroke,
            strokeWidth: activeObject.strokeWidth,
            fontSize: (activeObject as any).fontSize
          } 
        }));
      }
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);

    return () => {
      window.removeEventListener('ADD_STAMP', handleAddStamp);
      window.removeEventListener('ADD_IMAGE', handleAddImage);
      window.removeEventListener('FORMAT_TEXT', handleFormatText);
      window.removeEventListener('UPDATE_TEXT_STYLE', handleUpdateTextStyle);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('UNDO_ACTION', handleUndo);
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
    };

  }, [activeTool, color, brushSize, fontSize, scale]);


  return (
    <div 
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full z-10"
      style={{ pointerEvents: activeTool !== 'image' && activeTool !== 'stamp' ? 'auto' : 'none' }}
    >
      <canvas id={`fabric-canvas-${pageIndex}`} className="absolute top-0 left-0" />
    </div>
  );
}
