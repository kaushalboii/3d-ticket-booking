import React from 'react';
import { Seat } from '../types';

interface SeatBottomBarProps {
  selectedSeats: Seat[];
  onContinue: () => void;
}

export const SeatBottomBar: React.FC<SeatBottomBarProps> = ({
  selectedSeats,
  onContinue,
}) => {
  const hasSeats = selectedSeats.length > 0;
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="w-full bg-[#050505] border-t border-[#141414] px-6 py-4 flex items-center justify-between select-none">
      {/* Left Details */}
      <div>
        {hasSeats ? (
          <div className="flex flex-col">
            <span className="text-[#F5F5F5] font-semibold text-sm tracking-tight">
              {selectedSeats.length === 1 ? (
                `Row ${selectedSeats[0].row}, Seat ${selectedSeats[0].number}`
              ) : (
                `${selectedSeats.length} Seats (${selectedSeats.map((s) => s.id).join(', ')})`
              )}
            </span>
            <span className="text-[#929292] text-xs font-normal mt-0.5">
              ₹{totalPrice} {selectedSeats.length > 1 && `(₹${selectedSeats[0].price} each)`}
            </span>
          </div>
        ) : (
          <span className="text-[#808080] text-sm font-normal">
            Choose your seat
          </span>
        )}
      </div>

      {/* Right Continue Button matching Video Frame 00:00 (Mint green capsule) */}
      <button
        disabled={!hasSeats}
        onClick={onContinue}
        className={`px-7 py-3 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
          hasSeats
            ? 'bg-[#55E6A5] text-[#050505] shadow-lg shadow-[#55E6A5]/25 hover:brightness-105 active:scale-95'
            : 'bg-[#181818] text-[#444444] cursor-not-allowed border border-[#222222]'
        }`}
      >
        {selectedSeats.length > 1 ? `Continue (${selectedSeats.length})` : 'Continue'}
      </button>
    </div>
  );
};
