import React, { useState } from 'react';
import { Seat, Booking, Movie, Showtime, UserProfile } from '../types';
import { VELS_CINEMA_INFO as CINEMA_INFO } from '../data/velsData';
import { CreditCard, ShieldCheck, X, CheckCircle2, Ticket, QrCode } from 'lucide-react';

interface CheckoutModalProps {
  seat: Seat;
  movie?: Movie;
  showtime?: Showtime;
  currentUser?: UserProfile | null;
  onClose: () => void;
  onConfirmBooking: (booking: Booking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  seat,
  movie,
  showtime,
  currentUser,
  onClose,
  onConfirmBooking,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');

  const fee = 30; // ₹30 convenience & 3D projection fee
  const total = seat.price + fee;

  const movieTitle = movie ? movie.title : CINEMA_INFO.movieTitle;
  const movieLang = movie ? movie.language : 'Tamil';
  const showtimeStr = showtime ? showtime.time : CINEMA_INFO.showtime;
  const showtimeFormat = showtime ? showtime.format : CINEMA_INFO.movieFormat;
  const customerName = currentUser?.name || 'Kaushal Maran';
  const customerPhone = currentUser?.phone || '+91 98401 23456';

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        reference: `VELS-${Math.floor(100000 + Math.random() * 900000)}`,
        movieTitle,
        language: movieLang,
        theatreName: CINEMA_INFO.name,
        hallName: CINEMA_INFO.hall,
        date: CINEMA_INFO.date,
        showtime: showtimeStr,
        seat,
        ticketPrice: seat.price,
        fee,
        total,
        createdAt: new Date().toISOString(),
        customerName,
        customerPhone,
      };
      onConfirmBooking(newBooking);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-sm bg-[#111111] border border-[#222222] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1C1C1C] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-[#55E6A5]">
              <Ticket className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-[#F5F5F5] font-semibold text-sm">
                Confirm Booking
              </h3>
              <p className="text-[#888888] text-[11px]">
                {CINEMA_INFO.name} · {CINEMA_INFO.hall}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#1A1A1A] text-[#888888] hover:text-[#F5F5F5] flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Movie Details Summary */}
          <div className="bg-[#090909] border border-[#1A1A1A] rounded-2xl p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#55E6A5]">
                {showtimeFormat}
              </span>
              <span className="text-xs text-[#888888] font-mono">
                {CINEMA_INFO.date} · {showtimeStr}
              </span>
            </div>
            <h4 className="text-[#F5F5F5] font-bold text-sm">
              {movieTitle} <span className="text-[#888888] font-normal">({movieLang})</span>
            </h4>
            <div className="pt-2 border-t border-[#161616] flex items-center justify-between text-xs">
              <span className="text-[#888888]">Selected Seat:</span>
              <span className="text-[#55E6A5] font-bold font-mono">
                Row {seat.row}, Seat {seat.number} ({seat.tier === 'economy' ? 'Economy' : 'Elite'})
              </span>
            </div>
          </div>

          {/* Payment Method Selector (Indian UPI & Cards) */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setPaymentMethod('upi')}
              className={`py-2.5 rounded-xl border font-medium transition flex items-center justify-center gap-1.5 ${
                paymentMethod === 'upi'
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-[#0E0E0E] text-[#888888] border-[#222222]'
              }`}
            >
              <span>UPI / GPay / PhonePe</span>
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`py-2.5 rounded-xl border font-medium transition flex items-center justify-center gap-1.5 ${
                paymentMethod === 'card'
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-[#0E0E0E] text-[#888888] border-[#222222]'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Card / NetBanking</span>
            </button>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-1.5 text-xs text-[#888888] pt-1">
            <div className="flex justify-between">
              <span>Ticket Price</span>
              <span className="text-[#F5F5F5] font-mono">₹{seat.price}</span>
            </div>
            <div className="flex justify-between">
              <span>Convenience & 3D Laser Fee</span>
              <span className="text-[#F5F5F5] font-mono">₹{fee}</span>
            </div>
            <div className="pt-2 border-t border-[#1C1C1C] flex justify-between text-sm font-bold text-[#F5F5F5]">
              <span>Total Payable</span>
              <span className="text-[#55E6A5] font-mono">₹{total}</span>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-[#0B0B0B] border-t border-[#1C1C1C]">
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-3 rounded-full bg-white hover:bg-[#EFEFEF] text-[#0A0A0A] font-bold text-xs tracking-tight transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/10"
          >
            {isProcessing ? (
              <span>Authorizing UPI Payment...</span>
            ) : (
              <span>Pay ₹{total} & Instant Reserve</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
