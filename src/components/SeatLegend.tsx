import React from 'react';

export const SeatLegend: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-center gap-5 py-3 select-none text-[11px] text-[#888888] bg-[#050505]">
      {/* Available */}
      <div className="flex items-center gap-2">
        <div className="w-3.5 h-2.5 rounded-[3px] bg-[#1F2228] border border-[#2A303C]" />
        <span className="text-[#999999]">Available</span>
      </div>

      {/* Taken */}
      <div className="flex items-center gap-2">
        <div className="w-3.5 h-2.5 rounded-[3px] bg-[#6E2D33] border border-[#8E3339]" />
        <span className="text-[#999999]">Taken</span>
      </div>

      {/* Recliner */}
      <div className="flex items-center gap-2">
        <div className="w-3.5 h-2.5 rounded-[3px] bg-[#161920] border border-[#3A4150]" />
        <span className="text-[#999999]">Recliner</span>
      </div>

      {/* Selected */}
      <div className="flex items-center gap-2">
        <div className="w-3.5 h-2.5 rounded-[3px] bg-[#E5A93C] shadow-sm shadow-[#E5A93C]/40" />
        <span className="text-[#E0E0E0] font-medium">Selected</span>
      </div>
    </div>
  );
};
