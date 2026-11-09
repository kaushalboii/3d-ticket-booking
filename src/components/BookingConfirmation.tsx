import React, { useState } from 'react';
import { Booking } from '../types';
import { CheckCircle2, Download, ArrowLeft, Eye, Home, Check } from 'lucide-react';

interface BookingConfirmationProps {
  booking: Booking;
  onDone: () => void;
  onView3D?: () => void;
  onHome?: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onDone,
  onView3D,
  onHome,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    try {
      const ticketText = `================================================
CINESCAPE DIGITAL BOARDING PASS
================================================
Reference:   ${booking.reference}
Movie:       ${booking.movieTitle} (${booking.language})
Cinema:      ${booking.theatreName}
Screen:      ${booking.hallName}
Date & Time: ${booking.date} · ${booking.showtime}
Seat:        Row ${booking.seat.row}, Seat ${booking.seat.number} (${booking.seat.tier.toUpperCase()})
Total Paid:  ${booking.currency || '₹'}${booking.total}
Guest:       ${booking.customerName}
================================================
Present this QR pass at the entrance scanner.
================================================`;
      const blob = new Blob([ticketText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CINESCAPE-PASS-${booking.reference}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (_) {}
    setTimeout(() => setDownloaded(false), 3500);
  };

  return (
    <div className="w-full h-full bg-[#0B0D12] flex flex-col items-center justify-between p-6 select-none">
      {/* Top Header */}
      <div className="w-full max-w-xs flex items-center justify-between">
        <button
          onClick={onDone}
          className="w-8 h-8 rounded-full bg-[#141822] border border-white/[0.08] text-[#F0F1F4] flex items-center justify-center hover:bg-[#1C2230] transition active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#A3A9B8]" strokeWidth={1.5} />
        </button>
        <span className="text-xs font-mono text-[#7A8296]">
          Digital pass
        </span>
        <div className="w-8 h-8" />
      </div>

      {/* Main Ticket Card: Physical boarding pass aesthetic */}
      <div className="w-full max-w-xs bg-[#0E1118] border border-white/[0.08] rounded-3xl overflow-hidden my-auto">
        {/* Status Header */}
        <div className="p-4 bg-[#141822] border-b border-white/[0.08] flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#55E6A5]/15 border border-[#55E6A5]/30 flex items-center justify-center text-[#55E6A5]">
            <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="text-xs font-medium text-[#F0F1F4]">
              Reservation confirmed
            </h4>
            <p className="text-[10px] text-[#7A8296] font-mono mt-0.5">
              Ref: {booking.reference}
            </p>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="p-5 space-y-4">
          <div>
            <span className="text-[10px] font-mono text-[#55E6A5] block">
              {booking.theatreName} · {booking.hallName}
            </span>
            <h3 className="text-base font-medium text-[#F0F1F4] mt-1">
              {booking.movieTitle}
            </h3>
            <p className="text-xs text-[#7A8296] mt-0.5 font-mono">
              {booking.date.split(',')[0]} · {booking.showtime}
            </p>
          </div>

          <div className="p-3 bg-[#141822] border border-white/[0.08] rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#7A8296] block font-mono">
                Paid {booking.currency || '₹'}{booking.total}
              </span>
              <span className="text-sm font-medium text-[#F0F1F4] font-mono">
                Row {booking.seat.row}, Seat {booking.seat.number}
              </span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded bg-white/[0.06] text-[#A3A9B8] font-mono text-[10px]">
              {booking.seat.tier.toUpperCase()}
            </span>
          </div>

          {/* Scannable Pass QR Code */}
          <div className="flex flex-col items-center pt-3 border-t border-dashed border-white/[0.1]">
            <div className="p-3 bg-white rounded-xl mb-2">
              <svg width="76" height="76" viewBox="0 0 100 100" className="fill-black">
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
            <span className="text-[10px] text-[#5C6479] font-mono">
              Scan at auditorium entry
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-xs space-y-2">
        <button
          onClick={handleDownload}
          className="w-full py-2.5 rounded-full bg-[#55E6A5] text-[#07130E] font-medium text-xs tracking-tight transition active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
        >
          {downloaded ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Pass saved!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Save pass to device</span>
            </>
          )}
        </button>

        {onView3D && (
          <button
            onClick={onView3D}
            className="w-full py-2.5 rounded-full bg-[#141822] border border-white/[0.08] hover:border-white/[0.16] text-[#D1D5DF] text-xs font-normal transition active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#55E6A5]" strokeWidth={1.5} />
            <span>Inspect 3D sightline again</span>
          </button>
        )}

        <button
          onClick={onHome || onDone}
          className="w-full py-2.5 rounded-full bg-transparent text-[#7A8296] hover:text-[#D1D5DF] text-xs font-normal transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Home className="w-3 h-3" strokeWidth={1.5} />
          <span>Return home</span>
        </button>
      </div>
    </div>
  );
};