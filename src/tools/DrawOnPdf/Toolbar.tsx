import React from 'react';
import { 
  MousePointer2, 
  Pen, 
  Highlighter, 
  Eraser, 
  Square, 
  Circle, 
  Minus as LineIcon, 
  MoveUpRight, 
  Undo, 
  Redo, 
  FileDown
} from 'lucide-react';
import { ToolMode } from './EditorWorkspace';

interface ToolbarProps {
  activeTool: ToolMode;
  setActiveTool: (tool: ToolMode) => void;
  onExport: () => void;
  isExporting: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function Toolbar({
  activeTool, setActiveTool,
  onExport, isExporting,
  onUndo, onRedo
}: ToolbarProps) {
  const drawTools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'draw', icon: Pen, label: 'Draw' },
    { id: 'highlight', icon: Highlighter, label: 'Highlight' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'line', icon: LineIcon, label: 'Line' },
    { id: 'arrow', icon: MoveUpRight, label: 'Arrow' },
    { id: 'rect', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' }
  ];

  return (
    <div className="flex flex-col border-b border-[#e5e7eb] bg-white z-20 shadow-sm relative h-[104px]">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 bg-white border-b border-[#e5e7eb] h-12">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#ef4444] rounded-lg flex items-center justify-center shadow-sm">
             <span className="text-white font-bold text-sm">PDF</span>
          </div>
          <span className="font-semibold text-gray-900 tracking-tight">Draw on PDF</span>
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
      
      {/* Tool bar */}
      <div className="flex items-center justify-between px-6 py-2 h-[55px] bg-[#f8fafc]">
        <div className="flex items-center space-x-1">
          {drawTools.map((t) => (
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
        
        <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
          <button onClick={onUndo} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white rounded-lg transition-colors flex flex-col items-center" title="Undo">
            <Undo size={18} className="mb-1" />
            <span className="text-[10px] font-medium text-center">Undo</span>
          </button>
          <button onClick={onRedo} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white rounded-lg transition-colors flex flex-col items-center" title="Redo">
            <Redo size={18} className="mb-1" />
            <span className="text-[10px] font-medium text-center">Redo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
