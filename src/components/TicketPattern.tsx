import React from "react";

export interface TicketPatternProps {
  ink?: string;
  className?: string;
}

export function TicketPattern({ ink = "currentColor", className = "" }: TicketPatternProps) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden w-full h-full min-h-[90px] ${className}`}>
      <svg
        viewBox="0 0 200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[140px] opacity-85 transition-colors duration-300 select-none pointer-events-none"
      >
        <defs>
          <radialGradient id="patternGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ink} stopOpacity="0.25" />
            <stop offset="100%" stopColor={ink} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Center Glow */}
        <circle cx="100" cy="60" r="48" fill="url(#patternGlow)" />

        {/* Concentric Guilloche / Cinema Aperture Arcs */}
        <circle cx="100" cy="60" r="54" stroke={ink} strokeWidth="0.75" strokeDasharray="3 3" opacity="0.4" />
        <circle cx="100" cy="60" r="46" stroke={ink} strokeWidth="1" opacity="0.6" />
        <circle cx="100" cy="60" r="38" stroke={ink} strokeWidth="0.5" strokeDasharray="1.5 2" opacity="0.5" />
        <circle cx="100" cy="60" r="30" stroke={ink} strokeWidth="1.25" opacity="0.75" />
        <circle cx="100" cy="60" r="22" stroke={ink} strokeWidth="0.75" opacity="0.6" />
        <circle cx="100" cy="60" r="14" stroke={ink} strokeWidth="1.5" opacity="0.85" />
        <circle cx="100" cy="60" r="6" fill={ink} opacity="0.9" />

        {/* Diagonal Cross-Hairs / Calipers */}
        <line x1="20" y1="60" x2="65" y2="60" stroke={ink} strokeWidth="0.75" opacity="0.5" />
        <line x1="135" y1="60" x2="180" y2="60" stroke={ink} strokeWidth="0.75" opacity="0.5" />
        <line x1="100" y1="10" x2="100" y2="35" stroke={ink} strokeWidth="0.75" opacity="0.5" />
        <line x1="100" y1="85" x2="100" y2="110" stroke={ink} strokeWidth="0.75" opacity="0.5" />

        {/* Sound Wave / Sightline Curves */}
        <path
          d="M 15,30 Q 55,60 15,90"
          stroke={ink}
          strokeWidth="0.6"
          fill="none"
          opacity="0.35"
        />
        <path
          d="M 25,25 Q 70,60 25,95"
          stroke={ink}
          strokeWidth="0.6"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M 185,30 Q 145,60 185,90"
          stroke={ink}
          strokeWidth="0.6"
          fill="none"
          opacity="0.35"
        />
        <path
          d="M 175,25 Q 130,60 175,95"
          stroke={ink}
          strokeWidth="0.6"
          fill="none"
          opacity="0.3"
        />

        {/* Micro-Perforations */}
        {[-30, -15, 0, 15, 30].map((offset, i) => (
          <rect
            key={i}
            x={98 + offset}
            y="114"
            width="4"
            height="1.5"
            rx="0.5"
            fill={ink}
            opacity="0.5"
          />
        ))}
      </svg>
    </div>
  );
}
export default TicketPattern;

