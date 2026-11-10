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

      {/* Right Continue Button: High-taste minimal white pill with dark text */}
      <button
        disabled={!hasSeats}
        onClick={onContinue}
        className={`px-7 py-3 rounded-full text-xs font-semibold tracking-tight transition-all duration-150 cursor-pointer ${
          hasSeats
            ? 'bg-white text-[#070709] shadow-md hover:bg-[#F2F2F5] active:scale-95'
            : 'bg-[#141418] text-[#55555e] cursor-not-allowed border border-[#222228]'
        }`}
      >
        {selectedSeats.length > 1 ? `Continue (${selectedSeats.length} Seats) →` : 'Continue to 3D Sightline →'}
      </button>
    </div>
  );
};
