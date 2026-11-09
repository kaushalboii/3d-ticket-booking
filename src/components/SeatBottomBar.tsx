import React from 'react';
import { Seat } from '../types';
import { Eye, ArrowRight } from 'lucide-react';

interface SeatBottomBarProps {
  selectedSeat: Seat | null;
  onContinue: () => void;
}

export const SeatBottomBar: React.FC<SeatBottomBarProps> = ({
  selectedSeat,
  onContinue,
}) => {
  return (
    <div className="w-full bg-[#050505] border-t border-[#141414] px-5 py-3.5 flex items-center justify-between select-none">
      {/* Left Details */}
      <div>
        {selectedSeat ? (
          <div className="flex flex-col">
            <span className="text-[#F5F5F5] font-bold text-sm tracking-tight flex items-center gap-1.5">
              <span>Row {selectedSeat.row}, Seat {selectedSeat.number}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#55E6A5]/15 text-[#55E6A5]">
                {selectedSeat.tier}
              </span>
            </span>
            <span className="text-[#888888] text-xs font-normal mt-0.5">
              ₹{selectedSeat.price} · {selectedSeat.metrics.category}
            </span>
          </div>
        ) : (
          <div className="flex flex-col">
            <span className="text-[#E0E0E0] text-sm font-medium">
              Choose your seat
            </span>
            <span className="text-[#666666] text-[11px]">
              Tap any available seat above
            </span>
          </div>
        )}
      </div>

      {/* Right Continue to 3D View Button */}
      <button
        disabled={!selectedSeat}
        onClick={onContinue}
        className={`px-5 sm:px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
          selectedSeat
            ? 'bg-[#55E6A5] text-[#050505] shadow-lg shadow-[#55E6A5]/25 hover:brightness-105 active:scale-95 cursor-pointer'
            : 'bg-[#181818] text-[#444444] border border-[#222222] cursor-not-allowed'
        }`}
      >
        <Eye className="w-3.5 h-3.5" />
        <span>Preview 3D Sightline</span>
        <ArrowRight className="w-3 h-3 hidden sm:inline" />
      </button>
    </div>
  );
};
