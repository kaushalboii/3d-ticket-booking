import React, { useState, useEffect } from 'react';
import { Seat, Movie } from '../types';
import { Auditorium3DView } from './Auditorium3DView';
import { SeatInfoDrawer } from './SeatInfoDrawer';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';

interface SeatPreviewViewProps {
  seats: Seat[];
  seat: Seat;
  movie?: Movie;
  currency?: string;
  onBackToSeatMap: () => void;
  onBookSeat: () => void;
}

export const SeatPreviewView: React.FC<SeatPreviewViewProps> = ({
  seats,
  seat,
  movie,
  currency = '₹',
  onBackToSeatMap,
  onBookSeat,
}) => {
  // Phase starts with brief 0.5s overhead swoop into seat, matching video frame 00:02 -> 00:03
  const [viewPhase, setViewPhase] = useState<'transition' | 'eye_level'>('transition');
  // Full cinema mode: allows user to hide the drawer completely to admire the full screen
  const [isFullCinemaView, setIsFullCinemaView] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setViewPhase('eye_level');
    }, 550);
    return () => clearTimeout(timer);
  }, [seat.id]);

  return (
    <div className="relative w-full h-full bg-[#050505] flex flex-col justify-between overflow-hidden select-none">
      {/* 3D Auditorium & Cinema Screen Viewport */}
      <div className="absolute inset-0 z-0">
        <Auditorium3DView
          seats={seats}
          selectedSeat={seat}
          viewPhase={viewPhase}
          screenImage={movie?.backdrop}
        />
      </div>

      {/* Top Floating Navigation matching video */}
      <div className="relative z-20 w-full flex items-center justify-between px-5 pt-3 pointer-events-none">
        {/* Back Button */}
        <button
          onClick={onBackToSeatMap}
          className="pointer-events-auto w-9 h-9 rounded-full bg-[#111111]/90 border border-[#222222] text-[#F5F5F5] flex items-center justify-center hover:bg-[#1A1A1A] transition active:scale-95 shadow-md cursor-pointer"
          aria-label="Back to Seat Map"
        >
          <ChevronLeft className="w-4 h-4 text-[#CCCCCC]" />
        </button>

        {/* View from [Seat] Pill */}
        <div className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111111]/85 border border-[#222222] shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-[#55E6A5]" />
          <span className="text-xs font-medium text-[#E5E5E5] tracking-tight">
            View from {seat.id}
          </span>
          {movie && (
            <span className="hidden sm:inline text-[11px] text-[#888888] font-normal">
              · {movie.title}
            </span>
          )}
        </div>

        {/* Fullscreen 3D View Toggle Button */}
        <button
          onClick={() => setIsFullCinemaView(!isFullCinemaView)}
          className="pointer-events-auto w-9 h-9 rounded-full bg-[#111111]/90 border border-[#222222] text-[#F5F5F5] flex items-center justify-center hover:bg-[#1A1A1A] transition active:scale-95 shadow-md cursor-pointer"
          title={isFullCinemaView ? "Show Information Drawer" : "Full Screen Cinema View"}
          aria-label="Toggle Full Cinema View"
        >
          {isFullCinemaView ? (
            <EyeOff className="w-3.5 h-3.5 text-[#55E6A5]" />
          ) : (
            <Eye className="w-3.5 h-3.5 text-[#CCCCCC]" />
          )}
        </button>
      </div>

      {/* Bottom Info Drawer (Slides up when in eye level view, or can be toggled) */}
      {!isFullCinemaView && (
        <div className="relative z-20 w-full mt-auto">
          <SeatInfoDrawer
            seat={seat}
            currency={currency}
            onChangeSeat={onBackToSeatMap}
            onBookSeat={onBookSeat}
          />
        </div>
      )}

      {/* When in Full Cinema View: Minimal floating bottom bar to Book or Return */}
      {isFullCinemaView && (
        <div className="relative z-20 w-full px-5 pb-5 flex items-center justify-between gap-3 pointer-events-auto">
          <button
            onClick={() => setIsFullCinemaView(false)}
            className="px-4 py-2.5 rounded-full bg-[#111111]/90 border border-[#222222] text-xs font-medium text-[#E5E5E5] backdrop-blur-md shadow-lg"
          >
            Show Details
          </button>
          <button
            onClick={onBookSeat}
            className="px-6 py-2.5 rounded-full bg-white text-[#0A0A0A] text-xs font-bold shadow-lg shadow-white/20 active:scale-95 transition"
          >
            Book · {currency}{seat.price}
          </button>
        </div>
      )}
    </div>
  );
};
