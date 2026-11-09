import React, { useState, useEffect } from 'react';
import { generateVelsTheatresSeats, VELS_SHOWTIMES, VELS_CINEMA_INFO, MOVIES_LIST } from './data/velsData';
import { Seat, Showtime, Movie, Booking, UserProfile } from './types';
import { CinemaHeader } from './components/CinemaHeader';
import { ScreenArc } from './components/ScreenArc';
import { SeatMap } from './components/SeatMap';
import { SeatLegend } from './components/SeatLegend';
import { SeatBottomBar } from './components/SeatBottomBar';
import { SeatPreviewView } from './components/SeatPreviewView';
import { CheckoutModal } from './components/CheckoutModal';
import { BookingConfirmation } from './components/BookingConfirmation';
import { LandingPage } from './components/LandingPage';
import { LoginModal } from './components/LoginModal';
import { Smartphone, Maximize2, Home, Film } from 'lucide-react';

export default function App() {
  const [seats, setSeats] = useState<Seat[]>(() => generateVelsTheatresSeats());
  const [showtimes, setShowtimes] = useState<Showtime[]>(VELS_SHOWTIMES);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string>('st-4'); // '11:10 PM'
  const [activeMovie, setActiveMovie] = useState<Movie>(MOVIES_LIST[0]); // 'Scene - Tamil'

  // Default selected seat: H1 or F8 (in BookMyShow screenshot, H1 is in green focus)
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>('F8');

  // Active Screen: 'landing' | 'seat_map' | 'seat_preview' | 'confirmation'
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'seat_map' | 'seat_preview' | 'confirmation'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('preview') || hash.includes('3d') || hash.includes('eye')) {
        return 'seat_preview';
      }
      if (hash.includes('landing') || hash.includes('home') || hash.includes('movies')) {
        return 'landing';
      }
    }
    return 'seat_map';
  });

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('preview') || hash.includes('3d') || hash.includes('eye')) {
        setCurrentScreen('seat_preview');
      } else if (hash.includes('landing') || hash.includes('home') || hash.includes('movies')) {
        setCurrentScreen('landing');
      } else if (hash.includes('seat') || hash.includes('map')) {
        setCurrentScreen('seat_map');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // User Profile / Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    name: 'Kaushal',
    phone: '+91 98401 23456',
    email: 'kaushalmaran@vels.in',
    isLoggedIn: true,
  });
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Checkout modal
  const [showCheckout, setShowCheckout] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Desktop view mode toggle (Mobile frame vs Fullscreen)
  const [isFramed, setIsFramed] = useState(false); // default fullscreen so user sees everything clearly!

  const selectedSeat = seats.find((s) => s.id === selectedSeatId) || null;

  // Handle seat click in map
  const handleSelectSeat = (seat: Seat) => {
    if (seat.status === 'occupied') return;
    if (selectedSeatId === seat.id) {
      setSelectedSeatId(null);
    } else {
      setSelectedSeatId(seat.id);
    }
  };

  // Continue to 3D Seat Preview
  const handleContinueToPreview = () => {
    if (selectedSeat) {
      setCurrentScreen('seat_preview');
    }
  };

  // Return to Seat Map (Change Seat)
  const handleBackToSeatMap = () => {
    setCurrentScreen('seat_map');
  };

  // Select movie from Landing Page
  const handleSelectMovieFromLanding = (movie: Movie) => {
    setActiveMovie(movie);
    setCurrentScreen('seat_map');
  };

  // Confirm Booking from Checkout
  const handleConfirmBooking = (booking: Booking) => {
    // Mark seat as occupied in live state
    setSeats((prev) =>
      prev.map((s) => (s.id === booking.seat.id ? { ...s, status: 'occupied' } : s))
    );
    setConfirmedBooking(booking);
    setShowCheckout(false);
    setCurrentScreen('confirmation');
  };

  // Render Inner Cinema Application Content
  const renderAppContent = () => {
    // 1. Landing Page
    if (currentScreen === 'landing') {
      return (
        <LandingPage
          onSelectMovie={handleSelectMovieFromLanding}
          onOpenLogin={() => setShowLoginModal(true)}
          currentUser={currentUser}
        />
      );
    }

    // 2. Booking Confirmation Pass
    if (currentScreen === 'confirmation' && confirmedBooking) {
      return (
        <BookingConfirmation
          booking={confirmedBooking}
          onDone={() => {
            setConfirmedBooking(null);
            setCurrentScreen('seat_map');
          }}
        />
      );
    }

    // 3. Seat-View Preview (STATE B) with 360° Drag Look-Around
    if (currentScreen === 'seat_preview' && selectedSeat) {
      return (
        <SeatPreviewView
          seats={seats}
          seat={selectedSeat}
          movie={activeMovie}
          onBackToSeatMap={handleBackToSeatMap}
          onBookSeat={() => setShowCheckout(true)}
        />
      );
    }

    // 4. Seat Selection (STATE A: Vels Theatres Chennai)
    return (
      <div className="relative w-full h-full bg-[#050505] flex flex-col justify-between overflow-hidden select-none">
        {/* Top Header matching BookMyShow Vels Theatres */}
        <CinemaHeader
          movieTitle={`${activeMovie.title} - ${activeMovie.language}`}
          theatreSubtitle={`${VELS_CINEMA_INFO.name} | ${VELS_CINEMA_INFO.date} | ${VELS_CINEMA_INFO.showtime}`}
          showtimes={showtimes}
          selectedShowtimeId={selectedShowtimeId}
          onSelectShowtime={setSelectedShowtimeId}
          onBackClick={() => setCurrentScreen('landing')}
          onOpenLogin={() => setShowLoginModal(true)}
          userName={currentUser?.name}
        />

        {/* Interactive Scrollable Seat Map matching Vels Theatres */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <SeatMap
            seats={seats}
            selectedSeatId={selectedSeatId}
            onSelectSeat={handleSelectSeat}
          />

          {/* Seat Legend matching BookMyShow */}
          <SeatLegend />
        </div>

        {/* Bottom Booking Summary Bar */}
        <SeatBottomBar
          selectedSeat={selectedSeat}
          onContinue={handleContinueToPreview}
        />
      </div>
    );
  };

  return (
    <div className="h-[100dvh] w-full bg-[#050505] text-[#F5F5F5] flex flex-col items-center justify-center p-0 font-sans relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#55E6A5]/[0.02] rounded-full blur-3xl pointer-events-none" />

      {/* Top Global Utility Bar (Home Navigation & Viewport Mode) */}
      <div className="absolute top-3 right-3 z-50 flex items-center gap-2">
        {currentScreen !== 'landing' && (
          <button
            onClick={() => setCurrentScreen('landing')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111]/90 border border-[#222222] hover:border-[#55E6A5] text-[#D0D0D0] hover:text-white transition text-[11px] font-medium shadow-lg cursor-pointer"
            title="Go to Vels Theatres Landing Page"
          >
            <Home className="w-3 h-3 text-[#55E6A5]" />
            <span className="hidden sm:inline">Landing Page</span>
          </button>
        )}

        <button
          onClick={() => setIsFramed(!isFramed)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111]/90 border border-[#222222] hover:border-[#55E6A5] text-[#D0D0D0] hover:text-white transition text-[11px] font-medium shadow-lg cursor-pointer"
          title={isFramed ? "Switch to Fullscreen Viewport" : "Switch to Centered Mobile Phone Frame"}
        >
          {isFramed ? (
            <>
              <Maximize2 className="w-3 h-3 text-[#55E6A5]" />
              <span>Full Screen</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3 h-3 text-[#55E6A5]" />
              <span>Mobile Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container: Adapts automatically to window height with zero clipping */}
      <div
        className={`w-full h-full flex flex-col transition-all duration-300 ${
          isFramed
            ? 'max-w-[440px] max-h-[96dvh] my-auto rounded-[36px] border border-[#222222] shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden'
            : 'w-full h-full'
        }`}
      >
        {renderAppContent()}
      </div>

      {/* Checkout Modal */}
      {showCheckout && selectedSeat && (
        <CheckoutModal
          seat={selectedSeat}
          movie={activeMovie}
          showtime={showtimes.find((s) => s.id === selectedShowtimeId)}
          currentUser={currentUser}
          onClose={() => setShowCheckout(false)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={(user) => setCurrentUser(user)}
        />
      )}
    </div>
  );
}
