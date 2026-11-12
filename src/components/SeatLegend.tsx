import React from 'react';

export const SeatLegend: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-center gap-5 py-3 px-4 select-none text-[11px] text-[#aaa398] bg-[#0c0b0a]">
      <div className="flex items-center gap-2">
        <div className="w-4 h-3 rounded-[3px] bg-[#1e1c19] border border-[#efe9de]/[0.12]" />
        <span>Available</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-3 rounded-[3px] bg-[#512327] border border-[#6e3035]" />
        <span>Taken</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-3 rounded-[3px] bg-[#1c1f24] border border-[#3a404c]" />
        <span>Recliner</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-3 rounded-[3px] bg-[#E5A93C]" />
        <span className="text-[#efe9de] font-medium">Selected</span>
      </div>
    </div>
  );
};
