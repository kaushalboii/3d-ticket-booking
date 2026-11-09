import React from 'react';
import { Seat } from '../types';

interface SeatBottomBarProps {
  selectedSeat: Seat | null;
  onContinue: () => void;
}

export const SeatBottomBar: React.FC<SeatBottomBarProps> = ({
  selectedSeat,
  onContinue,
}) => {
  return (
    <div className="w-full bg-[#050505] border-t border-[#141414] px-6 py-4 flex items-center justify-between select-none">
      {/* Left Details */}
      <div>
        {selectedSeat ? (
          <div className="flex flex-col">
            <span className="text-[#F5F5F5] font-semibold text-sm tracking-tight">
              Row {selectedSeat.row}, Seat {selectedSeat.number}
            </span>
            <span className="text-[#929292] text-xs font-normal mt-0.5">
              ₹{selectedSeat.price}
            </span>
          </div>
        ) : (
          <span className="text-[#929292] text-sm font-normal">
            Choose your seat
          </span>
        )}
      </div>

      {/* Right Continue Button */}
      <button
        disabled={!selectedSeat}
        onClick={onContinue}
        className={`px-7 py-3 rounded-full text-sm font-bold transition-all duration-200 ${
          selectedSeat
            ? 'bg-[#55E6A5] text-[#050505] shadow-lg shadow-[#55E6A5]/25 hover:brightness-105 active:scale-95 cursor-pointer'
            : 'bg-[#181818] text-[#363636] cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
};
