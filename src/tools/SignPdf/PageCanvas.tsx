import React, { useRef, useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { X, Edit2 } from 'lucide-react';
import { FieldData } from './EditorWorkspace';

interface PageCanvasProps {
  pageIndex: number;
  scale: number;
  fields: FieldData[];
  onUpdateField: (id: string, data: Partial<FieldData>) => void;
  onRemoveField: (id: string) => void;
  onEditSignature?: () => void;
}

export function PageCanvas({ pageIndex, scale, fields, onUpdateField, onRemoveField, onEditSignature }: PageCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    
    // Initial size
    setTimeout(updateSize, 100);

    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current?.parentElement) {
      resizeObserver.observe(containerRef.current.parentElement);
    }
    return () => resizeObserver.disconnect();
  }, [scale]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-10 pointer-events-none"
      style={{ overflow: 'hidden' }}
    >
      {fields.map(field => (
        <Rnd
          key={field.id}
          size={{ width: field.width * scale, height: field.height * scale }}
          position={{ x: field.x * scale, y: field.y * scale }}
          onDragStop={(e, d) => {
            onUpdateField(field.id, { x: d.x / scale, y: d.y / scale });
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            onUpdateField(field.id, {
              width: parseInt(ref.style.width, 10) / scale,
              height: parseInt(ref.style.height, 10) / scale,
              x: position.x / scale,
              y: position.y / scale,
            });
          }}
          bounds="parent"
          className="pointer-events-auto group border-2 border-transparent hover:border-blue-400 focus-within:border-blue-500 absolute"
        >
          {/* Controls */}
          <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-20">
            {field.type === 'signature' && onEditSignature && (
              <button
                onClick={onEditSignature}
                className="bg-blue-500 text-white rounded-full p-1 shadow-md hover:bg-blue-600"
              >
                <Edit2 size={12} />
              </button>
            )}
            <button
              onClick={() => onRemoveField(field.id)}
              className="bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
            >
              <X size={12} />
            </button>
          </div>

          {/* Content */}
          <div className="w-full h-full bg-blue-50/50 flex items-center justify-center relative overflow-hidden">
            {field.type === 'signature' ? (
              field.value ? (
                <img src={field.value} alt="Signature" className="w-full h-full object-contain pointer-events-none" />
              ) : (
                <span className="text-blue-500 font-medium text-sm">Sign Here</span>
              )
            ) : field.type === 'text' || field.type === 'name' || field.type === 'date' || field.type === 'initials' ? (
              <input 
                type="text" 
                value={field.value || ''}
                onChange={(e) => onUpdateField(field.id, { value: e.target.value })}
                placeholder={field.type.toUpperCase()}
                className="w-full h-full bg-transparent border-none outline-none text-center font-medium text-gray-800"
                style={{ fontSize: `${Math.max(12, (field.height * scale) * 0.4)}px` }}
              />
            ) : field.type === 'stamp' ? (
              field.value ? (
                <img src={field.value} alt="Stamp" className="w-full h-full object-contain pointer-events-none" />
              ) : (
                <span className="text-blue-500 font-medium text-sm">Stamp Here</span>
              )
            ) : null}
          </div>
        </Rnd>
      ))}
    </div>
  );
}
