import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { ToolMode } from './EditorWorkspace';

interface PageCanvasProps {
  pageIndex: number;
  file: File;
  scale: number;
  activeTool: ToolMode;
  color: string;
  brushSize: number;
  opacity: number;
  onCanvasReady?: (canvas: fabric.Canvas) => void;
}

export function PageCanvas({ pageIndex, file, scale, activeTool, color, brushSize, opacity, onCanvasReady }: PageCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Use a small timeout to let react-pdf render the canvas first so we can match its size
    const timer = setTimeout(() => {
      const pdfCanvas = containerRef.current?.parentElement?.querySelector('canvas.react-pdf__Page__canvas') as HTMLCanvasElement;
      if (!pdfCanvas || !containerRef.current) return;

      const width = pdfCanvas.width / window.devicePixelRatio;
      const height = pdfCanvas.height / window.devicePixelRatio;

      if (!canvasRef.current) {
        const c = new fabric.Canvas(`draw-canvas-${pageIndex}`, {
          width,
          height,
          selection: false,
        });
        canvasRef.current = c;
        if (onCanvasReady) onCanvasReady(c);
        
        // Setup initial history state
        (c as any)._history = [];
        (c as any)._historyPointer = -1;
        
        const saveHistory = () => {
          if ((c as any)._historyProcessing) return;
          const json = c.toJSON();
          const hist = (c as any)._history;
          let ptr = (c as any)._historyPointer;
          
          if (ptr < hist.length - 1) {
             hist.splice(ptr + 1);
          }
          hist.push(json);
          (c as any)._historyPointer = hist.length - 1;
        };
        
        c.on('object:added', saveHistory);
        c.on('object:modified', saveHistory);
        c.on('object:removed', saveHistory);
        saveHistory(); // initial blank state
      } else {
        canvasRef.current.setDimensions({ width, height });
        canvasRef.current.renderAll();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [scale, pageIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset modes
    canvas.isDrawingMode = false;
    canvas.selection = activeTool === 'select';
    canvas.forEachObject(obj => {
      obj.selectable = activeTool === 'select';
      obj.evented = activeTool === 'select' || activeTool === 'eraser';
    });

    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    canvas.defaultCursor = 'default';

    if (activeTool === 'draw' || activeTool === 'highlight') {
      canvas.isDrawingMode = true;
      const brush = new fabric.PencilBrush(canvas);
      brush.decimate = 2;
      brush.color = activeTool === 'highlight' ? color + '80' : color; // Add transparency for highlight
      if (activeTool === 'highlight') brush.color = color;
      
      brush.width = brushSize;
      canvas.freeDrawingBrush = brush;
      
      if (activeTool === 'highlight') {
         canvas.freeDrawingBrush.color = color;
         // In fabric 6 we could set opacity directly on the object when path is created
         canvas.on('path:created', (e: any) => {
           if (activeTool === 'highlight') {
             e.path.set({ opacity: 0.4, globalCompositeOperation: 'multiply' });
             canvas.renderAll();
           } else {
             e.path.set({ opacity: opacity });
           }
         });
      } else {
         canvas.on('path:created', (e: any) => {
            e.path.set({ opacity: opacity });
         });
      }
    } else if (activeTool === 'eraser') {
      canvas.defaultCursor = 'crosshair';
      canvas.on('mouse:down', (o) => {
        if (o.target) {
          canvas.remove(o.target);
        }
      });
    } else if (['rect', 'circle', 'line', 'arrow'].includes(activeTool)) {
      let isDrawing = false;
      let startPoint = { x: 0, y: 0 };
      let currentShape: any = null;
      canvas.defaultCursor = 'crosshair';

      canvas.on('mouse:down', (o) => {
        isDrawing = true;
        const pointer = canvas.getScenePoint(o.e);
        startPoint = { x: pointer.x, y: pointer.y };

        if (activeTool === 'rect') {
          currentShape = new fabric.Rect({
            left: startPoint.x,
            top: startPoint.y,
            width: 0,
            height: 0,
            fill: 'transparent',
            stroke: color,
            strokeWidth: brushSize,
            opacity: opacity,
            selectable: false,
          });
        } else if (activeTool === 'circle') {
          currentShape = new fabric.Ellipse({
            left: startPoint.x,
            top: startPoint.y,
            rx: 0,
            ry: 0,
            fill: 'transparent',
            stroke: color,
            strokeWidth: brushSize,
            opacity: opacity,
            selectable: false,
          });
        } else if (activeTool === 'line') {
          currentShape = new fabric.Line([startPoint.x, startPoint.y, startPoint.x, startPoint.y], {
            stroke: color,
            strokeWidth: brushSize,
            opacity: opacity,
            selectable: false,
          });
        } else if (activeTool === 'arrow') {
          // A simple line for arrow base, actual arrowhead needs custom rendering or a polygon.
          // For simplicity we use a line, but will add an arrowhead polygon in up event or via a group.
          currentShape = new fabric.Line([startPoint.x, startPoint.y, startPoint.x, startPoint.y], {
            stroke: color,
            strokeWidth: brushSize,
            opacity: opacity,
            selectable: false,
          });
        }
        
        if (currentShape) {
          canvas.add(currentShape);
        }
      });

      canvas.on('mouse:move', (o) => {
        if (!isDrawing || !currentShape) return;
        const pointer = canvas.getScenePoint(o.e);
        
        if (activeTool === 'rect') {
          currentShape.set({
            width: Math.abs(pointer.x - startPoint.x),
            height: Math.abs(pointer.y - startPoint.y),
            left: Math.min(pointer.x, startPoint.x),
            top: Math.min(pointer.y, startPoint.y),
          });
        } else if (activeTool === 'circle') {
          currentShape.set({
            rx: Math.abs(pointer.x - startPoint.x) / 2,
            ry: Math.abs(pointer.y - startPoint.y) / 2,
            left: Math.min(pointer.x, startPoint.x),
            top: Math.min(pointer.y, startPoint.y),
          });
        } else if (activeTool === 'line' || activeTool === 'arrow') {
          currentShape.set({
            x2: pointer.x,
            y2: pointer.y,
          });
        }
        canvas.renderAll();
      });

      canvas.on('mouse:up', () => {
        isDrawing = false;
        if (currentShape) {
          currentShape.setCoords();
          currentShape = null;
        }
      });
    }

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (!canvas) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          canvas.remove(activeObject);
          canvas.discardActiveObject();
        }
      }
      
      // Undo (Ctrl+Z or Cmd+Z)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('UNDO_ACTION'));
      }
      
      // Redo (Ctrl+Y or Cmd+Y or Ctrl+Shift+Z)
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') || 
          ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('REDO_ACTION'));
      }
      
      // Copy (Ctrl+C or Cmd+C)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          activeObject.clone().then((cloned: any) => {
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
    
    const handleUndo = () => {
      if (!canvas) return;
      const hist = (canvas as any)._history;
      let ptr = (canvas as any)._historyPointer;
      if (ptr > 0) {
        ptr -= 1;
        (canvas as any)._historyProcessing = true;
        canvas.loadFromJSON(hist[ptr], () => {
          canvas.renderAll();
          (canvas as any)._historyPointer = ptr;
          (canvas as any)._historyProcessing = false;
        });
      }
    };
    
    const handleRedo = () => {
      if (!canvas) return;
      const hist = (canvas as any)._history;
      let ptr = (canvas as any)._historyPointer;
      if (ptr < hist.length - 1) {
        ptr += 1;
        (canvas as any)._historyProcessing = true;
        canvas.loadFromJSON(hist[ptr], () => {
          canvas.renderAll();
          (canvas as any)._historyPointer = ptr;
          (canvas as any)._historyProcessing = false;
        });
      }
    };

    const handleUpdateObjectStyle = (e: any) => {
      if (!canvas) return;
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        activeObject.set(e.detail);
        canvas.renderAll();
      }
    };

    window.addEventListener('UNDO_ACTION', handleUndo);
    window.addEventListener('REDO_ACTION', handleRedo);
    window.addEventListener('UPDATE_OBJECT_STYLE', handleUpdateObjectStyle);

    // Send selection updates back to window to sync with RightPanel if we had one
    const handleSelection = () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        window.dispatchEvent(new CustomEvent('OBJECT_SELECTED', { 
          detail: { 
            fill: activeObject.fill, 
            stroke: activeObject.stroke, 
            strokeWidth: activeObject.strokeWidth,
            opacity: activeObject.opacity
          } 
        }));
      }
    };
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('UNDO_ACTION', handleUndo);
      window.removeEventListener('REDO_ACTION', handleRedo);
      window.removeEventListener('UPDATE_OBJECT_STYLE', handleUpdateObjectStyle);
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('path:created');
    };

  }, [activeTool, color, brushSize, opacity, scale]);


  return (
    <div 
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full z-10"
      style={{ pointerEvents: true ? 'auto' : 'none' }}
    >
      <canvas id={`draw-canvas-${pageIndex}`} className="absolute top-0 left-0" />
    </div>
  );
}
