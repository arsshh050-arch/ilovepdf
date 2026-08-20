import React from 'react';
import { useLocation } from 'react-router-dom';

export function GenericInfoPage() {
  const location = useLocation();
  const pathName = location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Page';
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold text-[#111111] capitalize mb-4">{pathName}</h1>
      <p className="text-[#737680] max-w-lg mx-auto">
        This is a placeholder page for {pathName}. It would typically contain the corresponding marketing or product information for this route.
      </p>
    </div>
  );
}
