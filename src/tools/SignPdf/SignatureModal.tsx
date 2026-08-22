import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { X, Upload, Eraser } from 'lucide-react';

interface SignatureModalProps {
  onClose: () => void;
  onApply: (dataUrl: string) => void;
}

export function SignatureModal({ onClose, onApply }: SignatureModalProps) {
  const [activeTab, setActiveTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedText, setTypedText] = useState('');
  const [fontFamily, setFontFamily] = useState('Caveat, cursive'); // We'll assume some fonts or use standard
  const sigCanvas = useRef<SignatureCanvas>(null);

  const handleApply = () => {
    if (activeTab === 'draw') {
      if (sigCanvas.current?.isEmpty()) {
        alert("Please draw your signature first.");
        return;
      }
      onApply(sigCanvas.current!.toDataURL('image/png'));
    } else if (activeTab === 'type') {
      if (!typedText) return;
      // Convert typed text to image
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 150;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#000';
        ctx.font = `48px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedText, canvas.width / 2, canvas.height / 2);
        onApply(canvas.toDataURL('image/png'));
      }
    }
    onClose();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onApply(ev.target.result as string);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Create your signature</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="px-6 pt-4">
          <div className="flex space-x-6 border-b border-gray-200">
            {['draw', 'type', 'upload'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors relative ${
                  activeTab === tab ? 'text-[#E5322D]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E5322D]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex-1 min-h-[250px]">
          {activeTab === 'draw' && (
            <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden h-[200px]">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{ className: 'w-full h-full cursor-crosshair' }}
              />
              <button 
                onClick={() => sigCanvas.current?.clear()}
                className="absolute bottom-3 right-3 flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm"
              >
                <Eraser size={16} /> Clear
              </button>
            </div>
          )}

          {activeTab === 'type' && (
            <div className="space-y-4">
              <input 
                type="text" 
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder="Type your name here..."
                className="w-full text-center text-2xl p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E5322D]"
              />
              <div className="flex gap-4 justify-center">
                <button onClick={() => setFontFamily('Caveat, cursive')} className="px-4 py-2 border rounded hover:bg-gray-100" style={{ fontFamily: 'Caveat, cursive' }}>Style 1</button>
                <button onClick={() => setFontFamily('Georgia, serif')} className="px-4 py-2 border rounded hover:bg-gray-100" style={{ fontFamily: 'Georgia, serif' }}>Style 2</button>
                <button onClick={() => setFontFamily('Courier New, monospace')} className="px-4 py-2 border rounded hover:bg-gray-100" style={{ fontFamily: 'Courier New, monospace' }}>Style 3</button>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="h-[200px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors relative cursor-pointer">
              <input 
                type="file" 
                accept="image/png, image/jpeg" 
                onChange={handleUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload size={40} className="text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium">Click or drag an image here</p>
              <p className="text-sm text-gray-400 mt-1">PNG, JPG with transparent background recommended</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button 
            onClick={handleApply}
            className="px-6 py-2.5 rounded-lg font-bold text-white bg-[#E5322D] hover:bg-[#D72F2A]"
          >
            Apply Signature
          </button>
        </div>
      </div>
    </div>
  );
}
