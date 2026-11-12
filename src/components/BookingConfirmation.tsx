import React, { useState } from 'react';
import { Booking } from '../types';
import { CheckCircle2, ArrowLeft, QrCode, Ticket as TicketIcon, Printer } from 'lucide-react';
import { PaymentReceipt } from './PaymentReceipt';
import { CinemaTicket } from './CinemaTicket';

interface BookingConfirmationProps {
  booking: Booking;
  onDone: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onDone,
}) => {
  const [activeTab, setActiveTab] = useState<'ticket3d' | 'printer' | 'digital'>('ticket3d');

  return (
    <div className="w-full h-full bg-[#0c0b0a] flex flex-col items-center justify-between p-4 sm:p-6 select-none overflow-y-auto">
      {/* Symmetrical Top Header & Pass Switcher */}
      <div className="w-full max-w-lg grid grid-cols-[1fr_auto_1fr] items-center gap-3 mb-4">
        <div className="justify-self-start">
          <button
            onClick={onDone}
            className="w-9 h-9 rounded-full bg-[#141311] border border-[#efe9de]/[0.08] text-[#efe9de] flex items-center justify-center hover:bg-[#1e1c19] transition-colors duration-150 active:scale-[0.97] cursor-pointer"
            title="Return to Cinema"
            aria-label="Return to Cinema"
          >
            <ArrowLeft className="w-4 h-4 text-[#cfc8bc]" strokeWidth={1.75} />
          </button>
        </div>

        <div className="justify-self-center flex items-center gap-1 bg-[#141311] border border-[#efe9de]/[0.08] p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('ticket3d')}
            className={`flex items-center gap-1.5 h-7 px-3 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer ${
              activeTab === 'ticket3d'
                ? 'bg-[#262421] text-[#efe9de]'
                : 'text-[#787268] hover:text-[#aaa398]'
            }`}
          >
            <TicketIcon className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>3D Ticket</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('printer')}
            className={`flex items-center gap-1.5 h-7 px-3 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer ${
              activeTab === 'printer'
                ? 'bg-[#262421] text-[#efe9de]'
                : 'text-[#787268] hover:text-[#aaa398]'
            }`}
          >
            <Printer className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Receipt</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('digital')}
            className={`flex items-center gap-1.5 h-7 px-3 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer ${
              activeTab === 'digital'
                ? 'bg-[#262421] text-[#efe9de]'
                : 'text-[#787268] hover:text-[#aaa398]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>QR Pass</span>
          </button>
        </div>

        <div className="w-9 h-9" />
      </div>

      {/* View 1: Interactive 3D Perforated Ticket */}
      {activeTab === 'ticket3d' && (
        <div className="w-full flex-1 flex flex-col items-center justify-center my-auto py-2">
          <CinemaTicket booking={booking} />
        </div>
      )}

      {/* View 2: Thermal POS Receipt Printer */}
      {activeTab === 'printer' && (
        <div className="w-full flex-1 flex flex-col items-center justify-center my-auto py-2">
          <PaymentReceipt booking={booking} onDone={onDone} />
        </div>
      )}

      {/* View 3: Digital Turnstile QR Pass */}
      {activeTab === 'digital' && (
        <div className="w-full max-w-xs bg-[#141311] border border-[#efe9de]/[0.08] rounded-[20px] overflow-hidden shadow-2xl my-auto">
          <div className="p-4 bg-[#181614] border-b border-[#efe9de]/[0.08] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
              <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#efe9de]">
                Ticket confirmed
              </h4>
              <p className="text-[11px] text-[#787268] font-mono mt-0.5 tabular-nums">
                Ref {booking.reference}
              </p>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <span className="text-[11px] font-medium text-[#E5A93C] block">
                {booking.theatreName}
              </span>
              <h3 className="text-base font-semibold text-[#efe9de] mt-0.5">
                {booking.movieTitle}
              </h3>
              <p className="text-xs text-[#aaa398] mt-0.5 tabular-nums">
                {booking.hallName} · {booking.showtime}
              </p>
            </div>

            <div className="p-3.5 bg-[#0c0b0a] border border-[#efe9de]/[0.08] rounded-xl flex items-center justify-between gap-2">
              <div className="tabular-nums">
                <span className="text-[11px] text-[#787268] block">
                  {booking.seats && booking.seats.length > 1
                    ? `${booking.seats.length} seats · ₹${booking.total}`
                    : `Reserved · ₹${booking.total}`}
                </span>
                <span className="text-sm font-semibold text-[#efe9de] font-mono">
                  {booking.seats && booking.seats.length > 1
                    ? booking.seats.map((s) => s.id).join(', ')
                    : `Row ${booking.seat.row}, Seat ${booking.seat.number}`}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-[#E5A93C]/15 text-[#E5A93C] border border-[#E5A93C]/25 font-medium text-[11px]">
                {booking.seat.tierLabel}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-[#efe9de] rounded-xl">
              <div className="w-32 h-32 bg-[#0c0b0a] p-2 rounded-lg flex items-center justify-center">
                <QrCode className="w-28 h-28 text-[#efe9de]" strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-mono text-[#12110f] font-semibold mt-2 tracking-wider">
                {booking.reference}
              </span>
              <span className="text-[10px] text-[#5a554c]">
                Scan at Audi 3 turnstile
              </span>
            </div>

            <div className="text-center text-[11px] text-[#787268] space-y-0.5">
              <p>{booking.customerName} · {booking.customerPhone}</p>
              <p>Doors open 15 minutes before showtime</p>
            </div>
          </div>
        </div>
      )}

      {/* Primary Action */}
      <div className="w-full max-w-xs mt-4">
        <button
          onClick={onDone}
          className="w-full h-11 rounded-xl bg-[#efe9de] hover:bg-white text-[#12110f] font-semibold text-xs active:scale-[0.98] transition-colors duration-150 cursor-pointer"
        >
          Done & return to seats
        </button>
      </div>
    </div>
  );
};
