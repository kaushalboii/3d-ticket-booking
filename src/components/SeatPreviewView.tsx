import React, { useState, useEffect, useCallback } from 'react';
import { Seat, Movie } from '../types';
import { Auditorium3DView } from './Auditorium3DView';
import { SeatInfoDrawer } from './SeatInfoDrawer';
import { ChevronLeft, Eye, EyeOff, RotateCcw } from 'lucide-react';

/**
 * Cubic-bezier camera easing function matching cinematic deceleration curve
 * Equivalent to CSS cubic-bezier(0.25, 0.1, 0.25, 1.0)
 */
export function cubicBezierEasing(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Quadratic Bezier spatial interpolation across 3 control points with cubic-bezier time easing
 */
export function bezierInterpolation(p0: number, p1: number, p2: number, t: number): number {
  const inv = 1 - t;
  return inv * inv * p0 + 2 * inv * t * p1 + t * t * p2;
}

/**
 * Interpolates 3D camera position from initial auditorium perspective [0, 5, 10]
 * to the selected seat's eye-level perspective [seat.x, 1.2, seat.z + 0.8]
 */
export function interpolateCameraCoordinates(
  seat: { x: number; y: number; z: number },
  progress: number
): { position: [number, number, number]; lookAt: [number, number, number]; fov: number } {
  const eased = cubicBezierEasing(Math.min(1.0, Math.max(0.0, progress)));

  // Initial auditorium perspective requested: [0, 5, 10]
  const p0: [number, number, number] = [0, 5, 10];
  // Target eye-level coordinate requested: [seat.x, 1.2, seat.z + 0.8]
  const p2: [number, number, number] = [seat.x, 1.2, seat.z + 0.8];
  // Mid-air arching flight control point
  const p1: [number, number, number] = [seat.x * 0.4, 3.4, (10 + (seat.z + 0.8)) / 2 + 0.5];

  const posX = bezierInterpolation(p0[0], p1[0], p2[0], eased);
  const posY = bezierInterpolation(p0[1], p1[1], p2[1], eased);
  const posZ = bezierInterpolation(p0[2], p1[2], p2[2], eased);

  // LookAt direction: from looking down at the stadium rake [0, 0.8, 6.0] to facing center screen [0, 4.2, 0]
  const lookX = bezierInterpolation(0, seat.x * 0.35, 0, eased);
  const lookY = bezierInterpolation(0.8, 2.2, 4.2, eased);
  const lookZ = bezierInterpolation(6.0, 3.2, 0, eased);

  const fov = 60 * (1 - eased) + 50 * eased;

  return {
    position: [posX, posY, posZ],
    lookAt: [lookX, lookY, lookZ],
    fov,
  };
}

interface SeatPreviewViewProps {
  seats: Seat[];
  seat: Seat;
  selectedSeats?: Seat[];
  movie?: Movie;
  currency?: string;
  onSelectSeatToPreview?: (seat: Seat) => void;
  onBackToSeatMap: () => void;
  onBookSeat: () => void;
}

export const SeatPreviewView: React.FC<SeatPreviewViewProps> = ({
  seats,
  seat,
  selectedSeats = [seat],
  movie,
  currency = '₹',
  onSelectSeatToPreview,
  onBackToSeatMap,
  onBookSeat,
}) => {
  // Flight state & drawer reveal synchronization
  const [replayCount, setReplayCount] = useState(0);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isFullCinemaView, setIsFullCinemaView] = useState(false);

  // When seat changes, reset drawer visibility so it reveals upon camera landing
  useEffect(() => {
    setIsDrawerVisible(false);
  }, [seat.id]);

  // Callback from 3D camera when the cubic-bezier flight arrives at the seat
  const handleTransitionComplete = useCallback(() => {
    setIsDrawerVisible(true);
  }, []);

  // Replay the cinematic camera swoop
  const handleReplayFlight = () => {
    setIsDrawerVisible(false);
    setReplayCount((prev) => prev + 1);
  };

  const totalSeatsCount = selectedSeats.length;
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="relative w-full h-full bg-[#0B0D12] flex flex-col justify-between overflow-hidden select-none">
      {/* 3D Auditorium & Cinema Screen Viewport with Cubic-Bezier Camera Tweening */}
      <div className="absolute inset-0 z-0">
        <Auditorium3DView
          seats={seats}
          selectedSeat={seat}
          replayTrigger={replayCount}
          screenImage={movie?.backdrop}
          onTransitionComplete={handleTransitionComplete}
        />
      </div>

      {/* Top Floating Navigation Bar */}
      <div className="relative z-30 w-full flex items-center justify-between px-6 pt-3.5 pointer-events-none">
        {/* Back to Seat Map Button */}
        <button
          onClick={onBackToSeatMap}
          className="pointer-events-auto w-8 h-8 rounded-full bg-[#0B0D12]/90 backdrop-blur-md border border-white/[0.08] text-[#F0F1F4] flex items-center justify-center hover:bg-[#141822] hover:border-white/[0.16] transition active:scale-95 cursor-pointer"
          aria-label="Back to seat map"
          title="Back to seat map"
        >
          <ChevronLeft className="w-4 h-4 text-[#A3A9B8]" strokeWidth={1.5} />
        </button>

        {/* View from Seat Pill / Multi-Seat Switcher */}
        {totalSeatsCount > 1 ? (
          <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-full bg-[#0B0D12]/90 backdrop-blur-md border border-white/[0.08]">
            {selectedSeats.map((s) => {
              const isCurrent = s.id === seat.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onSelectSeatToPreview?.(s)}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-[#55E6A5] text-[#07130E] font-medium'
                      : 'text-[#7A8296] hover:text-[#D1D5DF]'
                  }`}
                >
                  <span>Seat {s.id}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B0D12]/90 backdrop-blur-md border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#55E6A5]" />
            <span className="text-xs font-medium text-[#F0F1F4] tracking-tight">
              View from Row {seat.row}, Seat {seat.number}
            </span>
            {movie && (
              <span className="hidden sm:inline text-[11px] text-[#7A8296] font-normal">
                · {movie.title}
              </span>
            )}
          </div>
        )}

        {/* Action Controls: Replay Swoop & Fullscreen 3D View Toggle */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            onClick={handleReplayFlight}
            className="w-8 h-8 rounded-full bg-[#0B0D12]/90 backdrop-blur-md border border-white/[0.08] text-[#F0F1F4] flex items-center justify-center hover:bg-[#141822] hover:border-white/[0.16] transition active:scale-95 cursor-pointer"
            title="Replay cinematic camera swoop"
            aria-label="Replay camera flight"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#55E6A5]" strokeWidth={1.5} />
          </button>

          <button
            onClick={() => setIsFullCinemaView(!isFullCinemaView)}
            className="w-8 h-8 rounded-full bg-[#0B0D12]/90 backdrop-blur-md border border-white/[0.08] text-[#F0F1F4] flex items-center justify-center hover:bg-[#141822] hover:border-white/[0.16] transition active:scale-95 cursor-pointer"
            title={isFullCinemaView ? "Show details sheet" : "Expand screen view"}
            aria-label="Toggle full view"
          >
            {isFullCinemaView ? (
              <EyeOff className="w-3.5 h-3.5 text-[#55E6A5]" strokeWidth={1.5} />
            ) : (
              <Eye className="w-3.5 h-3.5 text-[#A3A9B8]" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Bottom Info Drawer: Revealed automatically when camera swoop completes */}
      <div
        className={`relative z-20 w-full mt-auto transition-all duration-500 ease-out transform ${
          isDrawerVisible && !isFullCinemaView
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <SeatInfoDrawer
          seat={seat}
          selectedSeats={selectedSeats}
          currency={currency}
          onChangeSeat={onBackToSeatMap}
          onBookSeat={onBookSeat}
        />
      </div>

      {/* Full Cinema Mode Minimal Bottom Strip */}
      {isFullCinemaView && (
        <div className="relative z-30 w-full px-6 pb-6 flex items-center justify-between gap-3 pointer-events-auto">
          <button
            onClick={() => setIsFullCinemaView(false)}
            className="px-4 py-2 rounded-full bg-[#0B0D12]/90 border border-white/[0.08] text-xs font-normal text-[#D1D5DF] backdrop-blur-md cursor-pointer hover:bg-[#141822] transition"
          >
            Show optical metrics
          </button>
          <button
            onClick={onBookSeat}
            className="px-5 py-2 rounded-full bg-[#55E6A5] text-[#07130E] text-xs font-medium cursor-pointer hover:brightness-105 active:scale-[0.98] transition shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
          >
            {totalSeatsCount > 1
              ? `Book ${totalSeatsCount} seats · ${currency}${totalPrice}`
              : `Book seat · ${currency}${seat.price}`}
          </button>
        </div>
      )}
    </div>
  );
};