import React, { useState } from 'react';
import { X, Link as LinkIcon, ExternalLink, Bookmark } from 'lucide-react';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPages: number;
  initialUrl?: string;
  initialPage?: number;
  onSaveLink: (data: { url?: string; targetPage?: number }) => void;
}

export function LinkModal({
  isOpen,
  onClose,
  totalPages,
  initialUrl = 'https://',
  initialPage = 1,
  onSaveLink,
}: LinkModalProps) {
  const [linkType, setLinkType] = useState<'url' | 'page'>(initialUrl ? 'url' : 'page');
  const [url, setUrl] = useState(initialUrl);
  const [targetPage, setTargetPage] = useState(initialPage);

  if (!isOpen) return null;

  const handleApply = () => {
    if (linkType === 'url') {
      onSaveLink({ url: url.trim() });
    } else {
      onSaveLink({ targetPage });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E8EAEF] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="p-4 px-6 border-b border-[#E8EAEF] flex items-center justify-between bg-[#FAFBFD]">
          <div className="flex items-center gap-2">
            <LinkIcon size={18} className="text-[#E5322D]" />
            <h3 className="text-lg font-bold text-[#272830]">Add Link</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setLinkType('url')}
              className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 ${
                linkType === 'url'
                  ? 'border-[#E5322D] bg-[#FFF0EE] text-[#E5322D]'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ExternalLink size={14} />
              Web URL
            </button>
            <button
              type="button"
              onClick={() => setLinkType('page')}
              className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 ${
                linkType === 'page'
                  ? 'border-[#E5322D] bg-[#FFF0EE] text-[#E5322D]'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Bookmark size={14} />
              Jump to Page
            </button>
          </div>

          {linkType === 'url' ? (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Destination URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3.5 py-2 border border-[#E8EAEF] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E5322D]/20 focus:border-[#E5322D]"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Target Page Number</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={targetPage}
                  onChange={(e) => setTargetPage(Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1)))}
                  className="w-24 px-3 py-2 border border-[#E8EAEF] rounded-xl text-sm font-semibold"
                />
                <span className="text-xs text-gray-500">out of {totalPages} pages</span>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 px-6 border-t border-[#E8EAEF] bg-[#FAFBFD] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 text-sm font-bold text-white bg-[#E5322D] hover:bg-[#CC2521] rounded-xl shadow-xs flex items-center gap-2"
          >
            Apply Link
          </button>
        </div>
      </div>
    </div>
  );
}
