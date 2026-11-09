import React, { useState, useEffect } from 'react';
import { generateTheatreSeats, THEATRES_LIST, CITIES_LIST, MOVIES_LIST } from './data/velsData';
import { Seat, Showtime, Movie, Booking, UserProfile, Theatre, City } from './types';
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
import { CitySelectModal } from './components/CitySelectModal';
import { TheatreSelectModal } from './components/TheatreSelectModal';
import { Smartphone, Maximize2, Home, Film, Globe } from 'lucide-react';

export default function App() {
  // Global Platform State: Current City & Multiplex
  const [currentCity, setCurrentCity] = useState<string>('Chennai');
  const [currentTheatre, setCurrentTheatre] = useState<Theatre>(THEATRES_LIST[0]);

  // Seating & Showtimes dynamically generated for the active Theatre
  const [seats, setSeats] = useState<Seat[]>(() => generateTheatreSeats(THEATRES_LIST[0]));
  const [showtimes, setShowtimes] = useState<Showtime[]>(THEATRES_LIST[0].showtimes);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string>(THEATRES_LIST[0].showtimes[0].id);
  const [selectedDate, setSelectedDate] = useState<string>('Mon, 09 Nov, 2026');
  const [activeMovie, setActiveMovie] = useState<Movie>(MOVIES_LIST[0]); // 'Scene - Tamil'

  // Multi-Seat Selection (default to Row F, Seat 8 matching reference video)
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(['F8']);
  const [focusedPreviewSeatId, setFocusedPreviewSeatId] = useState<string>('F8');

  // Active Screen: 'landing' | 'seat_map' | 'seat_preview' | 'confirmation'
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'seat_map' | 'seat_preview' | 'confirmation'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('preview') || hash.includes('3d') || hash.includes('eye')) {
        return 'seat_preview';
      }
      if (hash.includes('seat') || hash.includes('map')) {
        return 'seat_map';
      }
    }
    return 'landing';
  });

  // Modal Dialogs
  const [showCityModal, setShowCityModal] = useState(false);
  const [showTheatreModal, setShowTheatreModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // User Profile / Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    name: 'Kaushal',
    phone: '+91 98401 23456',
    email: 'kaushalmaran@vels.in',
    isLoggedIn: true,
  });

  // Desktop view mode toggle (Mobile frame vs Fullscreen)
  const [isFramed, setIsFramed] = useState(false);

  // Keep URL hash in sync with current screen for browser back/forward and bookmarking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (currentScreen === 'seat_preview') {
      window.location.hash = '3d';
    } else if (currentScreen === 'seat_map') {
      window.location.hash = 'seat_map';
    } else if (currentScreen === 'landing') {
      window.location.hash = 'landing';
    } else if (currentScreen === 'confirmation') {
      window.location.hash = 'ticket';
    }
  }, [currentScreen]);

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

  const selectedSeats = seats.filter((s) => selectedSeatIds.includes(s.id));
  const activePreviewSeat =
    seats.find((s) => s.id === focusedPreviewSeatId) ||
    selectedSeats[0] ||
    seats.find((s) => s.id === 'F8') ||
    seats[0];

  // Handle theatre switch
  const handleSelectTheatre = (theatre: Theatre) => {
    setCurrentTheatre(theatre);
    setCurrentCity(theatre.city);
    setSeats(generateTheatreSeats(theatre));
    setShowtimes(theatre.showtimes);
    setSelectedShowtimeId(theatre.showtimes[0]?.id || 'st-1');
  };

  // Handle city switch
  const handleSelectCity = (city: City) => {
    setCurrentCity(city.name);
    const firstTheatreInCity = THEATRES_LIST.find(
      (th) => th.city.toLowerCase() === city.name.toLowerCase()
    );
    if (firstTheatreInCity) {
      handleSelectTheatre(firstTheatreInCity);
    }
  };

  // Handle seat click in map (supports selecting 1, 2, or more seats!)
  const handleSelectSeat = (seat: Seat) => {
    if (seat.status === 'occupied') return;
    if (selectedSeatIds.includes(seat.id)) {
      const next = selectedSeatIds.filter((id) => id !== seat.id);
      setSelectedSeatIds(next);
      if (focusedPreviewSeatId === seat.id && next.length > 0) {
        setFocusedPreviewSeatId(next[0]);
      }
    } else {
      const next = [...selectedSeatIds, seat.id];
      setSelectedSeatIds(next);
      setFocusedPreviewSeatId(seat.id);
    }
  };

  // Continue to 3D Seat Preview
  const handleContinueToPreview = () => {
    if (selectedSeats.length > 0) {
      if (!selectedSeatIds.includes(focusedPreviewSeatId)) {
        setFocusedPreviewSeatId(selectedSeats[0].id);
      }
      setCurrentScreen('seat_preview');
    }
  };

  // Return to Seat Map (Change Seat)
  const handleBackToSeatMap = () => {
    setCurrentScreen('seat_map');
  };

  // Select movie from Landing Page: opens theatre & showtime picker for that movie
  const handleSelectMovieFromLanding = (movie: Movie) => {
    setActiveMovie(movie);
    setShowTheatreModal(true);
  };

  // Choose theatre and showtime from modal: jumps straight into Seat Map
  const handleSelectTheatreAndShowtime = (theatre: Theatre, showtime: Showtime) => {
    handleSelectTheatre(theatre);
    setSelectedShowtimeId(showtime.id);
    setCurrentScreen('seat_map');
  };

  // Confirm Booking from Checkout
  const handleConfirmBooking = (booking: Booking) => {
    // Mark booked seats as occupied in live state
    const bookedIds = new Set(booking.seats ? booking.seats.map((s) => s.id) : [booking.seat.id]);
    setSeats((prev) =>
      prev.map((s) => (bookedIds.has(s.id) ? { ...s, status: 'occupied' } : s))
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
          currentCity={currentCity}
          currentTheatre={currentTheatre}
          onSelectMovie={handleSelectMovieFromLanding}
          onSelectTheatre={(th) => {
            handleSelectTheatre(th);
            setCurrentScreen('seat_map');
          }}
          onOpenCitySelect={() => setShowCityModal(true)}
          onOpenLogin={() => setShowLoginModal(true)}
          onDirect3DPreview={() => setCurrentScreen('seat_preview')}
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
          onView3D={() => setCurrentScreen('seat_preview')}
          onHome={() => {
            setConfirmedBooking(null);
            setCurrentScreen('landing');
          }}
        />
      );
    }

    // 3. Seat-View Preview (STATE B) with Cubic-Bezier Camera Tween & 360° Drag Look-Around
    if (currentScreen === 'seat_preview' && activePreviewSeat) {
      return (
        <SeatPreviewView
          seats={seats}
          seat={activePreviewSeat}
          selectedSeats={selectedSeats}
          movie={activeMovie}
          currency={currentTheatre.currency}
          onSelectSeatToPreview={(s) => setFocusedPreviewSeatId(s.id)}
          onBackToSeatMap={handleBackToSeatMap}
          onBookSeat={() => setShowCheckout(true)}
        />
      );
    }

    // 4. Seat Selection (STATE A: Multiplex & City Seating Matrix)
    const activeShowtime = showtimes.find((s) => s.id === selectedShowtimeId);

    return (
      <div className="relative w-full h-full bg-[#0B0D12] flex flex-col justify-between overflow-hidden select-none">
        {/* Top Header with City, Multiplex & Showtime selector */}
        <CinemaHeader
          movieTitle={`${activeMovie.title} - ${activeMovie.language}`}
          theatreSubtitle={`${currentTheatre.name} (${currentTheatre.city}) · ${currentTheatre.hall} | ${selectedDate.split(',')[0]} | ${activeShowtime?.time || currentTheatre.showtimes[0].time}`}
          showtimes={showtimes}
          selectedShowtimeId={selectedShowtimeId}
          onSelectShowtime={setSelectedShowtimeId}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onBackClick={() => setCurrentScreen('landing')}
          onOpenLogin={() => setShowLoginModal(true)}
          onOpenTheatreSelect={() => setShowTheatreModal(true)}
          userName={currentUser?.name}
          currentStep={2}
        />

        {/* Interactive Scrollable Seat Map with Framer Motion Staggered Row Entrance */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <SeatMap
            seats={seats}
            selectedSeatId={focusedPreviewSeatId}
            selectedSeatIds={selectedSeatIds}
            onSelectSeat={handleSelectSeat}
            eliteTierLabel={`${currentTheatre.currency}${currentTheatre.elitePrice} ELITE`}
            economyTierLabel={`${currentTheatre.currency}${currentTheatre.economyPrice} ECONOMY`}
            currency={currentTheatre.currency}
          />

          {/* Seat Legend */}
          <SeatLegend />
        </div>

        {/* Bottom Booking Summary Bar */}
        <SeatBottomBar
          selectedSeat={activePreviewSeat}
          selectedSeats={selectedSeats}
          currency={currentTheatre.currency}
          onContinue={handleContinueToPreview}
        />
      </div>
    );
  };

  return (
    <div className="h-[100dvh] w-full bg-[#0B0D12] text-[#F0F1F4] flex flex-col items-center justify-center p-0 font-sans relative overflow-hidden">
      {/* Top Global Utility Bar (Home Navigation & Viewport Mode) */}
      <div className="absolute top-3 right-3 z-50 flex items-center gap-2">
        {currentScreen !== 'landing' && (
          <button
            onClick={() => setCurrentScreen('landing')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141822]/90 border border-white/[0.08] hover:border-white/[0.16] text-[#D1D5DF] hover:text-[#F0F1F4] transition text-[11px] font-normal cursor-pointer"
            title="Go to movies catalogue"
          >
            <Home className="w-3 h-3 text-[#55E6A5]" strokeWidth={1.5} />
            <span className="hidden sm:inline">Landing page</span>
          </button>
        )}

        <button
          onClick={() => setIsFramed(!isFramed)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141822]/90 border border-white/[0.08] hover:border-white/[0.16] text-[#D1D5DF] hover:text-[#F0F1F4] transition text-[11px] font-normal cursor-pointer"
          title={isFramed ? "Switch to fullscreen viewport" : "Switch to mobile frame"}
        >
          {isFramed ? (
            <>
              <Maximize2 className="w-3 h-3 text-[#55E6A5]" strokeWidth={1.5} />
              <span>Full screen</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3 h-3 text-[#55E6A5]" strokeWidth={1.5} />
              <span>Mobile frame</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container: Adapts automatically to window height with zero clipping */}
      <div
        className={`w-full h-full flex flex-col transition-all duration-200 ${
          isFramed
            ? 'max-w-[440px] max-h-[96dvh] my-auto rounded-[32px] border border-white/[0.08] overflow-hidden'
            : 'w-full h-full'
        }`}
      >
        {renderAppContent()}
      </div>

      {/* Checkout Modal */}
      {showCheckout && activePreviewSeat && (
        <CheckoutModal
          seat={activePreviewSeat}
          seats={selectedSeats}
          movie={activeMovie}
          showtime={showtimes.find((s) => s.id === selectedShowtimeId)}
          theatre={currentTheatre}
          selectedDate={selectedDate}
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

      {/* Global City Select Modal */}
      {showCityModal && (
        <CitySelectModal
          currentCity={currentCity}
          onSelectCity={handleSelectCity}
          onClose={() => setShowCityModal(false)}
        />
      )}

      {/* Theatre & Showtime Selection Modal */}
      {showTheatreModal && (
        <TheatreSelectModal
          movie={activeMovie}
          currentTheatreId={currentTheatre.id}
          selectedCity={currentCity}
          onSelectTheatreAndShowtime={handleSelectTheatreAndShowtime}
          onClose={() => setShowTheatreModal(false)}
        />
      )}
    </div>
  );
}
