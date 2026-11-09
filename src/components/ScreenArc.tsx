import React from 'react';

export const ScreenArc: React.FC = () => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center my-2 select-none">
      <div className="relative w-full max-w-[280px] h-[32px] flex items-center justify-center">
        <svg
          viewBox="0 0 280 32"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 15 26 Q 140 4 265 26"
            stroke="url(#screenArcGrad)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="screenArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.08)" />
              <stop offset="40%" stopColor="rgba(255, 255, 255, 0.7)" />
              <stop offset="60%" stopColor="rgba(255, 255, 255, 0.7)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.08)" />
            </linearGradient>
          </defs>
        </svg>

        <span className="absolute bottom-0 text-[10px] font-mono text-[#5C6479]">
          Auditorium Screen
        </span>
      </div>
    </div>
  );
};