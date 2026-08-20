import React, { useState } from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

interface AuthInputProps {
  label: string;
  icon?: any;
  error?: string;
  className?: string;
  name: string;
  type?: string;
  autoComplete?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id?: string;
}

export function AuthInput({ label, icon: Icon, error, className = '', ...props }: AuthInputProps) {
  const id = props.id || props.name;
  
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-[14px] font-[500] text-[#272830] mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon size={18} className="text-[#999BA3]" />
          </div>
        )}
        <input
          id={id}
          className={`
            w-full h-[48px] bg-white border rounded-[6px] text-[15px] text-[#272830] placeholder-[#AEB2BC] transition-all
            focus:outline-none focus:ring-4 focus:ring-opacity-15
            ${Icon ? 'pl-10' : 'pl-4'} pr-4
            ${error 
              ? 'border-[#E5322D] focus:border-[#E5322D] focus:ring-[#E5322D]' 
              : 'border-[#AEB2BC] focus:border-[#E5322D] focus:ring-[#E5322D]'
            }
          `}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] text-[#E5322D] font-[500]">
          {error}
        </p>
      )}
    </div>
  );
}

export function PasswordInput({ label, error, className = '', ...props }: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const id = props.id || props.name;
  
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-[14px] font-[500] text-[#272830] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          {/* We'll pass the lock icon in the usage, or hardcode it here. Let's let usage pass it, or just use it here since it's a specific component. */}
          {props.icon && React.createElement(props.icon, { size: 18, className: "text-[#999BA3]" })}
        </div>
        
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          className={`
            w-full h-[48px] bg-white border rounded-[6px] text-[15px] text-[#272830] placeholder-[#AEB2BC] transition-all
            focus:outline-none focus:ring-4 focus:ring-opacity-15
            ${props.icon ? 'pl-10' : 'pl-4'} pr-10
            ${error 
              ? 'border-[#E5322D] focus:border-[#E5322D] focus:ring-[#E5322D]' 
              : 'border-[#AEB2BC] focus:border-[#E5322D] focus:ring-[#E5322D]'
            }
          `}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#999BA3] hover:text-[#272830] transition-colors focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] text-[#E5322D] font-[500]">
          {error}
        </p>
      )}
    </div>
  );
}
