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
  const [viewPhase, setViewPhase] = useState<'transition' | 'eye_level'>('transition');
  const [isFullCinemaView, setIsFullCinemaView] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setViewPhase('eye_level');
    }, 550);
    return () => clearTimeout(timer);
  }, [seat.id]);

  return (
    <div className="relative w-full h-full bg-[#0B0D12] flex flex-col justify-between overflow-hidden select-none">
      {/* 3D Auditorium & Cinema Screen Viewport */}
      <div className="absolute inset-0 z-0">
        <Auditorium3DView
          seats={seats}
          selectedSeat={seat}
          viewPhase={viewPhase}
          screenImage={movie?.backdrop}
        />
      </div>

      {/* Top Floating Navigation */}
      <div className="relative z-20 w-full flex items-center justify-between px-6 pt-3.5 pointer-events-none">
        {/* Back Button */}
        <button
          onClick={onBackToSeatMap}
          className="pointer-events-auto w-8 h-8 rounded-full bg-[#0B0D12]/90 backdrop-blur-md border border-white/[0.08] text-[#F0F1F4] flex items-center justify-center hover:bg-[#141822] transition active:scale-95 cursor-pointer"
          aria-label="Back to seat map"
        >
          <ChevronLeft className="w-4 h-4 text-[#A3A9B8]" strokeWidth={1.5} />
        </button>

        {/* View from [Seat] Pill */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B0D12]/90 backdrop-blur-md border border-white/[0.08]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#55E6A5]" />
          <span className="text-xs font-medium text-[#F0F1F4] tracking-tight">
            View from {seat.id}
          </span>
          {movie && (
            <span className="hidden sm:inline text-[11px] text-[#7A8296] font-normal">
              · {movie.title}
            </span>
          )}
        </div>

        {/* Fullscreen 3D View Toggle Button */}
        <button
          onClick={() => setIsFullCinemaView(!isFullCinemaView)}
          className="pointer-events-auto w-8 h-8 rounded-full bg-[#0B0D12]/90 backdrop-blur-md border border-white/[0.08] text-[#F0F1F4] flex items-center justify-center hover:bg-[#141822] transition active:scale-95 cursor-pointer"
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

      {/* Bottom Info Drawer */}
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

      {/* Full Cinema Mode Minimal Bottom Strip */}
      {isFullCinemaView && (
        <div className="relative z-20 w-full px-6 pb-6 flex items-center justify-between gap-3 pointer-events-auto">
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
            Book seat ({currency}{seat.price})
          </button>
        </div>
      )}
    </div>
  );
};