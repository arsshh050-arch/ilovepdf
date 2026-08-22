import React, { useState } from 'react';
import { PenTool, ShieldCheck, PenLine, Type, Calendar, FileText, Stamp, Crown } from 'lucide-react';


export type SignMode = 'simple' | 'digital';

export interface FieldType {
  id: string;
  type: 'signature' | 'initials' | 'name' | 'date' | 'text' | 'stamp';
  label: string;
  icon: React.ElementType;
  required?: boolean;
}

const FIELDS: FieldType[] = [
  { id: 'f-sig', type: 'signature', label: 'Signature', icon: PenLine, required: true },
  { id: 'f-ini', type: 'initials', label: 'Initials', icon: Type },
  { id: 'f-nam', type: 'name', label: 'Name', icon: Type },
  { id: 'f-dat', type: 'date', label: 'Date', icon: Calendar },
  { id: 'f-txt', type: 'text', label: 'Text', icon: FileText },
  { id: 'f-stm', type: 'stamp', label: 'Company Stamp', icon: Stamp },
];

export function RightPanel({
  onAddField,
  onSignDoc,
  onMultiSign,
  isReady,
}: {
  onAddField: (type: FieldType['type']) => void;
  onSignDoc: () => void;
  onMultiSign: () => void;
  isReady: boolean;
}) {
  const [signMode, setSignMode] = useState<SignMode>('simple');
  const [showPremiumGate, setShowPremiumGate] = useState(false);

  return (
    <div className="w-80 bg-white border-l border-[#E0E2E8] flex flex-col h-full flex-shrink-0 z-20">
      <div className="p-6 overflow-y-auto flex-1">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Signing options</h2>

        <div className="space-y-3 mb-8">
          <button
            onClick={() => setSignMode('simple')}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
              signMode === 'simple' ? 'border-[#E5322D] bg-red-50/20' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`p-2 rounded-full ${signMode === 'simple' ? 'bg-[#E5322D] text-white' : 'bg-gray-100 text-gray-500'}`}>
              <PenTool size={20} />
            </div>
            <div>
              <div className="font-bold text-gray-800">Simple Signature</div>
              <div className="text-xs text-gray-500 mt-1">Standard electronic signature</div>
            </div>
          </button>

          <button
            onClick={() => {
              setSignMode('digital');
              setShowPremiumGate(true);
            }}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
              signMode === 'digital' ? 'border-[#E5322D] bg-red-50/20' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`p-2 rounded-full ${signMode === 'digital' ? 'bg-[#E5322D] text-white' : 'bg-gray-100 text-gray-500'}`}>
              <ShieldCheck size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800">Digital Signature</span>
                <Crown size={14} className="text-yellow-500 fill-yellow-500" />
              </div>
              <div className="text-xs text-gray-500 mt-1">Secure certified signature</div>
            </div>
          </button>
        </div>

        {showPremiumGate && signMode === 'digital' && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
              <Crown size={16} className="text-blue-600" /> Premium Feature
            </h3>
            <p className="text-sm text-blue-700 mb-4">You have selected Premium features. Upgrade to Premium to continue.</p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors">
              Upgrade to Premium
            </button>
            <button 
              onClick={() => {
                setSignMode('simple');
                setShowPremiumGate(false);
              }}
              className="w-full mt-2 text-blue-600 hover:text-blue-800 font-semibold text-sm py-2"
            >
              Continue with Free
            </button>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Fields</h3>
          <p className="text-xs text-gray-400 mb-4">Click to add fields to your document.</p>
          
          <div className="space-y-2">
            {FIELDS.map((f) => (
              <button
                key={f.id}
                onClick={() => onAddField(f.type)}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-left transition-colors group"
              >
                <div className="text-gray-400 group-hover:text-[#E5322D] transition-colors">
                  <f.icon size={18} />
                </div>
                <span className="text-sm font-semibold text-gray-700 flex-1">{f.label}</span>
                {f.required && (
                  <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">REQ</span>
                )}
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="p-4 bg-gray-50 border-t border-[#E0E2E8] space-y-3">
        <button
          onClick={onSignDoc}
          disabled={!isReady}
          className={`w-full font-bold text-lg py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2
            ${isReady ? 'bg-[#E5322D] hover:bg-[#D72F2A] text-white hover:shadow-lg transform hover:-translate-y-0.5' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
          `}
        >
          <span>Sign <span className="font-normal">&rarr;</span></span>
        </button>

        <div className="text-center">
          <span className="text-xs text-gray-500">or</span>
        </div>

        <button
          onClick={onMultiSign}
          className="w-full font-bold text-sm text-[#272830] bg-white border-2 border-gray-200 hover:border-gray-300 py-3 rounded-xl transition-all"
        >
          Request Signatures
        </button>
      </div>
    </div>
  );
}
