import React, { useState } from 'react';
import { Seat, Booking } from '../types';
import { INDIAN_CINEMA_INFO as CINEMA_INFO } from '../data/indianCinemaData';
import { CreditCard, ShieldCheck, X, CheckCircle2, Ticket, Smartphone } from 'lucide-react';

interface CheckoutModalProps {
  seats: Seat[];
  movieTitle?: string;
  movieLanguage?: string;
  hallName?: string;
  showtime?: string;
  onClose: () => void;
  onConfirmBooking: (booking: Booking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  seats,
  movieTitle = CINEMA_INFO.movieTitle,
  movieLanguage = 'Tamil',
  hallName = CINEMA_INFO.hall,
  showtime = CINEMA_INFO.showtime,
  onClose,
  onConfirmBooking,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('kaushal@okaxis');

  const ticketPrice = seats.reduce((sum, s) => sum + s.price, 0);
  const fee = 30 * seats.length;
  const total = ticketPrice + fee;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        reference: `VELS-${Math.floor(100000 + Math.random() * 900000)}`,
        movieTitle,
        language: movieLanguage,
        theatreName: CINEMA_INFO.name,
        hallName,
        date: CINEMA_INFO.date,
        showtime,
        seat: seats[0],
        seats,
        ticketPrice,
        fee,
        total,
        createdAt: new Date().toISOString(),
        customerName: 'Kaushal Maran',
        customerPhone: '+91 98401 23456',
      };
      onConfirmBooking(newBooking);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0b0a]/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-sm bg-[#141311] border border-[#efe9de]/[0.08] rounded-[20px] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#efe9de]/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1e1c19] border border-[#efe9de]/[0.08] flex items-center justify-center text-[#E5A93C]">
              <Ticket className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-[#efe9de] font-semibold text-sm leading-tight">
                Confirm reservation
              </h3>
              <p className="text-[#787268] text-xs mt-0.5 truncate max-w-[200px]">
                {movieTitle} · {showtime}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="w-8 h-8 rounded-lg bg-[#1e1c19] text-[#aaa398] hover:text-[#efe9de] flex items-center justify-center transition-colors duration-150 cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Summary & Payment */}
        <div className="p-5 space-y-4">
          <div className="bg-[#0c0b0a] border border-[#efe9de]/[0.08] rounded-xl p-4 space-y-2.5 tabular-nums">
            <div className="flex justify-between items-start text-xs">
              <span className="text-[#787268]">Selected seats</span>
              <div className="text-right">
                <span className="text-[#efe9de] font-semibold block font-mono">
                  {seats.map((s) => s.id).join(', ')}
                </span>
                <span className="text-[11px] text-[#aaa398]">
                  {seats.length} {seats.length > 1 ? 'tickets' : 'ticket'} · {seats[0].tierLabel}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#787268]">Tickets</span>
              <span className="text-[#efe9de] font-mono">₹{ticketPrice}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#787268]">Convenience fee & GST</span>
              <span className="text-[#efe9de] font-mono">₹{fee}</span>
            </div>

            <div className="pt-2.5 border-t border-[#efe9de]/[0.08] flex justify-between items-center">
              <span className="text-xs font-medium text-[#aaa398]">Total</span>
              <span className="text-[#E5A93C] font-semibold text-base font-mono">
                ₹{total}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#aaa398] block">
              Payment method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`h-10 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'bg-[#262421] border-[#E5A93C]/60 text-[#efe9de]'
                    : 'bg-[#0c0b0a] border-[#efe9de]/[0.08] text-[#787268] hover:text-[#aaa398]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>UPI / GPay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`h-10 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-[#262421] border-[#E5A93C]/60 text-[#efe9de]'
                    : 'bg-[#0c0b0a] border-[#efe9de]/[0.08] text-[#787268] hover:text-[#aaa398]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Cards / RuPay</span>
              </button>
            </div>

            {paymentMethod === 'upi' && (
              <div className="pt-1">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="Enter UPI ID"
                  className="w-full h-10 bg-[#0c0b0a] border border-[#efe9de]/[0.08] px-3.5 rounded-lg text-xs text-[#efe9de] placeholder:text-[#5a554c] focus:outline-none focus:border-[#E5A93C] font-mono"
                />
              </div>
            )}
          </div>

          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full h-11 rounded-xl bg-[#efe9de] hover:bg-white text-[#12110f] font-semibold text-xs transition-colors duration-150 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 tabular-nums"
          >
            {isProcessing ? (
              <span>Reserving seats in {hallName}...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />
                <span>Pay ₹{total} & issue passes</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#787268]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E5A93C]" strokeWidth={1.75} />
            <span>Instant digital ticket and thermal receipt</span>
          </div>
        </div>
      </div>
    </div>
  );
};
