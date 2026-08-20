import React from 'react';

export function AuthIllustration() {
  return (
    <div className="w-full max-w-[400px] aspect-square relative">
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Soft abstract background blobs */}
        <circle cx="200" cy="200" r="160" fill="#EAEBFF" opacity="0.5" />
        <circle cx="260" cy="140" r="80" fill="#FFEFEF" opacity="0.8" />
        
        {/* Central Document Base */}
        <rect x="120" y="80" width="160" height="220" rx="12" fill="#FFFFFF" stroke="#D4D6DE" strokeWidth="4" />
        
        {/* Document lines */}
        <rect x="150" y="140" width="100" height="8" rx="4" fill="#E0E2E8" />
        <rect x="150" y="170" width="100" height="8" rx="4" fill="#E0E2E8" />
        <rect x="150" y="200" width="70" height="8" rx="4" fill="#E0E2E8" />
        
        {/* PDF Badge */}
        <rect x="150" y="100" width="40" height="20" rx="4" fill="#E5322D" />
        <text x="170" y="114" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">PDF</text>
        
        {/* Security Lock Icon (floating bottom right) */}
        <g transform="translate(240, 240)">
          <circle cx="30" cy="30" r="30" fill="#E6F4EA" />
          <path d="M22 28V24C22 19.5817 25.5817 16 30 16C34.4183 16 38 19.5817 38 24V28H39C40.1046 28 41 28.8954 41 30V40C41 41.1046 40.1046 42 39 42H21C19.8954 42 19 41.1046 19 40V30C19 28.8954 19.8954 28 21 28H22ZM34 28V24C34 21.7909 32.2091 20 30 20C27.7909 20 26 21.7909 26 24V28H34ZM30 36C31.1046 36 32 35.1046 32 34C32 32.8954 31.1046 32 30 32C28.8954 32 28 32.8954 28 34C28 35.1046 28.8954 36 30 36Z" fill="#34A853"/>
        </g>
        
        {/* Gear/Settings Icon (floating top left) */}
        <g transform="translate(70, 110)">
          <circle cx="24" cy="24" r="24" fill="#F3E8FF" />
          <path d="M24 16C19.5817 16 16 19.5817 16 24C16 28.4183 19.5817 32 24 32C28.4183 32 32 28.4183 32 24C32 19.5817 28.4183 16 24 16ZM24 28C21.7909 28 20 26.2091 20 24C20 21.7909 21.7909 20 24 20C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28Z" fill="#9333EA" />
          <path d="M34 22H31.8C31.3 20.3 30.5 18.8 29.4 17.6L31 16C31.4 15.6 31.4 15 31 14.6L29.4 13C29 12.6 28.4 12.6 28 13L26.4 14.6C25.2 13.5 23.7 12.7 22 12.2V10C22 9.4 21.6 9 21 9H19C18.4 9 18 9.4 18 10V12.2C16.3 12.7 14.8 13.5 13.6 14.6L12 13C11.6 12.6 11 12.6 10.6 13L9 14.6C8.6 15 8.6 15.6 9 16L10.6 17.6C9.5 18.8 8.7 20.3 8.2 22H6C5.4 22 5 22.4 5 23V25C5 25.6 5.4 26 6 26H8.2C8.7 27.7 9.5 29.2 10.6 30.4L9 32C8.6 32.4 8.6 33 9 33.4L10.6 35C11 35.4 11.6 35.4 12 35L13.6 33.4C14.8 34.5 16.3 35.3 18 35.8V38C18 38.6 18.4 39 19 39H21C21.6 39 22 38.6 22 38V35.8C23.7 35.3 25.2 34.5 26.4 33.4L28 35C28.4 35.4 29 35.4 29.4 35L31 33.4C31.4 33 31.4 32.4 31 32L29.4 30.4C30.5 29.2 31.3 27.7 31.8 26H34C34.6 26 35 25.6 35 25V23C35 22.4 34.6 22 34 22Z" fill="#9333EA" opacity="0.3" />
        </g>
      </svg>
    </div>
  );
}
