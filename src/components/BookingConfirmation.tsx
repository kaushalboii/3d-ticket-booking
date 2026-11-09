import React from 'react';
import { Booking } from '../types';
import { CheckCircle2, Download, ArrowLeft } from 'lucide-react';

interface BookingConfirmationProps {
  booking: Booking;
  onDone: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onDone,
}) => {
  return (
    <div className="w-full h-full bg-[#050505] flex flex-col items-center justify-between p-6 select-none animate-fade-in">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onDone}
          className="w-9 h-9 rounded-full bg-[#111111] border border-[#222222] text-[#F5F5F5] flex items-center justify-center hover:bg-[#1A1A1A] transition active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-[#CCCCCC]" />
        </button>
        <span className="text-xs font-semibold text-[#888888] uppercase tracking-wider">
          Digital Pass
        </span>
        <div className="w-9 h-9" />
      </div>

      {/* Main Ticket Card */}
      <div className="w-full max-w-xs bg-[#111111] border border-[#222222] rounded-3xl overflow-hidden shadow-2xl my-auto">
        {/* Success Banner */}
        <div className="p-4 bg-[#090909] border-b border-[#1A1A1A] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#55E6A5]/15 border border-[#55E6A5]/30 flex items-center justify-center text-[#55E6A5]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#F5F5F5]">
              Booking Confirmed
            </h4>
            <p className="text-[10px] text-[#888888] font-mono mt-0.5">
              Ref: {booking.reference}
            </p>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="p-5 space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#55E6A5] tracking-wider block">
              Meridian · {booking.hallName}
            </span>
            <h3 className="text-base font-bold text-[#F5F5F5] mt-0.5">
              {booking.movieTitle}
            </h3>
            <p className="text-xs text-[#888888] mt-0.5">
              {booking.date} · {booking.showtime}
            </p>
          </div>

          <div className="p-3 bg-[#070707] border border-[#1A1A1A] rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#777777] uppercase font-bold block">
                Seat Reserved · Paid ₹{booking.total}
              </span>
              <span className="text-sm font-bold text-[#F5F5F5] font-mono">
                Row {booking.seat.row}, Seat {booking.seat.number}
              </span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#55E6A5]/20 text-[#55E6A5] border border-[#55E6A5]/30 font-bold uppercase text-[10px]">
              {booking.seat.tier}
            </span>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center pt-2 border-t border-dashed border-[#222222]">
            <div className="p-2.5 bg-white rounded-2xl shadow-md mb-2">
              <svg width="80" height="80" viewBox="0 0 100 100" className="fill-black">
                <rect x="5" y="5" width="28" height="28" fill="black" />
                <rect x="9" y="9" width="20" height="20" fill="white" />
                <rect x="13" y="13" width="12" height="12" fill="black" />
                <rect x="67" y="5" width="28" height="28" fill="black" />
                <rect x="71" y="9" width="20" height="20" fill="white" />
                <rect x="75" y="13" width="12" height="12" fill="black" />
                <rect x="5" y="67" width="28" height="28" fill="black" />
                <rect x="9" y="71" width="20" height="20" fill="white" />
                <rect x="13" y="75" width="12" height="12" fill="black" />
                <rect x="40" y="12" width="10" height="10" />
                <rect x="55" y="12" width="6" height="10" />
                <rect x="40" y="38" width="15" height="10" />
                <rect x="15" y="45" width="10" height="12" />
                <rect x="70" y="45" width="15" height="10" />
                <rect x="42" y="62" width="12" height="15" />
                <rect x="65" y="70" width="20" height="15" />
              </svg>
            </div>
            <span className="text-[9px] uppercase tracking-wider text-[#777777] font-mono">
              Scan at Hall 3 Entrance
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="w-full max-w-xs space-y-2">
        <button
          onClick={() => alert(`Saved Pass ${booking.reference} to Apple / Google Wallet!`)}
          className="w-full py-3 rounded-full bg-white text-[#0A0A0A] font-bold text-xs tracking-tight transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-white/10"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Save to Apple / Google Wallet</span>
        </button>

        <button
          onClick={onDone}
          className="w-full py-3 rounded-full bg-[#161616] border border-[#262626] text-[#929292] hover:text-[#F5F5F5] text-xs font-semibold transition active:scale-95 cursor-pointer"
        >
          Back to Seat Map
        </button>
      </div>
    </div>
  );
};
