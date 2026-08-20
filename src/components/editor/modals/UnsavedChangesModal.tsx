import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onDiscard: () => void;
  onSave: () => void;
}

export function UnsavedChangesModal({
  isOpen,
  onCancel,
  onDiscard,
  onSave,
}: UnsavedChangesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E8EAEF] overflow-hidden p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 text-amber-600">
          <div className="p-3 bg-amber-50 rounded-2xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Unsaved Changes</h3>
            <p className="text-xs text-gray-500">You have unsaved edits in this document.</p>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Leaving or closing now will discard any unsaved annotations, text modifications, or changes made to this PDF.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Stay & Edit
          </button>
          <button
            onClick={onDiscard}
            className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            Discard Changes
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2 text-sm font-bold text-white bg-[#E5322D] hover:bg-[#CC2521] rounded-xl shadow-xs transition-colors"
          >
            Save & Export
          </button>
        </div>
      </div>
    </div>
  );
}
