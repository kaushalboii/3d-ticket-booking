import React, { useState } from 'react';
import { Movie, Showtime } from '../types';
import { THEATRES } from '../data/mockData';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Film,
  MapPin,
  Play,
  Star,
  Users,
  X
} from 'lucide-react';

interface MovieDetailsViewProps {
  movie: Movie;
  showtimes: Showtime[];
  onSelectShowtime: (showtime: Showtime) => void;
  onBack: () => void;
}

export const MovieDetailsView: React.FC<MovieDetailsViewProps> = ({
  movie,
  showtimes,
  onSelectShowtime,
  onBack,
}) => {
  const [selectedTheatreId, setSelectedTheatreId] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('Today, 24 Oct');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  const dates = ['Today, 24 Oct', 'Tomorrow, 25 Oct', 'Sat, 26 Oct', 'Sun, 27 Oct'];
  const formats = ['All', 'IMAX 3D', 'DOLBY ATMOS', '2D'];

  const filteredShowtimes = showtimes.filter((st) => {
    if (st.movieId !== movie.id) return false;
    const matchTheatre = selectedTheatreId === 'all' || st.theatreId === selectedTheatreId;
    const matchDate = st.date.includes(selectedDate.split(',')[0]) || st.date === selectedDate;
    const matchFormat = selectedFormat === 'All' || st.format === selectedFormat;
    return matchTheatre && matchFormat;
  });

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#f3f4f6] flex flex-col pb-24 font-sans">
      {/* Hero Backdrop */}
      <div className="relative h-[440px] md:h-[500px] w-full overflow-hidden bg-[#0c0d10] border-b border-white/[0.06]">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0e] via-[#0b0c0e]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c0e] via-[#0b0c0e]/70 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-6 left-6 md:left-12 z-20">
          <button
            onClick={onBack}
            className="h-9 px-3 rounded-lg bg-[#141519] hover:bg-[#1c1d22] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All movies</span>
          </button>
        </div>

        {/* Movie Details Header Overlay */}
        <div className="absolute bottom-8 left-6 md:left-12 right-6 max-w-5xl flex flex-col md:flex-row gap-6 items-end">
          {/* Poster */}
          <div className="hidden md:block w-44 shrink-0 rounded-xl overflow-hidden border border-white/[0.1] bg-[#121317]">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-64 object-cover"
            />
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="px-1.5 py-0.5 rounded bg-white/[0.1] text-zinc-200 text-[10px]">
                {movie.rating}
              </span>
              <div className="flex items-center gap-1 text-zinc-300">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="tabular-nums">{movie.score}</span>
                <span className="text-zinc-500">/ 10</span>
              </div>
              <span>•</span>
              <span className="tabular-nums">{movie.duration}</span>
              <span>•</span>
              <span className="font-sans">{movie.genres.join(', ')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-medium text-white tracking-tight leading-none font-cinzel">
              {movie.title}
            </h1>

            <p className="text-xs text-zinc-400 italic">
              "{movie.tagline}"
            </p>

            <p className="text-xs md:text-sm text-zinc-400 max-w-2xl leading-relaxed line-clamp-3">
              {movie.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <button
                onClick={() => setShowTrailerModal(true)}
                className="h-8 px-3 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3 h-3 fill-zinc-200" />
                <span>Teaser</span>
              </button>

              <div className="flex items-center gap-1.5 text-zinc-500">
                <Film className="w-3.5 h-3.5" />
                <span>Dir. {movie.director}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mt-10 w-full space-y-10">
        {/* Cast & Crew Section */}
        {movie.cast.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              <span>Cast</span>
            </h3>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {movie.cast.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-[#121317] border border-white/[0.06] p-2.5 rounded-xl min-w-[190px]"
                >
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="text-xs font-medium text-zinc-200">{c.name}</h5>
                    <p className="text-[11px] text-zinc-500">{c.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Showtimes Container */}
        <div className="bg-[#121317] border border-white/[0.08] rounded-xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-base font-medium text-zinc-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span>Screenings & showtimes</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Each screening includes full 3D eye-level seat sightline simulation.
              </p>
            </div>

            {/* Theatre Selector */}
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
              <select
                value={selectedTheatreId}
                onChange={(e) => setSelectedTheatreId(e.target.value)}
                className="bg-[#18191e] border border-white/[0.08] px-3 py-1.5 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-white/20"
              >
                <option value="all">All venues</option>
                {THEATRES.map((th) => (
                  <option key={th.id} value={th.id}>
                    {th.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {dates.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex flex-col items-start ${
                  selectedDate === d
                    ? 'bg-[#22232a] text-white border border-white/[0.14]'
                    : 'bg-[#18191e] border border-white/[0.05] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>{d.split(',')[0]}</span>
                <span className="text-[10px] text-zinc-500">{d.split(',')[1]}</span>
              </button>
            ))}
          </div>

          {/* Format Tabs */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500">Format:</span>
            {formats.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                  selectedFormat === fmt
                    ? 'bg-white/[0.1] text-white border border-white/[0.14]'
                    : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          {/* Showtimes Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {filteredShowtimes.length === 0 ? (
              <div className="col-span-full py-12 text-center text-zinc-500 text-xs">
                <p>No screening slots found for this date and format filter.</p>
                <button
                  onClick={() => {
                    setSelectedTheatreId('all');
                    setSelectedFormat('All');
                  }}
                  className="text-zinc-300 underline mt-2 hover:text-white"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredShowtimes.map((st) => (
                <div
                  key={st.id}
                  className="bg-[#16171b] border border-white/[0.06] hover:border-white/[0.14] rounded-xl p-4 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-300">
                        {st.format}
                      </span>
                      <span className="text-zinc-500">{st.date}</span>
                    </div>

                    <h4 className="text-sm font-medium text-white mt-2">
                      {st.theatreName}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5">{st.auditoriumName}</p>

                    <div className="mt-3 py-1.5 px-2.5 rounded-lg bg-[#111215] border border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>Std ${st.pricing.standard}</span>
                      <span>•</span>
                      <span>Prem ${st.pricing.premium}</span>
                      <span>•</span>
                      <span>VIP ${st.pricing.vip_recliner}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-base font-medium font-mono text-white tabular-nums">
                        {st.time}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectShowtime(st)}
                      className="h-8 px-3 rounded-lg bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3 h-3" />
                      <span>3D seats</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-[#121317] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-3.5 bg-[#16171b] flex items-center justify-between border-b border-white/[0.06]">
              <h4 className="text-zinc-200 text-xs font-medium">
                {movie.title} • Preview
              </h4>
              <button
                onClick={() => setShowTrailerModal(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black flex items-center justify-center relative">
              <img
                src={movie.backdropUrl}
                alt="Trailer Poster"
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <h3 className="text-xl font-medium text-white font-cinzel">{movie.title}</h3>
                <p className="text-xs text-zinc-400 max-w-md">
                  Expanded IMAX 1.43:1 aspect ratio with 12-channel digital spatial audio.
                </p>
                <button
                  onClick={() => {
                    setShowTrailerModal(false);
                    const st = showtimes.find((s) => s.movieId === movie.id);
                    if (st) onSelectShowtime(st);
                  }}
                  className="mt-2 h-9 px-4 rounded-lg bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-colors"
                >
                  Select seats & inspect 3D view
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
