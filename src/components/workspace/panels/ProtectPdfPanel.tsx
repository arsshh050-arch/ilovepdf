import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface ProtectPdfPanelProps {
  password: string;
  onPasswordChange: (p: string) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (cp: string) => void;
}

export function ProtectPdfPanel({
  password,
  onPasswordChange,
  confirmPassword,
  onConfirmPasswordChange
}: ProtectPdfPanelProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Simple password strength calculation
  const getStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-gray-200' };
    if (pass.length < 6) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (pass.length < 10) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-green-500' };
  };

  const strength = getStrength(password);

  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h3 className="text-base font-bold text-[#272830] mb-1">PROTECT PDF WITH PASSWORD</h3>
        <p className="text-xs text-[#737680]">Set a password to encrypt and secure your PDF document.</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* PASSWORD INPUT */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#272830]">Type password:</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Enter password..."
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

          {/* STRENGTH METER */}
          {password && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-[#E8EAEF] rounded-full overflow-hidden flex">
                <div className={`h-full transition-all ${strength.color}`} style={{ width: `${(strength.score / 3) * 100}%` }} />
              </div>
              <span className="text-[11px] font-bold text-[#555760]">{strength.label}</span>
            </div>
          )}
        </div>

        {/* CONFIRM PASSWORD INPUT */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#272830]">Repeat password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            placeholder="Repeat password..."
            className="w-full h-10 px-3 border border-[#E8EAEF] rounded-xl text-xs font-bold text-[#272830] outline-none focus:border-[#E5322D]"
          />
          {confirmPassword && confirmPassword !== password && (
            <span className="text-[11px] text-[#E5322D] font-medium">Passwords do not match</span>
          )}
        </div>
      </div>
    </div>
  );
}
