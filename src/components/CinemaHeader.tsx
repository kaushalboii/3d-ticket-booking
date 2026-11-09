import React from 'react';
import { Showtime } from '../types';
import { ChevronLeft, SlidersHorizontal } from 'lucide-react';

interface CinemaHeaderProps {
  cinemaName: string;
  hallAndDate: string;
  showtimes: Showtime[];
  selectedShowtimeId: string;
  onSelectShowtime: (id: string) => void;
  onBackClick?: () => void;
  onOpenSettings?: () => void;
  onOpenLogin?: () => void;
  userName?: string;
}

export const CinemaHeader: React.FC<CinemaHeaderProps> = ({
  cinemaName,
  hallAndDate,
  showtimes,
  selectedShowtimeId,
  onSelectShowtime,
  onBackClick,
  onOpenSettings,
  onOpenLogin,
  userName,
}) => {
  return (
    <div className="w-full flex flex-col items-center pt-3 pb-3 px-5 select-none bg-[#050505] border-b border-[#141414]/60">
      {/* Top Bar: Left Back Button, Center Cinema & Hall, Right Profile/Settings */}
      <div className="w-full flex items-center justify-between mb-3.5">
        {/* Left Circle Back Button to Movies Portal */}
        <button
          onClick={onBackClick}
          className="w-9 h-9 rounded-full bg-[#111111] border border-[#222222] text-[#F5F5F5] flex items-center justify-center hover:bg-[#1A1A1A] hover:border-[#55E6A5] transition active:scale-95 cursor-pointer shadow-md"
          title="Back to Movies"
          aria-label="Back to Movies"
        >
          <ChevronLeft className="w-4 h-4 text-[#CCCCCC]" />
        </button>

        {/* Center Title and Subtitle matching Video Frame 00:00 */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[#F5F5F5] font-bold text-base tracking-tight leading-tight">
            {cinemaName}
          </h1>
          <p className="text-[#808080] text-xs font-normal mt-0.5 tracking-tight">
            {hallAndDate}
          </p>
        </div>

        {/* Right Settings / Screens Button matching Video Frame 00:00 */}
        <button
          onClick={onOpenSettings}
          className="w-9 h-9 rounded-full bg-[#111111] border border-[#222222] text-[#CCCCCC] hover:text-[#55E6A5] hover:border-[#55E6A5] flex items-center justify-center hover:bg-[#1A1A1A] transition active:scale-95 cursor-pointer shadow-md"
          title="Auditorium & Screen Settings"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Showtime Pill Selector matching Video Frame 00:00: Active is Solid White Capsule */}
      <div className="flex items-center gap-2 justify-center max-w-full">
        {showtimes.map((st) => {
          const isSelected = st.id === selectedShowtimeId;
          return (
            <button
              key={st.id}
              onClick={() => onSelectShowtime(st.id)}
              className={`px-4 py-1.5 rounded-full text-xs transition duration-200 flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-white text-[#0A0A0A] font-bold shadow-lg shadow-white/10 scale-105'
                  : 'bg-[#111111] border border-[#222222] text-[#808080] hover:text-[#E0E0E0] hover:border-[#333333]'
              }`}
            >
              <span>{st.time}</span>
              <span className={`text-[10px] uppercase font-bold tracking-tight ${isSelected ? 'text-[#0A0A0A]/90' : 'text-[#666666]'}`}>
                {st.format}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
