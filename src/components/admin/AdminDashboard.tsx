import React, { useState } from 'react';
import { Movie, Showtime, Seat } from '../../types';
import {
  Film,
  Calendar,
  Layers,
  DollarSign,
  Users,
  Settings,
  Plus,
  Trash2,
  X,
  Clock,
  Ticket
} from 'lucide-react';

interface AdminDashboardProps {
  movies: Movie[];
  showtimes: Showtime[];
  seats: Seat[];
  onUpdateMovies: (movies: Movie[]) => void;
  onUpdateShowtimes: (showtimes: Showtime[]) => void;
  onUpdateSeats: (seats: Seat[]) => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  movies,
  showtimes,
  seats,
  onUpdateMovies,
  onUpdateShowtimes,
  onUpdateSeats,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'movies' | 'showtimes' | 'seats' | 'bookings'>('movies');

  // New Movie Form State
  const [isAddingMovie, setIsAddingMovie] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDuration, setNewDuration] = useState('2h 10m');
  const [newRating, setNewRating] = useState('PG-13');
  const [newGenre, setNewGenre] = useState('Sci-Fi, Action');
  const [newPoster] = useState('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop');
  const [newBackdrop] = useState('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=2000&auto=format&fit=crop');

  // Pricing Editor
  const [standardPrice, setStandardPrice] = useState(17.50);
  const [premiumPrice, setPremiumPrice] = useState(23.00);
  const [vipPrice, setVipPrice] = useState(31.00);

  // New Showtime Form
  const [isAddingShowtime, setIsAddingShowtime] = useState(false);
  const [showtimeMovieId, setShowtimeMovieId] = useState(movies[0]?.id || '');
  const [showtimeDate, setShowtimeDate] = useState('Today, 24 Oct');
  const [showtimeTime, setShowtimeTime] = useState('21:00');
  const [showtimeFormat, setShowtimeFormat] = useState<'IMAX 3D' | 'DOLBY ATMOS' | '2D' | '4DX'>('IMAX 3D');

  const [bookingsList] = useState([
    {
      id: 'bk-1',
      ref: 'CSC-894210',
      movie: 'CHRONOS: BEYOND HORIZON',
      customer: 'Dr. Evelyn Reed',
      seats: ['D-6', 'D-7'],
      hall: 'Auditorium 1 (IMAX Laser)',
      time: '19:30',
      amount: 46.00,
      status: 'Confirmed'
    },
    {
      id: 'bk-2',
      ref: 'CSC-382914',
      movie: 'NEO-TOKYO: VELOCITY',
      customer: 'Kenji Sato',
      seats: ['F-5', 'F-6'],
      hall: 'Auditorium 2 (Dolby Atmos)',
      time: '20:45',
      amount: 62.00,
      status: 'Confirmed'
    },
    {
      id: 'bk-3',
      ref: 'CSC-771239',
      movie: 'THE ABYSSAL DEEP',
      customer: 'Marcus Vance',
      seats: ['H-6'],
      hall: 'Auditorium 1 (IMAX Laser)',
      time: '17:00',
      amount: 31.00,
      status: 'Confirmed'
    }
  ]);

  const handleCreateMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const createdMovie: Movie = {
      id: `m-${Date.now()}`,
      title: newTitle.trim(),
      tagline: newTagline.trim() || 'A cinematic premiere.',
      description: newDesc.trim() || 'A cinema experience presented in expanded aspect ratio format.',
      posterUrl: newPoster,
      backdropUrl: newBackdrop,
      rating: newRating,
      score: 9.0,
      duration: newDuration,
      genres: newGenre.split(',').map((g) => g.trim()),
      languages: ['English'],
      formats: ['IMAX 3D', 'DOLBY ATMOS', '2D'],
      director: 'Cine Studio',
      releaseDate: 'Nov 2026',
      cast: []
    };

    onUpdateMovies([createdMovie, ...movies]);
    setIsAddingMovie(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleDeleteMovie = (movieId: string) => {
    if (confirm('Remove this movie from the active catalogue?')) {
      onUpdateMovies(movies.filter((m) => m.id !== movieId));
    }
  };

  const handleCreateShowtime = (e: React.FormEvent) => {
    e.preventDefault();
    const movieObj = movies.find((m) => m.id === showtimeMovieId);
    if (!movieObj) return;

    const newSt: Showtime = {
      id: `st-${Date.now()}`,
      movieId: showtimeMovieId,
      theatreId: 'th-1',
      theatreName: 'CINESCAPE Grand Luxe Cinema',
      auditoriumId: 'aud-1',
      auditoriumName: 'Auditorium 1 (IMAX Laser)',
      format: showtimeFormat,
      date: showtimeDate,
      time: showtimeTime,
      pricing: {
        standard: standardPrice,
        premium: premiumPrice,
        vip_recliner: vipPrice
      }
    };

    onUpdateShowtimes([newSt, ...showtimes]);
    setIsAddingShowtime(false);
  };

  const handleUpdateTierPrices = () => {
    const updatedSeats = seats.map((s) => {
      let price = standardPrice;
      if (s.tier === 'premium') price = premiumPrice;
      if (s.tier === 'vip_recliner') price = vipPrice;
      return { ...s, price };
    });
    onUpdateSeats(updatedSeats);
    alert('Auditorium pricing updated.');
  };

  const handleToggleSeatOccupancy = (seatId: string) => {
    const updated = seats.map((s) => {
      if (s.id === seatId) {
        return {
          ...s,
          status: (s.status === 'occupied' ? 'available' : 'occupied') as any
        };
      }
      return s;
    });
    onUpdateSeats(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b0c0e]/98 backdrop-blur-md flex flex-col p-6 md:p-10 overflow-y-auto font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#18191e] border border-white/[0.08] flex items-center justify-center text-zinc-300">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-medium text-white tracking-wide font-cinzel">
              CINESCAPE Console
            </h2>
            <p className="text-[11px] font-mono text-zinc-500">
              Operations • Auditoriums, movies and live bookings
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-[#141519] border border-white/[0.08] text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Stat Cards (Derived directly from tokens: label, big figure, change vs reference) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 my-6">
        <div className="bg-[#121317] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Daily box office</span>
            <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <p className="text-2xl font-medium font-mono text-white mt-1 tabular-nums">$29,480.00</p>
          <span className="text-[11px] font-mono text-emerald-400 block mt-1">+14.2% vs last week</span>
        </div>

        <div className="bg-[#121317] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Seat occupancy</span>
            <Users className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <p className="text-2xl font-medium font-mono text-white mt-1 tabular-nums">
            {((seats.filter(s => s.status === 'occupied').length / seats.length) * 100).toFixed(1)}%
          </p>
          <span className="text-[11px] font-mono text-zinc-500 block mt-1">
            {seats.filter(s => s.status === 'occupied').length} of {seats.length} seats sold
          </span>
        </div>

        <div className="bg-[#121317] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Active showtimes</span>
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <p className="text-2xl font-medium font-mono text-white mt-1 tabular-nums">{showtimes.length}</p>
          <span className="text-[11px] font-mono text-zinc-500 block mt-1">3 auditoriums active</span>
        </div>

        <div className="bg-[#121317] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Repertoire titles</span>
            <Film className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <p className="text-2xl font-medium font-mono text-white mt-1 tabular-nums">{movies.length}</p>
          <span className="text-[11px] font-mono text-zinc-500 block mt-1">IMAX & Dolby Atmos</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] pb-3 mb-6">
        <button
          onClick={() => setActiveTab('movies')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'movies'
              ? 'bg-[#22232a] text-white border border-white/[0.12]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Movies ({movies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('showtimes')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'showtimes'
              ? 'bg-[#22232a] text-white border border-white/[0.12]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Showtimes</span>
        </button>

        <button
          onClick={() => setActiveTab('seats')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'seats'
              ? 'bg-[#22232a] text-white border border-white/[0.12]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Auditorium layout</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'bookings'
              ? 'bg-[#22232a] text-white border border-white/[0.12]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Bookings ledger</span>
        </button>
      </div>

      {/* TAB 1: Movies */}
      {activeTab === 'movies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Active catalogue</h3>
            <button
              onClick={() => setIsAddingMovie(true)}
              className="h-8 px-3 rounded-lg bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add movie</span>
            </button>
          </div>

          {isAddingMovie && (
            <form
              onSubmit={handleCreateMovie}
              className="bg-[#121317] border border-white/[0.08] rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <h4 className="text-xs font-medium text-white">Add title</h4>
                <button
                  type="button"
                  onClick={() => setIsAddingMovie(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-zinc-500 block mb-1 font-mono text-[11px]">Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Film title"
                    className="w-full bg-[#18191e] border border-white/[0.08] px-3 py-1.5 rounded-lg text-white text-xs focus:outline-none focus:border-white/20"
                  />
                </div>
                <div>
                  <label className="text-zinc-500 block mb-1 font-mono text-[11px]">Tagline</label>
                  <input
                    type="text"
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    placeholder="Film tagline"
                    className="w-full bg-[#18191e] border border-white/[0.08] px-3 py-1.5 rounded-lg text-white text-xs focus:outline-none focus:border-white/20"
                  />
                </div>
                <div>
                  <label className="text-zinc-500 block mb-1 font-mono text-[11px]">Duration & rating</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      placeholder="2h 15m"
                      className="w-2/3 bg-[#18191e] border border-white/[0.08] px-3 py-1.5 rounded-lg text-white text-xs focus:outline-none focus:border-white/20 font-mono"
                    />
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(e.target.value)}
                      className="w-1/3 bg-[#18191e] border border-white/[0.08] px-2 py-1.5 rounded-lg text-white text-xs focus:outline-none"
                    >
                      <option value="PG">PG</option>
                      <option value="PG-13">PG-13</option>
                      <option value="R">R</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-zinc-500 block mb-1 font-mono text-[11px]">Genres</label>
                <input
                  type="text"
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  placeholder="Sci-Fi, Action"
                  className="w-full bg-[#18191e] border border-white/[0.08] px-3 py-1.5 rounded-lg text-white text-xs focus:outline-none focus:border-white/20"
                />
              </div>

              <div>
                <label className="text-zinc-500 block mb-1 font-mono text-[11px]">Synopsis</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Short narrative..."
                  className="w-full bg-[#18191e] border border-white/[0.08] px-3 py-1.5 rounded-lg text-white text-xs focus:outline-none focus:border-white/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingMovie(false)}
                  className="h-8 px-3 rounded-lg bg-[#18191e] text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-3.5 rounded-lg bg-white text-zinc-950 text-xs font-medium hover:bg-zinc-200"
                >
                  Save movie
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {movies.map((m) => (
              <div
                key={m.id}
                className="bg-[#121317] border border-white/[0.06] rounded-xl p-3.5 flex gap-3.5 items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={m.posterUrl}
                    alt={m.title}
                    className="w-12 h-16 object-cover rounded-md"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide">
                      {m.genres.join(' • ')}
                    </span>
                    <h4 className="text-white font-medium text-xs truncate mt-0.5">
                      {m.title}
                    </h4>
                    <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                      {m.duration} • {m.rating} • Score: {m.score}
                    </p>
                    <div className="flex gap-1 mt-1.5">
                      {m.formats.map((f) => (
                        <span
                          key={f}
                          className="px-1.5 py-0.2 rounded bg-white/[0.04] text-[9px] text-zinc-400 border border-white/[0.06] font-mono"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteMovie(m.id)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors"
                  title="Remove movie"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Showtimes */}
      {activeTab === 'showtimes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Showtimes list</h3>
            <button
              onClick={() => setIsAddingShowtime(true)}
              className="h-8 px-3 rounded-lg bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule showtime</span>
            </button>
          </div>

          {isAddingShowtime && (
            <form
              onSubmit={handleCreateShowtime}
              className="bg-[#121317] border border-white/[0.08] rounded-xl p-4 space-y-3"
            >
              <h4 className="text-xs font-medium text-white">New screening</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-zinc-500 block mb-1 font-mono text-[11px]">Movie</label>
                  <select
                    value={showtimeMovieId}
                    onChange={(e) => setShowtimeMovieId(e.target.value)}
                    className="w-full bg-[#18191e] border border-white/[0.08] px-2.5 py-1.5 rounded-lg text-white text-xs focus:outline-none"
                  >
                    {movies.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-zinc-500 block mb-1 font-mono text-[11px]">Date</label>
                  <input
                    type="text"
                    value={showtimeDate}
                    onChange={(e) => setShowtimeDate(e.target.value)}
                    placeholder="Today, 24 Oct"
                    className="w-full bg-[#18191e] border border-white/[0.08] px-2.5 py-1.5 rounded-lg text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-zinc-500 block mb-1 font-mono text-[11px]">Time</label>
                  <input
                    type="text"
                    value={showtimeTime}
                    onChange={(e) => setShowtimeTime(e.target.value)}
                    placeholder="21:15"
                    className="w-full bg-[#18191e] border border-white/[0.08] px-2.5 py-1.5 rounded-lg text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-zinc-500 block mb-1 font-mono text-[11px]">Format</label>
                  <select
                    value={showtimeFormat}
                    onChange={(e) => setShowtimeFormat(e.target.value as any)}
                    className="w-full bg-[#18191e] border border-white/[0.08] px-2.5 py-1.5 rounded-lg text-white text-xs"
                  >
                    <option value="IMAX 3D">IMAX 3D</option>
                    <option value="DOLBY ATMOS">DOLBY ATMOS</option>
                    <option value="2D">2D Laser</option>
                    <option value="4DX">4DX Motion</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingShowtime(false)}
                  className="h-8 px-3 rounded-lg bg-[#18191e] text-xs font-medium text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-3.5 rounded-lg bg-white text-zinc-950 text-xs font-medium hover:bg-zinc-200"
                >
                  Save slot
                </button>
              </div>
            </form>
          )}

          <div className="bg-[#121317] border border-white/[0.06] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs text-zinc-400">
              <thead className="bg-[#16171b] text-zinc-500 uppercase text-[10px] font-mono">
                <tr>
                  <th className="py-2.5 px-3.5">Movie</th>
                  <th className="py-2.5 px-3.5">Auditorium</th>
                  <th className="py-2.5 px-3.5">Format</th>
                  <th className="py-2.5 px-3.5">Date</th>
                  <th className="py-2.5 px-3.5">Time</th>
                  <th className="py-2.5 px-3.5">Pricing</th>
                  <th className="py-2.5 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {showtimes.map((st) => {
                  const m = movies.find((mov) => mov.id === st.movieId);
                  return (
                    <tr key={st.id} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 px-3.5 font-medium text-zinc-200">{m?.title}</td>
                      <td className="py-2.5 px-3.5 text-zinc-500 font-mono">{st.auditoriumName}</td>
                      <td className="py-2.5 px-3.5">
                        <span className="px-1.5 py-0.2 rounded bg-white/[0.06] text-zinc-300 font-mono text-[10px]">
                          {st.format}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 font-mono">{st.date}</td>
                      <td className="py-2.5 px-3.5 font-mono text-white tabular-nums">{st.time}</td>
                      <td className="py-2.5 px-3.5 font-mono text-[11px] text-zinc-400 tabular-nums">
                        ${st.pricing.standard} / ${st.pricing.premium} / ${st.pricing.vip_recliner}
                      </td>
                      <td className="py-2.5 px-3.5 text-right">
                        <button
                          onClick={() => onUpdateShowtimes(showtimes.filter((s) => s.id !== st.id))}
                          className="text-zinc-500 hover:text-rose-400 text-xs transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Seats & Pricing */}
      {activeTab === 'seats' && (
        <div className="space-y-4">
          <div className="bg-[#121317] border border-white/[0.06] rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-medium text-white flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
              <span>Base tier ticket pricing</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-zinc-500 block mb-1 font-mono text-[11px]">Standard (Rows A–B)</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono">$</span>
                  <input
                    type="number"
                    step="0.5"
                    value={standardPrice}
                    onChange={(e) => setStandardPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#18191e] border border-white/[0.08] pl-6 pr-3 py-1.5 rounded-lg text-white font-mono text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="text-zinc-500 block mb-1 font-mono text-[11px]">Premium (Rows C–E)</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono">$</span>
                  <input
                    type="number"
                    step="0.5"
                    value={premiumPrice}
                    onChange={(e) => setPremiumPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#18191e] border border-white/[0.08] pl-6 pr-3 py-1.5 rounded-lg text-white font-mono text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="text-zinc-500 block mb-1 font-mono text-[11px]">VIP Recliner (Rows F–H)</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono">$</span>
                  <input
                    type="number"
                    step="0.5"
                    value={vipPrice}
                    onChange={(e) => setVipPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#18191e] border border-white/[0.08] pl-6 pr-3 py-1.5 rounded-lg text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleUpdateTierPrices}
              className="h-8 px-3.5 rounded-lg bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-colors"
            >
              Apply pricing
            </button>
          </div>

          {/* Seat Layout Override */}
          <div className="bg-[#121317] border border-white/[0.06] rounded-xl p-4 space-y-3">
            <div>
              <h4 className="text-xs font-medium text-white">
                Live auditorium seat override
              </h4>
              <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                Click any seat to toggle occupied or available status.
              </p>
            </div>

            <div className="space-y-1 py-1">
              {['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'].map((row) => (
                <div key={row} className="flex items-center gap-2">
                  <span className="w-5 text-[11px] font-mono text-zinc-500 text-center">
                    {row}
                  </span>
                  <div className="flex-1 grid grid-cols-12 gap-1">
                    {seats
                      .filter((s) => s.row === row)
                      .sort((a, b) => a.number - b.number)
                      .map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => handleToggleSeatOccupancy(seat.id)}
                          title={`${seat.id}: ${seat.status}`}
                          className={`h-7 rounded text-[10px] font-mono border transition-colors flex items-center justify-center ${
                            seat.status === 'occupied'
                              ? 'bg-[#18191e] text-zinc-600 border-white/[0.04]'
                              : 'bg-white/[0.06] text-zinc-300 border-white/[0.08] hover:bg-white/[0.12]'
                          }`}
                        >
                          {seat.number}
                        </button>
                      ))}
                  </div>
                  <span className="w-5 text-[11px] font-mono text-zinc-500 text-center">
                    {row}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white">Live ledger</h3>
          <div className="bg-[#121317] border border-white/[0.06] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs text-zinc-400">
              <thead className="bg-[#16171b] text-zinc-500 uppercase text-[10px] font-mono">
                <tr>
                  <th className="py-2.5 px-3.5">Ref ID</th>
                  <th className="py-2.5 px-3.5">Customer</th>
                  <th className="py-2.5 px-3.5">Movie</th>
                  <th className="py-2.5 px-3.5">Hall</th>
                  <th className="py-2.5 px-3.5">Seats</th>
                  <th className="py-2.5 px-3.5">Amount</th>
                  <th className="py-2.5 px-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {bookingsList.map((bk) => (
                  <tr key={bk.id} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3.5 font-mono text-zinc-200">{bk.ref}</td>
                    <td className="py-2.5 px-3.5 text-zinc-200 font-medium">{bk.customer}</td>
                    <td className="py-2.5 px-3.5 text-zinc-300">{bk.movie}</td>
                    <td className="py-2.5 px-3.5 text-zinc-500 font-mono">{bk.hall}</td>
                    <td className="py-2.5 px-3.5">
                      <div className="flex gap-1 font-mono text-[10px]">
                        {bk.seats.map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.2 rounded bg-white/[0.06] text-zinc-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 font-mono text-white tabular-nums">
                      ${bk.amount.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className="text-[11px] font-mono text-emerald-400">
                        {bk.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
