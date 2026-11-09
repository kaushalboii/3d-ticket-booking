import React from 'react';
import { Showtime } from '../types';
import { ChevronLeft, User, ChevronDown } from 'lucide-react';

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
    <div className="w-full flex flex-col items-center pt-3 pb-3 px-4 select-none bg-[#0B0D12] border-b border-white/[0.08]">
      {/* Top Bar: Back Button, Movie & Theatre Subtitle, Profile */}
      <div className="w-full flex items-center justify-between mb-3">
        {/* Left Circle Back Button */}
        <button
          onClick={onBackClick}
          className="w-8 h-8 rounded-full bg-[#141822] border border-white/[0.08] text-[#F0F1F4] flex items-center justify-center hover:bg-[#1C2230] hover:border-white/[0.16] transition active:scale-95 cursor-pointer"
          title="Back to movies catalogue"
          aria-label="Back to movies"
        >
          <ChevronLeft className="w-4 h-4 text-[#A3A9B8]" strokeWidth={1.5} />
        </button>

        {/* Center Title and Subtitle with Theatre Dropdown */}
        <div className="flex flex-col items-center text-center px-2 flex-1 max-w-[320px]">
          <h1 className="text-[#F0F1F4] font-medium text-sm tracking-tight leading-tight truncate w-full">
            {movieTitle}
          </h1>

          {onOpenTheatreSelect ? (
            <button
              onClick={onOpenTheatreSelect}
              className="group flex items-center justify-center gap-1 text-[#7A8296] hover:text-[#55E6A5] text-[11px] font-normal mt-0.5 truncate w-full cursor-pointer transition"
              title="Click to switch cinema or auditorium"
            >
              <span className="truncate underline decoration-dotted underline-offset-2">
                {theatreSubtitle}
              </span>
              <ChevronDown className="w-3 h-3 text-[#55E6A5] shrink-0" strokeWidth={1.5} />
            </button>
          ) : (
            <p className="text-[#7A8296] text-[11px] font-normal mt-0.5 truncate w-full">
              {theatreSubtitle}
            </p>
          )}
        </div>

        {/* Right Ticket Button / Profile */}
        <button
          onClick={onOpenLogin}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141822] border border-white/[0.08] text-[11px] text-[#55E6A5] font-normal hover:bg-[#1C2230] transition cursor-pointer"
        >
          <User className="w-3 h-3" strokeWidth={1.5} />
          <span>{userName || 'Guest'}</span>
        </button>
      </div>

      {/* Visual Step Progress Indicator */}
      <div className="w-full max-w-[280px] flex items-center justify-between px-2 mb-2.5">
        {[
          { num: 1, label: 'Movie' },
          { num: 2, label: 'Seats' },
          { num: 3, label: '3D View' },
          { num: 4, label: 'Pass' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-1.5">
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono font-medium ${
                currentStep >= s.num
                  ? 'bg-[#55E6A5] text-[#07130E]'
                  : 'bg-[#181D29] border border-white/[0.08] text-[#5C6479]'
              }`}
            >
              {s.num}
            </span>
            <span
              className={`text-[10px] hidden xs:inline ${
                currentStep >= s.num ? 'text-[#D1D5DF]' : 'text-[#5C6479]'
              }`}
            >
              {s.label}
            </span>
            {s.num < 4 && <div className="w-3 h-[1px] bg-white/[0.08]" />}
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
              className={`px-3 py-1 rounded-full text-[11px] transition cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-[#55E6A5]/15 border border-[#55E6A5]/50 text-[#55E6A5] font-medium'
                  : 'bg-[#141822] border border-white/[0.08] text-[#7A8296] hover:text-[#D1D5DF] hover:border-white/[0.14]'
              }`}
            >
              <span className="font-medium">{d.day}</span> {d.date}
            </button>
          );
        })}
      </div>

      {/* Showtime Pill Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-full no-scrollbar">
        {showtimes.map((st) => {
          const isSelected = st.id === selectedShowtimeId;
          return (
            <button
              key={st.id}
              onClick={() => onSelectShowtime(st.id)}
              className={`px-3 py-1 rounded-full text-xs transition duration-150 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#55E6A5] text-[#07130E] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                  : 'bg-[#141822] border border-white/[0.08] text-[#7A8296] hover:text-[#D1D5DF] hover:border-white/[0.14]'
              }`}
            >
              <span>{st.time}</span>
              <span
                className={`text-[9px] font-mono ${
                  isSelected ? 'text-[#07130E]/75' : 'text-[#5C6479]'
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