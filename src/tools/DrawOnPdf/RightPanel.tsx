import React from 'react';
import { ToolMode } from './EditorWorkspace';

interface RightPanelProps {
  activeTool: ToolMode;
  color: string;
  setColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
}

export function RightPanel({ 
  activeTool, color, setColor, brushSize, setBrushSize, opacity, setOpacity 
}: RightPanelProps) {
  const colors = ['#000000', '#E5322D', '#3B82F6', '#22C55E', '#EAB308', '#FFFFFF'];

  const renderColorPicker = (label = "Color", colorValue: string, setColorFn: (c: string) => void) => (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-2">
        {colors.map(c => (
          <button
            key={c}
            onClick={() => setColorFn(c)}
            className={`w-8 h-8 rounded-full border-2 transition-transform shadow-sm ${colorValue === c ? 'scale-110 border-gray-400' : 'border-gray-200 hover:scale-110'}`}
            style={{ backgroundColor: c }}
          />
        ))}
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 overflow-hidden relative shadow-sm">
          <input 
            type="color" 
            value={colorValue} 
            onChange={e => setColorFn(e.target.value)}
            className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-[320px] bg-white border-l border-[#e5e7eb] flex flex-col h-full z-10 shadow-sm hidden lg:flex">
      <div className="p-4 border-b border-[#e5e7eb] bg-gray-50/50">
        <h3 className="font-semibold text-gray-900">Properties</h3>
      </div>
      
      <div className="p-6 overflow-y-auto flex-1">
        {activeTool === 'select' && (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
              Select an object to modify its properties, move, resize or delete it.
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Opacity</label>
              <div className="flex items-center space-x-3">
                <input 
                  type="range" 
                  min="0" max="1" step="0.1"
                  value={opacity} 
                  onChange={e => {
                    setOpacity(parseFloat(e.target.value));
                    window.dispatchEvent(new CustomEvent('UPDATE_OBJECT_STYLE', { detail: { opacity: parseFloat(e.target.value) } }));
                  }}
                  className="flex-1 accent-[#E5322D]"
                />
                <span className="text-sm font-medium w-12 text-right">{Math.round(opacity * 100)}%</span>
              </div>
            </div>
            {renderColorPicker("Color", color, (c) => {
              setColor(c);
              window.dispatchEvent(new CustomEvent('UPDATE_OBJECT_STYLE', { detail: { stroke: c, fill: c } }));
            })}
          </div>
        )}

        {(activeTool === 'draw' || activeTool === 'highlight' || activeTool === 'eraser') && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Brush Size</label>
              <div className="flex items-center space-x-3">
                <input 
                  type="range" 
                  min="1" max="100" 
                  value={brushSize} 
                  onChange={e => setBrushSize(parseInt(e.target.value))}
                  className="flex-1 accent-[#E5322D]"
                />
                <span className="text-sm font-medium w-8 text-right">{brushSize}px</span>
              </div>
            </div>
            
            {activeTool !== 'eraser' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Opacity</label>
                <div className="flex items-center space-x-3">
                  <input 
                    type="range" 
                    min="0" max="1" step="0.1"
                    value={opacity} 
                    onChange={e => setOpacity(parseFloat(e.target.value))}
                    className="flex-1 accent-[#E5322D]"
                  />
                  <span className="text-sm font-medium w-12 text-right">{Math.round(opacity * 100)}%</span>
                </div>
              </div>
            )}
            
            {activeTool !== 'eraser' && renderColorPicker(activeTool === 'highlight' ? 'Highlight Color' : 'Ink Color', color, setColor)}
          </div>
        )}

        {(activeTool === 'rect' || activeTool === 'circle' || activeTool === 'line' || activeTool === 'arrow') && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Border / Stroke Size</label>
              <div className="flex items-center space-x-3">
                <input 
                  type="range" 
                  min="1" max="50" 
                  value={brushSize} 
                  onChange={e => setBrushSize(parseInt(e.target.value))}
                  className="flex-1 accent-[#E5322D]"
                />
                <span className="text-sm font-medium w-8 text-right">{brushSize}px</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Opacity</label>
              <div className="flex items-center space-x-3">
                <input 
                  type="range" 
                  min="0" max="1" step="0.1"
                  value={opacity} 
                  onChange={e => setOpacity(parseFloat(e.target.value))}
                  className="flex-1 accent-[#E5322D]"
                />
                <span className="text-sm font-medium w-12 text-right">{Math.round(opacity * 100)}%</span>
              </div>
            </div>
            
            {renderColorPicker('Color', color, setColor)}
          </div>
        )}

      </div>
    </div>
  );
}
