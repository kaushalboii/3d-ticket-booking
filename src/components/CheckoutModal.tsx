import React, { useState } from 'react';
import { Seat, Booking } from '../types';
import { INDIAN_CINEMA_INFO as CINEMA_INFO } from '../data/indianCinemaData';
import { CreditCard, ShieldCheck, X, CheckCircle2, Ticket, Smartphone } from 'lucide-react';

interface CheckoutModalProps {
  seats: Seat[];
  onClose: () => void;
  onConfirmBooking: (booking: Booking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  seats,
  onClose,
  onConfirmBooking,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('kaushal@okaxis');

  const ticketPrice = seats.reduce((sum, s) => sum + s.price, 0);
  const fee = 30 * seats.length; // ₹30 GST & booking fee per ticket
  const total = ticketPrice + fee;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        reference: `VELS-${Math.floor(100000 + Math.random() * 900000)}`,
        movieTitle: CINEMA_INFO.movieTitle,
        language: 'Tamil',
        theatreName: CINEMA_INFO.name,
        hallName: CINEMA_INFO.hall,
        date: CINEMA_INFO.date,
        showtime: CINEMA_INFO.showtime,
        seat: seats[0],
        seats: seats,
        ticketPrice,
        fee,
        total,
        createdAt: new Date().toISOString(),
        customerName: 'Kaushal Maran',
        customerPhone: '+91 98401 23456',
      };
      onConfirmBooking(newBooking);
    }, 900);
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
                Confirm Reservation
              </h3>
              <p className="text-[#888888] text-[11px]">
                {CINEMA_INFO.shortName} · {CINEMA_INFO.movieTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#1A1A1A] text-[#888888] hover:text-[#F5F5F5] flex items-center justify-center cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Booking Summary */}
        <div className="p-5 space-y-4">
          <div className="bg-[#090909] border border-[#1A1A1A] rounded-2xl p-3.5 space-y-2">
            <div className="flex justify-between items-start text-xs">
              <span className="text-[#888888]">Selected Seats</span>
              <div className="text-right">
                <span className="text-white font-bold block">
                  {seats.map((s) => s.id).join(', ')}
                </span>
                <span className="text-[10px] text-[#71717A]">
                  {seats.length} {seats.length > 1 ? 'Tickets' : 'Ticket'} ({seats[0].tierLabel})
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#888888]">Ticket Total</span>
              <span className="text-white font-mono">₹{ticketPrice}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#888888]">Convenience Fee & GST</span>
              <span className="text-white font-mono">₹{fee}</span>
            </div>

            <div className="pt-2 border-t border-[#1C1C1C] flex justify-between items-center">
              <span className="text-xs font-semibold text-[#888888]">Total Amount</span>
              <span className="text-[#55E6A5] font-bold text-base font-mono">
                ₹{total}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#777777] block">
              Payment Method (India)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'bg-[#181818] border-[#55E6A5] text-[#55E6A5]'
                    : 'bg-[#0E0E0E] border-[#222222] text-[#888888]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>UPI / GPay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-[#181818] border-[#55E6A5] text-[#55E6A5]'
                    : 'bg-[#0E0E0E] border-[#222222] text-[#888888]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Cards / RuPay</span>
              </button>
            </div>

            {paymentMethod === 'upi' && (
              <div className="pt-1">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="Enter UPI ID (e.g. mobile@upi)"
                  className="w-full bg-[#080808] border border-[#222222] px-3.5 py-2 rounded-xl text-xs text-white placeholder:text-[#555555] focus:outline-none focus:border-[#55E6A5] font-mono"
                />
              </div>
            )}
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-3 rounded-full bg-[#55E6A5] hover:brightness-105 text-[#050505] font-bold text-xs tracking-tight transition active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#55E6A5]/25 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Securing Reservation in Audi 3...</span>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Pay ₹{total} & Get Passes</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#666666]">
            <ShieldCheck className="w-3 h-3 text-[#55E6A5]" />
            <span>Instant booking confirmation with scannable QR ticket</span>
          </div>
        </div>
      </div>
    </div>
  );
};
