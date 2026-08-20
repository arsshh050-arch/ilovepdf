import React from 'react';
import { ToolMode } from './EditorWorkspace';

interface RightPanelProps {
  activeTool: ToolMode;
  color: string;
  setColor: (c: string) => void;
  brushSize: number;
  setBrushSize: (s: number) => void;
  fontSize: number;
  setFontSize: (s: number) => void;
}

export function RightPanel({
  activeTool,
  color, setColor,
  brushSize, setBrushSize,
  fontSize, setFontSize
}: RightPanelProps) {
  const colors = ['#000000', '#E5322D', '#3B82F6', '#22C55E', '#EAB308', '#FFFFFF'];

  const renderColorPicker = (label = "Color") => (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-2">
        {colors.map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-8 h-8 rounded-full border-2 transition-transform shadow-sm ${color === c ? 'scale-110 border-gray-400' : 'border-gray-200 hover:scale-110'}`}
            style={{ backgroundColor: c }}
          />
        ))}
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 overflow-hidden relative shadow-sm">
          <input 
            type="color" 
            value={color} 
            onChange={e => setColor(e.target.value)}
            className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-[320px] bg-white border-l border-[#e5e7eb] flex flex-col h-full z-10 shadow-sm hidden lg:flex">
      <div className="p-4 border-b border-[#e5e7eb] bg-white h-12 flex items-center">
        <h3 className="font-semibold text-gray-900 text-sm">Properties</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {(activeTool === 'text' || activeTool === 'edit-text') && (
          <div className="space-y-6">
            {activeTool === 'edit-text' && (
              <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-100">
                Click on any existing text in the PDF document to automatically detect it, mask the original text, and convert it into an editable text box.
              </div>
            )}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Font Size</label>
              <div className="flex items-center space-x-3">
                <input 
                  type="range" 
                  min="8" max="72" 
                  value={fontSize} 
                  onChange={e => setFontSize(parseInt(e.target.value))}
                  className="flex-1 accent-[#E5322D]"
                />
                <span className="text-sm font-medium w-8 text-right">{fontSize}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Formatting</label>
              <div className="flex space-x-2">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('FORMAT_TEXT', { detail: 'bold' }))}
                  className="flex-1 py-2 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 font-bold shadow-sm transition-colors"
                >B</button>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('FORMAT_TEXT', { detail: 'italic' }))}
                  className="flex-1 py-2 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 italic font-serif shadow-sm transition-colors"
                >I</button>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('FORMAT_TEXT', { detail: 'underline' }))}
                  className="flex-1 py-2 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 underline shadow-sm transition-colors"
                >U</button>
              </div>
            </div>

            {renderColorPicker("Text Color")}
          </div>
        )}

        {(activeTool === 'draw' || activeTool === 'highlight') && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Brush Size</label>
              <div className="flex items-center space-x-3">
                <input 
                  type="range" 
                  min="1" max="40" 
                  value={brushSize} 
                  onChange={e => setBrushSize(parseInt(e.target.value))}
                  className="flex-1 accent-[#E5322D]"
                />
                <span className="text-sm font-medium w-8 text-right">{brushSize}px</span>
              </div>
            </div>
            {renderColorPicker(activeTool === 'highlight' ? 'Highlight Color' : 'Ink Color')}
          </div>
        )}

        {['rect', 'circle', 'line', 'arrow'].includes(activeTool) && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stroke Width</label>
              <div className="flex items-center space-x-3">
                <input 
                  type="range" 
                  min="1" max="20" 
                  value={brushSize} 
                  onChange={e => setBrushSize(parseInt(e.target.value))}
                  className="flex-1 accent-[#E5322D]"
                />
                <span className="text-sm font-medium w-8 text-right">{brushSize}px</span>
              </div>
            </div>
            {renderColorPicker('Stroke Color')}
          </div>
        )}

        {['form-text', 'form-check'].includes(activeTool) && (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
              Draw on the canvas to place form fields. These will be exported as native interactive PDF form fields.
            </div>
          </div>
        )}

        {activeTool === 'select' && (
          <div className="text-sm text-gray-500 text-center py-8">
            Select an object on the canvas to edit its properties, or choose a tool from the top toolbar to begin.
          </div>
        )}

        {activeTool === 'eraser' && (
          <div className="text-sm text-gray-500 text-center py-8">
            Click on any drawn object, shape, or text to remove it from the document.
          </div>
        )}

      </div>
    </div>
  );
}
