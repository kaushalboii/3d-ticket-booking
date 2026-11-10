import React, { useState, useEffect, useCallback } from 'react';
import { Seat } from '../types';
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

  // Target eye-level coordinate right at human eye height above seat cushion
  const eyeY = seat.y + 0.92;
  const eyeZ = seat.z - 0.04;

  // Initial cinematic auditorium vantage point [0, 6.0, 15.5]
  const p0: [number, number, number] = [0, 6.0, 15.5];
  // Target eye-level coordinate at seat cushion: [seat.x, eyeY, eyeZ]
  const p2: [number, number, number] = [seat.x, eyeY, eyeZ];
  // Mid-air arching flight control point
  const p1: [number, number, number] = [seat.x * 0.35, Math.max(4.5, eyeY + 1.8), (15.5 + eyeZ) / 2];

  const posX = bezierInterpolation(p0[0], p1[0], p2[0], eased);
  const posY = bezierInterpolation(p0[1], p1[1], p2[1], eased);
  const posZ = bezierInterpolation(p0[2], p1[2], p2[2], eased);

  // LookAt direction: from looking down at the stadium rake [0, 1.8, 5.0] to facing center screen [0, 3.8, 0]
  const lookX = bezierInterpolation(0, seat.x * 0.25, 0, eased);
  const lookY = bezierInterpolation(1.8, 2.8, 3.8, eased);
  const lookZ = bezierInterpolation(5.0, 2.5, 0, eased);

  const fov = 62 * (1 - eased) + 52 * eased;

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
  onSelectSeatToPreview?: (seat: Seat) => void;
  onBackToSeatMap: () => void;
  onBookSeat: () => void;
}

export const SeatPreviewView: React.FC<SeatPreviewViewProps> = ({
  seats,
  seat,
  selectedSeats = [seat],
  onSelectSeatToPreview,
  onBackToSeatMap,
  onBookSeat,
}) => {
  // Flight state & drawer synchronization
  const [replayCount, setReplayCount] = useState(0);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isFullCinemaView, setIsFullCinemaView] = useState(false);

  // Automatically reset drawer visibility when the active preview seat changes
  useEffect(() => {
    setIsDrawerVisible(false);
  }, [seat.id]);

  // Callback from 3D camera when the cubic-bezier flight arrives at the seat
  const handleTransitionComplete = useCallback(() => {
    setIsDrawerVisible(true);
  }, []);

  // Replay the cinematic camera flight
  const handleReplayFlight = () => {
    setIsDrawerVisible(false);
    setReplayCount((prev) => prev + 1);
  };

  const totalSeatsCount = selectedSeats.length;
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="relative w-full h-full bg-[#050505] flex flex-col justify-between overflow-hidden select-none">
      {/* 3D Auditorium & Cinema Screen Viewport with Cubic-Bezier Camera Tweening */}
      <div className="absolute inset-0 z-0">
        <Auditorium3DView
          seats={seats}
          selectedSeat={seat}
          replayTrigger={replayCount}
          onTransitionComplete={handleTransitionComplete}
        />
      </div>

      {/* Top Floating Navigation Bar */}
      <div className="relative z-30 w-full flex items-center justify-between px-5 pt-4 pointer-events-none">
        {/* Left Back Button to Seat Map */}
        <button
          onClick={onBackToSeatMap}
          className="pointer-events-auto w-9 h-9 rounded-full bg-[#111111]/90 border border-[#222222] text-[#F5F5F5] flex items-center justify-center hover:bg-[#1A1A1A] hover:border-[#E5A93C] transition active:scale-95 shadow-md cursor-pointer"
          title="Back to Seat Map"
          aria-label="Back to Seat Map"
        >
          <ChevronLeft className="w-4 h-4 text-[#CCCCCC]" />
        </button>

        {/* Multi-Seat Switcher Pill Bar (if multiple seats are selected) */}
        {totalSeatsCount > 1 ? (
          <div className="pointer-events-auto flex items-center gap-1.5 bg-[#111111]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#222222] shadow-lg">
            <span className="text-[10px] text-[#71717A] uppercase font-mono tracking-tight mr-1">
              Preview:
            </span>
            {selectedSeats.map((s) => {
              const isCurrent = s.id === seat.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onSelectSeatToPreview?.(s)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold transition cursor-pointer ${
                    isCurrent
                      ? 'bg-[#E5A93C] text-[#050505] shadow-sm'
                      : 'text-[#888888] hover:text-[#CCCCCC]'
                  }`}
                >
                  {s.id}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="pointer-events-auto px-3.5 py-1 rounded-full bg-[#111111]/90 backdrop-blur-md border border-[#222222] text-xs font-mono text-[#F5F5F5] shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E5A93C] animate-pulse" />
            <span className="font-bold">
              Row {seat.row}, Seat {seat.number}
            </span>
            <span className="text-[10px] text-[#A1A1AA] font-sans">
              · {seat.tierLabel}
            </span>
          </div>
        )}

        {/* Right Action Icons: Replay Camera Swoop & Toggle Full Cinema View */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            onClick={handleReplayFlight}
            className="w-9 h-9 rounded-full bg-[#111111]/90 border border-[#222222] text-[#F5F5F5] flex items-center justify-center hover:bg-[#1A1A1A] hover:border-[#E5A93C] transition active:scale-95 shadow-md cursor-pointer"
            title="Replay Camera Swoop"
            aria-label="Replay Camera Flight"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#E5A93C]" />
          </button>

          <button
            onClick={() => setIsFullCinemaView(!isFullCinemaView)}
            className="w-9 h-9 rounded-full bg-[#111111]/90 border border-[#222222] text-[#F5F5F5] flex items-center justify-center hover:bg-[#1A1A1A] hover:border-[#E5A93C] transition active:scale-95 shadow-md cursor-pointer"
            title={isFullCinemaView ? 'Show Information Drawer' : 'Full Screen Cinema View'}
            aria-label="Toggle Full Cinema View"
          >
            {isFullCinemaView ? (
              <EyeOff className="w-3.5 h-3.5 text-[#E5A93C]" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-[#CCCCCC]" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom Info Drawer (Exact match to video frames 00:04, 00:12, 00:20) */}
      <div
        className={`relative z-20 w-full mt-auto transition-all duration-500 ease-out transform ${
          isDrawerVisible && !isFullCinemaView
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <SeatInfoDrawer
          seat={seat}
          selectedSeats={selectedSeats}
          onChangeSeat={onBackToSeatMap}
          onBookSeat={onBookSeat}
        />
      </div>

      {/* Minimal floating bottom bar when in Full Cinema View */}
      {isFullCinemaView && (
        <div className="relative z-30 w-full px-5 pb-5 flex items-center justify-between gap-3 pointer-events-auto animate-fade-in">
          <button
            onClick={() => setIsFullCinemaView(false)}
            className="px-4 py-2.5 rounded-full bg-[#111111]/90 border border-[#222222] text-xs font-medium text-[#E5E5E5] backdrop-blur-md shadow-lg hover:border-[#E5A93C] transition cursor-pointer"
          >
            Show Details
          </button>
          <button
            onClick={onBookSeat}
            className="px-6 py-2.5 rounded-full bg-white text-[#0A0A0A] text-xs font-bold shadow-lg shadow-white/20 active:scale-95 transition cursor-pointer"
          >
            {totalSeatsCount > 1 ? `Book ${totalSeatsCount} Seats · ₹${totalPrice}` : `Book · ₹${seat.price}`}
          </button>
        </div>
      )}
    </div>
  );
};
