import React from 'react';
import { Theatre, Showtime, Movie } from '../types';
import { THEATRES_LIST } from '../data/velsData';
import { X, Film, MapPin, Sparkles, ChevronRight, Clock } from 'lucide-react';

interface TheatreSelectModalProps {
  movie: Movie;
  currentTheatreId: string;
  selectedCity?: string;
  onSelectTheatreAndShowtime: (theatre: Theatre, showtime: Showtime) => void;
  onClose: () => void;
}

export const TheatreSelectModal: React.FC<TheatreSelectModalProps> = ({
  movie,
  currentTheatreId,
  selectedCity,
  onSelectTheatreAndShowtime,
  onClose,
}) => {
  // Filter theatres matching the movie and optionally city
  const availableTheatres = THEATRES_LIST.filter((th) => {
    if (selectedCity && selectedCity !== 'All' && th.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }
    if (movie.theatreIds && movie.theatreIds.length > 0) {
      return movie.theatreIds.includes(th.id);
    }
    return true;
  });

  const displayTheatres = availableTheatres.length > 0 ? availableTheatres : THEATRES_LIST.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none animate-fade-in">
      <div className="w-full max-w-lg bg-[#111111] border border-[#222222] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1C1C1C] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#55E6A5] to-emerald-600 flex items-center justify-center text-[#050505] shadow-md shadow-[#55E6A5]/20 font-bold">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[#F5F5F5] font-bold text-sm tracking-tight">
                {movie.title} · Select Cinema
              </h3>
              <p className="text-[#888888] text-[11px]">
                {movie.language} · {movie.genre} · {selectedCity || 'All Theatres'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#1A1A1A] text-[#888888] hover:text-[#F5F5F5] flex items-center justify-center cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Theatres & Showtimes List */}
        <div className="p-4 space-y-3 overflow-y-auto">
          {displayTheatres.map((th) => {
            const isCurrent = th.id === currentTheatreId;
            return (
              <div
                key={th.id}
                className={`p-4 rounded-2xl border transition flex flex-col gap-3 ${
                  isCurrent
                    ? 'bg-[#141414] border-[#55E6A5]/60 shadow-lg'
                    : 'bg-[#0E0E0E] border-[#222222] hover:border-[#383838]'
                }`}
              >
                {/* Theatre Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {th.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-[#55E6A5]/15 text-[#55E6A5] text-[10px] font-bold uppercase font-mono">
                        {th.format}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#888888] mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#55E6A5]" />
                      <span>{th.location}</span>
                    </p>
                    <p className="text-[10px] text-[#666666] mt-0.5">
                      {th.hall} · From {th.currency}{th.economyPrice}
                    </p>
                  </div>

                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-[#181818] border border-[#282828] text-[#AAAAAA]">
                    {th.city}
                  </span>
                </div>

                {/* Showtimes Pills */}
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#666666] tracking-wider block mb-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#55E6A5]" />
                    <span>Select Showtime for 3D View:</span>
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {th.showtimes.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => {
                          onSelectTheatreAndShowtime(th, st);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#2A2A2A] hover:bg-[#55E6A5] hover:text-[#050505] hover:border-[#55E6A5] text-xs font-semibold text-[#D5D5D5] transition flex items-center gap-1.5 cursor-pointer group/time active:scale-95 shadow-sm"
                      >
                        <span>{st.time}</span>
                        <span className="text-[9px] text-[#777777] group-hover/time:text-[#050505]/75 uppercase font-bold font-mono">
                          {st.format}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
