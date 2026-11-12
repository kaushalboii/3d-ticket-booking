import React from 'react';
import { motion } from 'motion/react';
import { Seat } from '../types';
import { ScreenArc } from './ScreenArc';

interface SeatMapProps {
  seats: Seat[];
  selectedSeatIds: string[];
  onSelectSeat: (seat: Seat) => void;
  showSweetSpotGuide?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.04,
    },
  },
};

const rowVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.36,
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
  const rows = Array.from(new Set(seats.map((s) => s.row))).sort();

  return (
    <div className="w-full flex-1 overflow-x-auto overflow-y-auto px-4 py-4 select-none flex flex-col items-center justify-center">
      <div className="min-w-max mx-auto flex flex-col items-center">
        {/* Centered Curved Screen Arc */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
          className="w-full flex justify-center mb-4"
        >
          <ScreenArc />
        </motion.div>

        {/* Symmetrical 3-Bank Auditorium Rows */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-2 my-2"
        >
          {rows.map((rowLetter) => {
            const rowSeats = seats.filter((s) => s.row === rowLetter);
            if (rowSeats.length === 0) return null;

            const seatsPerRow = Math.max(...rowSeats.map((s) => s.number));
            const isReclinerRow = rowLetter === rows[rows.length - 1];
            const isSweetSpotRow = showSweetSpotGuide && ['D', 'E', 'F'].includes(rowLetter);

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

            const rowLabelClass = `w-5 text-[11px] font-medium text-center font-mono select-none tabular-nums ${
              isSweetSpotRow ? 'text-[#E5A93C]' : 'text-[#5a554c]'
            }`;

            return (
              <motion.div
                key={rowLetter}
                variants={rowVariants}
                className={`flex items-center gap-2 min-w-max justify-center px-2 py-0.5 rounded-lg transition-colors duration-150 ${
                  isSweetSpotRow ? 'bg-[#E5A93C]/[0.05] border border-[#E5A93C]/20' : ''
                }`}
              >
                {/* Left Row Marker */}
                <span className={rowLabelClass}>{rowLetter}</span>

                {/* Left Bank */}
                <div className="flex items-center gap-1.5">
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

                {/* Left Aisle */}
                <div className="w-3 sm:w-5 shrink-0" />

                {/* Center Bank */}
                <div className="flex items-center gap-1.5">
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

                {/* Right Aisle */}
                <div className="w-3 sm:w-5 shrink-0" />

                {/* Right Bank */}
                <div className="flex items-center gap-1.5">
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

                {/* Symmetrical Right Row Marker (Keeps center column aligned directly below screen midpoint) */}
                <span className={rowLabelClass} aria-hidden="true">
                  {rowLetter}
                </span>
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

const seatDimensions = 'w-[20px] h-[16px] sm:w-[24px] sm:h-[18px] rounded-[4px]';

const SeatCapsule: React.FC<SeatCapsuleProps> = ({
  seat,
  isSelected,
  isRecliner,
  onClick,
}) => {
  const isOccupied = seat.status === 'occupied';

  if (isSelected) {
    return (
      <motion.button
        initial={{ scale: 0.9 }}
        animate={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 460, damping: 28 }}
        onClick={onClick}
        className={`${seatDimensions} bg-[#E5A93C] text-[#12110f] font-semibold font-mono text-[10px] leading-none flex items-center justify-center shadow-sm z-10 cursor-pointer tabular-nums`}
        title={`Seat ${seat.id} · Selected · ₹${seat.price}`}
        aria-pressed="true"
      >
        {seat.number}
      </motion.button>
    );
  }

  if (isOccupied) {
    return (
      <div
        className={`${seatDimensions} bg-[#512327] border border-[#6e3035] opacity-85 cursor-not-allowed select-none`}
        title={`Seat ${seat.id} · Taken`}
      />
    );
  }

  if (isRecliner) {
    return (
      <button
        onClick={onClick}
        className={`${seatDimensions} bg-[#1c1f24] border border-[#3a404c] hover:border-[#E5A93C] hover:bg-[#252a32] transition-colors duration-150 active:scale-[0.95] cursor-pointer`}
        title={`Seat ${seat.id} · Recliner · ₹${seat.price}`}
        aria-label={`Seat ${seat.id}, Recliner, ₹${seat.price}`}
      />
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${seatDimensions} bg-[#1e1c19] border border-[#efe9de]/[0.1] hover:border-[#E5A93C] hover:bg-[#282521] transition-colors duration-150 active:scale-[0.95] cursor-pointer`}
      title={`Seat ${seat.id} · Standard · ₹${seat.price}`}
      aria-label={`Seat ${seat.id}, Standard, ₹${seat.price}`}
    />
  );
};
