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
}) => {
  return (
    <header className="w-full flex flex-col items-center pt-4 pb-3.5 px-5 select-none bg-[#0c0b0a] border-b border-[#efe9de]/[0.08]">
      {/* Symmetrical Top Bar */}
      <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center gap-3 mb-4">
        <div className="justify-self-start">
          <button
            onClick={onBackClick}
            className="w-9 h-9 rounded-full bg-[#141311] border border-[#efe9de]/[0.08] text-[#efe9de] flex items-center justify-center hover:bg-[#1e1c19] hover:border-[#efe9de]/20 transition-colors duration-150 active:scale-[0.97] cursor-pointer"
            title="Back to Movies"
            aria-label="Back to Movies"
          >
            <ChevronLeft className="w-4 h-4 text-[#cfc8bc]" strokeWidth={1.75} />
          </button>
        </div>

        <div className="justify-self-center flex flex-col items-center text-center min-w-0">
          <h1 className="text-[#efe9de] font-semibold text-sm sm:text-base tracking-tight leading-tight">
            {cinemaName}
          </h1>
          <p className="text-[#787268] text-xs font-normal mt-0.5 truncate max-w-[260px] sm:max-w-md">
            {hallAndDate}
          </p>
        </div>

        <div className="justify-self-end">
          <button
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-full bg-[#141311] border border-[#efe9de]/[0.08] text-[#cfc8bc] hover:text-[#E5A93C] hover:border-[#efe9de]/20 flex items-center justify-center hover:bg-[#1e1c19] transition-colors duration-150 active:scale-[0.97] cursor-pointer"
            title="Auditorium & Screen Settings"
            aria-label="Auditorium & Screen Settings"
          >
            <SlidersHorizontal className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Showtime Segmented Strip (Consistent height, zero scale jump) */}
      <div className="flex items-center gap-2 justify-center max-w-full flex-wrap">
        {showtimes.map((st) => {
          const isSelected = st.id === selectedShowtimeId;
          return (
            <button
              key={st.id}
              onClick={() => onSelectShowtime(st.id)}
              className={`h-8 px-3.5 rounded-lg text-xs transition-colors duration-150 flex items-center gap-2 cursor-pointer tabular-nums active:scale-[0.98] ${
                isSelected
                  ? 'bg-[#efe9de] text-[#12110f] font-semibold'
                  : 'bg-[#141311] border border-[#efe9de]/[0.08] text-[#aaa398] hover:text-[#efe9de] hover:bg-[#1e1c19]'
              }`}
            >
              <span>{st.time}</span>
              <span
                className={`text-[10px] font-mono ${
                  isSelected ? 'text-[#12110f]/75 font-semibold' : 'text-[#787268]'
                }`}
              >
                {st.format}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
