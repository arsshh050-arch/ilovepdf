import React, { useState } from 'react';
import {
  ArrowLeft,
  MousePointer,
  Hand,
  Highlighter,
  Square,
  PlusCircle,
  Type,
  FormInput,
  PenLine,
  Eraser,
  Undo2,
  Redo2,
  Maximize2,
  Minimize2,
  Download,
  Check,
  Loader2,
  FileText,
} from 'lucide-react';
import { EditorMode } from '../../types/pdfEditor';

interface EditorTopNavbarProps {
  documentName: string;
  onDocumentNameChange: (name: string) => void;
  activeMode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  undoCount: number;
  redoCount: number;
  onSaveAndExport: () => void;
  isExporting: boolean;
  onBack: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const MODES: Array<{ id: EditorMode; label: string; icon: any; shortcut: string }> = [
  { id: 'select', label: 'Select', icon: MousePointer, shortcut: 'V' },
  { id: 'hand', label: 'Hand / Pan', icon: Hand, shortcut: 'H' },
  { id: 'annotate', label: 'Annotate', icon: Highlighter, shortcut: 'A' },
  { id: 'shapes', label: 'Shapes', icon: Square, shortcut: 'U' },
  { id: 'insert', label: 'Insert', icon: PlusCircle, shortcut: 'I' },
  { id: 'edit-text', label: 'Edit Text', icon: Type, shortcut: 'T' },
  { id: 'forms', label: 'Forms', icon: FormInput, shortcut: 'F' },
  { id: 'sign', label: 'Sign', icon: PenLine, shortcut: 'S' },
  { id: 'whiteout', label: 'Whiteout', icon: Eraser, shortcut: 'W' },
];

export function EditorTopNavbar({
  documentName,
  onDocumentNameChange,
  activeMode,
  onModeChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  undoCount,
  redoCount,
  onSaveAndExport,
  isExporting,
  onBack,
  isFullscreen,
  onToggleFullscreen,
}: EditorTopNavbarProps) {
  const [isEditingName, setIsEditingName] = useState(false);

  return (
    <header className="w-full bg-white border-b border-[#E8EAEF] px-4 py-2 flex items-center justify-between gap-4 z-30 select-none shadow-xs">
      {/* LEFT: BACK & DOCUMENT TITLE */}
      <div className="flex items-center gap-3 min-w-[200px] max-w-[320px]">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          title="Back to Tools"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Exit</span>
        </button>

        <div className="h-5 w-[1px] bg-gray-200" />

        <div className="flex items-center gap-2 overflow-hidden">
          <div className="p-1.5 bg-[#FFF0EE] rounded-lg text-[#E5322D] shrink-0">
            <FileText size={16} />
          </div>
          {isEditingName ? (
            <input
              type="text"
              autoFocus
              value={documentName}
              onChange={(e) => onDocumentNameChange(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
              className="px-2 py-1 text-xs font-bold text-gray-900 border border-[#E5322D] rounded-md outline-hidden w-full"
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="text-xs font-bold text-gray-900 truncate hover:text-[#E5322D] transition-colors text-left max-w-[180px]"
              title="Click to rename document"
            >
              {documentName || 'Document.pdf'}
            </button>
          )}
        </div>
      </div>

      {/* CENTER: MODE SELECTORS */}
      <div className="flex items-center bg-[#F4F5F9] p-1 rounded-2xl border border-[#E8EAEF] gap-0.5 overflow-x-auto no-scrollbar">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-white text-[#E5322D] shadow-xs font-bold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
              title={`${mode.label} (${mode.shortcut})`}
            >
              <Icon size={15} className={isActive ? 'text-[#E5322D]' : 'text-gray-500'} />
              <span className="hidden md:inline">{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* RIGHT: UNDO / REDO / FULLSCREEN / SAVE */}
      <div className="flex items-center gap-2 shrink-0">
        {/* UNDO / REDO */}
        <div className="flex items-center gap-1 bg-[#F4F5F9] p-1 rounded-xl border border-[#E8EAEF]">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-lg text-gray-700 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors relative"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={15} />
            {undoCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {undoCount > 9 ? '9+' : undoCount}
              </span>
            )}
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-lg text-gray-700 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors relative"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={15} />
            {redoCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {redoCount > 9 ? '9+' : redoCount}
              </span>
            )}
          </button>
        </div>

        {/* FULLSCREEN */}
        <button
          onClick={onToggleFullscreen}
          className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-[#E8EAEF] hidden lg:flex items-center justify-center transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        {/* PRIMARY SAVE / EXPORT BUTTON */}
        <button
          onClick={onSaveAndExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-[#E5322D] hover:bg-[#CC2521] active:bg-[#B31D1A] text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-75"
        >
          {isExporting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Applying Edits...</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>Save & Export</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
