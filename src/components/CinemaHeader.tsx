import React from 'react';
import { Showtime } from '../types';
import { ChevronLeft, Ticket, Edit3, User } from 'lucide-react';

interface CinemaHeaderProps {
  movieTitle: string;
  theatreSubtitle: string;
  showtimes: Showtime[];
  selectedShowtimeId: string;
  onSelectShowtime: (id: string) => void;
  onBackClick?: () => void;
  onOpenLogin?: () => void;
  userName?: string;
}

export const CinemaHeader: React.FC<CinemaHeaderProps> = ({
  movieTitle,
  theatreSubtitle,
  showtimes,
  selectedShowtimeId,
  onSelectShowtime,
  onBackClick,
  onOpenLogin,
  userName,
}) => {
  return (
    <div className="w-full flex flex-col items-center pt-3 pb-2 px-4 select-none bg-[#050505] border-b border-[#141414]">
      {/* Top Bar: Back Button, Movie & Theatre Subtitle, 1 Ticket Button */}
      <div className="w-full flex items-center justify-between mb-3">
        {/* Left Circle Back Button */}
        <button
          onClick={onBackClick}
          className="w-8 h-8 rounded-full bg-[#111111] border border-[#222222] text-[#F5F5F5] flex items-center justify-center hover:bg-[#1A1A1A] transition active:scale-95 cursor-pointer"
          aria-label="Back to Movies"
        >
          <ChevronLeft className="w-4 h-4 text-[#CCCCCC]" />
        </button>

        {/* Center Title and Subtitle matching BookMyShow */}
        <div className="flex flex-col items-center text-center px-2">
          <h1 className="text-[#F5F5F5] font-bold text-sm tracking-tight leading-tight">
            {movieTitle}
          </h1>
          <p className="text-[#888888] text-[10px] font-normal mt-0.5 truncate max-w-[280px]">
            {theatreSubtitle}
          </p>
        </div>

        {/* Right Ticket Button / Profile */}
        <button
          onClick={onOpenLogin}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#111111] border border-[#262626] text-[10px] text-[#55E6A5] font-semibold hover:bg-[#1A1A1A] transition cursor-pointer"
        >
          <User className="w-3 h-3" />
          <span>{userName || '1 Ticket'}</span>
        </button>
      </div>

      {/* Date Pill Selector (State A from Reference Video) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 max-w-full no-scrollbar">
        {[
          { day: 'Mon', date: '09 Nov', active: true },
          { day: 'Tue', date: '10 Nov', active: false },
          { day: 'Wed', date: '11 Nov', active: false },
          { day: 'Thu', date: '12 Nov', active: false },
        ].map((d, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition cursor-pointer shrink-0 ${
              d.active
                ? 'bg-[#55E6A5]/15 border border-[#55E6A5] text-[#55E6A5]'
                : 'bg-[#101010] border border-[#222222] text-[#777777] hover:text-[#CCCCCC]'
            }`}
          >
            <span className="font-bold">{d.day}</span> {d.date}
          </button>
        ))}
      </div>

      {/* Showtime Pill Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
        {showtimes.map((st) => {
          const isSelected = st.id === selectedShowtimeId;
          return (
            <button
              key={st.id}
              onClick={() => onSelectShowtime(st.id)}
              className={`px-3 py-1 rounded-full text-xs transition duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#55E6A5] text-[#050505] font-bold shadow-md shadow-[#55E6A5]/30'
                  : 'bg-[#111111] border border-[#222222] text-[#888888] hover:text-[#E0E0E0] hover:border-[#333333]'
              }`}
            >
              <span>{st.time}</span>
              <span className={`text-[9px] uppercase font-bold ${isSelected ? 'text-[#050505]/80' : 'text-[#666666]'}`}>
                {st.format}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
