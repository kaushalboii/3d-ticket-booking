import React from 'react';

export const ScreenArc: React.FC = () => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center my-3 select-none">
      {/* Curved SVG Screen Arc */}
      <div className="relative w-full max-w-[280px] h-[36px] flex items-center justify-center">
        {/* Soft radial glow behind the arc */}
        <div className="absolute top-0 w-3/4 h-6 bg-white/[0.04] blur-xl rounded-full pointer-events-none" />

        <svg
          viewBox="0 0 280 32"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle curved arc with fine gradient */}
          <path
            d="M 15 28 Q 140 2 265 28"
            stroke="url(#screenArcGrad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="screen-arc-glow"
          />
          <defs>
            <linearGradient id="screenArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.08)" />
              <stop offset="30%" stopColor="rgba(255, 255, 255, 0.65)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.95)" />
              <stop offset="70%" stopColor="rgba(255, 255, 255, 0.65)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.08)" />
            </linearGradient>
          </defs>
        </svg>

        {/* SCREEN Label */}
        <span className="absolute bottom-[-2px] text-[9px] uppercase tracking-[0.25em] text-[#555555] font-semibold">
          SCREEN
        </span>
      </div>
    </div>
  );
};
