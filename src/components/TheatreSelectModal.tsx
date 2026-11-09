import React from 'react';
import { Theatre, Showtime, Movie } from '../types';
import { THEATRES_LIST } from '../data/velsData';
import { X, Film, MapPin, ChevronRight, Clock } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-lg bg-[#0E1118] border border-white/[0.08] rounded-3xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#141822] border border-white/[0.08] flex items-center justify-center text-[#55E6A5]">
              <Film className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-[#F0F1F4] font-medium text-sm tracking-tight">
                {movie.title} · Select cinema
              </h3>
              <p className="text-[#7A8296] text-[11px]">
                {movie.language} · {movie.genre} · {selectedCity || 'All cinemas'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#141822] text-[#7A8296] hover:text-[#F0F1F4] flex items-center justify-center cursor-pointer"
          >
            <X className="w-3.5 h-3.5" strokeWidth={1.5} />
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
                    ? 'bg-[#151A24] border-[#55E6A5]/50'
                    : 'bg-[#141822] border-white/[0.08] hover:border-white/[0.14]'
                }`}
              >
                {/* Theatre Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-[#F0F1F4] tracking-tight">
                        {th.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-white/[0.06] text-[#A3A9B8] text-[10px] font-mono">
                        {th.format}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A8296] mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#55E6A5]" strokeWidth={1.5} />
                      <span>{th.location}</span>
                    </p>
                    <p className="text-[10px] text-[#5C6479] mt-0.5 font-mono">
                      {th.hall} · From {th.currency}{th.economyPrice}
                    </p>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.06] text-[#7A8296]">
                    {th.city}
                  </span>
                </div>

                {/* Showtimes Pills */}
                <div>
                  <span className="text-[10px] font-mono text-[#5C6479] block mb-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" strokeWidth={1.5} />
                    <span>Select showtime to open 3D seat preview</span>
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {th.showtimes.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => {
                          onSelectTheatreAndShowtime(th, st);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-full bg-[#1A202D] hover:bg-[#222A3B] border border-white/[0.08] hover:border-[#55E6A5]/50 text-xs transition cursor-pointer flex items-center gap-1.5 group"
                      >
                        <span className="font-mono text-[#F0F1F4] group-hover:text-[#55E6A5]">
                          {st.time}
                        </span>
                        <span className="text-[9px] font-mono text-[#5C6479]">
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