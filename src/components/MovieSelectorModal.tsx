import React from 'react';
import { Movie } from '../types';
import { INDIAN_MOVIES } from '../data/indianCinemaData';
import { X, Film, Check, Star, Clock } from 'lucide-react';

interface MovieSelectorModalProps {
  activeMovie: Movie;
  onSelectMovie: (movie: Movie) => void;
  onClose: () => void;
}

export const MovieSelectorModal: React.FC<MovieSelectorModalProps> = ({
  activeMovie,
  onSelectMovie,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm select-none animate-fade-in">
      <div className="w-full max-w-sm bg-[#111111] border-t sm:border border-[#222222] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1A1A1A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center text-[#55E6A5]">
              <Film className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-[#F5F5F5] font-bold text-sm tracking-tight">
                Now Showing in Audi 3
              </h3>
              <p className="text-[#888888] text-[11px]">
                Vels Meridian Cinemas: Chennai
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#181818] text-[#888888] hover:text-[#F5F5F5] flex items-center justify-center cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Movie List */}
        <div className="p-4 space-y-2.5 overflow-y-auto">
          {INDIAN_MOVIES.map((movie) => {
            const isSelected = movie.id === activeMovie.id;
            return (
              <div
                key={movie.id}
                onClick={() => {
                  onSelectMovie(movie);
                  onClose();
                }}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#181818] border-[#55E6A5]/60 shadow-md shadow-[#55E6A5]/10'
                    : 'bg-[#0A0A0A] border-[#1C1C1C] hover:border-[#333333] hover:bg-[#141414]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-14 rounded-xl overflow-hidden bg-black shrink-0 border border-[#222222]">
                    <img
                      src={movie.backdrop}
                      alt={movie.title}
                      className="w-full h-full object-cover filter brightness-90"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#55E6A5] tracking-wider block">
                      {movie.language} · 4K Laser
                    </span>
                    <h4 className="text-sm font-bold text-[#F5F5F5] truncate">
                      {movie.title}
                    </h4>
                    <p className="text-[11px] text-[#777777] flex items-center gap-2 mt-0.5">
                      <span>{movie.duration}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5 text-amber-400">
                        <Star className="w-2.5 h-2.5 fill-amber-400" />
                        {movie.rating}
                      </span>
                    </p>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-[#55E6A5] text-[#050505] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <span className="text-xs text-[#666666] font-semibold shrink-0">
                    Select
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
