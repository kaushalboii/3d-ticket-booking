import React, { useState } from 'react';
import { Movie, UserProfile } from '../types';
import { INDIAN_MOVIES, INDIAN_SHOWTIMES, INDIAN_DATES, CINESCAPE_LOCATIONS } from '../data/indianCinemaData';
import { Film, User, ChevronRight, ArrowRight, Sparkles, Star, ShieldCheck, Globe, Compass, Play, Ticket as TicketIcon, Image as ImageIcon } from 'lucide-react';
import { ScreenArc } from './ScreenArc';
import { CinemaTicket } from './CinemaTicket';

interface CinemaLandingPageProps {
  onSelectMovieAndBook: (movie: Movie, showtimeId?: string) => void;
  onOpenLogin: () => void;
  currentUser: UserProfile | null;
}

export const CinemaLandingPage: React.FC<CinemaLandingPageProps> = ({
  onSelectMovieAndBook,
  onOpenLogin,
  currentUser,
}) => {
  const [selectedCityId, setSelectedCityId] = useState('mumbai');
  const [heroMediaMode, setHeroMediaMode] = useState<'ticket' | 'poster'>('ticket');
  const featured = INDIAN_MOVIES[0]; // Scene - Tamil
  const currentCity = CINESCAPE_LOCATIONS.find((c) => c.id === selectedCityId) || CINESCAPE_LOCATIONS[0];

  return (
    <div className="w-full h-full bg-[#000000] text-[#FFFFFF] flex flex-col overflow-y-auto select-none font-sans antialiased">
      {/* Global Brand Top Header */}
      <header className="sticky top-0 z-40 bg-[#000000]/95 backdrop-blur-md border-b border-[#181818] px-6 py-4 flex items-center justify-between">
        {/* Brand Logo & Global Location */}
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-black text-xs tracking-tighter shadow-md">
            CS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-widest text-white">
                CINESCAPE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C]" />
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#121212] border border-[#262626] text-[#A0A0A0] font-mono tracking-tight">
                GLOBAL FLAGSHIP
              </span>
            </div>
            <p className="text-[10px] text-[#71717A] tracking-wide mt-0.5">
              {currentCity.venue} · Audi 3 (IMAX 4K Laser & Dolby Atmos)
            </p>
          </div>
        </div>

        {/* Global Cities Selector */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#0A0A0A] p-1 rounded-full border border-[#1E1E1E]">
          {CINESCAPE_LOCATIONS.map((loc) => {
            const isCurrent = loc.id === selectedCityId;
            return (
              <button
                key={loc.id}
                onClick={() => setSelectedCityId(loc.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-[#777777] hover:text-[#CCCCCC]'
                }`}
              >
                <span>{loc.flag}</span>
                <span>{loc.city}</span>
              </button>
            );
          })}
        </div>

        {/* User Account / Membership */}
        <button
          onClick={onOpenLogin}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111] hover:bg-[#1A1A1A] border border-[#262626] text-xs font-semibold text-[#E4E4E7] transition cursor-pointer shadow-sm"
        >
          <User className="w-3.5 h-3.5 text-[#E5A93C]" />
          <span>{currentUser?.isLoggedIn ? currentUser.name : 'Sign In'}</span>
        </button>
      </header>

      {/* Main Content Showcase */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* Hero Cinematic Feature with Curved Cinema Screen Arc */}
        <section className="relative rounded-3xl border border-[#1E1E1E] bg-gradient-to-b from-[#0A0A0A] via-[#060606] to-[#020202] p-6 sm:p-10 overflow-hidden shadow-2xl">
          {/* Subtle curved screen glow line overhead */}
          <div className="w-full flex justify-center mb-6">
            <ScreenArc />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Film Editorial Details */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest font-mono text-[#A1A1AA]">
                <span className="px-2.5 py-0.5 rounded-full bg-white text-black font-bold">
                  Now Screening Globally
                </span>
                <span className="border border-[#27272A] px-2 py-0.5 rounded-full">
                  IMAX 4K Laser
                </span>
                <span className="border border-[#27272A] px-2 py-0.5 rounded-full">
                  Dolby Atmos 64-CH
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-bold border border-[#27272A] px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>8.8 / 10</span>
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none">
                {featured.title}
              </h1>

              <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-lg">
                Director Lokesh Kanagaraj's high-octane cinematic thrill ride projected onto CINESCAPE's largest curved giant screen with uncompressed audio fidelity.
              </p>

              {/* Showtimes Capsules matching Reference Video Frame 00:00 */}
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#71717A] block mb-2">
                  Select Showtime in Audi 3:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {INDIAN_SHOWTIMES.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => onSelectMovieAndBook(featured, st.id)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
                        st.selected
                          ? 'bg-white text-black font-bold shadow-md shadow-white/20 hover:bg-[#EEEEEE]'
                          : 'bg-[#121212] border border-[#27272A] text-[#D4D4D8] hover:border-white hover:text-white'
                      }`}
                    >
                      <span>{st.time}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${st.selected ? 'bg-black/10 text-black' : 'bg-[#222222] text-[#888888]'}`}>
                        {st.format}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking CTA Button */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onSelectMovieAndBook(featured, 'st-2')}
                  className="px-7 py-3.5 rounded-full bg-white text-[#070709] font-bold text-xs tracking-tight hover:bg-neutral-200 transition flex items-center gap-2 shadow-xl shadow-white/10 active:scale-95 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#070709]" />
                  <span>Select Seats & 3D Preview (₹190)</span>
                  <ArrowRight className="w-4 h-4 text-[#070709]" />
                </button>
                <span className="text-xs text-[#71717A] font-mono">
                  Standard ₹190 · VIP Recliner ₹250
                </span>
              </div>
            </div>

            {/* Right Column: Interactive 3D Tactile Ticket or High-contrast Poster */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              {/* Media Mode Toggle */}
              <div className="flex items-center gap-1 bg-[#111114] border border-[#222327] p-1 rounded-full mb-3 self-center shadow-inner">
                <button
                  type="button"
                  onClick={() => setHeroMediaMode('ticket')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                    heroMediaMode === 'ticket'
                      ? 'bg-[#E5A93C] text-[#070709] shadow-sm'
                      : 'text-[#888888] hover:text-[#F5F5F5]'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>3D Physical Ticket</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHeroMediaMode('poster')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                    heroMediaMode === 'poster'
                      ? 'bg-[#E5A93C] text-[#070709] shadow-sm'
                      : 'text-[#888888] hover:text-[#F5F5F5]'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Movie Poster</span>
                </button>
              </div>

              {heroMediaMode === 'ticket' ? (
                <div className="w-full flex justify-center py-1">
                  <CinemaTicket
                    movieTitle={featured.title}
                    onBookNow={() => onSelectMovieAndBook(featured, 'st-2')}
                  />
                </div>
              ) : (
                <div className="relative w-full max-w-[320px] aspect-[4/5] rounded-2xl overflow-hidden border border-[#222222] bg-[#0A0A0A] shadow-2xl group">
                  <img
                    src={featured.backdrop}
                    alt={featured.title}
                    className="w-full h-full object-cover filter contrast-125 brightness-75 group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 space-y-1">
                    <div className="flex items-center justify-between text-xs text-white">
                      <span className="font-bold tracking-tight">CINESCAPE · Audi 3</span>
                      <span className="font-mono text-[#A1A1AA]">2h 35m</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#E5A93C]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>First-Person 3D Sightline Guarantee</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3D Sightline Feature Preview: Minimal Architecture */}
        <section className="space-y-4">
          <div className="border-b border-[#1C1C1C] pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#E5A93C] block">
                CINESCAPE Sightline Engine
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Inspect Your Exact Eye-Level Sightline Before Booking
              </h2>
            </div>
            <span className="text-xs text-[#71717A] font-mono hidden sm:inline">
              Audi 3 · Stadium Seating
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-[#090909] border border-[#1A1A1A] rounded-2xl p-5 space-y-2">
              <span className="text-[10px] font-mono text-[#71717A] uppercase">01 / Laser Distance</span>
              <div className="text-2xl font-bold font-mono text-white">9.8 m</div>
              <p className="text-xs text-[#888888] leading-relaxed">
                Calculated physical distance from your seat cushion to the curved screen center for optimal eye comfort.
              </p>
            </div>

            <div className="bg-[#090909] border border-[#1A1A1A] rounded-2xl p-5 space-y-2">
              <span className="text-[10px] font-mono text-[#71717A] uppercase">02 / Field of View</span>
              <div className="text-2xl font-bold font-mono text-white">60° FOV</div>
              <p className="text-xs text-[#888888] leading-relaxed">
                Cinematic immersion rating matching the SMPTE and IMAX recommended peripheral arc.
              </p>
            </div>

            <div className="bg-[#090909] border border-[#1A1A1A] rounded-2xl p-5 space-y-2">
              <span className="text-[10px] font-mono text-[#71717A] uppercase">03 / Alignment</span>
              <div className="text-2xl font-bold font-mono text-white">0.3 m Offset</div>
              <p className="text-xs text-[#888888] leading-relaxed">
                Precise off-axis metric ensuring symmetric stereo separation from all 64 surround channels.
              </p>
            </div>
          </div>
        </section>

        {/* Global Film Programme Grid */}
        <section className="space-y-4">
          <div className="border-b border-[#1C1C1C] pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#71717A] block">
                Global Programme
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Now Showing at CINESCAPE
              </h2>
            </div>
            <span className="text-xs text-[#E5A93C] font-mono">
              {INDIAN_MOVIES.length} Titles Screening Live
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INDIAN_MOVIES.map((movie) => (
              <div
                key={movie.id}
                onClick={() => onSelectMovieAndBook(movie)}
                className="bg-[#0A0A0A] border border-[#1C1C1C] hover:border-[#E5A93C]/50 rounded-2xl p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-28 rounded-xl overflow-hidden bg-black shrink-0 border border-[#222222]">
                    <img
                      src={movie.backdrop}
                      alt={movie.title}
                      className="w-full h-full object-cover filter contrast-125 brightness-80 group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <span className="text-[10px] font-mono uppercase text-[#A1A1AA] tracking-wider block">
                      {movie.language} · {movie.genre}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-[#E5A93C] transition truncate">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-[#71717A] line-clamp-2 leading-relaxed">
                      {movie.synopsis}
                    </p>
                    <div className="text-[11px] font-mono text-[#A1A1AA] pt-1">
                      Standard ₹190 · VIP Recliner ₹250
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#181818] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-[#161616] border border-[#262626] text-white text-xs font-mono font-bold">
                      {movie.timing}
                    </span>
                    <span className="text-[10px] text-[#71717A] font-mono">
                      Audi 3
                    </span>
                  </div>

                  <button className="px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-bold hover:bg-[#E4E4E7] transition flex items-center gap-1 group-hover:translate-x-0.5">
                    <span>Select Seats</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Global Minimal Footer */}
      <footer className="mt-auto border-t border-[#141414] py-8 px-6 text-center text-xs text-[#71717A] space-y-1">
        <p className="font-semibold text-[#A1A1AA]">
          CINESCAPE Global Flagship Theatres · London · New York · Tokyo · Mumbai · Singapore
        </p>
        <p className="text-[11px]">
          Auditorium 3 (IMAX 4K Laser Projection, 64-Channel Dolby Atmos, 3-Bank Seating Layout)
        </p>
      </footer>
    </div>
  );
};
