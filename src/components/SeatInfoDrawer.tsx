import React, { useState } from 'react';
import { Seat } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SeatInfoDrawerProps {
  seat: Seat;
  onChangeSeat: () => void;
  onBookSeat: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SeatInfoDrawer: React.FC<SeatInfoDrawerProps> = ({
  seat,
  onChangeSeat,
  onBookSeat,
}) => {
  const { metrics } = seat;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="w-full bg-[#111111] border-t border-[#1C1C1C] rounded-t-3xl px-5 pt-2.5 pb-5 flex flex-col shadow-2xl select-none transition-all duration-300">
      {/* Top Drag Handle (Clickable to Collapse / Expand to see full cinema screen) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-center py-1 group cursor-pointer"
        title={collapsed ? "Expand Information Sheet" : "Minimize to View Full Cinema Screen"}
      >
        <div className="flex items-center gap-1">
          <div className="w-9 h-1 rounded-full bg-[#2E2E2E] group-hover:bg-[#555555] transition" />
        </div>
      </button>

      {/* When Collapsed: Sleek compact strip */}
      {collapsed ? (
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-[#55E6A5]">
              Row {seat.row}, Seat {seat.number}
            </span>
            <span className="text-[11px] text-[#888888]">
              · {seat.tier === 'elite' ? 'Elite' : seat.tier === 'economy' ? 'Economy' : seat.tier === 'recliner' ? 'Recliner' : 'Standard'} (₹{seat.price})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(false)}
              className="text-[11px] text-[#888888] hover:text-[#F5F5F5] flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1A1A1A] border border-[#262626]"
            >
              <span>Details</span>
              <ChevronUp className="w-3 h-3" />
            </button>
            <button
              onClick={onBookSeat}
              className="px-4 py-1.5 rounded-full bg-white text-[#0A0A0A] text-xs font-bold shadow-md"
            >
              Book · ₹{seat.price}
            </button>
          </div>
        </div>
      ) : (
        /* Expanded State: Exact match to reference screenshot */
        <>
          {/* Top Seat Title & Mini Map */}
          <div className="flex items-start justify-between mb-3.5 mt-1">
            <div>
              {/* Category Tag */}
              <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-[#888888] block mb-0.5">
                {metrics.category}
              </span>

              {/* Seat Title */}
              <h2 className="text-[#F5F5F5] font-bold text-lg tracking-tight">
                Row {seat.row}, Seat {seat.number}
              </h2>

              {/* Tier & Price */}
              <p className="text-[#929292] text-xs font-normal mt-0.5">
                {seat.tier === 'elite' ? 'Elite' : seat.tier === 'economy' ? 'Economy' : seat.tier === 'recliner' ? 'Recliner' : 'Standard'} · ₹{seat.price}
              </p>
            </div>

            {/* Mini Seat Map Graphic (Right side of drawer matching screenshot) */}
            <div className="p-2 rounded-xl bg-[#0B0B0B] border border-[#1A1A1A] flex flex-col items-center">
              {/* Mini Screen arc */}
              <div className="w-12 h-1 rounded-full bg-[#444444]/60 mb-1.5" />

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
                          ? 'bg-[#55E6A5] scale-125 shadow-sm shadow-[#55E6A5]'
                          : 'bg-[#262626]'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {/* Metric 1: Distance */}
            <div className="bg-[#090909] border border-[#1A1A1A] rounded-2xl p-3 flex flex-col justify-between">
              <span className="text-[#F5F5F5] font-bold text-base tracking-tight font-mono">
                {metrics.distanceMeters.toFixed(1)} m
              </span>
              <span className="text-[#777777] text-[10px] font-normal mt-0.5">
                to screen
              </span>
            </div>

            {/* Metric 2: Field of View */}
            <div className="bg-[#090909] border border-[#1A1A1A] rounded-2xl p-3 flex flex-col justify-between">
              <span className="text-[#F5F5F5] font-bold text-base tracking-tight font-mono">
                {metrics.fovDegrees}°
              </span>
              <span className="text-[#777777] text-[10px] font-normal mt-0.5">
                field of view
              </span>
            </div>

            {/* Metric 3: Offset from Center */}
            <div className="bg-[#090909] border border-[#1A1A1A] rounded-2xl p-3 flex flex-col justify-between">
              <span className="text-[#F5F5F5] font-bold text-base tracking-tight font-mono">
                {metrics.offsetMeters.toFixed(1)} m
              </span>
              <span className="text-[#777777] text-[10px] font-normal mt-0.5 truncate">
                {metrics.offsetDirection}
              </span>
            </div>
          </div>

          {/* Action Buttons: Change Seat & Book */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onChangeSeat}
              className="w-full py-3 rounded-full bg-[#161616] border border-[#262626] text-[#F5F5F5] hover:bg-[#202020] hover:border-[#333333] text-xs font-semibold transition active:scale-95 cursor-pointer"
            >
              Change seat
            </button>

            <button
              onClick={onBookSeat}
              className="w-full py-3 rounded-full bg-white text-[#0A0A0A] hover:bg-[#F0F0F0] text-xs font-bold transition active:scale-95 cursor-pointer shadow-lg shadow-white/10"
            >
              Book · ₹{seat.price}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
