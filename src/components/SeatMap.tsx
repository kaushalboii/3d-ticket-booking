import React, { useState } from 'react';
import { Seat } from '../types';
import { ScreenArc } from './ScreenArc';

interface SeatMapProps {
  seats: Seat[];
  selectedSeatId: string | null;
  onSelectSeat: (seat: Seat) => void;
  eliteTierLabel?: string;
  economyTierLabel?: string;
  currency?: string;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  seats,
  selectedSeatId,
  onSelectSeat,
  eliteTierLabel = '₹190 ELITE',
  economyTierLabel = '₹190 ECONOMY',
  currency = '₹',
}) => {
  const eliteRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const economyRows = ['J'];

  // UI view mode: classic red UI (default per user request) vs BMS grid view
  const [uiMode, setUiMode] = useState<'red' | 'grid'>('red');

  // Helper to split row seats into Left Bank, Center Bank, Right Bank matching Vels Theatres
  const renderRow = (rowLetter: string) => {
    const rowSeats = seats.filter((s) => s.row === rowLetter);
    if (rowSeats.length === 0) return null;

    let leftSeats: Seat[] = [];
    let centerSeats: Seat[] = [];
    let rightSeats: Seat[] = [];

    if (rowLetter === 'A') {
      leftSeats = rowSeats.filter((s) => s.number <= 9);
      centerSeats = rowSeats.filter((s) => s.number >= 10 && s.number <= 17);
      rightSeats = rowSeats.filter((s) => s.number >= 18);
    } else if (['B', 'C'].includes(rowLetter)) {
      leftSeats = rowSeats.filter((s) => s.number <= 5);
      centerSeats = rowSeats.filter((s) => s.number >= 6 && s.number <= 18);
      rightSeats = rowSeats.filter((s) => s.number >= 19);
    } else if (['D', 'E', 'F', 'G', 'H'].includes(rowLetter)) {
      leftSeats = rowSeats.filter((s) => s.number <= 5);
      centerSeats = rowSeats.filter((s) => s.number >= 6 && s.number <= 18);
      rightSeats = rowSeats.filter((s) => s.number >= 19);
    } else if (rowLetter === 'I') {
      leftSeats = rowSeats.filter((s) => s.number <= 5);
      centerSeats = rowSeats.filter((s) => s.number >= 6 && s.number <= 18);
      rightSeats = rowSeats.filter((s) => s.number >= 19);
    } else if (rowLetter === 'J') {
      leftSeats = rowSeats.filter((s) => s.number <= 4);
      centerSeats = rowSeats.filter((s) => s.number >= 5 && s.number <= 17);
      rightSeats = rowSeats.filter((s) => s.number >= 18);
    }

    return (
      <div key={rowLetter} className="flex items-center gap-1.5 sm:gap-2 mb-2 min-w-max justify-center">
        {/* Left Row Letter */}
        <span className="w-5 text-[11px] font-bold text-[#666666] text-center font-mono shrink-0">
          {rowLetter}
        </span>

        {/* Left Bank */}
        <div className="flex items-center gap-1 sm:gap-1.5 justify-end min-w-[70px]">
          {leftSeats.map((seat) => (
            <SeatItem
              key={seat.id}
              seat={seat}
              isSelected={seat.id === selectedSeatId}
              isRedUi={uiMode === 'red'}
              currency={currency}
              onClick={() => onSelectSeat(seat)}
            />
          ))}
        </div>

        {/* Left Aisle */}
        <div className="w-3 sm:w-4 shrink-0" />

        {/* Center Bank */}
        <div className="flex items-center gap-1 sm:gap-1.5 justify-center">
          {centerSeats.map((seat) => (
            <SeatItem
              key={seat.id}
              seat={seat}
              isSelected={seat.id === selectedSeatId}
              isRedUi={uiMode === 'red'}
              currency={currency}
              onClick={() => onSelectSeat(seat)}
            />
          ))}
        </div>

        {/* Right Aisle */}
        <div className="w-3 sm:w-4 shrink-0" />

        {/* Right Bank */}
        <div className="flex items-center gap-1 sm:gap-1.5 justify-start min-w-[70px]">
          {rightSeats.map((seat) => (
            <SeatItem
              key={seat.id}
              seat={seat}
              isSelected={seat.id === selectedSeatId}
              isRedUi={uiMode === 'red'}
              currency={currency}
              onClick={() => onSelectSeat(seat)}
            />
          ))}
        </div>

        {/* Right Row Letter */}
        <span className="w-5 text-[11px] font-bold text-[#666666] text-center font-mono shrink-0">
          {rowLetter}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full flex-1 overflow-x-auto overflow-y-auto px-4 py-2 select-none flex flex-col items-center">
      <div className="min-w-max mx-auto flex flex-col items-center">
        {/* Top View Mode Switcher & Curved Screen Arc */}
        <div className="w-full flex flex-col items-center mb-1">
          {/* Subtle UI Mode Pill */}
          <div className="flex items-center gap-1 p-0.5 rounded-full bg-[#111111] border border-[#222222] mb-1">
            <button
              onClick={() => setUiMode('red')}
              className={`px-3 py-0.5 rounded-full text-[10px] font-semibold transition cursor-pointer ${
                uiMode === 'red'
                  ? 'bg-[#7D4147] text-white shadow-sm'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Classic Red UI
            </button>
            <button
              onClick={() => setUiMode('grid')}
              className={`px-3 py-0.5 rounded-full text-[10px] font-semibold transition cursor-pointer ${
                uiMode === 'grid'
                  ? 'bg-[#222222] text-[#55E6A5]'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Grid View
            </button>
          </div>

          {/* Curved Screen Arc at Top (from Reference Video UI) */}
          <ScreenArc />
        </div>

        {/* Elite Category Header */}
        <div className="w-full text-center py-2 mb-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#888888]">
            {eliteTierLabel}
          </span>
          <div className="w-3/4 max-w-[360px] h-[1px] bg-gradient-to-r from-transparent via-[#2A2A2A] to-transparent mx-auto mt-1" />
        </div>

        {/* Elite Rows (A - I) */}
        <div className="flex flex-col items-center mb-3">
          {eliteRows.map((r) => renderRow(r))}
        </div>

        {/* Economy Category Header */}
        <div className="w-full text-center py-2 mb-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#888888]">
            {economyTierLabel}
          </span>
          <div className="w-3/4 max-w-[360px] h-[1px] bg-gradient-to-r from-transparent via-[#2A2A2A] to-transparent mx-auto mt-1" />
        </div>

        {/* Economy Rows (J) */}
        <div className="flex flex-col items-center mb-4">
          {economyRows.map((r) => renderRow(r))}
        </div>
      </div>
    </div>
  );
};

interface SeatItemProps {
  seat: Seat;
  isSelected: boolean;
  isRedUi: boolean;
  currency: string;
  onClick: () => void;
}

const SeatItem: React.FC<SeatItemProps> = ({
  seat,
  isSelected,
  isRedUi,
  currency,
  onClick,
}) => {
  const isOccupied = seat.status === 'occupied';
  const formatNum = seat.number < 10 ? `0${seat.number}` : `${seat.number}`;

  // 1. Selected State (Signature Mint Green)
  if (isSelected) {
    return (
      <button
        onClick={onClick}
        className={`w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] ${
          isRedUi ? 'rounded-full' : 'rounded-[3px]'
        } bg-[#55E6A5] text-[#050505] font-extrabold text-[9px] flex items-center justify-center shadow-[0_0_14px_rgba(85,230,165,0.7)] scale-110 z-10 cursor-pointer transition transform`}
        title={`Seat ${seat.id} (Selected - ${currency}${seat.price})`}
      >
        {formatNum}
      </button>
    );
  }

  // 2. Taken / Sold State: The iconic "Red One" from the reference video!
  if (isOccupied) {
    if (isRedUi) {
      return (
        <div
          className="w-[19px] h-[19px] sm:w-[21px] sm:h-[21px] rounded-full bg-[#7D4147] border border-[#96373E] text-[#D89399] text-[8px] flex items-center justify-center font-mono cursor-not-allowed opacity-90 shadow-sm shadow-[#7D4147]/20"
          title={`Seat ${seat.id} (Taken)`}
        >
          {formatNum}
        </div>
      );
    }

    // Grid fallback
    return (
      <div
        className="w-[18px] h-[17px] rounded-[3px] bg-[#222222] text-[#444444] text-[8px] flex items-center justify-center font-mono cursor-not-allowed opacity-60"
        title={`Seat ${seat.id} (Sold)`}
      >
        {formatNum}
      </div>
    );
  }

  // 3. Available State: Sleek dark circle (Red UI mode) or BookMyShow border (Grid mode)
  if (isRedUi) {
    return (
      <button
        onClick={onClick}
        className="w-[19px] h-[19px] sm:w-[21px] sm:h-[21px] rounded-full bg-[#181818] border border-[#2B2B2B] hover:border-[#55E6A5] hover:bg-[#222222] text-[#777777] hover:text-[#55E6A5] font-mono text-[8px] flex items-center justify-center transition active:scale-95 cursor-pointer"
        title={`Seat ${seat.id} (${seat.tierLabel})`}
      >
        {formatNum}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-[18px] h-[17px] rounded-[3px] bg-[#141414] border border-[#2E5E4A] hover:border-[#55E6A5] text-[#7BA694] hover:text-[#55E6A5] font-mono text-[8px] flex items-center justify-center transition active:scale-95 cursor-pointer"
      title={`Seat ${seat.id} (${seat.tierLabel})`}
    >
      {formatNum}
    </button>
  );
};
