import React from 'react';

export const SeatLegend: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-center gap-6 py-2.5 select-none text-[11px] text-[#888888] bg-[#050505] border-t border-[#141414]">
      {/* Available */}
      <div className="flex items-center gap-2">
        <div className="w-3.5 h-3.5 rounded-full bg-[#181818] border border-[#333333]" />
        <span className="text-[#A0A0A0]">Available</span>
      </div>

      {/* Taken (Red from signature video UI) */}
      <div className="flex items-center gap-2">
        <div className="w-3.5 h-3.5 rounded-full bg-[#7D4147] border border-[#94383F]" />
        <span className="text-[#A0A0A0]">Taken</span>
      </div>

      {/* Selected */}
      <div className="flex items-center gap-2">
        <div className="w-3.5 h-3.5 rounded-full bg-[#55E6A5] shadow-sm shadow-[#55E6A5]/50" />
        <span className="text-[#F0F0F0] font-semibold">Selected</span>
      </div>
    </div>
  );
};
