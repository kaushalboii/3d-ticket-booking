import React from 'react';
import { Booking } from '../types';
import { CheckCircle2, ArrowLeft, QrCode, Ticket, MapPin, Calendar, Clock } from 'lucide-react';

interface BookingConfirmationProps {
  booking: Booking;
  onDone: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onDone,
}) => {
  return (
    <div className="w-full h-full bg-[#050505] flex flex-col items-center justify-between p-6 select-none overflow-y-auto">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onDone}
          className="w-9 h-9 rounded-full bg-[#111111] border border-[#222222] text-[#F5F5F5] flex items-center justify-center hover:bg-[#1A1A1A] transition active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#CCCCCC]" />
        </button>
        <span className="text-xs font-semibold text-[#888888] uppercase tracking-wider">
          Digital Boarding Pass
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
              Ticket Confirmed
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
              {booking.theatreName}
            </span>
            <h3 className="text-base font-bold text-[#F5F5F5] mt-0.5">
              {booking.movieTitle}
            </h3>
            <p className="text-xs text-[#888888] mt-0.5">
              {booking.hallName} · {booking.showtime}
            </p>
          </div>

          <div className="p-3.5 bg-[#070707] border border-[#1A1A1A] rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#777777] uppercase font-bold block">
                {booking.seats && booking.seats.length > 1
                  ? `Reserved (${booking.seats.length} Seats) · Paid ₹${booking.total}`
                  : `Reserved Seat · Paid ₹${booking.total}`}
              </span>
              <span className="text-sm font-bold text-[#F5F5F5] font-mono">
                {booking.seats && booking.seats.length > 1
                  ? `Seats ${booking.seats.map((s) => s.id).join(', ')}`
                  : `Row ${booking.seat.row}, Seat ${booking.seat.number}`}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#55E6A5]/20 text-[#55E6A5] border border-[#55E6A5]/30 font-bold uppercase text-[10px]">
              {booking.seat.tierLabel}
            </span>
          </div>

          {/* QR Code Graphic for Cinema Turnstile */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl">
            <div className="w-32 h-32 bg-[#050505] p-2 rounded-xl flex items-center justify-center">
              <QrCode className="w-28 h-28 text-white" />
            </div>
            <span className="text-[10px] font-mono text-black font-semibold mt-2 tracking-wider">
              {booking.reference}
            </span>
            <span className="text-[9px] text-[#555555]">
              Scan at Audi 3 entrance turnstile
            </span>
          </div>

          <div className="text-center text-[10px] text-[#666666] space-y-0.5">
            <p>Customer: {booking.customerName} ({booking.customerPhone})</p>
            <p>Doors open 15 minutes prior to showtime</p>
          </div>
        </div>
      </div>

      {/* Done Button */}
      <div className="w-full max-w-xs mt-4">
        <button
          onClick={onDone}
          className="w-full py-3 rounded-full bg-[#55E6A5] text-[#050505] font-bold text-xs tracking-tight shadow-lg shadow-[#55E6A5]/20 active:scale-95 transition cursor-pointer"
        >
          Done & Return to Cinema
        </button>
      </div>
    </div>
  );
};
