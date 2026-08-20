import React, { useState, useRef, useEffect } from 'react';
import { X, Type, PenTool, Upload, Check, Trash2 } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSignature: (dataUrl: string, sigType: 'draw' | 'type' | 'upload' | 'initials' | 'company-stamp') => void;
  title?: string;
  defaultTab?: 'type' | 'draw' | 'upload' | 'initials' | 'company-stamp';
}

const SIGNATURE_FONTS = [
  { name: 'Dancing Script', font: 'Dancing Script, cursive' },
  { name: 'Great Vibes', font: 'Great Vibes, cursive' },
  { name: 'Caveat', font: 'Caveat, cursive' },
  { name: 'Pacifico', font: 'Pacifico, cursive' },
  { name: 'Sacramento', font: 'Sacramento, cursive' },
  { name: 'Alex Brush', font: 'Alex Brush, cursive' },
];

const INK_COLORS = ['#000000', '#1E3A8A', '#DC2626', '#059669'];

export function SignatureModal({
  isOpen,
  onClose,
  onSaveSignature,
  title = 'Create Signature',
  defaultTab = 'type',
}: SignatureModalProps) {
  const [activeTab, setActiveTab] = useState<'type' | 'draw' | 'upload' | 'initials' | 'company-stamp'>(defaultTab);
  const [typedName, setTypedName] = useState('Arshpreet Singh');
  const [initialsText, setInitialsText] = useState('AS');
  const [selectedFontIndex, setSelectedFontIndex] = useState(0);
  const [inkColor, setInkColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      // Load Google fonts for cursive signatures
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Alex+Brush&family=Caveat:wght@600&family=Dancing+Script:wght@600&family=Great+Vibes&family=Pacifico&family=Sacramento&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, [isOpen, defaultTab]);

  // Clear canvas
  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setHasDrawn(false);
  };

  // Drawing canvas mouse/touch handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = strokeWidth * (canvas.width / rect.width);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    setIsDrawing(true);
    setHasDrawn(true);
  };

  const drawMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate transparent PNG from Typed text
  const generateTypedDataUrl = (text: string, fontStyle: string, color: string): string => {
    const offscreen = document.createElement('canvas');
    offscreen.width = 600;
    offscreen.height = 200;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return '';

    ctx.fillStyle = color;
    ctx.font = `64px ${fontStyle}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(text, offscreen.width / 2, offscreen.height / 2);

    return offscreen.toDataURL('image/png');
  };

  // Save Signature
  const handleApply = () => {
    if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (canvas && hasDrawn) {
        onSaveSignature(canvas.toDataURL('image/png'), 'draw');
        onClose();
      }
    } else if (activeTab === 'type') {
      if (typedName.trim()) {
        const font = SIGNATURE_FONTS[selectedFontIndex].font;
        const dataUrl = generateTypedDataUrl(typedName.trim(), font, inkColor);
        onSaveSignature(dataUrl, 'type');
        onClose();
      }
    } else if (activeTab === 'initials') {
      if (initialsText.trim()) {
        const font = SIGNATURE_FONTS[selectedFontIndex].font;
        const dataUrl = generateTypedDataUrl(initialsText.trim(), font, inkColor);
        onSaveSignature(dataUrl, 'initials');
        onClose();
      }
    } else if (activeTab === 'upload' || activeTab === 'company-stamp') {
      if (uploadedImage) {
        onSaveSignature(uploadedImage, activeTab);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-[#E8EAEF] overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-4 px-6 border-b border-[#E8EAEF] flex items-center justify-between bg-[#FAFBFD]">
          <h3 className="text-lg font-bold text-[#272830]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex border-b border-[#E8EAEF] bg-gray-50/70 px-6 pt-2">
          <button
            onClick={() => setActiveTab('type')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'type'
                ? 'border-[#E5322D] text-[#E5322D]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Type size={16} />
            Type
          </button>
          <button
            onClick={() => setActiveTab('draw')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'draw'
                ? 'border-[#E5322D] text-[#E5322D]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <PenTool size={16} />
            Draw
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-[#E5322D] text-[#E5322D]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Upload size={16} />
            Upload
          </button>
          <button
            onClick={() => setActiveTab('initials')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'initials'
                ? 'border-[#E5322D] text-[#E5322D]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Initials
          </button>
          <button
            onClick={() => setActiveTab('company-stamp')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'company-stamp'
                ? 'border-[#E5322D] text-[#E5322D]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Company Stamp
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
          {/* TAB 1: TYPE */}
          {activeTab === 'type' && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Enter your full name</label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="e.g. Arshpreet Singh"
                  className="w-full px-3.5 py-2.5 border border-[#E8EAEF] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E5322D]/20 focus:border-[#E5322D]"
                />
              </div>

              {/* FONT PREVIEWS */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Choose handwriting style</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {SIGNATURE_FONTS.map((fontItem, idx) => (
                    <button
                      key={fontItem.name}
                      onClick={() => setSelectedFontIndex(idx)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedFontIndex === idx
                          ? 'border-[#E5322D] bg-[#FFF0EE] shadow-xs'
                          : 'border-[#E8EAEF] bg-white hover:border-gray-300'
                      }`}
                    >
                      <span
                        style={{ fontFamily: fontItem.font, color: inkColor }}
                        className="text-2xl block truncate"
                      >
                        {typedName || 'Signature'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DRAW */}
          {activeTab === 'draw' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Draw with your mouse, trackpad, or finger</span>
                <button
                  onClick={handleClearCanvas}
                  className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 p-1 rounded-sm"
                >
                  <Trash2 size={13} />
                  Clear
                </button>
              </div>

              <div className="border border-[#E8EAEF] rounded-2xl bg-[#FCFDFF] overflow-hidden relative touch-none">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={220}
                  className="w-full h-[200px] cursor-crosshair block"
                  onMouseDown={startDrawing}
                  onMouseMove={drawMove}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={drawMove}
                  onTouchEnd={stopDrawing}
                />
                {!hasDrawn && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-300 font-medium text-sm">
                    Sign on this line
                  </div>
                )}
                <div className="absolute bottom-8 left-8 right-8 border-b border-gray-200 pointer-events-none" />
              </div>
            </div>
          )}

          {/* TAB 3: UPLOAD & COMPANY STAMP */}
          {(activeTab === 'upload' || activeTab === 'company-stamp') && (
            <div className="flex flex-col gap-4">
              <div className="border-2 border-dashed border-[#E8EAEF] hover:border-[#E5322D] rounded-2xl p-8 text-center flex flex-col items-center justify-center transition-colors bg-[#FAFBFD]">
                {uploadedImage ? (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={uploadedImage}
                      alt="Uploaded Signature"
                      className="max-h-36 max-w-full object-contain rounded-lg border border-gray-200 p-2 bg-white"
                    />
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      Remove and choose another
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload size={36} className="text-[#E5322D]" />
                    <span className="text-sm font-bold text-gray-800">
                      {activeTab === 'company-stamp' ? 'Upload Company Stamp / Seal' : 'Upload Signature Image'}
                    </span>
                    <span className="text-xs text-gray-500">Supports PNG, JPG, JPEG (Transparent PNG recommended)</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: INITIALS */}
          {activeTab === 'initials' && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Enter your Initials</label>
                <input
                  type="text"
                  maxLength={4}
                  value={initialsText}
                  onChange={(e) => setInitialsText(e.target.value.toUpperCase())}
                  placeholder="e.g. AS"
                  className="w-full px-3.5 py-2.5 border border-[#E8EAEF] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E5322D]/20 focus:border-[#E5322D]"
                />
              </div>

              {/* FONT PREVIEWS FOR INITIALS */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Choose initials style</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {SIGNATURE_FONTS.map((fontItem, idx) => (
                    <button
                      key={fontItem.name}
                      onClick={() => setSelectedFontIndex(idx)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedFontIndex === idx
                          ? 'border-[#E5322D] bg-[#FFF0EE] shadow-xs'
                          : 'border-[#E8EAEF] bg-white hover:border-gray-300'
                      }`}
                    >
                      <span
                        style={{ fontFamily: fontItem.font, color: inkColor }}
                        className="text-3xl block truncate"
                      >
                        {initialsText || 'AS'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* INK COLOR SELECTOR */}
          {(activeTab === 'type' || activeTab === 'draw' || activeTab === 'initials') && (
            <div className="flex items-center justify-between pt-2 border-t border-[#E8EAEF]">
              <span className="text-xs font-semibold text-gray-700">Ink Color</span>
              <div className="flex items-center gap-2">
                {INK_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setInkColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      inkColor === c ? 'scale-125 border-[#E5322D]' : 'border-white'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 px-6 border-t border-[#E8EAEF] bg-[#FAFBFD] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 text-sm font-bold text-white bg-[#E5322D] hover:bg-[#CC2521] rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Check size={16} />
            Apply Signature
          </button>
        </div>
      </div>
    </div>
  );
}
