import React from 'react';
import { ToolConfigSchema } from '../../../config/toolConfigurations';
import { FileText, CheckCircle2 } from 'lucide-react';

interface GenericToolPanelProps {
  config: ToolConfigSchema;
  totalFiles: number;
  options?: Record<string, any>;
  onOptionsChange?: (newOptions: Record<string, any>) => void;
}

export function GenericToolPanel({
  config,
  totalFiles,
  options = {},
  onOptionsChange
}: GenericToolPanelProps) {
  const updateOption = (key: string, value: any) => {
    if (onOptionsChange) {
      onOptionsChange({ ...options, [key]: value });
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h3 className="text-base font-bold text-[#272830] mb-1">{config.title.toUpperCase()} OPTIONS</h3>
        <p className="text-xs text-[#737680] leading-relaxed">{config.description}</p>
      </div>

      {/* FILE STATUS BADGE */}
      <div className="p-3.5 bg-white border border-[#E8EAEF] rounded-2xl flex items-center gap-3 shadow-xs">
        <div className="w-9 h-9 rounded-xl bg-[#FFF0EE] text-[#E5322D] flex items-center justify-center shrink-0">
          <FileText size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#272830]">
            {totalFiles} {totalFiles === 1 ? 'file' : 'files'} selected
          </span>
          <span className="text-[11px] text-[#2E7D32] flex items-center gap-1 font-medium">
            <CheckCircle2 size={12} /> Ready for processing
          </span>
        </div>
      </div>

      {/* TAILORED DYNAMIC CONTROLS BASED ON TOOL TYPE */}
      {config.id === 'ocr-pdf' && (
        <div className="flex flex-col gap-3 pt-2">
          <label className="text-xs font-bold text-[#272830]">Document Language:</label>
          <select
            value={options.language || 'English'}
            onChange={(e) => updateOption('language', e.target.value)}
            className="w-full h-10 px-3 border border-[#E8EAEF] rounded-xl text-xs font-bold text-[#272830] bg-white outline-none focus:border-[#E5322D]"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Auto">Auto Detect</option>
          </select>
        </div>
      )}

      {config.id === 'pdf-to-pdfa' && (
        <div className="flex flex-col gap-3 pt-2">
          <label className="text-xs font-bold text-[#272830]">PDF/A ISO Conformance Standard:</label>
          <div className="flex flex-col gap-2">
            {(['PDF/A-1b', 'PDF/A-2b', 'PDF/A-3b'] as const).map((spec) => (
              <label
                key={spec}
                onClick={() => updateOption('spec', spec)}
                className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between select-none ${
                  (options.spec || 'PDF/A-2b') === spec
                    ? 'border-[#E5322D] bg-[#FFF0EE]/30'
                    : 'border-[#E8EAEF] bg-white'
                }`}
              >
                <span className="text-xs font-bold text-[#272830]">{spec}</span>
                <input
                  type="radio"
                  name="pdfa-spec"
                  checked={(options.spec || 'PDF/A-2b') === spec}
                  onChange={() => updateOption('spec', spec)}
                  className="accent-[#E5322D]"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {config.id === 'ai-pdf-summarizer' && (
        <div className="flex flex-col gap-3 pt-2">
          <label className="text-xs font-bold text-[#272830]">Summary Depth:</label>
          <div className="grid grid-cols-3 gap-2">
            {(['short', 'medium', 'detailed'] as const).map((len) => (
              <button
                key={len}
                type="button"
                onClick={() => updateOption('length', len)}
                className={`py-2 text-xs font-bold capitalize rounded-xl border cursor-pointer ${
                  (options.length || 'medium') === len
                    ? 'border-[#E5322D] bg-[#FFF0EE] text-[#E5322D]'
                    : 'border-[#E8EAEF] bg-white text-[#272830]'
                }`}
              >
                {len}
              </button>
            ))}
          </div>
        </div>
      )}

      {config.id === 'translate-pdf' && (
        <div className="flex flex-col gap-3 pt-2">
          <label className="text-xs font-bold text-[#272830]">Target Language:</label>
          <select
            value={options.targetLang || 'Spanish'}
            onChange={(e) => updateOption('targetLang', e.target.value)}
            className="w-full h-10 px-3 border border-[#E8EAEF] rounded-xl text-xs font-bold text-[#272830] bg-white outline-none focus:border-[#E5322D]"
          >
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Italian">Italian</option>
            <option value="Portuguese">Portuguese</option>
            <option value="Japanese">Japanese</option>
            <option value="Chinese">Chinese</option>
          </select>
        </div>
      )}
    </div>
  );
}
