"use client";

import React, { useState } from "react";
import { Ticket } from "@/components/Ticket";
import { TicketPattern } from "@/components/TicketPattern";
import { Booking, Seat } from "@/types";
import { INDIAN_CINEMA_INFO } from "@/data/indianCinemaData";
import { Compass, ArrowRight } from "lucide-react";

export const CINEMA_PALETTES = [
  {
    name: "Champagne Brass",
    paper: "#12110f",
    ink: "#E5A93C",
    accent: "#E5A93C",
    glareColor: "#F5C369",
    border: "#2e2413",
  },
  {
    name: "IMAX Cobalt",
    paper: "#0d1b3e",
    ink: "#f1f5f9",
    accent: "#60a5fa",
    glareColor: "#ffffff",
    border: "#1e3a8a",
  },
  {
    name: "Signal Vermilion",
    paper: "#ff5a36",
    ink: "#12110f",
    accent: "#12110f",
    glareColor: "#ffffff",
    border: "#e04320",
  },
  {
    name: "Sulphur Paper",
    paper: "#c9e54b",
    ink: "#11130a",
    accent: "#11130a",
    glareColor: "#ffffff",
    border: "#b2d134",
  },
  {
    name: "Archive Cream",
    paper: "#f3ede2",
    ink: "#141311",
    accent: "#141311",
    glareColor: "#ffffff",
    border: "#dfd6c7",
  },
] as const;

export interface CinemaTicketProps {
  booking?: Booking;
  movieTitle?: string;
  theatreName?: string;
  hallName?: string;
  date?: string;
  showtime?: string;
  seats?: Seat[];
  seatLabel?: string;
  reference?: string;
  customerName?: string;
  defaultPaletteIndex?: number;
  className?: string;
  onBookNow?: () => void;
  showPalettePicker?: boolean;
}

const microLabelClassName =
  "font-mono text-[6px] font-bold leading-none tracking-[0.08em] uppercase opacity-[0.68]";

const barcodeStyle: React.CSSProperties = {
  background:
    "repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 4px, currentColor 4px 5px, transparent 5px 8px, currentColor 8px 12px, transparent 12px 14px)",
};

export const CinemaTicket: React.FC<CinemaTicketProps> = ({
  booking,
  movieTitle = booking?.movieTitle || INDIAN_CINEMA_INFO.movieTitle,
  theatreName = booking?.theatreName || INDIAN_CINEMA_INFO.name,
  hallName = booking?.hallName || INDIAN_CINEMA_INFO.hall,
  date = booking?.date || "14 Nov",
  showtime = booking?.showtime || "19:45",
  seats = booking?.seats || [],
  seatLabel = booking?.seats && booking.seats.length > 0
    ? booking.seats.map((s) => s.id).join(", ")
    : "Row F · Seat 8",
  reference = booking?.reference || "VELS-892401",
  defaultPaletteIndex = 0,
  className = "",
  onBookNow,
  showPalettePicker = true,
}) => {
  const [paletteIndex, setPaletteIndex] = useState(defaultPaletteIndex);
  const palette = CINEMA_PALETTES[paletteIndex];

  const admitCount = seats.length > 0 ? seats.length : 1;
  const admitWord = admitCount === 1 ? "One" : `${admitCount} Passes`;
  const tierName = seats[0]?.tierLabel || "Standard";

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* 3D Tilt Perforated Ticket */}
      <div className="relative flex items-center justify-center p-1">
        <Ticket
          aria-label={`${movieTitle} Cinema Admission Ticket`}
          className="z-10 h-[490px] w-[212px] aspect-auto max-[520px]:h-[450px] max-[520px]:w-[192px] shadow-2xl"
          ink={palette.ink}
          paper={palette.paper}
          notchSize={13}
          cornerSize={4}
          stubHeight={110}
          tiltProps={{
            glareColor: palette.glareColor,
            glareEnable: true,
            glareMaxOpacity: 0.14,
            glarePosition: "all",
            perspective: 1200,
            scale: 1.02,
            tiltMaxAngleX: 6,
            tiltMaxAngleY: 6,
          }}
          body={
            <div className="grid h-full grid-rows-[auto_1fr_auto_auto] gap-3 p-[18px_18px_20px] max-[520px]:gap-2.5 max-[520px]:p-[16px_16px_18px] select-none">
              <div className="flex justify-between items-center gap-2 font-mono text-[7px] font-bold leading-none tracking-[0.08em] uppercase opacity-[0.72]">
                <span>SERIES 03 · AUDI 3</span>
                <span>CINESCAPE</span>
              </div>

              <TicketPattern ink={palette.ink} />

              <div>
                <span className="font-mono text-[6.5px] font-bold uppercase tracking-wider block opacity-70 mb-1">
                  IMAX 4K LASER · DOLBY ATMOS
                </span>
                <h2 className="font-bold text-[24px] leading-[0.88] tracking-[-0.04em] uppercase max-[520px]:text-[21px]">
                  {movieTitle}
                </h2>
                <p className="mt-1.5 text-[7.5px] font-medium leading-[1.3] opacity-75 truncate">
                  {theatreName} · {hallName}
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-2 pt-1.5 border-t border-current/15 tabular-nums">
                <div className="flex flex-col gap-[2px]">
                  <dt className={microLabelClassName}>Date</dt>
                  <dd className="font-mono text-[9.5px] font-bold leading-none">
                    {date}
                  </dd>
                </div>
                <div className="flex flex-col gap-[2px]">
                  <dt className={microLabelClassName}>Showtime</dt>
                  <dd className="font-mono text-[9.5px] font-bold leading-none">
                    {showtime}
                  </dd>
                </div>
                <div className="flex flex-col gap-[2px]">
                  <dt className={microLabelClassName}>Seats</dt>
                  <dd className="font-mono text-[9.5px] font-bold leading-none truncate">
                    {seatLabel}
                  </dd>
                </div>
                <div className="flex flex-col gap-[2px]">
                  <dt className={microLabelClassName}>Tier</dt>
                  <dd className="font-mono text-[9.5px] font-bold leading-none uppercase truncate">
                    {tierName}
                  </dd>
                </div>
              </dl>
            </div>
          }
          stub={
            <div className="flex h-full flex-col justify-between gap-2.5 p-[16px_18px_14px] max-[520px]:p-[14px_16px_14px] select-none">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className={microLabelClassName}>Admit</span>
                  <strong className="font-bold text-[11px] leading-none uppercase">
                    {admitWord}
                  </strong>
                </div>
                <div className="flex flex-col items-end gap-0.5 text-right">
                  <span className={microLabelClassName}>Reference</span>
                  <strong className="font-mono font-bold text-[7.5px] leading-none uppercase">
                    {reference}
                  </strong>
                </div>
              </div>

              <div className="space-y-1">
                <div
                  aria-hidden="true"
                  className="h-[18px] w-full opacity-90 rounded-[1px]"
                  style={barcodeStyle}
                />
                <div className="flex justify-between items-center font-mono text-[6px] tracking-widest uppercase opacity-60">
                  <span>AUDI-3-TURNSTILE</span>
                  <span>SCAN ENTRY</span>
                </div>
              </div>
            </div>
          }
        />
      </div>

      {/* Quiet Cardstock Swatch Picker */}
      {showPalettePicker && (
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#141311] border border-[#efe9de]/[0.08]">
            {CINEMA_PALETTES.map((option, index) => {
              const isSelected = paletteIndex === index;
              return (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => setPaletteIndex(index)}
                  title={option.name}
                  aria-label={`${option.name} stock`}
                  aria-pressed={isSelected}
                  className={`size-6 rounded-full border transition-colors duration-150 flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? "border-[#efe9de]/70 ring-1 ring-[#efe9de]/30"
                      : "border-[#efe9de]/10 opacity-75 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: option.paper }}
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: option.ink }}
                  />
                </button>
              );
            })}
          </div>
          <span className="text-[11px] font-mono text-[#787268]">
            {palette.name}
          </span>
        </div>
      )}

      {onBookNow && (
        <button
          onClick={onBookNow}
          className="h-10 px-5 rounded-xl bg-[#efe9de] text-[#12110f] font-semibold text-xs hover:bg-white transition-colors duration-150 flex items-center gap-2 active:scale-[0.98] cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>Select seats with this pass</span>
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
};

export default CinemaTicket;
