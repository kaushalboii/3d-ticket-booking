import React, { useState } from 'react';
import { CinemaCanvas3D } from './auditorium/CinemaCanvas3D';
import { FirstPersonHUD } from './auditorium/FirstPersonHUD';
import { SeatMap2DDrawer } from './auditorium/SeatMap2DDrawer';
import { Movie, Showtime, Seat } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Layers,
  Grid
} from 'lucide-react';

interface SeatSelectionViewProps {
  movie: Movie;
  showtime: Showtime;
  seats: Seat[];
  onBack: () => void;
  onProceedToCheckout: (selectedSeats: Seat[]) => void;
}

export const SeatSelectionView: React.FC<SeatSelectionViewProps> = ({
  movie,
  showtime,
  seats,
  onBack,
  onProceedToCheckout,
}) => {
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(['D-6']);
  const [focusedSeat, setFocusedSeat] = useState<Seat | null>(() => {
    return seats.find((s) => s.id === 'D-6') || seats[0];
  });
  const [viewMode, setViewMode] = useState<'overview' | 'first_person'>('overview');
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [show2DDrawer, setShow2DDrawer] = useState(false);

  // Look around states
  const [lookAroundYaw, setLookAroundYaw] = useState(0);
  const [lookAroundPitch, setLookAroundPitch] = useState(0);

  const selectedSeats = seats.filter((s) => selectedSeatIds.includes(s.id));
  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleToggleSeat = (seat: Seat) => {
    if (seat.status === 'occupied') return;
    setSelectedSeatIds((prev) => {
      if (prev.includes(seat.id)) {
        return prev.filter((id) => id !== seat.id);
      } else {
        return [...prev, seat.id];
      }
    });
  };

  const handleSeatClick = (seat: Seat) => {
    setFocusedSeat(seat);
    setLookAroundYaw(0);
    setLookAroundPitch(0);
    setViewMode('first_person');
  };

  const handleSelectCompareSeat = (seatId: string) => {
    const targetSeat = seats.find((s) => s.id === seatId);
    if (targetSeat) {
      setFocusedSeat(targetSeat);
      setLookAroundYaw(0);
      setLookAroundPitch(0);
      setViewMode('first_person');
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#0b0c0e] flex flex-col overflow-hidden select-none font-sans">
      {/* Top Header */}
      <header className="z-20 bg-[#0e0f12] border-b border-white/[0.08] px-4 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Schedule</span>
          </button>

          <div className="h-3.5 w-[1px] bg-white/[0.1]" />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-white font-medium text-xs md:text-sm">
                {movie.title}
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.08] text-zinc-300">
                {showtime.format}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono flex items-center gap-2">
              <span>{showtime.theatreName}</span>
              <span>•</span>
              <span>{showtime.auditoriumName}</span>
              <span>•</span>
              <span className="text-zinc-300 tabular-nums">{showtime.time}</span>
            </p>
          </div>
        </div>

        {/* View Switcher & 2D Drawer Toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-[#141519] border border-white/[0.08] p-0.5 rounded-lg flex items-center gap-1">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'overview'
                  ? 'bg-[#22232a] text-white border border-white/[0.12]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span className="hidden sm:inline">Auditorium</span>
            </button>

            <button
              onClick={() => {
                if (!focusedSeat && selectedSeats.length > 0) {
                  setFocusedSeat(selectedSeats[0]);
                }
                setViewMode('first_person');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'first_person'
                  ? 'bg-[#22232a] text-white border border-white/[0.12]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Eye-level</span>
            </button>
          </div>

          <button
            onClick={() => setShow2DDrawer(true)}
            className="h-7 px-2.5 rounded-lg bg-[#141519] border border-white/[0.08] text-zinc-300 hover:text-white hover:border-white/20 transition-colors text-xs font-medium flex items-center gap-1.5"
            title="Open 2D Seat Map"
          >
            <Grid className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline font-mono text-[11px]">2D map</span>
          </button>
        </div>
      </header>

      {/* Main 3D Viewport */}
      <div className="relative flex-1 w-full h-full">
        <CinemaCanvas3D
          seats={seats}
          selectedSeatIds={selectedSeatIds}
          focusedSeat={focusedSeat}
          viewMode={viewMode}
          onSeatClick={handleSeatClick}
          onSeatHover={setHoveredSeat}
          lookAroundYaw={lookAroundYaw}
          lookAroundPitch={lookAroundPitch}
          movieTitle={movie.title}
        />

        {/* Dynamic HUD in First Person Mode */}
        {viewMode === 'first_person' && focusedSeat && (
          <FirstPersonHUD
            seat={focusedSeat}
            isSelected={selectedSeatIds.includes(focusedSeat.id)}
            onToggleSeat={handleToggleSeat}
            onReturnToMap={() => setViewMode('overview')}
            onSelectCompareSeat={handleSelectCompareSeat}
            yaw={lookAroundYaw}
            pitch={lookAroundPitch}
            onLookAroundChange={(y, p) => {
              setLookAroundYaw(y);
              setLookAroundPitch(p);
            }}
            onResetLookAround={() => {
              setLookAroundYaw(0);
              setLookAroundPitch(0);
            }}
          />
        )}

        {/* Overview Mode Helper Bar */}
        {viewMode === 'overview' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none bg-[#121317]/90 backdrop-blur-md border border-white/[0.08] px-3.5 py-1.5 rounded-lg text-xs text-zinc-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
            <span>Select any seat in 3D to inspect sightlines and perspective</span>
          </div>
        )}

        {/* Hovered Seat Tooltip */}
        {viewMode === 'overview' && hoveredSeat && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none bg-[#141519]/95 backdrop-blur-md border border-white/[0.1] px-3 py-1.5 rounded-lg text-xs text-zinc-200 shadow-xl flex items-center gap-3">
            <span className="font-mono text-zinc-200 font-medium">
              Row {hoveredSeat.row} • Seat {hoveredSeat.number}
            </span>
            <span className="text-zinc-500 font-mono text-[11px]">
              {hoveredSeat.tier.replace('_', ' ')}
            </span>
            <span className="font-mono tabular-nums text-white">${hoveredSeat.price.toFixed(2)}</span>
            <span className="text-zinc-500 text-[11px]">Click to inspect</span>
          </div>
        )}
      </div>

      {/* Bottom Booking Action Bar */}
      {viewMode === 'overview' && (
        <footer className="z-20 bg-[#0e0f12] border-t border-white/[0.08] px-6 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[11px] font-mono text-zinc-500 block">
                Selected seats ({selectedSeats.length})
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {selectedSeats.length === 0 ? (
                  <span className="text-xs text-zinc-500">None selected</span>
                ) : (
                  selectedSeats.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSeatClick(s)}
                      className="px-2 py-0.5 rounded bg-[#1c1d22] border border-white/[0.08] hover:border-white/20 text-zinc-200 text-xs font-mono transition-colors flex items-center gap-1"
                      title="Inspect eye-level"
                    >
                      <span>{s.id}</span>
                      <Eye className="w-2.5 h-2.5 text-zinc-500" />
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <span className="text-[11px] font-mono text-zinc-500 block">Total</span>
              <span className="text-base font-mono font-medium text-white tabular-nums">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <button
              disabled={selectedSeats.length === 0}
              onClick={() => onProceedToCheckout(selectedSeats)}
              className="h-9 px-5 rounded-lg bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-colors flex items-center gap-2 disabled:opacity-40 disabled:hover:bg-white"
            >
              <span>Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </footer>
      )}

      {/* 2D Seat Map Drawer */}
      {show2DDrawer && (
        <SeatMap2DDrawer
          seats={seats}
          selectedSeatIds={selectedSeatIds}
          focusedSeat={focusedSeat}
          onSeatSelect={handleToggleSeat}
          onPreviewSeatIn3D={(seat) => {
            handleSeatClick(seat);
            setShow2DDrawer(false);
          }}
          onClose={() => setShow2DDrawer(false)}
        />
      )}
    </div>
  );
};
