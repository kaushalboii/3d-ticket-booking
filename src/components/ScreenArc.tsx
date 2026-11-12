import React from 'react';

export const ScreenArc: React.FC = () => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center my-2 select-none">
      <div className="relative w-full max-w-[300px] h-[36px] flex items-center justify-center">
        <div className="absolute top-0 w-3/4 h-5 bg-[#efe9de]/[0.04] blur-xl rounded-full pointer-events-none" />

        <svg
          viewBox="0 0 300 32"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 16 28 Q 150 2 284 28"
            stroke="url(#screenArcGrad)"
            strokeWidth="1.75"
            strokeLinecap="round"
            className="screen-arc-glow"
          />
          <defs>
            <linearGradient id="screenArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(239, 233, 222, 0.08)" />
              <stop offset="30%" stopColor="rgba(239, 233, 222, 0.55)" />
              <stop offset="50%" stopColor="rgba(239, 233, 222, 0.9)" />
              <stop offset="70%" stopColor="rgba(239, 233, 222, 0.55)" />
              <stop offset="100%" stopColor="rgba(239, 233, 222, 0.08)" />
            </linearGradient>
          </defs>
        </svg>

        <span className="absolute bottom-[-2px] text-[10px] tracking-[0.22em] text-[#787268] font-mono uppercase">
          Screen
        </span>
      </div>
    </div>
  );
};
