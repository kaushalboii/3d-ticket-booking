import React from 'react';
import { Showtime } from '../types';
import { ChevronLeft, Ticket, Edit3, User, Sparkles, ChevronDown } from 'lucide-react';

interface CinemaHeaderProps {
  movieTitle: string;
  theatreSubtitle: string;
  showtimes: Showtime[];
  selectedShowtimeId: string;
  onSelectShowtime: (id: string) => void;
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  onBackClick?: () => void;
  onOpenLogin?: () => void;
  onOpenTheatreSelect?: () => void;
  userName?: string;
  currentStep?: 1 | 2 | 3 | 4;
}

export const CinemaHeader: React.FC<CinemaHeaderProps> = ({
  movieTitle,
  theatreSubtitle,
  showtimes,
  selectedShowtimeId,
  onSelectShowtime,
  selectedDate = 'Mon, 09 Nov',
  onSelectDate,
  onBackClick,
  onOpenLogin,
  onOpenTheatreSelect,
  userName,
  currentStep = 2,
}) => {
  const dates = [
    { day: 'Mon', date: '09 Nov', full: 'Mon, 09 Nov, 2026' },
    { day: 'Tue', date: '10 Nov', full: 'Tue, 10 Nov, 2026' },
    { day: 'Wed', date: '11 Nov', full: 'Wed, 11 Nov, 2026' },
    { day: 'Thu', date: '12 Nov', full: 'Thu, 12 Nov, 2026' },
    { day: 'Fri', date: '13 Nov', full: 'Fri, 13 Nov, 2026' },
  ];

  return (
    <div className="w-full flex flex-col items-center pt-3 pb-2 px-4 select-none bg-[#050505] border-b border-[#141414]">
      {/* Top Bar: Back Button, Movie & Theatre Subtitle, Profile */}
      <div className="w-full flex items-center justify-between mb-2.5">
        {/* Left Circle Back Button */}
        <button
          onClick={onBackClick}
          className="w-8 h-8 rounded-full bg-[#111111] border border-[#222222] text-[#F5F5F5] flex items-center justify-center hover:bg-[#1A1A1A] hover:border-[#55E6A5] transition active:scale-95 cursor-pointer shadow-md"
          title="Back to Movies catalogue"
          aria-label="Back to Movies"
        >
          <ChevronLeft className="w-4 h-4 text-[#CCCCCC]" />
        </button>

        {/* Center Title and Subtitle with Theatre Dropdown */}
        <div className="flex flex-col items-center text-center px-2 flex-1 max-w-[300px]">
          <h1 className="text-[#F5F5F5] font-bold text-sm tracking-tight leading-tight truncate w-full">
            {movieTitle}
          </h1>

          {onOpenTheatreSelect ? (
            <button
              onClick={onOpenTheatreSelect}
              className="group flex items-center justify-center gap-1 text-[#888888] hover:text-[#55E6A5] text-[10px] font-normal mt-0.5 truncate w-full cursor-pointer transition"
              title="Click to Switch Multiplex / Theatre"
            >
              <span className="truncate underline decoration-dotted underline-offset-2">
                {theatreSubtitle}
              </span>
              <ChevronDown className="w-3 h-3 text-[#55E6A5] shrink-0 group-hover:translate-y-0.5 transition" />
            </button>
          ) : (
            <p className="text-[#888888] text-[10px] font-normal mt-0.5 truncate w-full">
              {theatreSubtitle}
            </p>
          )}
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

      {/* Visual Step Progress Indicator */}
      <div className="w-full max-w-[320px] flex items-center justify-between px-2 mb-2">
        {[
          { num: 1, label: 'Movie' },
          { num: 2, label: 'Seats' },
          { num: 3, label: '3D View' },
          { num: 4, label: 'Book' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-1.5">
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                currentStep >= s.num
                  ? 'bg-[#55E6A5] text-[#050505] shadow-[0_0_8px_rgba(85,230,165,0.4)]'
                  : 'bg-[#181818] border border-[#2A2A2A] text-[#666666]'
              }`}
            >
              {s.num}
            </span>
            <span
              className={`text-[9px] font-medium hidden xs:inline ${
                currentStep >= s.num ? 'text-[#E0E0E0]' : 'text-[#555555]'
              }`}
            >
              {s.label}
            </span>
            {s.num < 4 && <div className="w-4 h-[1px] bg-[#222222]" />}
          </div>
        ))}
      </div>

      {/* Date Pill Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 max-w-full no-scrollbar">
        {dates.map((d) => {
          const isSelected = selectedDate.includes(d.date);
          return (
            <button
              key={d.date}
              onClick={() => onSelectDate?.(d.full)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-[#55E6A5]/15 border border-[#55E6A5] text-[#55E6A5] shadow-sm shadow-[#55E6A5]/20 font-bold'
                  : 'bg-[#101010] border border-[#222222] text-[#777777] hover:text-[#CCCCCC] hover:border-[#333333]'
              }`}
            >
              <span className="font-bold">{d.day}</span> {d.date}
            </button>
          );
        })}
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
              <span
                className={`text-[9px] uppercase font-bold ${
                  isSelected ? 'text-[#050505]/80' : 'text-[#666666]'
                }`}
              >
                {st.format}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
