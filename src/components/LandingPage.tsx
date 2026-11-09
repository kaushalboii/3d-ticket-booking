import React, { useState } from 'react';
import { Movie, UserProfile, Theatre, City } from '../types';
import { MOVIES_LIST, THEATRES_LIST, CITIES_LIST } from '../data/velsData';
import { Film, Calendar, Clock, MapPin, Eye, Star, User, Sparkles, ChevronRight, Compass, ShieldCheck, ChevronDown, Building2 } from 'lucide-react';

interface LandingPageProps {
  currentCity: string;
  currentTheatre: Theatre;
  onSelectMovie: (movie: Movie) => void;
  onSelectTheatre: (theatre: Theatre) => void;
  onOpenCitySelect: () => void;
  onOpenLogin: () => void;
  onDirect3DPreview?: () => void;
  currentUser: UserProfile | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentCity,
  currentTheatre,
  onSelectMovie,
  onSelectTheatre,
  onOpenCitySelect,
  onOpenLogin,
  onDirect3DPreview,
  currentUser,
}) => {
  const [selectedLang, setSelectedLang] = useState<string>('All');
  const featuredMovie = MOVIES_LIST[0]; // Scene - Tamil

  const filteredMovies = MOVIES_LIST.filter((m) => {
    if (selectedLang === 'All') return true;
    return m.language.toLowerCase() === selectedLang.toLowerCase();
  });

  // Theatres in the selected city
  const cityTheatres = THEATRES_LIST.filter(
    (th) => th.city.toLowerCase() === currentCity.toLowerCase()
  );
  const displayTheatres = cityTheatres.length > 0 ? cityTheatres : THEATRES_LIST;

  const currentCityObj = CITIES_LIST.find((c) => c.name.toLowerCase() === currentCity.toLowerCase());

  return (
    <div className="w-full h-full bg-[#050505] text-[#F5F5F5] flex flex-col overflow-y-auto select-none">
      {/* Top Global Navbar */}
      <header className="sticky top-0 z-30 bg-[#050505]/95 backdrop-blur-md border-b border-[#141414] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#55E6A5] to-emerald-600 flex items-center justify-center text-[#050505] shadow-md shadow-[#55E6A5]/20 font-bold">
            <Film className="w-4 h-4 font-bold" />
          </div>
          <div>
            <h1 className="text-[#F5F5F5] font-black text-sm tracking-tight leading-tight">
              CINESCAPE
            </h1>
            <p className="text-[10px] text-[#888888]">
              Global Cinema & 3D Ticket Network
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* City / Region Switcher Pill */}
          <button
            onClick={onOpenCitySelect}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111111] hover:bg-[#181818] border border-[#262626] hover:border-[#55E6A5] text-xs font-semibold text-[#E0E0E0] transition cursor-pointer shadow-sm group"
            title="Switch City / Region"
          >
            <span className="text-xs">{currentCityObj?.flag || '📍'}</span>
            <span>{currentCity}</span>
            <ChevronDown className="w-3 h-3 text-[#777777] group-hover:text-[#55E6A5] transition" />
          </button>

          {/* User Sign In */}
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111111] hover:bg-[#1A1A1A] border border-[#262626] text-xs font-semibold text-[#E0E0E0] transition cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-[#55E6A5]" />
            <span className="hidden sm:inline">{currentUser?.isLoggedIn ? currentUser.name : 'Sign In'}</span>
          </button>
        </div>
      </header>

      {/* Hero Movie Showcase */}
      <div className="relative w-full h-[360px] sm:h-[420px] shrink-0 overflow-hidden bg-black">
        <img
          src={featuredMovie.backdrop}
          alt={featuredMovie.title}
          className="w-full h-full object-cover filter brightness-45 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-transparent to-transparent" />

        <div className="absolute bottom-6 left-5 right-5 max-w-xl space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#55E6A5] text-[#050505] text-[10px] font-extrabold uppercase">
              Now Showing
            </span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] font-mono">
              {featuredMovie.language}
            </span>
            <span className="text-[11px] text-[#888888] font-mono">
              {featuredMovie.duration}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#262626] text-[#CCCCCC] text-[10px] font-mono">
              {currentTheatre.format}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {featuredMovie.title}
          </h2>

          <p className="text-xs text-[#CCCCCC] line-clamp-2 leading-relaxed">
            Experience the intense cinematic journey in {currentTheatre.name} with immersive first-person seat preview before reserving.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectMovie(featuredMovie)}
              className="px-6 py-2.5 rounded-full bg-[#55E6A5] text-[#050505] font-bold text-xs tracking-tight hover:brightness-105 transition flex items-center gap-2 shadow-lg shadow-[#55E6A5]/25 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Book Seats with 3D View ({currentTheatre.currency}{currentTheatre.elitePrice})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights: Signature 3D Preview */}
      <div className="px-5 py-4">
        <div
          onClick={onDirect3DPreview || (() => onSelectMovie(featuredMovie))}
          className="w-full bg-[#0E0E0E] hover:bg-[#141414] border border-[#222222] hover:border-[#55E6A5]/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg cursor-pointer transition group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#55E6A5]/10 border border-[#55E6A5]/30 flex items-center justify-center text-[#55E6A5] group-hover:scale-105 transition">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#F5F5F5] group-hover:text-[#55E6A5] transition">
                Signature 3D First-Person Seat View Simulator
              </h4>
              <p className="text-[11px] text-[#888888]">
                See the exact view of the screen from your seat with 360° drag look-around across multiplexes!
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#55E6A5] shrink-0 flex items-center gap-1 group-hover:translate-x-0.5 transition">
            Launch 3D Preview →
          </span>
        </div>
      </div>

      {/* Featured Theatres in City */}
      <div className="px-5 pb-5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#55E6A5]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Multiplexes in {currentCity}
            </h3>
          </div>
          <button
            onClick={onOpenCitySelect}
            className="text-[10px] text-[#55E6A5] hover:underline cursor-pointer"
          >
            Change City ({CITIES_LIST.length} Available) →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {displayTheatres.map((th) => {
            const isSelected = th.id === currentTheatre.id;
            return (
              <div
                key={th.id}
                onClick={() => onSelectTheatre(th)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#141414] border-[#55E6A5] shadow-lg shadow-[#55E6A5]/10'
                    : 'bg-[#0B0B0B] border-[#1C1C1C] hover:border-[#333333]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-white tracking-tight">
                      {th.name}
                    </h4>
                    <span className="px-1.5 py-0.5 rounded bg-[#55E6A5]/15 text-[#55E6A5] text-[9px] font-bold font-mono uppercase">
                      {th.format}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#888888] mt-0.5 truncate">
                    {th.location}
                  </p>
                  <p className="text-[10px] text-[#666666] mt-0.5">
                    {th.hall}
                  </p>
                </div>

                <div className="pt-2.5 mt-2 border-t border-[#181818] flex items-center justify-between text-[11px]">
                  <span className="text-[#AAAAAA] font-mono">
                    From {th.currency}{th.economyPrice}
                  </span>
                  <span className={`font-semibold ${isSelected ? 'text-[#55E6A5]' : 'text-[#888888]'}`}>
                    {isSelected ? '✓ Active Cinema' : 'Select Cinema →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Now Showing Movie Grid */}
      <div className="px-5 pb-8 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[11px]">
              Now Showing Movies
            </h3>
            <p className="text-[10px] text-[#777777]">
              Select a film to browse showtimes and enter 3D seat preview
            </p>
          </div>

          {/* Language filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['All', 'Tamil', 'English', 'Japanese'].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-3 py-1 rounded-full text-[10px] font-semibold transition cursor-pointer shrink-0 ${
                  selectedLang === lang
                    ? 'bg-[#55E6A5] text-[#050505]'
                    : 'bg-[#101010] border border-[#222222] text-[#888888] hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onSelectMovie(movie)}
              className="bg-[#0B0B0B] border border-[#1A1A1A] hover:border-[#55E6A5]/40 rounded-2xl overflow-hidden transition cursor-pointer flex flex-col justify-between group shadow-md"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={movie.backdrop}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 filter brightness-85"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/75 text-[10px] text-[#55E6A5] font-bold font-mono">
                  {movie.timing}
                </div>
              </div>

              <div className="p-3.5 space-y-1">
                <span className="text-[9px] uppercase font-bold text-[#888888] tracking-wider">
                  {movie.language} • {movie.genre}
                </span>
                <h4 className="text-sm font-bold text-white group-hover:text-[#55E6A5] transition">
                  {movie.title}
                </h4>
                <p className="text-[11px] text-[#888888]">
                  {currentTheatre.name} · {currentTheatre.currency}{currentTheatre.elitePrice}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs text-[#55E6A5] font-bold">
                  <span>Choose Shows & 3D Seats</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#141414] py-6 px-5 text-center text-[10px] text-[#666666]">
        <p>CINESCAPE Global Cinema Platform · Operating in {CITIES_LIST.length} Global Metropolitan Centers</p>
        <p className="mt-1">Powered by 3D WebGL Seat Sightline Simulator · Interactive Frontend Architecture</p>
      </footer>
    </div>
  );
};
