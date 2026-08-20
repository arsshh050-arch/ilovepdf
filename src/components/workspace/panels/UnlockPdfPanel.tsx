import React, { useState } from 'react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';

interface UnlockPdfPanelProps {
  password: string;
  onPasswordChange: (p: string) => void;
  confirmedPermission: boolean;
  onConfirmedPermissionChange: (c: boolean) => void;
}

export function UnlockPdfPanel({
  password,
  onPasswordChange,
  confirmedPermission,
  onConfirmedPermissionChange
}: UnlockPdfPanelProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h3 className="text-base font-bold text-[#272830] mb-1">UNLOCK PDF DOCUMENT</h3>
        <p className="text-xs text-[#737680]">Enter password to decrypt and remove protection.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#272830]">Password (if required):</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Enter document password..."
              className="w-full h-10 pl-3 pr-10 border border-[#E8EAEF] rounded-xl text-xs font-bold text-[#272830] outline-none focus:border-[#E5322D]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-[#888A92] hover:text-[#272830] cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2.5 pt-2 border-t border-[#E8EAEF] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={confirmedPermission}
            onChange={(e) => onConfirmedPermissionChange(e.target.checked)}
            className="w-4 h-4 mt-0.5 accent-[#E5322D] rounded shrink-0"
          />
          <span className="text-xs text-[#555760] leading-tight">
            I confirm that I have legal permission to unlock and decrypt this document.
          </span>
        </label>
      </div>
    </div>
  );
}
