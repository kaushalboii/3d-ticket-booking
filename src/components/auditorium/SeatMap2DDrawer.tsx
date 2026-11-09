import React from 'react';
import { Seat } from '../../types';
import { X, Eye } from 'lucide-react';

interface SeatMap2DDrawerProps {
  seats: Seat[];
  selectedSeatIds: string[];
  focusedSeat: Seat | null;
  onSeatSelect: (seat: Seat) => void;
  onPreviewSeatIn3D: (seat: Seat) => void;
  onClose: () => void;
}

export const SeatMap2DDrawer: React.FC<SeatMap2DDrawerProps> = ({
  seats,
  selectedSeatIds,
  focusedSeat,
  onSeatSelect,
  onPreviewSeatIn3D,
  onClose
}) => {
  const rows = ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];

  const getSeatColorClass = (seat: Seat) => {
    if (selectedSeatIds.includes(seat.id)) {
      return 'bg-white text-zinc-950 font-bold border-white shadow-sm';
    }
    if (focusedSeat?.id === seat.id) {
      return 'bg-[#282932] text-white font-medium border-amber-400/80 ring-1 ring-amber-400/50';
    }
    if (seat.status === 'occupied') {
      return 'bg-[#121316] text-zinc-700 border-white/[0.03] cursor-not-allowed';
    }
    if (seat.tier === 'vip_recliner') {
      return 'bg-amber-400/10 text-amber-300 border-amber-400/25 hover:bg-amber-400/20';
    }
    if (seat.tier === 'premium') {
      return 'bg-white/[0.06] text-zinc-300 border-white/[0.1] hover:bg-white/[0.12]';
    }
    return 'bg-[#16171b] text-zinc-400 border-white/[0.06] hover:bg-[#202127] hover:text-white';
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0e0f12]/98 backdrop-blur-md border-l border-white/[0.08] shadow-2xl flex flex-col p-6 overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div>
          <h3 className="text-sm font-medium text-white">2D Seat Schematic</h3>
          <p className="text-[11px] font-mono text-zinc-500">Synchronized with 3D auditorium</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-[#141519] text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Screen Arc Representation */}
      <div className="py-5 flex flex-col items-center">
        <div className="w-3/4 h-1.5 rounded-t-full bg-gradient-to-r from-zinc-600 via-zinc-200 to-zinc-600 opacity-70" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-2">
          Curved screen
        </span>
      </div>

      {/* Seat Rows Grid */}
      <div className="flex-1 overflow-y-auto space-y-1.5 py-1 pr-1">
        {rows.map((rowName) => {
          const rowSeats = seats
            .filter((s) => s.row === rowName)
            .sort((a, b) => a.number - b.number);

          return (
            <div key={rowName} className="flex items-center gap-2">
              <span className="w-4 text-[11px] font-mono text-zinc-500 text-center">
                {rowName}
              </span>

              <div className="flex-1 grid grid-cols-12 gap-1">
                {rowSeats.map((seat) => (
                  <button
                    key={seat.id}
                    disabled={seat.status === 'occupied'}
                    onClick={() => onSeatSelect(seat)}
                    title={`${seat.id} (${seat.tier}) - $${seat.price.toFixed(2)}`}
                    className={`h-6 rounded text-[10px] font-mono border transition-colors flex items-center justify-center ${getSeatColorClass(
                      seat
                    )}`}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>

              <span className="w-4 text-[11px] font-mono text-zinc-500 text-center">
                {rowName}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend & 3D Preview Hint */}
      <div className="pt-4 border-t border-white/[0.06] space-y-3">
        <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#16171b] border border-white/[0.08]" />
            <span>Standard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-white/[0.08] border border-white/[0.12]" />
            <span>Premium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-300" />
            <span>VIP</span>
          </div>
        </div>

        {focusedSeat && (
          <button
            onClick={() => {
              onPreviewSeatIn3D(focusedSeat);
              onClose();
            }}
            className="w-full h-8 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] text-zinc-200 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-400" />
            <span>Preview {focusedSeat.id} in 3D</span>
          </button>
        )}
      </div>
    </div>
  );
};
