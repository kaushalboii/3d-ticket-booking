import React from 'react';
import { Seat } from '../types';
import { Eye, ArrowRight } from 'lucide-react';

interface SeatBottomBarProps {
  selectedSeat: Seat | null;
  selectedSeats?: Seat[];
  currency?: string;
  onContinue: () => void;
}

export const SeatBottomBar: React.FC<SeatBottomBarProps> = ({
  selectedSeat,
  selectedSeats = selectedSeat ? [selectedSeat] : [],
  currency = '₹',
  onContinue,
}) => {
  const count = selectedSeats.length;
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const primarySeat = selectedSeat || selectedSeats[0] || null;

  return (
    <div className="w-full bg-[#0B0D12] border-t border-white/[0.08] px-6 py-3.5 flex items-center justify-between select-none">
      {/* Left Details */}
      <div>
        {primarySeat && count > 0 ? (
          <div className="flex flex-col">
            <span className="text-[#F0F1F4] font-medium text-sm tracking-tight flex items-center gap-2">
              <span>
                {count > 1
                  ? `${count} Seats (${selectedSeats.map((s) => s.id).join(', ')})`
                  : `Row ${primarySeat.row}, Seat ${primarySeat.number}`}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-[#A3A9B8]">
                {primarySeat.tier.toUpperCase()}
              </span>
            </span>
            <span className="text-[#7A8296] text-xs font-normal mt-0.5 font-mono">
              {currency}{totalPrice} · {primarySeat.metrics.category.toLowerCase()}
            </span>
          </div>
        ) : (
          <div className="flex flex-col">
            <span className="text-[#D1D5DF] text-sm font-normal">
              Select seats
            </span>
            <span className="text-[#5C6479] text-xs">
              Tap any available seats above
            </span>
          </div>
        )}
      </div>

      {/* Right Continue to 3D View Button */}
      <button
        disabled={count === 0}
        onClick={onContinue}
        className={`px-5 sm:px-6 py-2.5 rounded-full text-xs font-medium transition flex items-center gap-2 ${
          count > 0
            ? 'bg-[#55E6A5] text-[#07130E] hover:brightness-105 active:scale-[0.98] cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]'
            : 'bg-[#141822] text-[#5C6479] border border-white/[0.06] cursor-not-allowed'
        }`}
      >
        <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span>Preview 3D sightline</span>
        <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" strokeWidth={1.5} />
      </button>
    </div>
  );
};