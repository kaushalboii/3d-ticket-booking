import React from 'react';
import { motion } from 'framer-motion';
import { Seat } from '../types';
import { ScreenArc } from './ScreenArc';

interface SeatMapProps {
  seats: Seat[];
  selectedSeatIds: string[];
  onSelectSeat: (seat: Seat) => void;
  showSweetSpotGuide?: boolean;
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
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export const SeatMap: React.FC<SeatMapProps> = ({
  seats,
  selectedSeatIds,
  onSelectSeat,
  showSweetSpotGuide = false,
}) => {
  // Extract unique rows dynamically based on the current screen layout
  const rows = Array.from(new Set(seats.map((s) => s.row))).sort();

  return (
    <div className="w-full flex-1 overflow-x-auto overflow-y-auto px-4 py-3 select-none flex flex-col items-center">
      <div className="min-w-max mx-auto flex flex-col items-center">
        {/* Curved Screen Arc at Top with smooth fade in */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
          className="w-full flex justify-center"
        >
          <ScreenArc />
        </motion.div>

        {/* Auditorium Seating Rows with Staggered Framer Motion Entrance */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-2 mt-2 mb-4"
        >
          {rows.map((rowLetter) => {
            const rowSeats = seats.filter((s) => s.row === rowLetter);
            if (rowSeats.length === 0) return null;

            const seatsPerRow = Math.max(...rowSeats.map((s) => s.number));
            const isReclinerRow = rowLetter === rows[rows.length - 1];
            const isSweetSpotRow = showSweetSpotGuide && ['D', 'E', 'F'].includes(rowLetter);

            // Calculate bank splits (e.g. 3 - 8 - 3 or proportional)
            let leftMax = 3;
            let rightMin = 12;
            if (seatsPerRow === 16) {
              leftMax = 4;
              rightMin = 13;
            } else if (seatsPerRow <= 10) {
              leftMax = 2;
              rightMin = 9;
            } else if (seatsPerRow <= 12) {
              leftMax = 3;
              rightMin = 10;
            }

            const leftSeats = rowSeats.filter((s) => s.number <= leftMax);
            const centerSeats = rowSeats.filter((s) => s.number > leftMax && s.number < rightMin);
            const rightSeats = rowSeats.filter((s) => s.number >= rightMin);

            return (
              <motion.div
                key={rowLetter}
                variants={rowVariants}
                className={`flex items-center gap-2.5 min-w-max justify-center px-2 py-0.5 rounded-lg transition ${
                  isSweetSpotRow ? 'bg-[#55E6A5]/[0.04] border border-[#55E6A5]/20' : ''
                }`}
              >
                {/* Left Row Letter */}
                <span
                  className={`w-4 text-[11px] font-semibold text-center font-mono select-none ${
                    isSweetSpotRow ? 'text-[#55E6A5]' : 'text-[#555555]'
                  }`}
                >
                  {rowLetter}
                </span>

                {/* Left Block */}
                <div className="flex items-center gap-1.5 justify-end">
                  {leftSeats.map((seat) => (
                    <SeatCapsule
                      key={seat.id}
                      seat={seat}
                      isSelected={selectedSeatIds.includes(seat.id)}
                      isRecliner={isReclinerRow}
                      onClick={() => onSelectSeat(seat)}
                    />
                  ))}
                </div>

                {/* Left Aisle Gap */}
                <div className="w-3.5 sm:w-5 shrink-0" />

                {/* Center Block */}
                <div className="flex items-center gap-1.5 justify-center">
                  {centerSeats.map((seat) => (
                    <SeatCapsule
                      key={seat.id}
                      seat={seat}
                      isSelected={selectedSeatIds.includes(seat.id)}
                      isRecliner={isReclinerRow}
                      onClick={() => onSelectSeat(seat)}
                    />
                  ))}
                </div>

                {/* Right Aisle Gap */}
                <div className="w-3.5 sm:w-5 shrink-0" />

                {/* Right Block */}
                <div className="flex items-center gap-1.5 justify-start">
                  {rightSeats.map((seat) => (
                    <SeatCapsule
                      key={seat.id}
                      seat={seat}
                      isSelected={selectedSeatIds.includes(seat.id)}
                      isRecliner={isReclinerRow}
                      onClick={() => onSelectSeat(seat)}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

interface SeatCapsuleProps {
  seat: Seat;
  isSelected: boolean;
  isRecliner: boolean;
  onClick: () => void;
}

const SeatCapsule: React.FC<SeatCapsuleProps> = ({
  seat,
  isSelected,
  isRecliner,
  onClick,
}) => {
  const isOccupied = seat.status === 'occupied';

  // 1. Selected State (Bright Mint Green capsule with number & smooth pop animation)
  if (isSelected) {
    return (
      <motion.button
        initial={{ scale: 0.85, opacity: 0.8 }}
        animate={{ scale: 1.1, opacity: 1 }}
        whileHover={{ scale: 1.18 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        onClick={onClick}
        className="w-[19px] h-[15px] sm:w-[23px] sm:h-[17px] rounded-[4px] bg-[#55E6A5] text-[#050505] font-extrabold text-[9px] flex items-center justify-center shadow-[0_0_12px_rgba(85,230,165,0.7)] z-10 cursor-pointer"
        title={`Seat ${seat.id} (Selected · ₹${seat.price})`}
      >
        {seat.number}
      </motion.button>
    );
  }

  // 2. Taken State (Muted Dark Red rounded rectangle matching video frame 00:00)
  if (isOccupied) {
    return (
      <div
        className="w-[18px] h-[14px] sm:w-[22px] sm:h-[16px] rounded-[4px] bg-[#6E2D33] border border-[#8E3339] opacity-90 cursor-not-allowed select-none"
        title={`Seat ${seat.id} (Taken)`}
      />
    );
  }

  // 3. Recliner Row Available State
  if (isRecliner) {
    return (
      <button
        onClick={onClick}
        className="w-[18px] h-[14px] sm:w-[22px] sm:h-[16px] rounded-[4px] bg-[#161920] border border-[#3A4150] hover:border-[#55E6A5] hover:bg-[#202530] transition active:scale-95 cursor-pointer"
        title={`Seat ${seat.id} (Recliner · ₹${seat.price})`}
      />
    );
  }

  // 4. Standard Available State (Dark charcoal capsule matching video frame 00:00)
  return (
    <button
      onClick={onClick}
      className="w-[18px] h-[14px] sm:w-[22px] sm:h-[16px] rounded-[4px] bg-[#1F2228] border border-[#2A303C] hover:border-[#55E6A5] hover:bg-[#2A303C] transition active:scale-95 cursor-pointer"
      title={`Seat ${seat.id} (Standard · ₹${seat.price})`}
    />
  );
};
