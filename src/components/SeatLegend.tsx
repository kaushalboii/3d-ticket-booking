import React from 'react';

export const SeatLegend: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-center gap-6 py-2.5 select-none text-[11px] text-[#7A8296] bg-[#0B0D12] border-t border-white/[0.08]">
      {/* Available */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#141822] border border-white/[0.12]" />
        <span className="text-[#A3A9B8]">Available</span>
      </div>

      {/* Occupied */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#6B282E] border border-[#85343B]" />
        <span className="text-[#A3A9B8]">Occupied</span>
      </div>

      {/* Selected */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#55E6A5]" />
        <span className="text-[#F0F1F4] font-medium">Selected</span>
      </div>
    </div>
  );
};