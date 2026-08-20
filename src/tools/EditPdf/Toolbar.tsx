import React, { useState } from 'react';
import { 
  MousePointer2, Type, Pen, Square, Circle, Save, Plus, Image as ImageIcon,
  CheckSquare, TextSelect, Highlighter, Minus as LineIcon, MoveUpRight, Eraser, Undo, Redo, FileEdit, FileDown
} from 'lucide-react';
import { ToolMode } from './EditorWorkspace';

interface ToolbarProps {
  activeTool: ToolMode;
  setActiveTool: (tool: ToolMode) => void;
  color: string;
  setColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  onExport: () => void;
  isExporting: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

type EditCategory = 'annotate' | 'shapes' | 'insert' | 'text' | 'forms';

export function Toolbar({
  activeTool, setActiveTool,
  onExport, isExporting,
  onUndo, onRedo
}: ToolbarProps) {
  
  const [activeCategory, setActiveCategory] = useState<EditCategory>('annotate');

  const annotateTools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'highlight', icon: Highlighter, label: 'Highlight' },
    { id: 'draw', icon: Pen, label: 'Draw' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' }
  ];

  const shapeTools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'rect', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'line', icon: LineIcon, label: 'Line' },
    { id: 'arrow', icon: MoveUpRight, label: 'Arrow' },
  ];

  const textTools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'text', icon: Type, label: 'Add Text' },
    { id: 'edit-text', icon: FileEdit, label: 'Edit Text' },
  ];

  const formTools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'form-text', icon: TextSelect, label: 'Text Field' },
    { id: 'form-check', icon: CheckSquare, label: 'Checkbox' },
  ];

  const stamps = [
    'Approved', 'Completed', 'Confidential', 'Draft', 'Final', 
    'Expired', 'Departmental', 'Experimental', 'For Comment', 
    'For Public Release', 'Information Only'
  ];

  const categories = [
    { id: 'annotate', label: 'Annotate' },
    { id: 'text', label: 'Edit Text' },
    { id: 'shapes', label: 'Shapes' },
    { id: 'insert', label: 'Insert' },
    { id: 'forms', label: 'Forms' },
  ] as const;

  const renderTools = (tools: {id: string, icon: any, label: string}[]) => (
    <div className="flex items-center space-x-1">
      {tools.map((t) => (
        <button
          key={t.id}
          onClick={() => setActiveTool(t.id as ToolMode)}
          className={`p-2 rounded-xl transition-all flex flex-col items-center justify-center min-w-[64px] px-2 ${activeTool === t.id ? 'bg-red-50 text-[#ef4444] shadow-sm ring-1 ring-red-100' : 'hover:bg-gray-100 text-gray-700'}`}
          title={t.label}
        >
          <t.icon size={20} className="mb-1" />
          <span className="text-[11px] font-medium text-center leading-tight whitespace-nowrap">{t.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col border-b border-[#e5e7eb] bg-white z-20 shadow-sm relative h-[104px]">
      {/* Top Header / Category Tabs */}
      <div className="flex items-center justify-between px-6 bg-white border-b border-[#e5e7eb] h-12">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#ef4444] rounded-lg flex items-center justify-center shadow-sm">
             <span className="text-white font-bold text-sm">PDF</span>
          </div>
          <span className="font-semibold text-gray-900 tracking-tight">PDF Editor Pro</span>
        </div>
        <div className="flex items-center h-full space-x-1">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id as EditCategory)}
              className={`px-5 h-full text-sm font-medium border-b-[3px] transition-colors flex items-center ${activeCategory === c.id ? 'border-[#ef4444] text-[#ef4444]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex items-center">
          <button 
            onClick={onExport}
            disabled={isExporting}
            className="flex items-center space-x-2 bg-[#ef4444] hover:bg-red-600 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-sm disabled:opacity-50 text-sm"
          >
            <FileDown size={16} />
            <span>{isExporting ? 'Saving...' : 'Download'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center px-6 py-2 h-[55px] bg-[#f8fafc]">
        <div className="flex items-center space-x-4 border-r border-gray-200 pr-6">
          {activeCategory === 'annotate' && renderTools(annotateTools)}
          {activeCategory === 'shapes' && renderTools(shapeTools)}
          {activeCategory === 'text' && renderTools(textTools)}
          {activeCategory === 'forms' && renderTools(formTools)}
          
          {activeCategory === 'insert' && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setActiveTool('select')}
                className={`p-2 rounded-xl transition-all flex flex-col items-center justify-center min-w-[64px] px-2 ${activeTool === 'select' ? 'bg-red-50 text-[#ef4444] ring-1 ring-red-100' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                <MousePointer2 size={20} className="mb-1" />
                <span className="text-[11px] font-medium text-center leading-tight">Select</span>
              </button>
              <label 
                className="p-2 rounded-xl transition-all flex flex-col items-center justify-center min-w-[64px] px-2 hover:bg-gray-100 text-gray-700 cursor-pointer"
              >
                <ImageIcon size={20} className="mb-1" />
                <span className="text-[11px] font-medium text-center leading-tight">Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (ev.target?.result) {
                        window.dispatchEvent(new CustomEvent('ADD_IMAGE', { detail: ev.target.result }));
                        setActiveTool('select');
                      }
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }} />
              </label>

              <div className="relative group">
                <button 
                  className={`p-2 rounded-xl transition-all flex flex-col items-center justify-center min-w-[64px] px-2 ${activeTool === 'stamp' ? 'bg-red-50 text-[#ef4444] ring-1 ring-red-100' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  <Plus size={20} className="mb-1" />
                  <span className="text-[11px] font-medium text-center leading-tight">Stamp</span>
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 shadow-xl rounded-xl hidden group-hover:block z-50 overflow-hidden">
                  <div className="max-h-64 overflow-y-auto p-1">
                    {stamps.map(s => (
                      <button 
                        key={s} 
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('ADD_STAMP', { detail: s }));
                          setActiveTool('select');
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 pl-4">
          <button onClick={onUndo} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white rounded-lg transition-colors" title="Undo"><Undo size={18} /></button>
          <button onClick={onRedo} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white rounded-lg transition-colors" title="Redo"><Redo size={18} /></button>
        </div>

      </div>
    </div>
  );
}
