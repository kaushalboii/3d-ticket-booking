"use client";

import React, { useState, useEffect } from "react";
import {
  HouseIcon,
  ArrowCounterClockwiseIcon,
  PrinterIcon,
} from "@phosphor-icons/react";
import {
  ReceiptPrinter,
  type ReceiptPrinterStage,
  type ReceiptFeedMotion,
} from "@/components/ReceiptPrinter";
import { TactileButton } from "@/components/TactileButton";
import { Booking } from "@/types";
import { INDIAN_CINEMA_INFO } from "@/data/indianCinemaData";
import { playPrinterStepSound, playSuccessChime } from "@/helpers/audio-helper";

export interface PaymentReceiptProps {
  booking?: Booking;
  onDone?: () => void;
  defaultStage?: ReceiptPrinterStage;
  autoAdvance?: boolean;
}

// Fallback demo booking if none provided
const DEFAULT_DEMO_BOOKING: Booking = {
  id: "bk-demo",
  reference: "VELS-892401",
  movieTitle: INDIAN_CINEMA_INFO.movieTitle,
  language: "Tamil",
  theatreName: INDIAN_CINEMA_INFO.name,
  hallName: INDIAN_CINEMA_INFO.hall,
  date: INDIAN_CINEMA_INFO.date,
  showtime: INDIAN_CINEMA_INFO.showtime,
  seat: {
    id: "F8",
    row: "F",
    number: 8,
    tier: "recliner",
    tierLabel: "Recliner",
    price: 250,
    status: "occupied",
    x: 0,
    y: 0.8,
    z: 14,
    metrics: {
      distanceMeters: 14.5,
      fovDegrees: 62,
      offsetMeters: 0,
      offsetDirection: "dead centre",
      category: "SWEET SPOT",
    },
  },
  seats: [
    {
      id: "F8",
      row: "F",
      number: 8,
      tier: "recliner",
      tierLabel: "Recliner",
      price: 250,
      status: "occupied",
      x: 0,
      y: 0.8,
      z: 14,
      metrics: {
        distanceMeters: 14.5,
        fovDegrees: 62,
        offsetMeters: 0,
        offsetDirection: "dead centre",
        category: "SWEET SPOT",
      },
    },
  ],
  ticketPrice: 250,
  fee: 30,
  total: 280,
  currency: "INR",
  createdAt: new Date().toISOString(),
  customerName: "Kaushal Maran",
  customerPhone: "+91 98401 23456",
};

export const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  booking = DEFAULT_DEMO_BOOKING,
  onDone,
  defaultStage = "processing",
  autoAdvance = true,
}) => {
  const [stage, setStage] = useState<ReceiptPrinterStage>(defaultStage);
  const [feedMotion, setFeedMotion] = useState<ReceiptFeedMotion>("stepped");
  const [printCount, setPrintCount] = useState(1);

  // Audio feedback for mechanical stepper motor and completion chime
  useEffect(() => {
    if (stage === "printing") {
      // Pulse stepper motor sound during paper feed
      const soundInterval = setInterval(() => {
        playPrinterStepSound();
      }, 110);
      return () => clearInterval(soundInterval);
    } else if (stage === "complete") {
      playSuccessChime();
    }
  }, [stage]);

  // Auto-advance stages: processing (700ms) -> printing (2000ms) -> complete
  useEffect(() => {
    if (!autoAdvance) return;

    if (stage === "processing") {
      const timer = setTimeout(() => {
        setStage("printing");
      }, 750);
      return () => clearTimeout(timer);
    }

    if (stage === "printing") {
      const timer = setTimeout(() => {
        setStage("complete");
      }, 2100);
      return () => clearTimeout(timer);
    }
  }, [stage, autoAdvance, printCount]);

  const handleReprint = () => {
    setStage("processing");
    setPrintCount((c) => c + 1);
  };

  const seatsList = booking.seats && booking.seats.length > 0 ? booking.seats : [booking.seat];
  const seatsFormatted = seatsList.map((s) => s.id).join(", ");
  const formattedDate = booking.date || "Fri 14 Nov";
  const formattedTime = booking.showtime || "19:45";

  return (
    <div className="w-full flex flex-col items-center select-none py-2 px-1">
      <ReceiptPrinter.Root
        stage={stage}
        feedMotion={feedMotion}
        className="max-w-[370px] w-full"
      >
        {/* Machine Casing */}
        <ReceiptPrinter.Machine className="border-[#efe9de]/[0.08] bg-[#141311] shadow-2xl">
          <ReceiptPrinter.Header>
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-md bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                <PrinterIcon size={14} weight="bold" />
              </div>
              <div className="leading-tight">
                <span className="text-[11px] font-semibold text-[#efe9de] block">
                  Cinescape POS
                </span>
                <span className="text-[9px] text-[#6e675f] font-mono tabular-nums">
                  TERM-03 · {booking.hallName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <TactileButton
                depth="shallow"
                size="xs"
                variant="default"
                onClick={handleReprint}
                title="Reprint Receipt"
              >
                <ArrowCounterClockwiseIcon size={12} weight="bold" />
                Reprint
              </TactileButton>

              {onDone && (
                <TactileButton
                  depth="shallow"
                  size="xs"
                  variant="primary"
                  onClick={onDone}
                  title="Return to Cinema"
                >
                  <HouseIcon size={12} weight="fill" />
                  Home
                </TactileButton>
              )}
            </div>
          </ReceiptPrinter.Header>

          {/* Machine Terminal LCD Screen */}
          <ReceiptPrinter.Screen className="mt-3 border-[#efe9de]/[0.08] bg-[#0c0b0a] shadow-inner">
            <div className="space-y-3">
              <div className="flex items-start justify-between border-b border-[#efe9de]/[0.08] pb-2.5">
                <div>
                  <span className="text-[10px] font-mono text-[#E5A93C] block font-medium">
                    {booking.theatreName}
                  </span>
                  <h4 className="text-xs font-semibold text-[#efe9de] mt-0.5">
                    {booking.movieTitle}
                  </h4>
                  <p className="text-[10px] text-[#9b9388] font-mono mt-0.5 tabular-nums">
                    {booking.hallName} · Seats {seatsFormatted}
                  </p>
                </div>
                <div className="text-right tabular-nums">
                  <span className="text-[10px] text-[#6e675f] block">
                    Paid
                  </span>
                  <span className="text-sm font-semibold font-mono text-[#E5A93C]">
                    ₹{booking.total}
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <ReceiptPrinter.Status />
            </div>
          </ReceiptPrinter.Screen>
        </ReceiptPrinter.Machine>

        {/* Paper Extrusion Output */}
        <ReceiptPrinter.Output className="h-[36rem] w-[calc(90%+2rem)] px-4">
          <ReceiptPrinter.Paper className="shadow-2xl text-[11px] leading-[1.35] pt-6 pb-10 px-5 bg-[#fafaf7] text-[#111113] border-t border-black/10">
            {/* Receipt Header */}
            <div className="text-center space-y-0.5 border-b border-dashed border-black/30 pb-3">
              <div className="text-[13px] font-extrabold tracking-wider uppercase font-mono">
                *** {booking.theatreName} ***
              </div>
              <div className="text-[10px] tracking-wide text-black/75 uppercase">
                {booking.hallName}
              </div>
              <div className="text-[9px] text-black/60 font-mono">
                GSTIN: 33AAAAA0000A1Z5 · TERMINAL #03
              </div>
              <div className="text-[10px] font-bold text-black/90 uppercase tracking-widest pt-1">
                TAX INVOICE & ENTRY PASS
              </div>
            </div>

            {/* Meta Info */}
            <div className="py-2.5 border-b border-dashed border-black/30 text-[10px] font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-black/60">TXN REF:</span>
                <span className="font-bold">{booking.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">DATE/TIME:</span>
                <span>{formattedDate} · {formattedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">GUEST:</span>
                <span className="truncate max-w-[170px]">{booking.customerName}</span>
              </div>
            </div>

            {/* Movie Title & Format */}
            <div className="py-2.5 border-b border-dashed border-black/30 font-mono">
              <div className="text-[12px] font-bold uppercase tracking-tight">
                {booking.movieTitle}
              </div>
              <div className="text-[9px] text-black/70 uppercase mt-0.5">
                {booking.language} · 2D/IMAX · AUDI 3
              </div>
            </div>

            {/* Seats Itemized Breakdown */}
            <div className="py-2.5 border-b border-dashed border-black/30 font-mono text-[10px]">
              <div className="flex justify-between text-black/60 font-semibold border-b border-black/10 pb-1 mb-1.5">
                <span>SEAT(S)</span>
                <span>TIER</span>
                <span>AMOUNT</span>
              </div>
              <div className="space-y-1">
                {seatsList.map((s) => (
                  <div key={s.id} className="flex justify-between">
                    <span className="font-bold">Row {s.row}-{s.number}</span>
                    <span className="text-black/70">{s.tierLabel}</span>
                    <span className="font-mono">₹{s.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Calculations */}
            <div className="py-2.5 border-b border-dashed border-black/30 font-mono text-[10px] space-y-1">
              <div className="flex justify-between text-black/75">
                <span>TICKET SUBTOTAL:</span>
                <span>₹{booking.ticketPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-black/75">
                <span>CONVENIENCE & GST (18%):</span>
                <span>₹{booking.fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[13px] font-extrabold border-t border-black/20 pt-1.5 mt-1">
                <span>TOTAL PAID:</span>
                <span>₹{booking.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[9px] text-black/60 pt-0.5">
                <span>METHOD:</span>
                <span className="font-bold text-black/90">UPI / GPAY (APPROVED)</span>
              </div>
            </div>

            {/* Scannable Barcode & QR Stamp */}
            <div className="pt-3 pb-1 text-center font-mono space-y-1.5">
              {/* Thermal Barcode Lines */}
              <div
                aria-hidden="true"
                className="flex justify-center items-center gap-[2px] h-9 overflow-hidden mx-auto max-w-[210px] px-2"
              >
                {[
                  3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 1, 3, 2, 1, 4, 2, 1, 3, 1,
                  2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4,
                ].map((width, idx) => (
                  <div
                    key={idx}
                    className="bg-black h-full"
                    style={{ width: `${width}px` }}
                  />
                ))}
              </div>
              <div className="text-[10px] tracking-[0.25em] font-bold uppercase text-black/90">
                *{booking.reference}*
              </div>
              <div className="text-[8px] text-black/60 leading-tight uppercase max-w-[220px] mx-auto pt-1">
                SCAN AT AUDI 3 TURNSTILE 15 MINS PRIOR TO SHOWTIME
              </div>
              <div className="text-[8px] text-black/40 font-mono tracking-wider pt-0.5">
                *** ENJOY YOUR CINEMATIC EXPERIENCE ***
              </div>
            </div>
          </ReceiptPrinter.Paper>
        </ReceiptPrinter.Output>
      </ReceiptPrinter.Root>

      {/* Interactive Controls Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
        <div className="flex items-center gap-1 bg-[#141311] border border-[#efe9de]/[0.08] rounded-full p-1">
          <button
            type="button"
            onClick={() => setStage("processing")}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
              stage === "processing"
                ? "bg-[#E5A93C] text-[#0c0b0a] font-semibold"
                : "text-[#9b9388] hover:text-[#efe9de]"
            }`}
          >
            Processing
          </button>
          <button
            type="button"
            onClick={() => setStage("printing")}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
              stage === "printing"
                ? "bg-[#E5A93C] text-[#0c0b0a] font-semibold"
                : "text-[#9b9388] hover:text-[#efe9de]"
            }`}
          >
            Printing
          </button>
          <button
            type="button"
            onClick={() => setStage("complete")}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
              stage === "complete"
                ? "bg-[#E5A93C] text-[#0c0b0a] font-semibold"
                : "text-[#9b9388] hover:text-[#efe9de]"
            }`}
          >
            Complete
          </button>
        </div>

        <button
          type="button"
          onClick={() => setFeedMotion((m) => (m === "stepped" ? "smooth" : "stepped"))}
          className="px-3 py-1.5 rounded-full bg-[#141311] hover:bg-[#1c1a17] border border-[#efe9de]/[0.08] text-[11px] text-[#9b9388] transition-colors cursor-pointer flex items-center gap-1.5 font-mono"
        >
          <span>Feed:</span>
          <span className="font-semibold text-[#E5A93C]">{feedMotion}</span>
        </button>
      </div>
    </div>
  );
};

