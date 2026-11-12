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
    <div className="w-full bg-[#141311] border-t border-[#efe9de]/[0.08] px-5 py-3.5 flex items-center justify-between gap-4 select-none">
      <div className="min-w-0">
        {hasSeats ? (
          <div className="flex flex-col">
            <span className="text-[#efe9de] font-semibold text-sm tracking-tight truncate tabular-nums">
              {selectedSeats.length === 1
                ? `Row ${selectedSeats[0].row}, Seat ${selectedSeats[0].number}`
                : `${selectedSeats.length} seats (${selectedSeats.map((s) => s.id).join(', ')})`}
            </span>
            <span className="text-[#aaa398] text-xs font-mono mt-0.5 tabular-nums">
              ₹{totalPrice}
              {selectedSeats.length > 1 ? ` (₹${selectedSeats[0].price} each)` : ` · ${selectedSeats[0].tierLabel}`}
            </span>
          </div>
        ) : (
          <span className="text-[#787268] text-sm">
            Choose a seat to preview sightline
          </span>
        )}
      </div>

      <button
        disabled={!hasSeats}
        onClick={onContinue}
        className={`h-10 px-5 rounded-xl text-xs font-semibold tracking-tight transition-colors duration-150 shrink-0 cursor-pointer ${
          hasSeats
            ? 'bg-[#efe9de] text-[#12110f] hover:bg-white active:scale-[0.98]'
            : 'bg-[#1e1c19] text-[#5a554c] cursor-not-allowed border border-[#efe9de]/[0.06]'
        }`}
      >
        {selectedSeats.length > 1
          ? `Preview ${selectedSeats.length} seats`
          : 'Continue to 3D Sightline'}
      </button>
    </div>
  );
};
