import React, { useState } from 'react';
import { Movie, UserProfile, Theatre, City } from '../types';
import { MOVIES_LIST, THEATRES_LIST, CITIES_LIST } from '../data/velsData';
import { Film, Eye, User, ChevronRight, Compass, ChevronDown, Building2, MapPin } from 'lucide-react';

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
    <div className="w-full h-full bg-[#0B0D12] text-[#F0F1F4] flex flex-col overflow-y-auto select-none">
      {/* Top Quiet Navigation */}
      <header className="sticky top-0 z-30 bg-[#0B0D12]/95 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#141822] border border-white/[0.08] flex items-center justify-center text-[#55E6A5]">
            <Film className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <div>
            <span className="text-[#F0F1F4] font-semibold text-sm tracking-tight block">
              CINESCAPE
            </span>
            <span className="text-[11px] text-[#7A8296] block">
              Cinema & 3D sightline network
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* City / Region Switcher Pill */}
          <button
            onClick={onOpenCitySelect}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141822] hover:bg-[#1C2230] border border-white/[0.08] hover:border-white/[0.16] text-xs font-normal text-[#D1D5DF] transition cursor-pointer"
            title="Switch city or territory"
          >
            <span>{currentCityObj?.flag || '📍'}</span>
            <span>{currentCity}</span>
            <ChevronDown className="w-3 h-3 text-[#7A8296]" strokeWidth={1.5} />
          </button>

          {/* User Profile / Sign In */}
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141822] hover:bg-[#1C2230] border border-white/[0.08] text-xs font-normal text-[#D1D5DF] transition cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-[#55E6A5]" strokeWidth={1.5} />
            <span className="hidden sm:inline">{currentUser?.isLoggedIn ? currentUser.name : 'Sign In'}</span>
          </button>
        </div>
      </header>

      {/* Hero Movie Showcase: Asymmetric calm space */}
      <div className="relative w-full h-96 sm:h-[420px] shrink-0 overflow-hidden bg-black">
        <img
          src={featuredMovie.backdrop}
          alt={featuredMovie.title}
          className="w-full h-full object-cover filter brightness-40 scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-[#0B0D12]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D12]/95 via-[#0B0D12]/40 to-transparent" />

        <div className="absolute bottom-8 left-6 right-6 max-w-xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#55E6A5]/15 border border-[#55E6A5]/30 text-[#55E6A5] text-[11px] font-medium">
              Now showing
            </span>
            <span className="text-[11px] text-[#A3A9B8]">
              {featuredMovie.language} · {featuredMovie.duration}
            </span>
            <span className="text-[11px] text-[#7A8296] font-mono">
              {currentTheatre.format}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-medium text-[#F0F1F4] tracking-tight">
            {featuredMovie.title}
          </h2>

          <p className="text-xs text-[#A3A9B8] leading-relaxed max-w-md">
            Screening at {currentTheatre.name}. Preview the exact screen sightline, angle, and distance from your chosen seat before booking.
          </p>

          <div className="pt-1">
            <button
              onClick={() => onSelectMovie(featuredMovie)}
              className="px-5 py-2.5 rounded-full bg-[#55E6A5] text-[#07130E] font-medium text-xs tracking-tight hover:brightness-105 active:scale-[0.98] transition flex items-center gap-2 cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
            >
              <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Select seats & preview 3D view ({currentTheatre.currency}{currentTheatre.elitePrice})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Moment: 3D Seat Preview Indicator */}
      <div className="px-6 py-4">
        <div
          onClick={onDirect3DPreview || (() => onSelectMovie(featuredMovie))}
          className="w-full bg-[#11141C] hover:bg-[#161B26] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer transition"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#181D29] border border-white/[0.08] flex items-center justify-center text-[#55E6A5] shrink-0">
              <Compass className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="text-xs font-medium text-[#F0F1F4]">
                Interactive 3D seat sightline simulator
              </h4>
              <p className="text-[11px] text-[#7A8296] mt-0.5">
                Calculate optical field of view, distance in meters, and screen center offset in real time.
              </p>
            </div>
          </div>
          <span className="text-xs font-normal text-[#55E6A5] shrink-0 flex items-center gap-1">
            Launch simulator <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </span>
        </div>
      </div>

      {/* Multiplexes in City */}
      <div className="px-6 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#7A8296]" strokeWidth={1.5} />
            <h3 className="text-xs font-medium text-[#A3A9B8]">
              Cinemas in {currentCity}
            </h3>
          </div>
          <button
            onClick={onOpenCitySelect}
            className="text-[11px] text-[#55E6A5] hover:underline cursor-pointer"
          >
            Switch city ({CITIES_LIST.length} available) →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {displayTheatres.map((th) => {
            const isSelected = th.id === currentTheatre.id;
            return (
              <div
                key={th.id}
                onClick={() => onSelectTheatre(th)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#151A24] border-[#55E6A5]/50'
                    : 'bg-[#11141C] border-white/[0.08] hover:border-white/[0.14]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-medium text-[#F0F1F4] tracking-tight">
                      {th.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.06] text-[#A3A9B8] text-[10px] font-mono">
                      {th.format}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A8296] mt-1 truncate">
                    {th.location}
                  </p>
                  <p className="text-[11px] text-[#5C6479] mt-0.5 truncate">
                    {th.hall}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                  <span className="text-[#A3A9B8] font-mono">
                    From {th.currency}{th.economyPrice}
                  </span>
                  <span className={`text-xs ${isSelected ? 'text-[#55E6A5] font-medium' : 'text-[#7A8296]'}`}>
                    {isSelected ? 'Active cinema' : 'Select →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Now Showing Movie Grid */}
      <div className="px-6 py-4 pb-12 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h3 className="text-xs font-medium text-[#A3A9B8]">
              Now showing
            </h3>
            <p className="text-[11px] text-[#7A8296]">
              Select a film to browse showtimes and inspect seat sightlines
            </p>
          </div>

          {/* Language filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['All', 'Tamil', 'English', 'Japanese'].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-3 py-1 rounded-full text-[11px] transition cursor-pointer shrink-0 ${
                  selectedLang === lang
                    ? 'bg-[#55E6A5] text-[#07130E] font-medium'
                    : 'bg-[#141822] border border-white/[0.08] text-[#7A8296] hover:text-[#D1D5DF]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onSelectMovie(movie)}
              className="bg-[#11141C] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl overflow-hidden transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <img
                  src={movie.backdrop}
                  alt={movie.title}
                  className="w-full h-full object-cover filter brightness-85 group-hover:scale-[1.02] transition duration-300"
                />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] text-[#E0E2EC] font-mono border border-white/[0.08]">
                  {movie.timing}
                </div>
              </div>

              <div className="p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] text-[#7A8296]">
                  <span>{movie.language}</span>
                  <span>·</span>
                  <span>{movie.genre}</span>
                </div>
                <h4 className="text-sm font-medium text-[#F0F1F4] group-hover:text-[#55E6A5] transition">
                  {movie.title}
                </h4>
                <p className="text-[11px] text-[#7A8296]">
                  {currentTheatre.name} · {currentTheatre.currency}{currentTheatre.elitePrice}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs text-[#55E6A5] font-normal">
                  <span>View showtimes & seats</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiet Footer */}
      <footer className="mt-auto border-t border-white/[0.08] py-8 px-6 text-center text-[11px] text-[#5C6479]">
        <p>CINESCAPE · Multi-city cinema sightline simulator</p>
        <p className="mt-1">Built with WebGL Three.js for real-time optical calculations</p>
      </footer>
    </div>
  );
};