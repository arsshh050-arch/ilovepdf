import React from 'react';
import {
  X,
  Sliders,
  Type,
  Square,
  Image as ImageIcon,
  PenTool,
  MessageSquare,
  FormInput,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  RotateCw,
  Lock,
  Unlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough as StrikeIcon,
} from 'lucide-react';
import {
  EditorObject,
  TextEditorObject,
  ShapeEditorObject,
  ImageEditorObject,
  StampEditorObject,
  SignatureEditorObject,
  FormFieldEditorObject,
  StickyNoteObject,
  PageInfo,
} from '../../types/pdfEditor';

interface EditorRightPropertiesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedObject: EditorObject | null;
  onUpdateObject: (updated: Partial<EditorObject>) => void;
  onDeleteSelectedObject: () => void;
  onDuplicateSelectedObject: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  currentPageInfo?: PageInfo;
  enableSnapping: boolean;
  onToggleSnapping: () => void;
}

const COLOR_PALETTE = [
  '#000000',
  '#E5322D',
  '#2563EB',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#6B7280',
  '#FFFFFF',
];

export function EditorRightPropertiesPanel({
  isOpen,
  onClose,
  selectedObject,
  onUpdateObject,
  onDeleteSelectedObject,
  onDuplicateSelectedObject,
  onBringForward,
  onSendBackward,
  currentPageInfo,
  enableSnapping,
  onToggleSnapping,
}: EditorRightPropertiesPanelProps) {
  if (!isOpen) return null;

  return (
    <aside className="w-72 h-full bg-white border-l border-[#E8EAEF] flex flex-col z-20 shrink-0 select-none shadow-xs">
      {/* PANEL HEADER */}
      <div className="p-3 px-4 border-b border-[#E8EAEF] flex items-center justify-between bg-[#FAFBFD]">
        <div className="flex items-center gap-2">
          <Sliders size={15} className="text-[#E5322D]" />
          <h4 className="text-xs font-bold text-gray-800">
            {selectedObject ? 'Object Properties' : 'Document Settings'}
          </h4>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* BODY CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {selectedObject ? (
          <>
            {/* OBJECT TYPE BADGE & LAYER CONTROLS */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="font-extrabold text-[#E5322D] uppercase tracking-wider text-[11px] bg-[#FFF0EE] px-2.5 py-1 rounded-md">
                {selectedObject.type}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={onDuplicateSelectedObject}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                  title="Duplicate (Ctrl+D)"
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={onBringForward}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                  title="Bring Forward"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={onSendBackward}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                  title="Send Backward"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={onDeleteSelectedObject}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete (Delete/Backspace)"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* 1. TEXT OBJECT PROPERTIES */}
            {selectedObject.type === 'text' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Text Content</label>
                  <textarea
                    value={(selectedObject as TextEditorObject).text}
                    onChange={(e) => onUpdateObject({ text: e.target.value })}
                    rows={3}
                    className="w-full p-2 border border-[#E8EAEF] rounded-xl font-medium text-xs focus:ring-1 focus:ring-[#E5322D] outline-hidden resize-y"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Font Size</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={8}
                      max={72}
                      value={(selectedObject as TextEditorObject).fontSize || 14}
                      onChange={(e) => onUpdateObject({ fontSize: parseInt(e.target.value) })}
                      className="flex-1 accent-[#E5322D]"
                    />
                    <span className="w-8 text-right font-bold">
                      {(selectedObject as TextEditorObject).fontSize || 14}pt
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Color</label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {COLOR_PALETTE.map((c) => (
                      <button
                        key={c}
                        onClick={() => onUpdateObject({ color: c })}
                        className={`w-5 h-5 rounded-full border transition-transform ${
                          (selectedObject as TextEditorObject).color === c
                            ? 'scale-125 ring-2 ring-[#E5322D]'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. SHAPE OBJECT PROPERTIES */}
            {selectedObject.type === 'shape' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Border Color</label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {COLOR_PALETTE.map((c) => (
                      <button
                        key={c}
                        onClick={() => onUpdateObject({ strokeColor: c })}
                        className={`w-5 h-5 rounded-full border transition-transform ${
                          (selectedObject as ShapeEditorObject).strokeColor === c
                            ? 'scale-125 ring-2 ring-[#E5322D]'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Fill Color</label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => onUpdateObject({ fillColor: 'transparent' })}
                      className="px-2 py-0.5 border rounded text-[10px] font-bold"
                    >
                      None
                    </button>
                    {COLOR_PALETTE.map((c) => (
                      <button
                        key={c}
                        onClick={() => onUpdateObject({ fillColor: c })}
                        className={`w-5 h-5 rounded-full border transition-transform ${
                          (selectedObject as ShapeEditorObject).fillColor === c
                            ? 'scale-125 ring-2 ring-[#E5322D]'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Stroke Thickness</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={1}
                      max={16}
                      value={(selectedObject as ShapeEditorObject).strokeWidth || 2}
                      onChange={(e) => onUpdateObject({ strokeWidth: parseInt(e.target.value) })}
                      className="flex-1 accent-[#E5322D]"
                    />
                    <span className="w-8 text-right font-bold">
                      {(selectedObject as ShapeEditorObject).strokeWidth || 2}px
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. FORM FIELD PROPERTIES */}
            {selectedObject.type === 'form-field' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Field Name</label>
                  <input
                    type="text"
                    value={(selectedObject as FormFieldEditorObject).name || ''}
                    onChange={(e) => onUpdateObject({ name: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-[#E8EAEF] rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Default Value</label>
                  <input
                    type="text"
                    value={String((selectedObject as FormFieldEditorObject).defaultValue || '')}
                    onChange={(e) => onUpdateObject({ defaultValue: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-[#E8EAEF] rounded-xl text-xs"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <label className="text-[11px] font-semibold text-gray-600">Required Field</label>
                  <input
                    type="checkbox"
                    checked={!!(selectedObject as FormFieldEditorObject).required}
                    onChange={(e) => onUpdateObject({ required: e.target.checked })}
                    className="w-4 h-4 text-[#E5322D] rounded"
                  />
                </div>
              </div>
            )}

            {/* OPACITY SLIDER */}
            <div className="pt-2 border-t border-gray-100">
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Opacity</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={Math.round(((selectedObject.opacity !== undefined ? selectedObject.opacity : 1) * 100))}
                  onChange={(e) => onUpdateObject({ opacity: parseInt(e.target.value) / 100 })}
                  className="flex-1 accent-[#E5322D]"
                />
                <span className="w-10 text-right font-bold">
                  {Math.round(((selectedObject.opacity !== undefined ? selectedObject.opacity : 1) * 100))}%
                </span>
              </div>
            </div>

            {/* ROTATION SLIDER */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Rotation</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={selectedObject.rotation || 0}
                  onChange={(e) => onUpdateObject({ rotation: parseInt(e.target.value) })}
                  className="flex-1 accent-[#E5322D]"
                />
                <span className="w-10 text-right font-bold">{selectedObject.rotation || 0}°</span>
              </div>
            </div>
          </>
        ) : (
          /* NO OBJECT SELECTED: DOCUMENT GENERAL SETTINGS */
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl border border-[#E8EAEF] space-y-2">
              <h5 className="font-bold text-gray-800 text-xs">Document Metrics</h5>
              <div className="text-[11px] text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Page Width:</span>
                  <span className="font-semibold">{Math.round(currentPageInfo?.width || 595)} pt</span>
                </div>
                <div className="flex justify-between">
                  <span>Page Height:</span>
                  <span className="font-semibold">{Math.round(currentPageInfo?.height || 842)} pt</span>
                </div>
                <div className="flex justify-between">
                  <span>Orientation:</span>
                  <span className="font-semibold">
                    {(currentPageInfo?.width || 595) > (currentPageInfo?.height || 842) ? 'Landscape' : 'Portrait'}
                  </span>
                </div>
              </div>
            </div>

            {/* SNAPPING TOGGLE */}
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E8EAEF]">
              <div>
                <p className="font-bold text-gray-800 text-xs">Smart Alignment Guides</p>
                <p className="text-[10px] text-gray-500">Snap objects to center & margin guides</p>
              </div>
              <input
                type="checkbox"
                checked={enableSnapping}
                onChange={onToggleSnapping}
                className="w-4 h-4 text-[#E5322D] rounded"
              />
            </div>

            <div className="text-center py-6 text-gray-400">
              <p className="text-xs">Click any element on the canvas to inspect and edit its properties.</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
