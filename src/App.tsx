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

  // Default selected seat: H1 or F8 (in BookMyShow screenshot, H1 is in green focus)
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>('F8');

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
    return 'landing'; // Default entry point is the clean movie catalogue!
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
  const [isFramed, setIsFramed] = useState(false); // default fullscreen so user sees everything clearly!

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

  const selectedSeat = seats.find((s) => s.id === selectedSeatId) || null;

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

    // 3. Seat-View Preview (STATE B) with 360° Drag Look-Around
    if (currentScreen === 'seat_preview' && selectedSeat) {
      return (
        <SeatPreviewView
          seats={seats}
          seat={selectedSeat}
          movie={activeMovie}
          currency={currentTheatre.currency}
          onBackToSeatMap={handleBackToSeatMap}
          onBookSeat={() => setShowCheckout(true)}
        />
      );
    }

    // 4. Seat Selection (STATE A: Multiplex & City Seating Matrix)
    const activeShowtime = showtimes.find((s) => s.id === selectedShowtimeId);

    return (
      <div className="relative w-full h-full bg-[#050505] flex flex-col justify-between overflow-hidden select-none">
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

        {/* Interactive Scrollable Seat Map matching Theatre specifications */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <SeatMap
            seats={seats}
            selectedSeatId={selectedSeatId}
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
          selectedSeat={selectedSeat}
          currency={currentTheatre.currency}
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
            title="Go to Movies Landing Page"
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
