import React, { useState, useRef } from 'react';
import {
  Highlighter,
  Underline as UnderlineIcon,
  Strikethrough as StrikeIcon,
  Pencil,
  Sparkles,
  MessageSquare,
  Square,
  Circle,
  Minus,
  ArrowRight,
  Cloud,
  Stamp as StampIcon,
  Image as ImageIcon,
  PenTool,
  Type,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  CheckSquare,
  List,
  FileSignature,
  Eraser,
  Link as LinkIcon,
  Plus,
  ChevronDown,
} from 'lucide-react';
import {
  EditorMode,
  AnnotateSubTool,
  ShapeSubTool,
  InsertSubTool,
  FormSubTool,
  TextEditorObject,
} from '../../types/pdfEditor';
import { STAMP_PRESETS } from '../../config/stampPresets';

interface EditorSubToolbarProps {
  activeMode: EditorMode;
  activeAnnotateTool: AnnotateSubTool;
  onAnnotateToolChange: (tool: AnnotateSubTool) => void;
  activeShapeTool: ShapeSubTool;
  onShapeToolChange: (tool: ShapeSubTool) => void;
  activeFormTool: FormSubTool;
  onFormToolChange: (tool: FormSubTool) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  fillColor: string;
  onFillColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (w: number) => void;
  opacity: number;
  onOpacityChange: (op: number) => void;
  // Text state
  fontFamily: string;
  onFontFamilyChange: (font: string) => void;
  fontSize: number;
  onFontSizeChange: (sz: number) => void;
  isBold: boolean;
  onToggleBold: () => void;
  isItalic: boolean;
  onToggleItalic: () => void;
  isUnderline: boolean;
  onToggleUnderline: () => void;
  isStrikethrough: boolean;
  onToggleStrikethrough: () => void;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  onTextAlignChange: (align: 'left' | 'center' | 'right' | 'justify') => void;
  // Modals & Triggers
  onOpenSignatureModal: (tab?: 'type' | 'draw' | 'upload' | 'initials' | 'company-stamp') => void;
  onOpenCustomStampModal: () => void;
  onOpenLinkModal: () => void;
  onInsertStampPreset: (stamp: typeof STAMP_PRESETS[0]) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddTextBox: () => void;
}

const COLOR_PRESETS = [
  '#FFD600', // Yellow
  '#10B981', // Green
  '#3B82F6', // Blue
  '#EC4899', // Pink
  '#F97316', // Orange
  '#8B5CF6', // Purple
  '#E5322D', // Red
  '#000000', // Black
];

const FONT_FAMILIES = [
  'Helvetica',
  'Times New Roman',
  'Courier',
  'Arial',
  'Roboto',
  'Georgia',
  'Montserrat',
];

export function EditorSubToolbar({
  activeMode,
  activeAnnotateTool,
  onAnnotateToolChange,
  activeShapeTool,
  onShapeToolChange,
  activeFormTool,
  onFormToolChange,
  selectedColor,
  onColorChange,
  fillColor,
  onFillColorChange,
  strokeWidth,
  onStrokeWidthChange,
  opacity,
  onOpacityChange,
  fontFamily,
  onFontFamilyChange,
  fontSize,
  onFontSizeChange,
  isBold,
  onToggleBold,
  isItalic,
  onToggleItalic,
  isUnderline,
  onToggleUnderline,
  isStrikethrough,
  onToggleStrikethrough,
  textAlign,
  onTextAlignChange,
  onOpenSignatureModal,
  onOpenCustomStampModal,
  onOpenLinkModal,
  onInsertStampPreset,
  onImageUpload,
  onAddTextBox,
}: EditorSubToolbarProps) {
  const [showStampDropdown, setShowStampDropdown] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // If in Select or Hand mode, show simple contextual info
  if (activeMode === 'select' || activeMode === 'hand') {
    return (
      <div className="w-full bg-[#FAFBFD] border-b border-[#E8EAEF] px-4 py-1.5 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">
            {activeMode === 'select' ? 'Selection Tool' : 'Hand / Pan Tool'}:
          </span>
          <span>
            {activeMode === 'select'
              ? 'Click objects to select, resize, move or edit properties. Press Delete to remove.'
              : 'Click and drag anywhere to pan the document. Hold Spacebar from any tool to quick-pan.'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] bg-gray-200/80 px-2 py-0.5 rounded text-gray-700 font-mono">
            Space + Drag = Pan
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAFBFD] border-b border-[#E8EAEF] px-4 py-1.5 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar select-none z-20 text-xs">
      {/* 1. ANNOTATE SUB-BAR */}
      {activeMode === 'annotate' && (
        <div className="flex items-center gap-2 flex-wrap">
          {/* ANNOTATION TOOL BUTTONS */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-[#E8EAEF] gap-0.5 shadow-2xs">
            <button
              onClick={() => onAnnotateToolChange('highlight')}
              className={`p-1.5 rounded-lg flex items-center gap-1 font-semibold transition-colors ${
                activeAnnotateTool === 'highlight' ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Highlight Text"
            >
              <Highlighter size={15} />
              <span className="hidden sm:inline">Highlight</span>
            </button>
            <button
              onClick={() => onAnnotateToolChange('underline')}
              className={`p-1.5 rounded-lg flex items-center gap-1 font-semibold transition-colors ${
                activeAnnotateTool === 'underline' ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Underline Text"
            >
              <UnderlineIcon size={15} />
              <span className="hidden sm:inline">Underline</span>
            </button>
            <button
              onClick={() => onAnnotateToolChange('strikeout')}
              className={`p-1.5 rounded-lg flex items-center gap-1 font-semibold transition-colors ${
                activeAnnotateTool === 'strikeout' ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Strikethrough Text"
            >
              <StrikeIcon size={15} />
              <span className="hidden sm:inline">Strikeout</span>
            </button>
            <button
              onClick={() => onAnnotateToolChange('freehand')}
              className={`p-1.5 rounded-lg flex items-center gap-1 font-semibold transition-colors ${
                activeAnnotateTool === 'freehand' ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Freehand Pen"
            >
              <Pencil size={15} />
              <span className="hidden sm:inline">Draw Pen</span>
            </button>
            <button
              onClick={() => onAnnotateToolChange('marker')}
              className={`p-1.5 rounded-lg flex items-center gap-1 font-semibold transition-colors ${
                activeAnnotateTool === 'marker' ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Highlighter Marker"
            >
              <Sparkles size={15} />
              <span className="hidden sm:inline">Marker</span>
            </button>
            <button
              onClick={() => onAnnotateToolChange('comment')}
              className={`p-1.5 rounded-lg flex items-center gap-1 font-semibold transition-colors ${
                activeAnnotateTool === 'comment' ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Sticky Note / Comment"
            >
              <MessageSquare size={15} />
              <span className="hidden sm:inline">Comment</span>
            </button>
          </div>

          {/* COLOR PICKER */}
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-[#E8EAEF]">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                onClick={() => onColorChange(c)}
                className={`w-5 h-5 rounded-full transition-transform ${
                  selectedColor === c ? 'scale-125 ring-2 ring-gray-900 shadow-xs' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* STROKE WIDTH FOR FREEHAND */}
          {(activeAnnotateTool === 'freehand' || activeAnnotateTool === 'marker') && (
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-[#E8EAEF]">
              <span className="text-[11px] font-semibold text-gray-500">Thickness:</span>
              {[2, 4, 8, 12].map((w) => (
                <button
                  key={w}
                  onClick={() => onStrokeWidthChange(w)}
                  className={`w-6 h-6 rounded-md flex items-center justify-center font-bold ${
                    strokeWidth === w ? 'bg-[#FFF0EE] text-[#E5322D] border border-[#E5322D]' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. SHAPES SUB-BAR */}
      {activeMode === 'shapes' && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-white p-1 rounded-xl border border-[#E8EAEF] gap-0.5">
            <button
              onClick={() => onShapeToolChange('rectangle')}
              className={`p-1.5 rounded-lg flex items-center gap-1 font-semibold ${
                activeShapeTool === 'rectangle' ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Rectangle"
            >
              <Square size={15} />
              <span className="hidden sm:inline">Rectangle</span>
            </button>
            <button
              onClick={() => onShapeToolChange('circle')}
              className={`p-1.5 rounded-lg flex items-center gap-1 font-semibold ${
                activeShapeTool === 'circle' ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Circle / Oval"
            >
              <Circle size={15} />
              <span className="hidden sm:inline">Circle</span>
            </button>
            <button
              onClick={() => onShapeToolChange('line')}
              className={`p-1.5 rounded-lg flex items-center gap-1 font-semibold ${
                activeShapeTool === 'line' ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Line"
            >
              <Minus size={15} />
              <span className="hidden sm:inline">Line</span>
            </button>
            <button
              onClick={() => onShapeToolChange('arrow')}
              className={`p-1.5 rounded-lg flex items-center gap-1 font-semibold ${
                activeShapeTool === 'arrow' ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Arrow"
            >
              <ArrowRight size={15} />
              <span className="hidden sm:inline">Arrow</span>
            </button>
            <button
              onClick={() => onShapeToolChange('cloud')}
              className={`p-1.5 rounded-lg flex items-center gap-1 font-semibold ${
                activeShapeTool === 'cloud' ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Cloud"
            >
              <Cloud size={15} />
              <span className="hidden sm:inline">Cloud</span>
            </button>
          </div>

          {/* STROKE COLOR */}
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-[#E8EAEF]">
            <span className="text-[11px] font-semibold text-gray-500 mr-1">Stroke:</span>
            {COLOR_PRESETS.slice(0, 6).map((c) => (
              <button
                key={c}
                onClick={() => onColorChange(c)}
                className={`w-5 h-5 rounded-full transition-transform ${
                  selectedColor === c ? 'scale-125 ring-2 ring-gray-900 shadow-xs' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* FILL COLOR */}
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-[#E8EAEF]">
            <span className="text-[11px] font-semibold text-gray-500 mr-1">Fill:</span>
            <button
              onClick={() => onFillColorChange('transparent')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                fillColor === 'transparent' ? 'border-[#E5322D] bg-[#FFF0EE] text-[#E5322D]' : 'border-gray-200 text-gray-500'
              }`}
            >
              None
            </button>
            {COLOR_PRESETS.slice(0, 4).map((c) => (
              <button
                key={c}
                onClick={() => onFillColorChange(c)}
                className={`w-5 h-5 rounded-full transition-transform ${
                  fillColor === c ? 'scale-125 ring-2 ring-gray-900 shadow-xs' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. INSERT SUB-BAR */}
      {activeMode === 'insert' && (
        <div className="flex items-center gap-2 flex-wrap relative">
          {/* STAMPS BUTTON & DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setShowStampDropdown(!showStampDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-[#E8EAEF] font-bold text-gray-800 hover:bg-gray-50 shadow-2xs"
            >
              <StampIcon size={15} className="text-[#E5322D]" />
              <span>Stamps Library</span>
              <ChevronDown size={14} />
            </button>

            {showStampDropdown && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-2xl shadow-xl border border-[#E8EAEF] p-3 z-50 animate-in fade-in max-h-80 overflow-y-auto">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-800">Standard Stamps</span>
                  <button
                    onClick={() => {
                      setShowStampDropdown(false);
                      onOpenCustomStampModal();
                    }}
                    className="text-xs font-bold text-[#E5322D] hover:underline"
                  >
                    + Custom Stamp
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {STAMP_PRESETS.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => {
                        onInsertStampPreset(st);
                        setShowStampDropdown(false);
                      }}
                      className="p-2 border rounded-xl text-center hover:bg-gray-50 transition-all cursor-pointer font-black text-xs"
                      style={{ borderColor: st.color, color: st.color }}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
              onChange={onImageUpload}
              className="hidden"
            />
            <button
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-[#E8EAEF] font-bold text-gray-800 hover:bg-gray-50 shadow-2xs cursor-pointer"
            >
              <ImageIcon size={15} className="text-[#E5322D]" />
              <span>Insert Image</span>
            </button>
          </div>

          {/* SIGNATURE / INITIALS */}
          <button
            onClick={() => onOpenSignatureModal('type')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-[#E8EAEF] font-bold text-gray-800 hover:bg-gray-50 shadow-2xs cursor-pointer"
          >
            <PenTool size={15} className="text-[#E5322D]" />
            <span>Signature / Initials</span>
          </button>

          {/* ADD LINK */}
          <button
            onClick={onOpenLinkModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-[#E8EAEF] font-bold text-gray-800 hover:bg-gray-50 shadow-2xs cursor-pointer"
          >
            <LinkIcon size={15} className="text-[#E5322D]" />
            <span>Add Link</span>
          </button>
        </div>
      )}

      {/* 4. EDIT TEXT SUB-BAR */}
      {activeMode === 'edit-text' && (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onAddTextBox}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF0EE] text-[#E5322D] rounded-xl border border-[#E5322D]/30 font-bold hover:bg-[#FFE5E2] shadow-2xs cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Text Box</span>
          </button>

          {/* FONT SELECTOR */}
          <select
            value={fontFamily}
            onChange={(e) => onFontFamilyChange(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-[#E8EAEF] rounded-xl text-xs font-semibold text-gray-800 outline-hidden"
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          {/* FONT SIZE */}
          <div className="flex items-center bg-white rounded-xl border border-[#E8EAEF] px-1 py-0.5">
            <button
              onClick={() => onFontSizeChange(Math.max(6, fontSize - 2))}
              className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 rounded-md font-bold"
            >
              -
            </button>
            <span className="w-8 text-center font-bold text-gray-800">{fontSize}</span>
            <button
              onClick={() => onFontSizeChange(Math.min(96, fontSize + 2))}
              className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 rounded-md font-bold"
            >
              +
            </button>
          </div>

          {/* STYLES (BOLD, ITALIC, UNDERLINE, STRIKE) */}
          <div className="flex items-center bg-white p-0.5 rounded-xl border border-[#E8EAEF] gap-0.5">
            <button
              onClick={onToggleBold}
              className={`p-1.5 rounded-lg ${isBold ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Bold"
            >
              <Bold size={14} />
            </button>
            <button
              onClick={onToggleItalic}
              className={`p-1.5 rounded-lg ${isItalic ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Italic"
            >
              <Italic size={14} />
            </button>
            <button
              onClick={onToggleUnderline}
              className={`p-1.5 rounded-lg ${isUnderline ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Underline"
            >
              <UnderlineIcon size={14} />
            </button>
            <button
              onClick={onToggleStrikethrough}
              className={`p-1.5 rounded-lg ${isStrikethrough ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Strikethrough"
            >
              <StrikeIcon size={14} />
            </button>
          </div>

          {/* TEXT COLOR */}
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-[#E8EAEF]">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                onClick={() => onColorChange(c)}
                className={`w-5 h-5 rounded-full transition-transform ${
                  selectedColor === c ? 'scale-125 ring-2 ring-gray-900 shadow-xs' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* ALIGNMENT */}
          <div className="flex items-center bg-white p-0.5 rounded-xl border border-[#E8EAEF] gap-0.5">
            <button
              onClick={() => onTextAlignChange('left')}
              className={`p-1.5 rounded-lg ${textAlign === 'left' ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Align Left"
            >
              <AlignLeft size={14} />
            </button>
            <button
              onClick={() => onTextAlignChange('center')}
              className={`p-1.5 rounded-lg ${textAlign === 'center' ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Align Center"
            >
              <AlignCenter size={14} />
            </button>
            <button
              onClick={() => onTextAlignChange('right')}
              className={`p-1.5 rounded-lg ${textAlign === 'right' ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Align Right"
            >
              <AlignRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 5. FORMS SUB-BAR */}
      {activeMode === 'forms' && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-white p-1 rounded-xl border border-[#E8EAEF] gap-1">
            <button
              onClick={() => onFormToolChange('text-field')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold ${
                activeFormTool === 'text-field' ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Type size={14} />
              <span>Text Field</span>
            </button>
            <button
              onClick={() => onFormToolChange('multiline-text')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold ${
                activeFormTool === 'multiline-text' ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <List size={14} />
              <span>Multiline Area</span>
            </button>
            <button
              onClick={() => onFormToolChange('checkbox')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold ${
                activeFormTool === 'checkbox' ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CheckSquare size={14} />
              <span>Checkbox</span>
            </button>
            <button
              onClick={() => onFormToolChange('dropdown')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold ${
                activeFormTool === 'dropdown' ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronDown size={14} />
              <span>Dropdown</span>
            </button>
            <button
              onClick={() => onFormToolChange('signature-field')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold ${
                activeFormTool === 'signature-field' ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileSignature size={14} />
              <span>Signature Field</span>
            </button>
          </div>
          <span className="text-gray-500 text-[11px]">Click anywhere on page to place interactive form field</span>
        </div>
      )}

      {/* 6. SIGN SUB-BAR */}
      {activeMode === 'sign' && (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onOpenSignatureModal('type')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF0EE] text-[#E5322D] rounded-xl border border-[#E5322D]/30 font-bold hover:bg-[#FFE5E2] shadow-2xs"
          >
            <PenTool size={15} />
            <span>+ Type Signature</span>
          </button>
          <button
            onClick={() => onOpenSignatureModal('draw')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-800 rounded-xl border border-[#E8EAEF] font-bold hover:bg-gray-50 shadow-2xs"
          >
            <Pencil size={15} className="text-[#E5322D]" />
            <span>+ Draw Signature</span>
          </button>
          <button
            onClick={() => onOpenSignatureModal('upload')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-800 rounded-xl border border-[#E8EAEF] font-bold hover:bg-gray-50 shadow-2xs"
          >
            <ImageIcon size={15} className="text-[#E5322D]" />
            <span>+ Upload Signature</span>
          </button>
          <button
            onClick={() => onOpenSignatureModal('initials')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-800 rounded-xl border border-[#E8EAEF] font-bold hover:bg-gray-50 shadow-2xs"
          >
            <span>+ Initials</span>
          </button>
          <button
            onClick={() => onOpenSignatureModal('company-stamp')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-800 rounded-xl border border-[#E8EAEF] font-bold hover:bg-gray-50 shadow-2xs"
          >
            <StampIcon size={15} className="text-[#E5322D]" />
            <span>+ Company Stamp</span>
          </button>
        </div>
      )}

      {/* 7. WHITEOUT SUB-BAR */}
      {activeMode === 'whiteout' && (
        <div className="flex items-center gap-2">
          <div className="p-1 px-2.5 bg-white rounded-xl border border-[#E8EAEF] text-gray-700 font-medium">
            Drag a rectangle over content you want to erase/cover with whiteout
          </div>
          <div className="flex items-center gap-1">
            {['#FFFFFF', '#F8FAFC', '#FEF3C7'].map((c) => (
              <button
                key={c}
                onClick={() => onFillColorChange(c)}
                className={`w-6 h-6 rounded-lg border transition-transform ${
                  fillColor === c ? 'scale-110 ring-2 ring-[#E5322D]' : 'border-gray-300'
                }`}
                style={{ backgroundColor: c }}
                title={`Whiteout color: ${c}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
