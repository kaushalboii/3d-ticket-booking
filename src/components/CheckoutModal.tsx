import React, { useState } from 'react';
import { Seat, Booking, Movie, Showtime, UserProfile, Theatre } from '../types';
import { VELS_CINEMA_INFO as CINEMA_INFO } from '../data/velsData';
import { CreditCard, X, Ticket } from 'lucide-react';

interface CheckoutModalProps {
  seat: Seat;
  movie?: Movie;
  showtime?: Showtime;
  theatre?: Theatre;
  selectedDate?: string;
  currentUser?: UserProfile | null;
  onClose: () => void;
  onConfirmBooking: (booking: Booking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  seat,
  movie,
  showtime,
  theatre,
  selectedDate,
  currentUser,
  onClose,
  onConfirmBooking,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');

  const currency = theatre?.currency || '₹';
  const isIndia = currency === '₹';
  const fee = isIndia ? 30 : currency === '$' ? 3.50 : 2.50;
  const total = Number((seat.price + fee).toFixed(2));

  const movieTitle = movie ? movie.title : CINEMA_INFO.movieTitle;
  const movieLang = movie ? movie.language : 'Tamil';
  const theatreName = theatre ? theatre.name : CINEMA_INFO.name;
  const hallName = theatre ? theatre.hall : CINEMA_INFO.hall;
  const showtimeStr = showtime ? showtime.time : CINEMA_INFO.showtime;
  const showtimeFormat = showtime ? showtime.format : (theatre?.format || CINEMA_INFO.movieFormat);
  const bookingDate = selectedDate || CINEMA_INFO.date;
  const customerName = currentUser?.name || 'Kaushal Maran';
  const customerPhone = currentUser?.phone || '+91 98401 23456';

  const brandCode = theatre?.name ? theatre.name.replace(/[^A-Za-z]/g, '').substring(0, 4).toUpperCase() : 'CINE';

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        reference: `${brandCode}-${Math.floor(100000 + Math.random() * 900000)}`,
        movieTitle,
        language: movieLang,
        theatreName,
        hallName,
        date: bookingDate,
        showtime: showtimeStr,
        seat,
        ticketPrice: seat.price,
        fee,
        total,
        currency,
        createdAt: new Date().toISOString(),
        customerName,
        customerPhone,
      };
      onConfirmBooking(newBooking);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-sm bg-[#0E1118] border border-white/[0.08] rounded-3xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#141822] border border-white/[0.08] flex items-center justify-center text-[#55E6A5]">
              <Ticket className="w-3.5 h-3.5" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-[#F0F1F4] font-medium text-sm">
                Reserve ticket
              </h3>
              <p className="text-[#7A8296] text-[11px] truncate max-w-[220px]">
                {theatreName} · {hallName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#141822] text-[#7A8296] hover:text-[#F0F1F4] flex items-center justify-center cursor-pointer"
          >
            <X className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Movie Details Summary */}
          <div className="bg-[#141822] border border-white/[0.08] rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#55E6A5]">
                {showtimeFormat}
              </span>
              <span className="text-xs text-[#7A8296] font-mono">
                {bookingDate.split(',')[0]} · {showtimeStr}
              </span>
            </div>
            <h4 className="text-[#F0F1F4] font-medium text-sm">
              {movieTitle} <span className="text-[#7A8296] font-normal">({movieLang})</span>
            </h4>
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-[#7A8296]">Seat reservation:</span>
              <span className="text-[#55E6A5] font-mono font-medium">
                Row {seat.row}, Seat {seat.number} ({seat.tier.toUpperCase()})
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setPaymentMethod('upi')}
              className={`py-2.5 rounded-xl border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                paymentMethod === 'upi'
                  ? 'bg-[#1C2230] text-[#F0F1F4] border-white/[0.2] font-medium'
                  : 'bg-[#141822] text-[#7A8296] border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              <span>{isIndia ? 'UPI / GPay' : 'Apple Pay / GPay'}</span>
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`py-2.5 rounded-xl border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                paymentMethod === 'card'
                  ? 'bg-[#1C2230] text-[#F0F1F4] border-white/[0.2] font-medium'
                  : 'bg-[#141822] text-[#7A8296] border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Credit Card</span>
            </button>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-1.5 text-xs text-[#7A8296] pt-1 font-mono">
            <div className="flex justify-between">
              <span>Ticket price</span>
              <span className="text-[#D1D5DF]">{currency}{seat.price}</span>
            </div>
            <div className="flex justify-between">
              <span>Convenience & 3D fee</span>
              <span className="text-[#D1D5DF]">{currency}{fee}</span>
            </div>
            <div className="pt-2 border-t border-white/[0.06] flex justify-between text-sm font-medium text-[#F0F1F4]">
              <span>Total payable</span>
              <span className="text-[#55E6A5]">{currency}{total}</span>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-[#0A0C11] border-t border-white/[0.08]">
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-2.5 rounded-full bg-[#55E6A5] text-[#07130E] font-medium text-xs tracking-tight transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
          >
            {isProcessing ? (
              <span>Confirming reservation...</span>
            ) : (
              <span>Pay {currency}{total} & receive pass</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};