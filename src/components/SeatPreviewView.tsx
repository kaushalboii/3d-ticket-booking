import React, { useState, useEffect, useCallback } from 'react';
import { Seat } from '../types';
import { Auditorium3DView } from './Auditorium3DView';
import { SeatInfoDrawer } from './SeatInfoDrawer';
import { ChevronLeft, Eye, EyeOff, RotateCcw } from 'lucide-react';

/**
 * Smooth cubic-in-out timing curve matching cinematic camera deceleration
 */
export function cubicBezierEasing(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Quadratic Bezier spatial interpolation across 3 control points
 */
export function bezierInterpolation(p0: number, p1: number, p2: number, t: number): number {
  const inv = 1 - t;
  return inv * inv * p0 + 2 * inv * t * p1 + t * t * p2;
}

/**
 * Interpolates 3D camera position from auditorium vantage [0, 6.0, 15.5]
 * to the selected seat's seated eye-level perspective facing center screen.
 */
export function interpolateCameraCoordinates(
  seat: { x: number; y: number; z: number },
  progress: number,
  targetFov: number = 52,
  targetFocusY: number = 3.45
): { position: [number, number, number]; lookAt: [number, number, number]; fov: number } {
  const eased = cubicBezierEasing(Math.min(1.0, Math.max(0.0, progress)));

  const eyeY = seat.y + 0.92;
  const eyeZ = seat.z - 0.04;

  const p0: [number, number, number] = [0, 6.0, 15.5];
  const p2: [number, number, number] = [seat.x, eyeY, eyeZ];
  const p1: [number, number, number] = [
    seat.x * 0.35,
    Math.max(4.5, eyeY + 1.8),
    (15.5 + eyeZ) / 2,
  ];

  const posX = bezierInterpolation(p0[0], p1[0], p2[0], eased);
  const posY = bezierInterpolation(p0[1], p1[1], p2[1], eased);
  const posZ = bezierInterpolation(p0[2], p1[2], p2[2], eased);

  const lookX = bezierInterpolation(0, seat.x * 0.25, 0, eased);
  const lookY = bezierInterpolation(1.8, 2.7, targetFocusY, eased);
  const lookZ = bezierInterpolation(5.0, 2.5, 0, eased);

  const startFov = Math.max(targetFov + 8, 60);
  const fov = startFov * (1 - eased) + targetFov * eased;

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
  movieTitle?: string;
  movieBackdrop?: string;
  screenName?: string;
  onSelectSeatToPreview?: (seat: Seat) => void;
  onBackToSeatMap: () => void;
  onBookSeat: () => void;
}

export const SeatPreviewView: React.FC<SeatPreviewViewProps> = ({
  seats,
  seat,
  selectedSeats = [seat],
  movieTitle,
  movieBackdrop,
  screenName,
  onSelectSeatToPreview,
  onBackToSeatMap,
  onBookSeat,
}) => {
  const [replayCount, setReplayCount] = useState(0);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isFullCinemaView, setIsFullCinemaView] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    setIsDrawerVisible(false);
    setHasInteracted(false);
  }, [seat.id]);

  const handleTransitionComplete = useCallback(() => {
    setIsDrawerVisible(true);
  }, []);

  const handleUserInteract = useCallback(() => {
    setHasInteracted(true);
  }, []);

  const handleReplayFlight = () => {
    setIsDrawerVisible(false);
    setHasInteracted(false);
    setReplayCount((prev) => prev + 1);
  };

  const totalSeatsCount = selectedSeats.length;
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="relative w-full h-full bg-[#090807] flex flex-col justify-between overflow-hidden select-none">
      {/* 3D Auditorium & Cinema Screen Viewport */}
      <div className="absolute inset-0 z-0">
        <Auditorium3DView
          seats={seats}
          selectedSeat={seat}
          movieTitle={movieTitle}
          movieBackdrop={movieBackdrop}
          screenName={screenName}
          replayTrigger={replayCount}
          onTransitionComplete={handleTransitionComplete}
          onUserInteract={handleUserInteract}
        />
      </div>

      {/* Symmetrical Top Navigation Bar (Dead-center pill across all widths) */}
      <div className="relative z-30 w-full max-w-6xl mx-auto grid grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 pt-4 pointer-events-none">
        {/* Left: Back to Seat Map */}
        <div className="justify-self-start pointer-events-auto">
          <button
            onClick={onBackToSeatMap}
            className="w-9 h-9 rounded-full bg-[#141311]/90 backdrop-blur-md border border-[#efe9de]/[0.1] text-[#efe9de] flex items-center justify-center hover:bg-[#1e1c19] hover:border-[#efe9de]/25 transition-colors duration-150 active:scale-[0.97] shadow-md cursor-pointer"
            title="Back to Seat Map"
            aria-label="Back to Seat Map"
          >
            <ChevronLeft className="w-4 h-4 text-[#cfc8bc]" strokeWidth={1.75} />
          </button>
        </div>

        {/* Center: Multi-Seat Switcher or Active Seat Badge */}
        <div className="justify-self-center pointer-events-auto">
          {totalSeatsCount > 1 ? (
            <div className="flex items-center gap-1.5 bg-[#141311]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#efe9de]/[0.1] shadow-lg">
              <span className="text-[11px] text-[#787268] font-mono mr-1 pl-1">
                Preview
              </span>
              {selectedSeats.map((s) => {
                const isCurrent = s.id === seat.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => onSelectSeatToPreview?.(s)}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-medium transition-colors duration-150 cursor-pointer tabular-nums ${
                      isCurrent
                        ? 'bg-[#E5A93C] text-[#12110f] font-semibold'
                        : 'text-[#aaa398] hover:text-[#efe9de]'
                    }`}
                  >
                    {s.id}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-3.5 py-1.5 rounded-full bg-[#141311]/90 backdrop-blur-md border border-[#efe9de]/[0.1] text-xs font-mono text-[#efe9de] shadow-lg flex items-center gap-2 tabular-nums">
              <span className="w-2 h-2 rounded-full bg-[#E5A93C]" />
              <span className="font-medium">
                Row {seat.row}, Seat {seat.number}
              </span>
              <span className="text-[11px] text-[#aaa398] font-sans">
                · {seat.tierLabel}
              </span>
            </div>
          )}
        </div>

        {/* Right: Replay Flight & Toggle UI Overlay */}
        <div className="justify-self-end pointer-events-auto flex items-center gap-2">
          <button
            onClick={handleReplayFlight}
            className="w-9 h-9 rounded-full bg-[#141311]/90 backdrop-blur-md border border-[#efe9de]/[0.1] text-[#efe9de] flex items-center justify-center hover:bg-[#1e1c19] hover:border-[#efe9de]/25 transition-colors duration-150 active:scale-[0.97] shadow-md cursor-pointer"
            title="Replay Camera Swoop"
            aria-label="Replay Camera Flight"
          >
            <RotateCcw className="w-4 h-4 text-[#E5A93C]" strokeWidth={1.75} />
          </button>

          <button
            onClick={() => setIsFullCinemaView(!isFullCinemaView)}
            className="w-9 h-9 rounded-full bg-[#141311]/90 backdrop-blur-md border border-[#efe9de]/[0.1] text-[#efe9de] flex items-center justify-center hover:bg-[#1e1c19] hover:border-[#efe9de]/25 transition-colors duration-150 active:scale-[0.97] shadow-md cursor-pointer"
            title={isFullCinemaView ? 'Show Information Drawer' : 'Full Screen Cinema View'}
            aria-label="Toggle Full Cinema View"
          >
            {isFullCinemaView ? (
              <EyeOff className="w-4 h-4 text-[#E5A93C]" strokeWidth={1.75} />
            ) : (
              <Eye className="w-4 h-4 text-[#cfc8bc]" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* Subtle Drag Instruction Pill (Fades cleanly once viewer pans/zooms) */}
      {isDrawerVisible && !hasInteracted && !isFullCinemaView && (
        <div className="relative z-20 mx-auto mt-3 pointer-events-none">
          <div className="px-3 py-1 rounded-full bg-[#141311]/75 border border-[#efe9de]/[0.08] text-[11px] text-[#aaa398] backdrop-blur-sm">
            Drag to look around · Scroll to zoom
          </div>
        </div>
      )}

      {/* Centered Floating Bottom Info Sheet */}
      <div
        className={`relative z-20 w-full mt-auto px-0 sm:px-4 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isDrawerVisible && !isFullCinemaView
            ? 'translate-y-0 opacity-100'
            : 'translate-y-8 opacity-0 pointer-events-none'
        }`}
      >
        <SeatInfoDrawer
          seat={seat}
          selectedSeats={selectedSeats}
          onChangeSeat={onBackToSeatMap}
          onBookSeat={onBookSeat}
        />
      </div>

      {/* Minimal Floating Bar in Full Cinema View */}
      {isFullCinemaView && (
        <div className="relative z-30 w-full max-w-xl mx-auto px-5 pb-5 flex items-center justify-between gap-3 pointer-events-auto">
          <button
            onClick={() => setIsFullCinemaView(false)}
            className="px-4 py-2.5 rounded-xl bg-[#141311]/90 border border-[#efe9de]/[0.1] text-xs font-medium text-[#efe9de] backdrop-blur-md shadow-lg hover:bg-[#1e1c19] transition-colors duration-150 cursor-pointer"
          >
            Show details
          </button>
          <button
            onClick={onBookSeat}
            className="px-6 py-2.5 rounded-xl bg-[#efe9de] text-[#12110f] text-xs font-semibold shadow-lg hover:bg-white active:scale-[0.98] transition-colors duration-150 cursor-pointer tabular-nums"
          >
            {totalSeatsCount > 1
              ? `Book ${totalSeatsCount} seats · ₹${totalPrice}`
              : `Book · ₹${seat.price}`}
          </button>
        </div>
      )}
    </div>
  );
};
