import React, { useState } from 'react';
import { Seat } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SeatInfoDrawerProps {
  seat: Seat;
  currency?: string;
  onChangeSeat: () => void;
  onBookSeat: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SeatInfoDrawer: React.FC<SeatInfoDrawerProps> = ({
  seat,
  currency = '₹',
  onChangeSeat,
  onBookSeat,
}) => {
  const { metrics } = seat;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="w-full bg-[#0E1118] border-t border-white/[0.08] rounded-t-3xl px-6 pt-3 pb-6 flex flex-col select-none transition-all duration-200">
      {/* Top Drag Handle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-center py-1 cursor-pointer group"
        title={collapsed ? "Expand details" : "Collapse details"}
      >
        <div className="w-8 h-1 rounded-full bg-white/[0.12] group-hover:bg-white/[0.24] transition" />
      </button>

      {/* When Collapsed: Compact strip */}
      {collapsed ? (
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-[#55E6A5]">
              Row {seat.row}, Seat {seat.number}
            </span>
            <span className="text-[11px] text-[#7A8296] font-mono">
              · {seat.tier.toUpperCase()} ({currency}{seat.price})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(false)}
              className="text-[11px] text-[#A3A9B8] hover:text-[#F0F1F4] flex items-center gap-1 px-3 py-1 rounded-full bg-[#141822] border border-white/[0.08] cursor-pointer"
            >
              <span>Metrics</span>
              <ChevronUp className="w-3 h-3" strokeWidth={1.5} />
            </button>
            <button
              onClick={onBookSeat}
              className="px-4 py-1.5 rounded-full bg-[#55E6A5] text-[#07130E] text-xs font-medium cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
            >
              Book · {currency}{seat.price}
            </button>
          </div>
        </div>
      ) : (
        /* Expanded State */
        <>
          {/* Top Seat Title & Mini Map */}
          <div className="flex items-start justify-between mb-4 mt-2">
            <div>
              <span className="text-[10px] font-mono text-[#7A8296] block mb-1">
                {metrics.category.toLowerCase()}
              </span>

              <h2 className="text-[#F0F1F4] font-medium text-lg tracking-tight">
                Row {seat.row}, Seat {seat.number}
              </h2>

              <p className="text-[#7A8296] text-xs font-normal mt-0.5 font-mono">
                {seat.tier.toUpperCase()} · {currency}{seat.price}
              </p>
            </div>

            {/* Mini Seat Map Graphic */}
            <div className="p-2.5 rounded-xl bg-[#141822] border border-white/[0.08] flex flex-col items-center">
              {/* Mini Screen arc */}
              <div className="w-12 h-0.5 rounded-full bg-white/[0.2] mb-1.5" />

              {/* Mini Seat Matrix */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }).map((_, i) => {
                  const rIdx = Math.floor(i / 7);
                  const cIdx = i % 7;

                  const rowChar = seat.row.charCodeAt(0) - 65;
                  const normalizedR = Math.min(3, Math.floor(rowChar / 2.5));
                  const normalizedC = Math.min(6, Math.floor((seat.number - 1) / 2));
                  const isMatch = rIdx === normalizedR && cIdx === normalizedC;

                  return (
                    <div
                      key={i}
                      className={`w-1 h-1 rounded-full ${
                        isMatch
                          ? 'bg-[#55E6A5] scale-125'
                          : 'bg-white/[0.12]'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3 Optical Metric Cards */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {/* Metric 1: Distance */}
            <div className="bg-[#141822] border border-white/[0.08] rounded-2xl p-3 flex flex-col justify-between">
              <span className="text-[#F0F1F4] font-mono text-base font-medium">
                {metrics.distanceMeters.toFixed(1)} m
              </span>
              <span className="text-[#7A8296] text-[10px] font-normal mt-0.5">
                distance to screen
              </span>
            </div>

            {/* Metric 2: Field of View */}
            <div className="bg-[#141822] border border-white/[0.08] rounded-2xl p-3 flex flex-col justify-between">
              <span className="text-[#F0F1F4] font-mono text-base font-medium">
                {metrics.fovDegrees}°
              </span>
              <span className="text-[#7A8296] text-[10px] font-normal mt-0.5">
                field of view
              </span>
            </div>

            {/* Metric 3: Offset from Center */}
            <div className="bg-[#141822] border border-white/[0.08] rounded-2xl p-3 flex flex-col justify-between">
              <span className="text-[#F0F1F4] font-mono text-base font-medium">
                {metrics.offsetMeters.toFixed(1)} m
              </span>
              <span className="text-[#7A8296] text-[10px] font-normal mt-0.5 truncate">
                {metrics.offsetDirection}
              </span>
            </div>
          </div>

          {/* Action Buttons: Change Seat & Book */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onChangeSeat}
              className="w-full py-2.5 rounded-full bg-[#141822] border border-white/[0.08] text-[#D1D5DF] hover:bg-[#1C2230] text-xs font-normal transition active:scale-[0.98] cursor-pointer"
            >
              Change seat
            </button>

            <button
              onClick={onBookSeat}
              className="w-full py-2.5 rounded-full bg-[#55E6A5] text-[#07130E] hover:brightness-105 active:scale-[0.98] text-xs font-medium transition cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
            >
              Book · {currency}{seat.price}
            </button>
          </div>
        </>
      )}
    </div>
  );
};