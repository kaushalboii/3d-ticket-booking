import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Seat } from '../types';
import { ScreenArc } from './ScreenArc';

interface SeatMapProps {
  seats: Seat[];
  selectedSeatId?: string | null;
  selectedSeatIds?: string[];
  onSelectSeat: (seat: Seat) => void;
  eliteTierLabel?: string;
  economyTierLabel?: string;
  currency?: string;
}

// Framer Motion staggered entrance animation variants (50ms delay between rows)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Stagger each row entrance by exactly 50ms
      delayChildren: 0.05,
    },
  },
};

const rowVariants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export const SeatMap: React.FC<SeatMapProps> = ({
  seats,
  selectedSeatId,
  selectedSeatIds,
  onSelectSeat,
  eliteTierLabel = '₹190 ELITE',
  economyTierLabel = '₹190 ECONOMY',
  currency = '₹',
}) => {
  const eliteRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const economyRows = ['J'];
  const allRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  // UI view mode: classic velvet UI vs grid view
  const [uiMode, setUiMode] = useState<'red' | 'grid'>('red');

  // Check if a seat is currently selected (supports both array and single id)
  const isSeatSelected = (seatId: string) => {
    if (selectedSeatIds && selectedSeatIds.length > 0) {
      return selectedSeatIds.includes(seatId);
    }
    return seatId === selectedSeatId;
  };

  // Split row seats into Left Bank, Center Bank, Right Bank
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
      <motion.div
        key={rowLetter}
        variants={rowVariants}
        className="flex items-center gap-1.5 sm:gap-2 mb-2 min-w-max justify-center"
      >
        {/* Left Row Letter */}
        <span className="w-5 text-[11px] font-mono text-[#5C6479] text-center shrink-0">
          {rowLetter}
        </span>

        {/* Left Bank */}
        <div className="flex items-center gap-1 sm:gap-1.5 justify-end min-w-[70px]">
          {leftSeats.map((seat) => (
            <SeatItem
              key={seat.id}
              seat={seat}
              isSelected={isSeatSelected(seat.id)}
              isRedUi={uiMode === 'red'}
              currency={currency}
              onClick={() => onSelectSeat(seat)}
            />
          ))}
        </div>

        {/* Left Aisle */}
        <div className="w-3.5 sm:w-4 shrink-0" />

        {/* Center Bank */}
        <div className="flex items-center gap-1 sm:gap-1.5 justify-center">
          {centerSeats.map((seat) => (
            <SeatItem
              key={seat.id}
              seat={seat}
              isSelected={isSeatSelected(seat.id)}
              isRedUi={uiMode === 'red'}
              currency={currency}
              onClick={() => onSelectSeat(seat)}
            />
          ))}
        </div>

        {/* Right Aisle */}
        <div className="w-3.5 sm:w-4 shrink-0" />

        {/* Right Bank */}
        <div className="flex items-center gap-1 sm:gap-1.5 justify-start min-w-[70px]">
          {rightSeats.map((seat) => (
            <SeatItem
              key={seat.id}
              seat={seat}
              isSelected={isSeatSelected(seat.id)}
              isRedUi={uiMode === 'red'}
              currency={currency}
              onClick={() => onSelectSeat(seat)}
            />
          ))}
        </div>

        {/* Right Row Letter */}
        <span className="w-5 text-[11px] font-mono text-[#5C6479] text-center shrink-0">
          {rowLetter}
        </span>
      </motion.div>
    );
  };

  return (
    <div className="w-full flex-1 overflow-x-auto overflow-y-auto px-4 py-3 select-none flex flex-col items-center bg-[#0B0D12]">
      <div className="min-w-max mx-auto flex flex-col items-center">
        {/* View Mode Switcher & Curved Screen Arc */}
        <div className="w-full flex flex-col items-center mb-2">
          {/* Subtle UI Mode Pill */}
          <div className="flex items-center gap-1 p-0.5 rounded-full bg-[#141822] border border-white/[0.08] mb-1">
            <button
              onClick={() => setUiMode('red')}
              className={`px-3 py-0.5 rounded-full text-[10px] transition cursor-pointer ${
                uiMode === 'red'
                  ? 'bg-[#1E2536] text-[#F0F1F4] font-medium'
                  : 'text-[#7A8296] hover:text-[#D1D5DF]'
              }`}
            >
              Velvet layout
            </button>
            <button
              onClick={() => setUiMode('grid')}
              className={`px-3 py-0.5 rounded-full text-[10px] transition cursor-pointer ${
                uiMode === 'grid'
                  ? 'bg-[#1E2536] text-[#55E6A5] font-medium'
                  : 'text-[#7A8296] hover:text-[#D1D5DF]'
              }`}
            >
              Grid view
            </button>
          </div>

          {/* Curved Screen Arc with smooth entrance */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
            className="w-full flex justify-center"
          >
            <ScreenArc />
          </motion.div>
        </div>

        {/* Elite Category Header */}
        <div className="w-full text-center py-2 mb-1">
          <span className="text-[11px] font-mono text-[#7A8296]">
            {eliteTierLabel}
          </span>
          <div className="w-3/4 max-w-[320px] h-[1px] bg-white/[0.06] mx-auto mt-1.5" />
        </div>

        {/* Staggered Row Entrance Animation Container (50ms delay between rows) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center mb-3"
        >
          {eliteRows.map((r) => renderRow(r))}
        </motion.div>

        {/* Economy Category Header */}
        <div className="w-full text-center py-2 mb-1">
          <span className="text-[11px] font-mono text-[#7A8296]">
            {economyTierLabel}
          </span>
          <div className="w-3/4 max-w-[320px] h-[1px] bg-white/[0.06] mx-auto mt-1.5" />
        </div>

        {/* Economy Rows (J) with Staggered Entrance */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center mb-4"
        >
          {economyRows.map((r) => renderRow(r))}
        </motion.div>
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

  // 1. Selected State: Solid Mint with Framer Motion spring pop
  if (isSelected) {
    return (
      <motion.button
        initial={{ scale: 0.85 }}
        animate={{ scale: 1.08 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        onClick={onClick}
        className={`w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] ${
          isRedUi ? 'rounded-full' : 'rounded-[4px]'
        } bg-[#55E6A5] text-[#07130E] font-mono font-medium text-[9px] flex items-center justify-center scale-105 z-10 cursor-pointer transition`}
        title={`Seat ${seat.id} (Selected - ${currency}${seat.price})`}
      >
        {formatNum}
      </motion.button>
    );
  }

  // 2. Taken / Sold State: Authentic dark cinema red
  if (isOccupied) {
    if (isRedUi) {
      return (
        <div
          className="w-[19px] h-[19px] sm:w-[21px] sm:h-[21px] rounded-full bg-[#6B282E] border border-[#85343B] text-[#D89399] text-[8px] flex items-center justify-center font-mono cursor-not-allowed opacity-90"
          title={`Seat ${seat.id} (Occupied)`}
        >
          {formatNum}
        </div>
      );
    }

    return (
      <div
        className="w-[18px] h-[17px] rounded-[3px] bg-[#141822] border border-white/[0.06] text-[#474D5E] text-[8px] flex items-center justify-center font-mono cursor-not-allowed opacity-60"
        title={`Seat ${seat.id} (Occupied)`}
      >
        {formatNum}
      </div>
    );
  }

  // 3. Available State: Quiet hairline circle
  if (isRedUi) {
    return (
      <button
        onClick={onClick}
        className="w-[19px] h-[19px] sm:w-[21px] sm:h-[21px] rounded-full bg-[#141822] border border-white/[0.08] hover:border-[#55E6A5]/60 hover:bg-[#1C2230] text-[#7A8296] hover:text-[#55E6A5] font-mono text-[8px] flex items-center justify-center transition active:scale-95 cursor-pointer"
        title={`Seat ${seat.id} (${seat.tierLabel})`}
      >
        {formatNum}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-[18px] h-[17px] rounded-[3px] bg-[#141822] border border-white/[0.08] hover:border-[#55E6A5]/60 text-[#7A8296] hover:text-[#55E6A5] font-mono text-[8px] flex items-center justify-center transition active:scale-95 cursor-pointer"
      title={`Seat ${seat.id} (${seat.tierLabel})`}
    >
      {formatNum}
    </button>
  );
};