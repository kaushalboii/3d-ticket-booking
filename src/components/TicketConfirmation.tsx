import React from 'react';
import { Booking } from '../types';
import {
  CheckCircle,
  Download,
  ArrowRight
} from 'lucide-react';

interface TicketConfirmationProps {
  booking: Booking;
  onDone: () => void;
}

export const TicketConfirmation: React.FC<TicketConfirmationProps> = ({
  booking,
  onDone
}) => {
  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#f3f4f6] flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-md w-full space-y-6">
        {/* Status */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-zinc-200 mb-1">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>

          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 block">
            Confirmed reservation
          </span>
          <h2 className="text-2xl font-medium tracking-tight text-white font-cinzel">
            Your admission pass
          </h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Digital pass sent to{' '}
            <span className="text-zinc-200">{booking.customerEmail}</span>
          </p>
        </div>

        {/* Boarding Pass Cinema Ticket */}
        <div className="bg-[#121317] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl text-left">
          {/* Movie Banner */}
          <div className="relative h-36 w-full overflow-hidden bg-[#0c0d10]">
            <img
              src={booking.posterUrl}
              alt={booking.movieTitle}
              className="w-full h-full object-cover object-center opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121317] via-[#121317]/50 to-transparent" />

            <div className="absolute bottom-3 left-4 right-4">
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.1] text-zinc-200">
                {booking.format}
              </span>
              <h3 className="text-base font-medium text-white mt-1">
                {booking.movieTitle}
              </h3>
              <p className="text-[11px] font-mono text-zinc-400">
                {booking.theatreName}
              </p>
            </div>
          </div>

          {/* Ticket Metadata */}
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase text-zinc-500 block">
                  Auditorium
                </span>
                <span className="font-medium text-zinc-200 mt-0.5 block truncate">
                  {booking.auditoriumName}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-500 block">
                  Date
                </span>
                <span className="font-medium text-zinc-200 mt-0.5 block">
                  {booking.date}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-500 block">
                  Time
                </span>
                <span className="font-medium text-zinc-200 mt-0.5 block tabular-nums">
                  {booking.time}
                </span>
              </div>
            </div>

            {/* Reserved Seats List */}
            <div className="border-t border-dashed border-white/[0.08] pt-3">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-1.5">
                Reserved seats ({booking.seats.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {booking.seats.map((seat) => (
                  <div
                    key={seat.id}
                    className="px-2 py-1 bg-[#18191e] border border-white/[0.06] rounded-md flex items-center gap-1.5"
                  >
                    <span className="text-xs font-mono font-medium text-zinc-200">
                      Row {seat.row}-{seat.number}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      {seat.tier.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Concessions Summary */}
            {booking.concessions.length > 0 && (
              <div className="border-t border-dashed border-white/[0.08] pt-3">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">
                  Concessions pickup
                </span>
                <div className="text-xs font-mono text-zinc-400 space-y-0.5">
                  {booking.concessions.map(({ item, quantity }) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{quantity}× {item.name}</span>
                      <span className="text-zinc-500 tabular-nums">${(item.price * quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* QR Code and Reference */}
            <div className="border-t border-white/[0.08] pt-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">
                  Reference code
                </span>
                <span className="text-sm font-mono font-medium text-white tracking-wider block">
                  {booking.bookingRef}
                </span>
                <span className="text-[11px] font-mono text-zinc-500 mt-0.5 block">
                  Guest: {booking.customerName}
                </span>
                <span className="text-[11px] font-mono text-zinc-400 mt-0.5 block tabular-nums">
                  Paid ${booking.totalAmount.toFixed(2)}
                </span>
              </div>

              {/* Minimal QR Element */}
              <div className="p-2 bg-white rounded-lg flex flex-col items-center">
                <svg width="64" height="64" viewBox="0 0 100 100" className="fill-black">
                  <rect x="5" y="5" width="28" height="28" fill="black" />
                  <rect x="9" y="9" width="20" height="20" fill="white" />
                  <rect x="13" y="13" width="12" height="12" fill="black" />

                  <rect x="67" y="5" width="28" height="28" fill="black" />
                  <rect x="71" y="9" width="20" height="20" fill="white" />
                  <rect x="75" y="13" width="12" height="12" fill="black" />

                  <rect x="5" y="67" width="28" height="28" fill="black" />
                  <rect x="9" y="71" width="20" height="20" fill="white" />
                  <rect x="13" y="75" width="12" height="12" fill="black" />

                  <rect x="40" y="8" width="8" height="8" />
                  <rect x="52" y="15" width="8" height="8" />
                  <rect x="40" y="28" width="16" height="8" />
                  <rect x="10" y="42" width="12" height="8" />
                  <rect x="30" y="42" width="18" height="8" />
                  <rect x="54" y="42" width="12" height="8" />
                  <rect x="74" y="42" width="16" height="8" />
                  <rect x="42" y="60" width="8" height="18" />
                  <rect x="58" y="60" width="12" height="8" />
                  <rect x="58" y="76" width="16" height="14" />
                  <rect x="78" y="64" width="12" height="8" />
                </svg>
                <span className="text-[8px] font-mono text-zinc-900 mt-0.5">
                  ENTRY PASS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={onDone}
            className="w-full sm:flex-1 h-9 rounded-lg bg-[#141519] border border-white/[0.08] hover:border-white/20 text-zinc-300 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Return to movies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => alert(`Saved Pass ${booking.bookingRef} to digital wallet!`)}
            className="w-full sm:flex-1 h-9 rounded-lg bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
