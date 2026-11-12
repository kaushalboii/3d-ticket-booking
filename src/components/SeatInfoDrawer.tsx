import React, { useState } from 'react';
import { Seat } from '../types';
import { ChevronUp } from 'lucide-react';

interface SeatInfoDrawerProps {
  seat: Seat;
  selectedSeats?: Seat[];
  onChangeSeat: () => void;
  onBookSeat: () => void;
}

const categoryLabels: Record<Seat['metrics']['category'], string> = {
  'UP CLOSE': 'Up close',
  'SWEET SPOT': 'Sweet spot',
  'FULL PICTURE': 'Full picture',
};

export const SeatInfoDrawer: React.FC<SeatInfoDrawerProps> = ({
  seat,
  selectedSeats = [seat],
  onChangeSeat,
  onBookSeat,
}) => {
  const { metrics } = seat;
  const [collapsed, setCollapsed] = useState(false);
  const totalCount = selectedSeats.length;
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="w-full max-w-xl mx-auto sm:mb-4 bg-[#141311]/95 backdrop-blur-md border-t sm:border border-[#efe9de]/[0.08] rounded-t-[20px] sm:rounded-[20px] px-5 pt-2.5 pb-5 flex flex-col shadow-2xl select-none">
      {/* Subtle Drag Handle */}
      {!collapsed && (
        <button
          onClick={() => setCollapsed(true)}
          className="w-full flex items-center justify-center py-1.5 mb-1 group cursor-pointer"
          title="Minimize sheet to inspect screen"
          aria-label="Minimize seat info sheet"
        >
          <div className="w-9 h-1 rounded-full bg-[#33302b] group-hover:bg-[#5a554c] transition-colors duration-150" />
        </button>
      )}

      {/* Collapsed Compact Bar */}
      {collapsed ? (
        <div className="flex items-center justify-between gap-3 py-1">
          <div className="flex items-center gap-2 min-w-0 tabular-nums">
            <span className="w-2 h-2 rounded-full bg-[#E5A93C] shrink-0" />
            <span className="text-xs font-semibold text-[#efe9de] truncate">
              Row {seat.row}, Seat {seat.number}
            </span>
            <span className="text-xs text-[#787268] truncate">
              · {seat.tierLabel} · ₹{seat.price}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCollapsed(false)}
              className="h-8 px-3 rounded-lg bg-[#1e1c19] border border-[#efe9de]/[0.08] text-xs font-medium text-[#aaa398] hover:text-[#efe9de] flex items-center gap-1 transition-colors duration-150 cursor-pointer"
            >
              <span>Details</span>
              <ChevronUp className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
            <button
              onClick={onBookSeat}
              className="h-8 px-4 rounded-lg bg-[#efe9de] hover:bg-white text-[#12110f] text-xs font-semibold active:scale-[0.98] transition-colors duration-150 cursor-pointer tabular-nums"
            >
              {totalCount > 1 ? `Book ${totalCount} · ₹${totalPrice}` : `Book · ₹${seat.price}`}
            </button>
          </div>
        </div>
      ) : (
        /* Expanded Sightline Sheet */
        <>
          {/* Top Seat Header + Mini Auditorium Map */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="space-y-0.5">
              <span className="text-[11px] font-medium text-[#E5A93C] block">
                {categoryLabels[metrics.category]}
              </span>
              <h2 className="text-[#efe9de] font-semibold text-lg tracking-tight leading-snug tabular-nums">
                Row {seat.row}, Seat {seat.number}
              </h2>
              <p className="text-[#aaa398] text-xs tabular-nums">
                {seat.tierLabel} · ₹{seat.price}
              </p>
            </div>

            {/* Mini Auditorium Matrix Preview */}
            <div className="p-2.5 rounded-xl bg-[#0c0b0a] border border-[#efe9de]/[0.08] flex flex-col items-center shrink-0">
              <div className="w-12 h-0.5 rounded-full bg-[#efe9de]/40 mb-2" />
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }).map((_, i) => {
                  const rIdx = Math.floor(i / 7);
                  const cIdx = i % 7;

                  const rowChar = seat.row.charCodeAt(0) - 65;
                  const normalizedR = Math.min(3, Math.floor(rowChar / 2.2));
                  const normalizedC = Math.min(6, Math.floor((seat.number - 1) / 2));
                  const isMatch = rIdx === normalizedR && cIdx === normalizedC;

                  return (
                    <div
                      key={i}
                      className={`w-1.5 h-1 rounded-[1px] ${
                        isMatch ? 'bg-[#E5A93C]' : 'bg-[#262421]'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3 Aligned Sightline Metric Cards */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            <div className="bg-[#0c0b0a] border border-[#efe9de]/[0.08] rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[#efe9de] font-medium text-base tracking-tight font-mono tabular-nums">
                {metrics.distanceMeters.toFixed(1)} m
              </span>
              <span className="text-[#787268] text-[11px] mt-1">
                to screen
              </span>
            </div>

            <div className="bg-[#0c0b0a] border border-[#efe9de]/[0.08] rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[#efe9de] font-medium text-base tracking-tight font-mono tabular-nums">
                {metrics.fovDegrees}°
              </span>
              <span className="text-[#787268] text-[11px] mt-1">
                field of view
              </span>
            </div>

            <div className="bg-[#0c0b0a] border border-[#efe9de]/[0.08] rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[#efe9de] font-medium text-base tracking-tight font-mono tabular-nums">
                {metrics.offsetMeters.toFixed(1)} m
              </span>
              <span className="text-[#787268] text-[11px] mt-1 truncate">
                {metrics.offsetDirection}
              </span>
            </div>
          </div>

          {/* Balanced Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onChangeSeat}
              className="w-full h-11 rounded-xl bg-[#1e1c19] border border-[#efe9de]/[0.08] text-[#efe9de] hover:bg-[#262421] text-xs font-medium transition-colors duration-150 active:scale-[0.98] cursor-pointer"
            >
              Change seat
            </button>

            <button
              onClick={onBookSeat}
              className="w-full h-11 rounded-xl bg-[#efe9de] hover:bg-white text-[#12110f] text-xs font-semibold transition-colors duration-150 active:scale-[0.98] cursor-pointer tabular-nums"
            >
              {totalCount > 1
                ? `Book ${totalCount} seats · ₹${totalPrice}`
                : `Book · ₹${seat.price}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
