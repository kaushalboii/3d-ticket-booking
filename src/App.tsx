import React, { useState } from 'react';
import { MOVIES as initialMovies, SHOWTIMES as initialShowtimes, THEATRES, generateAuditoriumSeats } from './data/mockData';
import { Movie, Showtime, Seat, Booking } from './types';
import { MovieDetailsView } from './components/MovieDetailsView';
import { SeatSelectionView } from './components/SeatSelectionView';
import { CheckoutModal } from './components/CheckoutModal';
import { TicketConfirmation } from './components/TicketConfirmation';
import { AdminDashboard } from './components/admin/AdminDashboard';
import {
  Film,
  Search,
  Star,
  MapPin,
  Eye,
  SlidersHorizontal,
  ShieldCheck,
  Compass,
  ArrowRight,
  Volume2
} from 'lucide-react';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [showtimes, setShowtimes] = useState<Showtime[]>(initialShowtimes);
  const [cinemaSeats, setCinemaSeats] = useState<Seat[]>(() => generateAuditoriumSeats());

  // Navigation and selection state
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);

  // Booking flow state
  const [checkoutSeats, setCheckoutSeats] = useState<Seat[] | null>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  // Admin dashboard state
  const [showAdmin, setShowAdmin] = useState(false);

  // Home filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'now_showing' | 'imax' | 'upcoming'>('now_showing');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');

  const genres = ['All', 'Sci-Fi', 'Action', 'Thriller', 'Cyberpunk', 'Horror', 'Animation'];

  const filteredMovies = movies.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGenre = selectedGenre === 'All' || m.genres.includes(selectedGenre);
    const matchesLanguage = selectedLanguage === 'All' || m.languages.includes(selectedLanguage);

    if (activeCategory === 'imax') {
      return matchesSearch && matchesGenre && matchesLanguage && m.formats.includes('IMAX 3D');
    }
    if (activeCategory === 'upcoming') {
      return matchesSearch && matchesGenre && matchesLanguage && m.isUpcoming;
    }
    return matchesSearch && matchesGenre && matchesLanguage;
  });

  const featuredMovie = movies[0];

  const handleBookingComplete = (booking: Booking) => {
    const bookedIds = new Set(booking.seats.map((s) => s.id));
    setCinemaSeats((prev) =>
      prev.map((seat) => (bookedIds.has(seat.id) ? { ...seat, status: 'occupied' } : seat))
    );
    setActiveBooking(booking);
    setCheckoutSeats(null);
  };

  // 1. Confirmed ticket pass
  if (activeBooking) {
    return (
      <TicketConfirmation
        booking={activeBooking}
        onDone={() => {
          setActiveBooking(null);
          setSelectedShowtime(null);
          setSelectedMovie(null);
        }}
      />
    );
  }

  // 2. 3D seat selection
  if (selectedMovie && selectedShowtime) {
    return (
      <>
        <SeatSelectionView
          movie={selectedMovie}
          showtime={selectedShowtime}
          seats={cinemaSeats}
          onBack={() => setSelectedShowtime(null)}
          onProceedToCheckout={(seats) => setCheckoutSeats(seats)}
        />

        {checkoutSeats && (
          <CheckoutModal
            movie={selectedMovie}
            showtime={selectedShowtime}
            seats={checkoutSeats}
            onClose={() => setCheckoutSeats(null)}
            onBookingComplete={handleBookingComplete}
          />
        )}
      </>
    );
  }

  // 3. Movie details
  if (selectedMovie) {
    return (
      <MovieDetailsView
        movie={selectedMovie}
        showtimes={showtimes}
        onSelectShowtime={(st) => setSelectedShowtime(st)}
        onBack={() => setSelectedMovie(null)}
      />
    );
  }

  // 4. Main catalogue view
  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#f3f4f6] flex flex-col font-sans selection:bg-[#24252b] selection:text-white">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0b0c0e]/95 backdrop-blur-md border-b border-white/[0.08] px-6 md:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <button
            onClick={() => {
              setSelectedMovie(null);
              setSelectedShowtime(null);
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#18191e] border border-white/[0.1] flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
              <Film className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold tracking-wider text-white font-cinzel">
                CINESCAPE
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-500 uppercase tracking-wide">
                auditorium
              </span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-1 text-xs font-medium">
            <button
              onClick={() => setActiveCategory('now_showing')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeCategory === 'now_showing'
                  ? 'bg-[#1c1d22] text-white border border-white/[0.08]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Now showing
            </button>
            <button
              onClick={() => setActiveCategory('imax')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeCategory === 'imax'
                  ? 'bg-[#1c1d22] text-white border border-white/[0.08]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              IMAX 3D
            </button>
            <button
              onClick={() => setActiveCategory('upcoming')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeCategory === 'upcoming'
                  ? 'bg-[#1c1d22] text-white border border-white/[0.08]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Upcoming
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141519] border border-white/[0.06] text-xs text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-zinc-500" />
            <span>Los Angeles • Downtown</span>
          </div>

          <button
            onClick={() => setShowAdmin(true)}
            className="px-3 py-1.5 rounded-lg bg-[#141519] hover:bg-[#1c1d22] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
            <span>Admin</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 pb-24">
        {/* Featured Film Hero */}
        <div className="relative h-[480px] md:h-[560px] w-full overflow-hidden bg-[#0e0f13] border-b border-white/[0.06]">
          <img
            src={featuredMovie.backdropUrl}
            alt={featuredMovie.title}
            className="w-full h-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0e] via-[#0b0c0e]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c0e] via-[#0b0c0e]/70 to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-12 left-6 md:left-12 right-6 max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="px-2 py-0.5 rounded bg-white/[0.08] text-zinc-300 border border-white/[0.08]">
                IMAX 70mm
              </span>
              <span>•</span>
              <span>1.43:1 aspect ratio</span>
              <span>•</span>
              <span className="text-amber-400 font-medium">{featuredMovie.score} rating</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium text-white tracking-tight leading-none font-cinzel">
              {featuredMovie.title}
            </h1>

            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed max-w-xl">
              {featuredMovie.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedMovie(featuredMovie);
                  const st = showtimes.find((s) => s.movieId === featuredMovie.id);
                  if (st) setSelectedShowtime(st);
                }}
                className="h-10 px-5 rounded-lg bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-colors flex items-center gap-2"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>3D seat preview & booking</span>
              </button>

              <button
                onClick={() => setSelectedMovie(featuredMovie)}
                className="h-10 px-4 rounded-lg bg-[#18191e] hover:bg-[#202127] border border-white/[0.1] text-zinc-200 text-xs font-medium transition-colors"
              >
                View synopsis & times
              </button>
            </div>
          </div>
        </div>

        {/* Feature Spec Strip */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 -mt-4 relative z-10">
          <div className="bg-[#121317] border border-white/[0.08] rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/[0.04] text-zinc-400 shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-medium text-zinc-200">First-person sightline</h3>
                <p className="text-zinc-500 text-[11px] mt-0.5">
                  Real eye-level screen distance, vertical neck angle, and FOV preview before purchase.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t md:border-t-0 md:border-l border-white/[0.06] pt-3 md:pt-0 md:pl-4">
              <div className="p-2 rounded-lg bg-white/[0.04] text-zinc-400 shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-medium text-zinc-200">Acoustic sweetspot</h3>
                <p className="text-zinc-500 text-[11px] mt-0.5">
                  Calibrated Dolby Atmos center channel and lateral surround sound balance ratings.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t md:border-t-0 md:border-l border-white/[0.06] pt-3 md:pt-0 md:pl-4">
              <div className="p-2 rounded-lg bg-white/[0.04] text-zinc-400 shrink-0">
                <ShieldCheck className="w-4 h-4 text-zinc-400" />
              </div>
              <div>
                <h3 className="font-medium text-zinc-200">Live seat hold</h3>
                <p className="text-zinc-500 text-[11px] mt-0.5">
                  Reserved seats lock immediately for 8 minutes to prevent duplicate bookings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 mt-12 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, directors..."
                className="w-full bg-[#131418] border border-white/[0.08] pl-9 pr-3 py-2 rounded-lg text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedGenre === genre
                      ? 'bg-[#22232a] text-white border border-white/[0.12]'
                      : 'bg-[#131418] border border-white/[0.05] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Section Heading */}
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 pt-2">
            <div>
              <h2 className="text-base font-medium text-zinc-100">
                {activeCategory === 'imax'
                  ? 'IMAX 3D repertoire'
                  : activeCategory === 'upcoming'
                  ? 'Upcoming releases'
                  : 'Now showing'}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Select a title to view showtimes and test eye-level 3D seating.
              </p>
            </div>
            <span className="text-xs text-zinc-500 font-mono tabular-nums">
              {filteredMovies.length} {filteredMovies.length === 1 ? 'title' : 'titles'}
            </span>
          </div>

          {/* Movie Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-1">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => setSelectedMovie(movie)}
                className="group cursor-pointer bg-[#121317] border border-white/[0.08] hover:border-white/[0.18] rounded-xl overflow-hidden transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#0c0d10]">
                    <img
                      src={movie.backdropUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover object-center opacity-85 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121317] via-transparent to-transparent" />

                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#0b0c0e]/80 border border-white/[0.08] text-zinc-200 text-[11px] font-mono flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="tabular-nums">{movie.score}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.1] text-zinc-300 text-[10px] font-mono">
                        {movie.rating}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono tabular-nums">
                        {movie.duration}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <span className="text-[11px] font-mono text-zinc-500 block">
                      {movie.genres.join(' • ')}
                    </span>
                    <h3 className="text-sm font-medium text-white group-hover:text-zinc-200 transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {movie.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {movie.formats.map((fmt) => (
                        <span
                          key={fmt}
                          className="px-2 py-0.5 rounded bg-[#17181e] border border-white/[0.06] text-[10px] font-mono text-zinc-400"
                        >
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 bg-[#0f1013] border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500">
                  <span>Dir. {movie.director}</span>
                  <span className="font-medium text-zinc-300 group-hover:text-white transition-colors flex items-center gap-1">
                    <span>Showtimes & 3D</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b0c0e] border-t border-white/[0.06] py-10 px-6 text-center text-xs text-zinc-500 space-y-2">
        <div className="flex items-center justify-center gap-2 text-zinc-400">
          <Film className="w-3.5 h-3.5" />
          <span className="font-cinzel text-xs tracking-wider text-zinc-300">
            CINESCAPE
          </span>
        </div>
        <p className="text-zinc-500">
          Auditorium sightline simulation and digital ticket reservation.
        </p>
        <p className="text-[11px] text-zinc-600 font-mono">
          WebGL Three.js procedural seating model
        </p>
      </footer>

      {/* Admin Studio Drawer */}
      {showAdmin && (
        <AdminDashboard
          movies={movies}
          showtimes={showtimes}
          seats={cinemaSeats}
          onUpdateMovies={setMovies}
          onUpdateShowtimes={setShowtimes}
          onUpdateSeats={setCinemaSeats}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div>
  );
}
