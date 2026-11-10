"use client";

import React, { useState } from "react";
import { Ticket } from "@/components/Ticket";
import { TicketPattern } from "@/components/TicketPattern";
import { Booking, Seat } from "@/types";
import { INDIAN_CINEMA_INFO } from "@/data/indianCinemaData";
import { Compass, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export const CINEMA_PALETTES = [
  {
    name: "Obsidian Mint",
    paper: "#0a0b0e",
    ink: "#55E6A5",
    accent: "#55E6A5",
    glareColor: "#55E6A5",
    border: "#1e2923",
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
    name: "Signal Premiere",
    paper: "#ff5a36",
    ink: "#111113",
    accent: "#111113",
    glareColor: "#ffffff",
    border: "#e04320",
  },
  {
    name: "Cyber Acid",
    paper: "#c9e54b",
    ink: "#11130a",
    accent: "#11130a",
    glareColor: "#ffffff",
    border: "#b2d134",
  },
  {
    name: "Champagne VIP",
    paper: "#18140c",
    ink: "#fbbf24",
    accent: "#f59e0b",
    glareColor: "#fbbf24",
    border: "#3d3014",
  },
  {
    name: "Titanium White",
    paper: "#f7f7f5",
    ink: "#0f1012",
    accent: "#0f1012",
    glareColor: "#ffffff",
    border: "#e2e2de",
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
  date = booking?.date || "14.11",
  showtime = booking?.showtime || "19:45",
  seats = booking?.seats || [],
  seatLabel = booking?.seats && booking.seats.length > 0
    ? booking.seats.map((s) => s.id).join(", ")
    : "Row F · Seat 8",
  reference = booking?.reference || "VELS-892401",
  customerName = booking?.customerName || "Kaushal Maran",
  defaultPaletteIndex = 0,
  className = "",
  onBookNow,
  showPalettePicker = true,
}) => {
  const [paletteIndex, setPaletteIndex] = useState(defaultPaletteIndex);
  const palette = CINEMA_PALETTES[paletteIndex];

  const admitCount = seats.length > 0 ? seats.length : 1;
  const admitWord = admitCount === 1 ? "One" : `${admitCount} Passes`;
  const tierName = seats[0]?.tierLabel || "Recliner VIP";

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* 3D Tilt Ticket Card */}
      <div className="relative flex items-center justify-center p-2">
        {/* Subtle radial ambient reflection matching ticket paper color */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none blur-3xl opacity-20 transition-colors duration-500 rounded-full"
          style={{
            background: `radial-gradient(circle, ${palette.paper} 0%, transparent 70%)`,
          }}
        />

        <Ticket
          aria-label={`${movieTitle} Cinema Admission Ticket`}
          className="z-10 h-[520px] w-[224px] aspect-auto max-[520px]:h-[465px] max-[520px]:w-[196px] shadow-2xl transition-all duration-300"
          ink={palette.ink}
          paper={palette.paper}
          notchSize={13}
          cornerSize={4}
          stubHeight={116}
          tiltProps={{
            glareColor: palette.glareColor,
            glareEnable: true,
            glareMaxOpacity: 0.18,
            glarePosition: "all",
            perspective: 1200,
            scale: 1.025,
            tiltMaxAngleX: 8,
            tiltMaxAngleY: 8,
          }}
          body={
            <div className="grid h-full grid-rows-[auto_1fr_auto_auto] gap-3.5 p-[20px_20px_22px] max-[520px]:gap-[11px] max-[520px]:p-[16px_16px_18px] select-none">
              {/* Header metadata */}
              <div className="flex justify-between items-center gap-2 font-mono text-[7px] font-bold leading-none tracking-[0.08em] uppercase opacity-[0.75]">
                <span>SERIES NO. 03 · AUDI 3</span>
                <span>FLAGSHIP · CHENNAI</span>
              </div>

              {/* Central Cinema Sightline & Soundwave Pattern */}
              <TicketPattern ink={palette.ink} />

              {/* Title & Hall section */}
              <div>
                <span className="font-mono text-[6.5px] font-bold uppercase tracking-wider block opacity-70 mb-1">
                  IMAX 4K LASER · DOLBY ATMOS
                </span>
                <h2 className="font-[850] text-[26px] leading-[0.85] tracking-[-0.06em] uppercase max-[520px]:text-[23px]">
                  {movieTitle}
                </h2>
                <p className="mt-2 text-[7.5px] font-semibold leading-[1.3] tracking-tight opacity-75">
                  {theatreName} · {hallName}
                </p>
              </div>

              {/* 2x2 Event Details Matrix */}
              <dl className="grid grid-cols-2 gap-2 pt-1 border-t border-current/15">
                <div className="flex flex-col gap-[2px]">
                  <dt className={microLabelClassName}>Date</dt>
                  <dd className="font-mono text-[10px] font-bold leading-none">
                    {date}
                  </dd>
                </div>
                <div className="flex flex-col gap-[2px]">
                  <dt className={microLabelClassName}>Doors / Showtime</dt>
                  <dd className="font-mono text-[10px] font-bold leading-none">
                    {showtime}
                  </dd>
                </div>
                <div className="flex flex-col gap-[2px]">
                  <dt className={microLabelClassName}>Seats</dt>
                  <dd className="font-mono text-[10px] font-bold leading-none truncate">
                    {seatLabel}
                  </dd>
                </div>
                <div className="flex flex-col gap-[2px]">
                  <dt className={microLabelClassName}>Tier</dt>
                  <dd className="font-mono text-[10px] font-bold leading-none uppercase truncate">
                    {tierName}
                  </dd>
                </div>
              </dl>
            </div>
          }
          stub={
            <div className="flex h-full flex-col justify-between gap-3 p-[18px_20px_16px] max-[520px]:p-[14px_16px_14px] select-none">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className={microLabelClassName}>Admit</span>
                  <strong className="font-[800] text-[12px] leading-none uppercase">
                    {admitWord}
                  </strong>
                </div>
                <div className="flex flex-col items-end gap-0.5 text-right">
                  <span className={microLabelClassName}>Turnstile Ref</span>
                  <strong className="font-mono font-[750] text-[7.5px] leading-none tracking-[-0.02em] uppercase">
                    {reference}
                  </strong>
                </div>
              </div>

              {/* Scannable High-precision Turnstile Barcode */}
              <div className="space-y-1">
                <div
                  aria-hidden="true"
                  className="h-[20px] w-full opacity-90 rounded-[1px]"
                  style={barcodeStyle}
                />
                <div className="flex justify-between items-center font-mono text-[6px] tracking-widest uppercase opacity-60">
                  <span>AUDI-3-TURNSTILE</span>
                  <span>SCAN FOR ENTRY</span>
                </div>
              </div>
            </div>
          }
        />
      </div>

      {/* Palette Selector Bar */}
      {showPalettePicker && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#111114] border border-[#222327] shadow-inner">
            {CINEMA_PALETTES.map((option, index) => {
              const isSelected = paletteIndex === index;
              return (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => setPaletteIndex(index)}
                  title={option.name}
                  aria-label={`${option.name} palette`}
                  aria-pressed={isSelected}
                  className={`size-6 rounded-full border transition-all duration-150 flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? "scale-110 border-white ring-2 ring-white/20"
                      : "border-black/30 hover:scale-105 opacity-80 hover:opacity-100"
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
          <span className="text-[10px] font-mono text-[#888888] tracking-wider uppercase">
            {palette.name} Edition
          </span>
        </div>
      )}

      {/* Optional Quick Booking Action */}
      {onBookNow && (
        <button
          onClick={onBookNow}
          className="mt-1 px-5 py-2.5 rounded-full bg-[#55E6A5] text-[#050505] font-extrabold text-xs tracking-tight hover:brightness-105 transition flex items-center gap-2 shadow-lg shadow-[#55E6A5]/25 active:scale-95 cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Book Seats with this Pass</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
export default CinemaTicket;

