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

  const fontFamilies = [
    'Helvetica', 'Arial', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Comic Sans MS'
  ];

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
                Advanced Text Detection: Click on any existing text to detect it, mask the original, and convert it into an editable layer.
              </div>
            )}
            
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Font Family</label>
              <select 
                onChange={(e) => window.dispatchEvent(new CustomEvent('UPDATE_TEXT_STYLE', { detail: { fontFamily: e.target.value } }))}
                className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#ef4444] focus:border-transparent outline-none"
              >
                {fontFamilies.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Font Size</label>
              <div className="flex items-center space-x-3">
                <input 
                  type="range" 
                  min="8" max="72" 
                  value={fontSize} 
                  onChange={e => {
                    setFontSize(parseInt(e.target.value));
                    window.dispatchEvent(new CustomEvent('UPDATE_TEXT_STYLE', { detail: { fontSize: parseInt(e.target.value) } }));
                  }}
                  className="flex-1 accent-[#E5322D]"
                />
                <span className="text-sm font-medium w-8 text-right">{fontSize}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Formatting & Alignment</label>
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
              <div className="flex space-x-2 mt-2">
                <button onClick={() => window.dispatchEvent(new CustomEvent('UPDATE_TEXT_STYLE', { detail: { textAlign: 'left' } }))} className="flex-1 py-1 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-xs">Left</button>
                <button onClick={() => window.dispatchEvent(new CustomEvent('UPDATE_TEXT_STYLE', { detail: { textAlign: 'center' } }))} className="flex-1 py-1 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-xs">Center</button>
                <button onClick={() => window.dispatchEvent(new CustomEvent('UPDATE_TEXT_STYLE', { detail: { textAlign: 'right' } }))} className="flex-1 py-1 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-xs">Right</button>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Spacing & Opacity</label>
              <div className="flex items-center space-x-3 text-xs mb-2">
                <span className="w-16">Line Ht</span>
                <input type="range" min="1" max="3" step="0.1" defaultValue="1" onChange={(e) => window.dispatchEvent(new CustomEvent('UPDATE_TEXT_STYLE', { detail: { lineHeight: parseFloat(e.target.value) } }))} className="flex-1 accent-[#E5322D]"/>
              </div>
              <div className="flex items-center space-x-3 text-xs mb-2">
                <span className="w-16">Char Sp.</span>
                <input type="range" min="-100" max="1000" defaultValue="0" onChange={(e) => window.dispatchEvent(new CustomEvent('UPDATE_TEXT_STYLE', { detail: { charSpacing: parseInt(e.target.value) } }))} className="flex-1 accent-[#E5322D]"/>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="w-16">Opacity</span>
                <input type="range" min="0" max="1" step="0.1" defaultValue="1" onChange={(e) => window.dispatchEvent(new CustomEvent('UPDATE_TEXT_STYLE', { detail: { opacity: parseFloat(e.target.value) } }))} className="flex-1 accent-[#E5322D]"/>
              </div>
            </div>

            {renderColorPicker("Text Color", color, (c) => {
              setColor(c);
              window.dispatchEvent(new CustomEvent('UPDATE_TEXT_STYLE', { detail: { fill: c } }));
            })}
            
            {renderColorPicker("Background Color", "", (c) => {
              window.dispatchEvent(new CustomEvent('UPDATE_TEXT_STYLE', { detail: { textBackgroundColor: c } }));
            })}
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
            {renderColorPicker(activeTool === 'highlight' ? 'Highlight Color' : 'Ink Color', color, setColor)}
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
            {renderColorPicker('Stroke Color', color, setColor)}
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
