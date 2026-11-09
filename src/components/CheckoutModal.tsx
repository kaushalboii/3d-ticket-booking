import React, { useState, useEffect } from 'react';
import { Seat, Movie, Showtime, Booking } from '../types';
import { CONCESSIONS } from '../data/mockData';
import {
  CreditCard,
  Clock,
  ShieldCheck,
  X,
  Plus,
  Minus,
  Tag,
  CheckCircle,
  Ticket
} from 'lucide-react';

interface CheckoutModalProps {
  movie: Movie;
  showtime: Showtime;
  seats: Seat[];
  onClose: () => void;
  onBookingComplete: (booking: Booking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  movie,
  showtime,
  seats,
  onClose,
  onBookingComplete
}) => {
  const [timeLeft, setTimeLeft] = useState(480);
  const [concessionCart, setConcessionCart] = useState<Record<string, number>>({
    c1: 1
  });

  const [promoCode, setPromoCode] = useState('CINESCAPE20');
  const [promoApplied, setPromoApplied] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [name, setName] = useState('Alex Mercer');
  const [email, setEmail] = useState('alex.mercer@cinema.com');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleUpdateQty = (itemId: string, delta: number) => {
    setConcessionCart((prev) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const ticketsSubtotal = seats.reduce((sum, s) => sum + s.price, 0);

  const concessionsSubtotal = Object.entries(concessionCart).reduce((sum, [id, qty]) => {
    const item = CONCESSIONS.find((c) => c.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const rawSubtotal = ticketsSubtotal + concessionsSubtotal;
  const discountAmount = promoApplied ? rawSubtotal * 0.2 : 0;
  const bookingFee = 1.95;
  const grandTotal = Math.max(0, rawSubtotal - discountAmount + bookingFee);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'CINESCAPE20') {
      setPromoApplied(true);
    } else {
      alert('Invalid code. Use CINESCAPE20 for 20% off.');
    }
  };

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      const bookingRef = `CSC-${Math.floor(100000 + Math.random() * 900000)}`;
      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        bookingRef,
        movieId: movie.id,
        movieTitle: movie.title,
        posterUrl: movie.posterUrl,
        theatreName: showtime.theatreName,
        auditoriumName: showtime.auditoriumName,
        format: showtime.format,
        date: showtime.date,
        time: showtime.time,
        seats,
        concessions: Object.entries(concessionCart).map(([id, qty]) => ({
          item: CONCESSIONS.find((c) => c.id === id)!,
          quantity: qty
        })).filter(entry => entry.item),
        subtotal: rawSubtotal,
        discount: discountAmount,
        bookingFee,
        totalAmount: grandTotal,
        qrPayload: `CINESCAPE|${bookingRef}|${movie.title}|${seats.map(s => s.id).join(',')}|${grandTotal.toFixed(2)}`,
        createdAt: new Date().toISOString(),
        customerName: name,
        customerEmail: email
      };

      onBookingComplete(newBooking);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="w-full max-w-2xl bg-[#111215] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] my-auto">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#141519] border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Ticket className="w-4 h-4 text-zinc-400" />
            <div>
              <h3 className="text-zinc-100 font-medium text-sm">
                Reservation checkout
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#18191e] border border-white/[0.06] text-zinc-400 font-mono text-[11px]">
              <Clock className="w-3 h-3 text-amber-400/80" />
              <span>Hold: {formatTimer(timeLeft)}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Movie Summary */}
          <div className="bg-[#16171b] border border-white/[0.06] rounded-lg p-3.5 flex flex-col sm:flex-row gap-3.5 items-start sm:items-center justify-between">
            <div className="flex gap-3 items-center">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-12 h-16 object-cover rounded-md border border-white/[0.06]"
              />
              <div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.06] text-zinc-300 font-mono">
                  {showtime.format}
                </span>
                <h4 className="text-white font-medium text-sm mt-1">{movie.title}</h4>
                <p className="text-[11px] text-zinc-500 font-mono">
                  {showtime.theatreName} • {showtime.auditoriumName}
                </p>
                <p className="text-[11px] text-zinc-400 font-mono">
                  {showtime.date} at {showtime.time}
                </p>
              </div>
            </div>

            <div className="sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-white/[0.04]">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                Reserved seats ({seats.length})
              </span>
              <div className="flex flex-wrap sm:justify-end gap-1 mt-1">
                {seats.map((s) => (
                  <span
                    key={s.id}
                    className="px-1.5 py-0.5 rounded bg-white/[0.08] text-zinc-200 font-mono text-[11px]"
                  >
                    {s.row}-{s.number}
                  </span>
                ))}
              </div>
              <span className="text-xs font-mono text-zinc-400 block mt-1 tabular-nums">
                ${ticketsSubtotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Concessions */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-medium text-zinc-300">
                Concessions & refreshments
              </h5>
              <span className="text-[11px] text-zinc-500 font-mono">Optional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CONCESSIONS.slice(0, 4).map((item) => {
                const qty = concessionCart[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="bg-[#16171b] border border-white/[0.04] rounded-lg p-2.5 flex gap-2.5 items-center justify-between"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0 pr-1">
                      <h6 className="text-xs font-medium text-zinc-200 truncate">{item.name}</h6>
                      <span className="text-[11px] font-mono text-zinc-400 block mt-0.5 tabular-nums">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#121316] border border-white/[0.06] rounded-md px-1.5 py-0.5">
                      <button
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="text-zinc-500 hover:text-white p-0.5"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono text-white w-3.5 text-center tabular-nums">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="text-zinc-400 hover:text-white p-0.5"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2">
            <h5 className="text-xs font-medium text-zinc-300">Delivery details</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-mono text-zinc-500 block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#16171b] border border-white/[0.08] px-3 py-1.5 rounded-lg text-xs text-white focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-zinc-500 block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#16171b] border border-white/[0.08] px-3 py-1.5 rounded-lg text-xs text-white focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Promo */}
          <div className="bg-[#16171b] border border-white/[0.06] rounded-lg p-3.5 space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3 h-3 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code"
                  className="w-full bg-[#121316] border border-white/[0.06] pl-8 pr-3 py-1.5 rounded-md text-xs text-white uppercase font-mono focus:outline-none focus:border-white/20"
                />
              </div>
              <button
                onClick={handleApplyPromo}
                className="px-3 py-1.5 rounded-md bg-[#1f2026] text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#272830] transition-colors"
              >
                Apply
              </button>
            </div>

            {promoApplied && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-mono">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Promo code applied (-20%)</span>
              </div>
            )}

            <div className="border-t border-white/[0.06] pt-2.5 space-y-1 text-xs font-mono">
              <div className="flex justify-between text-zinc-500">
                <span>Tickets ({seats.length})</span>
                <span className="text-zinc-300 tabular-nums">${ticketsSubtotal.toFixed(2)}</span>
              </div>
              {concessionsSubtotal > 0 && (
                <div className="flex justify-between text-zinc-500">
                  <span>Concessions</span>
                  <span className="text-zinc-300 tabular-nums">${concessionsSubtotal.toFixed(2)}</span>
                </div>
              )}
              {promoApplied && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span className="tabular-nums">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-500">
                <span>Facility fee</span>
                <span className="text-zinc-300 tabular-nums">${bookingFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-white/[0.06] pt-2 flex justify-between text-sm font-medium text-white">
                <span>Total</span>
                <span className="tabular-nums">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Payment Action */}
        <div className="p-4 bg-[#141519] border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span>Encrypted ticket checkout</span>
          </div>

          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full sm:w-auto h-9 px-5 rounded-lg bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>Confirming seats...</span>
            ) : (
              <>
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pay ${grandTotal.toFixed(2)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
