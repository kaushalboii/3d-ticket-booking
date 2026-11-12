import React, { useState } from 'react';
import { Movie, UserProfile } from '../types';
import { INDIAN_MOVIES, INDIAN_SHOWTIMES, CINESCAPE_LOCATIONS } from '../data/indianCinemaData';
import { User, ChevronRight, ArrowRight, ShieldCheck, Ticket as TicketIcon, Image as ImageIcon } from 'lucide-react';
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
  const [selectedHeroShowtimeId, setSelectedHeroShowtimeId] = useState('st-2');
  const [heroMediaMode, setHeroMediaMode] = useState<'ticket' | 'poster'>('ticket');

  const featured = INDIAN_MOVIES[0];
  const currentCity =
    CINESCAPE_LOCATIONS.find((c) => c.id === selectedCityId) || CINESCAPE_LOCATIONS[0];
  const activeShowtime =
    INDIAN_SHOWTIMES.find((st) => st.id === selectedHeroShowtimeId) || INDIAN_SHOWTIMES[1];

  return (
    <div className="w-full h-full bg-[#0c0b0a] text-[#efe9de] flex flex-col overflow-y-auto select-none antialiased">
      {/* Sticky Header Aligned With Page Container */}
      <header className="sticky top-0 z-40 bg-[#0c0b0a]/90 backdrop-blur-md border-b border-[#efe9de]/[0.08]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Flat Architectural Brand Mark + Venue */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#141311] border border-[#efe9de]/[0.1] flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M2.5 5.2C5.8 3.6 10.2 3.6 13.5 5.2"
                  stroke="#E5A93C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <rect
                  x="3"
                  y="7.5"
                  width="10"
                  height="5"
                  rx="1.2"
                  stroke="#efe9de"
                  strokeOpacity="0.65"
                  strokeWidth="1.25"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold tracking-[0.14em] text-[#efe9de] block leading-none">
                CINESCAPE
              </span>
              <p className="text-xs text-[#787268] truncate mt-1">
                {currentCity.venue} · Audi 3
              </p>
            </div>
          </div>

          {/* Segmented Location Strip (Zero Emoji Slop) */}
          <nav
            aria-label="Flagship cinema cities"
            className="hidden lg:flex items-center gap-1 bg-[#141311] p-1 rounded-lg border border-[#efe9de]/[0.08]"
          >
            {CINESCAPE_LOCATIONS.map((loc) => {
              const isCurrent = loc.id === selectedCityId;
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedCityId(loc.id)}
                  className={`h-7 px-2.5 rounded-md text-xs transition-colors duration-150 cursor-pointer flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-[#262421] text-[#efe9de] font-medium'
                      : 'text-[#787268] hover:text-[#aaa398]'
                  }`}
                >
                  <span className="font-mono text-[10px] text-[#E5A93C]">{loc.code}</span>
                  <span>{loc.city}</span>
                </button>
              );
            })}
          </nav>

          {/* Quiet Account Action */}
          <button
            onClick={onOpenLogin}
            className="h-8 px-3 rounded-lg bg-[#141311] hover:bg-[#1e1c19] border border-[#efe9de]/[0.08] text-xs font-medium text-[#efe9de] transition-colors duration-150 cursor-pointer flex items-center gap-2 shrink-0"
          >
            <User className="w-3.5 h-3.5 text-[#E5A93C]" strokeWidth={1.75} />
            <span>{currentUser?.isLoggedIn ? currentUser.name : 'Sign in'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-12">
        {/* Hero Feature Split */}
        <section className="rounded-[20px] border border-[#efe9de]/[0.08] bg-[#141311] p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Title, Format Specs, Showtime Selection, Single Primary CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-mono text-[#aaa398] tabular-nums">
                  {featured.genre} · IMAX 4K Laser · {featured.duration} · {featured.rating}
                </p>

                <h1 className="text-4xl sm:text-5xl font-semibold text-[#efe9de] tracking-[-0.025em] leading-[1.06]">
                  {featured.title}
                </h1>

                <p className="text-sm sm:text-base text-[#aaa398] leading-relaxed max-w-lg">
                  Inspect exact seat distance, screen curvature, and eye-level sightlines in 3D before reserving your seat in {currentCity.venue}.
                </p>
              </div>

              {/* Showtime Selector */}
              <div className="space-y-2.5">
                <span className="text-xs text-[#787268] block">
                  Showtimes today · Audi 3
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {INDIAN_SHOWTIMES.map((st) => {
                    const isSelected = st.id === selectedHeroShowtimeId;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedHeroShowtimeId(st.id)}
                        className={`h-9 px-3.5 rounded-lg text-xs transition-colors duration-150 cursor-pointer flex items-center gap-2 tabular-nums ${
                          isSelected
                            ? 'bg-[#262421] border border-[#E5A93C]/60 text-[#efe9de] font-medium'
                            : 'bg-[#0c0b0a] border border-[#efe9de]/[0.08] text-[#aaa398] hover:text-[#efe9de] hover:border-[#efe9de]/20'
                        }`}
                      >
                        <span className="font-mono">{st.time}</span>
                        <span
                          className={`text-[10px] font-mono ${
                            isSelected ? 'text-[#E5A93C]' : 'text-[#787268]'
                          }`}
                        >
                          {st.format}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary CTA + Pricing Spec */}
              <div className="pt-1 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onSelectMovieAndBook(featured, selectedHeroShowtimeId)}
                  className="h-11 px-6 rounded-xl bg-[#efe9de] text-[#12110f] font-semibold text-xs tracking-tight hover:bg-white transition-colors duration-150 flex items-center gap-2 active:scale-[0.98] cursor-pointer tabular-nums"
                >
                  <span>Select seats & 3D preview · ₹190</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </button>
                <span className="text-xs text-[#787268] font-mono tabular-nums">
                  Standard ₹190 · Recliner ₹250
                </span>
              </div>
            </div>

            {/* Right Column: Live Interactive 3D Physical Ticket */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 bg-[#0c0b0a] border border-[#efe9de]/[0.08] p-1 rounded-lg mb-4">
                <button
                  type="button"
                  onClick={() => setHeroMediaMode('ticket')}
                  className={`flex items-center gap-1.5 h-7 px-3 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer ${
                    heroMediaMode === 'ticket'
                      ? 'bg-[#262421] text-[#efe9de]'
                      : 'text-[#787268] hover:text-[#aaa398]'
                  }`}
                >
                  <TicketIcon className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>3D Ticket</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHeroMediaMode('poster')}
                  className={`flex items-center gap-1.5 h-7 px-3 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer ${
                    heroMediaMode === 'poster'
                      ? 'bg-[#262421] text-[#efe9de]'
                      : 'text-[#787268] hover:text-[#aaa398]'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Screen Still</span>
                </button>
              </div>

              {heroMediaMode === 'ticket' ? (
                <div className="w-full flex justify-center">
                  <CinemaTicket
                    movieTitle={featured.title}
                    theatreName={currentCity.venue}
                    hallName={`Audi 3 · ${activeShowtime.format}`}
                    showtime={activeShowtime.time}
                  />
                </div>
              ) : (
                <div className="relative w-full max-w-[300px] aspect-[4/5] rounded-2xl overflow-hidden border border-[#efe9de]/[0.08] bg-[#0c0b0a]">
                  <img
                    src={featured.backdrop}
                    alt={featured.title}
                    className="w-full h-full object-cover brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0a] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 space-y-1">
                    <div className="flex items-center justify-between text-xs text-[#efe9de] tabular-nums">
                      <span className="font-medium">Audi 3 · {activeShowtime.time}</span>
                      <span className="font-mono text-[#aaa398]">{featured.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#E5A93C]">
                      <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
                      <span>Eye-level sightline calibrated</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Sightline Engine Metrics */}
        <section className="space-y-4">
          <div className="border-b border-[#efe9de]/[0.08] pb-3 flex items-baseline justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-[#E5A93C] block">
                Sightline engine
              </span>
              <h2 className="text-lg font-semibold text-[#efe9de] tracking-tight mt-0.5">
                Inspect exact geometry before booking
              </h2>
            </div>
            <span className="text-xs text-[#787268] font-mono hidden sm:inline">
              Audi 3 · 3-8-3 Stadium Rake
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#141311] border border-[#efe9de]/[0.08] rounded-2xl p-5 flex flex-col justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-[#787268] block">01 · Throw distance</span>
                <div className="text-2xl font-medium font-mono text-[#efe9de] mt-2 tabular-nums">
                  9.8 m
                </div>
              </div>
              <p className="text-xs text-[#aaa398] leading-relaxed">
                Physical distance measured from your chosen seat cushion to the curved screen center.
              </p>
            </div>

            <div className="bg-[#141311] border border-[#efe9de]/[0.08] rounded-2xl p-5 flex flex-col justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-[#787268] block">02 · Viewing angle</span>
                <div className="text-2xl font-medium font-mono text-[#efe9de] mt-2 tabular-nums">
                  60° FOV
                </div>
              </div>
              <p className="text-xs text-[#aaa398] leading-relaxed">
                Horizontal field-of-view matched to the SMPTE sweet spot for curved giant screens.
              </p>
            </div>

            <div className="bg-[#141311] border border-[#efe9de]/[0.08] rounded-2xl p-5 flex flex-col justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-[#787268] block">03 · Acoustic offset</span>
                <div className="text-2xl font-medium font-mono text-[#efe9de] mt-2 tabular-nums">
                  0.3 m
                </div>
              </div>
              <p className="text-xs text-[#aaa398] leading-relaxed">
                Lateral centerline offset ensuring symmetric stereo balance across 64 channels.
              </p>
            </div>
          </div>
        </section>

        {/* Film Programme Grid */}
        <section className="space-y-4">
          <div className="border-b border-[#efe9de]/[0.08] pb-3 flex items-baseline justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-[#787268] block">
                Now screening
              </span>
              <h2 className="text-lg font-semibold text-[#efe9de] tracking-tight mt-0.5">
                Current programme in {currentCity.city}
              </h2>
            </div>
            <span className="text-xs text-[#aaa398] font-mono tabular-nums">
              {INDIAN_MOVIES.length} titles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INDIAN_MOVIES.map((movie) => (
              <div
                key={movie.id}
                onClick={() => onSelectMovieAndBook(movie)}
                className="bg-[#141311] border border-[#efe9de]/[0.08] hover:border-[#efe9de]/20 rounded-2xl p-5 transition-colors duration-150 cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-28 rounded-xl overflow-hidden bg-[#0c0b0a] shrink-0 border border-[#efe9de]/[0.08]">
                    <img
                      src={movie.backdrop}
                      alt={movie.title}
                      className="w-full h-full object-cover brightness-85"
                    />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <span className="text-xs text-[#787268] block">
                      {movie.language} · {movie.genre}
                    </span>
                    <h3 className="text-base font-semibold text-[#efe9de] group-hover:text-[#E5A93C] transition-colors duration-150 truncate">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-[#aaa398] line-clamp-2 leading-relaxed">
                      {movie.synopsis}
                    </p>
                    <div className="text-xs font-mono text-[#787268] pt-1 tabular-nums">
                      Standard ₹190 · Recliner ₹250
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-[#efe9de]/[0.06] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 tabular-nums">
                    <span className="px-2.5 py-1 rounded-md bg-[#0c0b0a] border border-[#efe9de]/[0.08] text-[#efe9de] text-xs font-mono font-medium">
                      {movie.timing}
                    </span>
                    <span className="text-xs text-[#787268] font-mono">
                      Audi 3
                    </span>
                  </div>

                  <span className="h-8 px-3.5 rounded-lg bg-[#efe9de] text-[#12110f] text-xs font-semibold flex items-center gap-1 group-hover:bg-white transition-colors duration-150">
                    <span>Select seats</span>
                    <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#efe9de]/[0.08] py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#787268]">
          <p className="font-medium text-[#aaa398]">
            CINESCAPE Global Flagship · London · Tokyo · New York · Mumbai · Singapore
          </p>
          <p className="font-mono">
            Audi 3 · IMAX 4K Laser · Dolby Atmos
          </p>
        </div>
      </footer>
    </div>
  );
};
