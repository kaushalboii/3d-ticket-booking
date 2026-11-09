import React, { useState } from 'react';
import { generateSeatsForScreen, INDIAN_SHOWTIMES, INDIAN_CINEMA_INFO, INDIAN_MOVIES, INDIAN_SCREENS } from './data/indianCinemaData';
import { Seat, Showtime, Movie, Booking, UserProfile, ScreenConfig } from './types';
import { CinemaLandingPage } from './components/CinemaLandingPage';
import { CinemaHeader } from './components/CinemaHeader';
import { SeatMap } from './components/SeatMap';
import { SeatLegend } from './components/SeatLegend';
import { SeatBottomBar } from './components/SeatBottomBar';
import { SeatPreviewView } from './components/SeatPreviewView';
import { CheckoutModal } from './components/CheckoutModal';
import { BookingConfirmation } from './components/BookingConfirmation';
import { LoginModal } from './components/LoginModal';
import { AuditoriumSettingsModal } from './components/AuditoriumSettingsModal';

export default function App() {
  // Screen Configuration (Defaults to Audi 3: The exact reference video standard!)
  const [currentScreenConfig, setCurrentScreenConfig] = useState<ScreenConfig>(INDIAN_SCREENS[0]);
  const [seats, setSeats] = useState<Seat[]>(() => generateSeatsForScreen(INDIAN_SCREENS[0].id));

  // Settings & Calibration state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [projectionMode, setProjectionMode] = useState('imax-laser');
  const [audioProfile, setAudioProfile] = useState('dolby-atmos');
  const [showSweetSpotGuide, setShowSweetSpotGuide] = useState(false);

  // Showtimes & Active Movie
  const [showtimes] = useState<Showtime[]>(INDIAN_SHOWTIMES);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string>('st-2'); // 19:45 IMAX
  const [activeMovie, setActiveMovie] = useState<Movie>(INDIAN_MOVIES[0]); // Scene - Tamil

  // Multi-Seat Selection (default to Row F, Seat 8 matching reference video)
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(['F8']);
  const [focusedPreviewSeatId, setFocusedPreviewSeatId] = useState<string>('F8');

  // Active Screen flow: 'landing' -> 'seat_map' -> 'seat_preview' -> 'confirmation'
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'seat_map' | 'seat_preview' | 'confirmation'>('landing');

  // User Profile / Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    name: 'Kaushal Maran',
    phone: '+91 98401 23456',
    email: 'kaushalmaran@vels.in',
    isLoggedIn: true,
  });
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Checkout modal
  const [showCheckout, setShowCheckout] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const selectedSeats = seats.filter((s) => selectedSeatIds.includes(s.id));
  const activePreviewSeat =
    seats.find((s) => s.id === focusedPreviewSeatId) ||
    selectedSeats[0] ||
    seats.find((s) => s.id === 'F8') ||
    seats[0];

  // Handle seat click in map (Supports booking 1, 2, or more seats!)
  const handleSelectSeat = (seat: Seat) => {
    if (seat.status === 'occupied') return;

    if (selectedSeatIds.includes(seat.id)) {
      // Deselect seat
      const next = selectedSeatIds.filter((id) => id !== seat.id);
      setSelectedSeatIds(next);
      if (focusedPreviewSeatId === seat.id && next.length > 0) {
        setFocusedPreviewSeatId(next[0]);
      }
    } else {
      // Select additional seat (e.g. 2, 3 or more seats)
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

  // Switch Auditorium Screen from Settings
  const handleSelectScreenConfig = (screen: ScreenConfig) => {
    setCurrentScreenConfig(screen);
    const newSeats = generateSeatsForScreen(screen.id);
    setSeats(newSeats);

    // Keep F8 if available or first available seat
    const defaultSeat = newSeats.find((s) => s.id === 'F8' && s.status === 'available') || newSeats.find((s) => s.status === 'available') || newSeats[0];
    setSelectedSeatIds([defaultSeat.id]);
    setFocusedPreviewSeatId(defaultSeat.id);
    setShowSettingsModal(false);
  };

  // From Landing Page to Seat Map with chosen movie and optional showtime
  const handleSelectMovieAndBook = (movie: Movie, showtimeId?: string) => {
    setActiveMovie(movie);
    if (showtimeId) {
      setSelectedShowtimeId(showtimeId);
    }
    const freshSeats = generateSeatsForScreen(currentScreenConfig.id);
    setSeats(freshSeats);
    setSelectedSeatIds(['F8']);
    setFocusedPreviewSeatId('F8');
    setCurrentScreen('seat_map');
  };

  // Confirm Booking from Checkout
  const handleConfirmBooking = (booking: Booking) => {
    const bookedIds = new Set(booking.seats.map((s) => s.id));
    setSeats((prev) =>
      prev.map((s) => (bookedIds.has(s.id) ? { ...s, status: 'occupied' } : s))
    );
    setConfirmedBooking(booking);
    setShowCheckout(false);
    setCurrentScreen('confirmation');
  };

  // Render Inner Cinema Application Content
  const renderAppContent = () => {
    // 1. Landing Page: Minimal black and white cinema portal
    if (currentScreen === 'landing') {
      return (
        <CinemaLandingPage
          onSelectMovieAndBook={handleSelectMovieAndBook}
          onOpenLogin={() => setShowLoginModal(true)}
          currentUser={currentUser}
        />
      );
    }

    // 2. Booking Confirmation Pass (Itemizes all booked seats)
    if (currentScreen === 'confirmation' && confirmedBooking) {
      return (
        <div className="w-full h-full max-w-lg mx-auto flex flex-col">
          <BookingConfirmation
            booking={confirmedBooking}
            onDone={() => {
              setConfirmedBooking(null);
              setSelectedSeatIds(['F8']);
              setCurrentScreen('seat_map');
            }}
          />
        </div>
      );
    }

    // 3. Seat-View Preview (STATE B) with React-Three-Fiber Camera Swoop & Multi-Seat Switcher
    if (currentScreen === 'seat_preview' && activePreviewSeat) {
      return (
        <SeatPreviewView
          seats={seats}
          seat={activePreviewSeat}
          selectedSeats={selectedSeats}
          onSelectSeatToPreview={(s) => setFocusedPreviewSeatId(s.id)}
          onBackToSeatMap={handleBackToSeatMap}
          onBookSeat={() => setShowCheckout(true)}
        />
      );
    }

    // 4. Seat Selection (STATE A: Exact Reproduction of Video Frame 00:00)
    return (
      <div className="w-full h-full max-w-2xl mx-auto flex flex-col justify-between overflow-hidden bg-[#050505]">
        {/* Top Header matching Video Frame 00:00 */}
        <CinemaHeader
          cinemaName={INDIAN_CINEMA_INFO.shortName}
          hallAndDate={`${activeMovie.title} · ${currentScreenConfig.shortName} · Fri 14 Nov`}
          showtimes={showtimes}
          selectedShowtimeId={selectedShowtimeId}
          onSelectShowtime={setSelectedShowtimeId}
          onBackClick={() => setCurrentScreen('landing')}
          onOpenSettings={() => setShowSettingsModal(true)}
          userName={currentUser?.name}
        />

        {/* Scrollable Auditorium Seat Map with curved screen arc and multi-seat selection */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <SeatMap
            seats={seats}
            selectedSeatIds={selectedSeatIds}
            onSelectSeat={handleSelectSeat}
            showSweetSpotGuide={showSweetSpotGuide}
          />

          {/* 4-Item Seat Legend matching Video Frame 00:00 (Available, Taken, Recliner, Selected) */}
          <SeatLegend />
        </div>

        {/* Bottom Booking Summary Bar (Supports 1, 2, or more seats!) */}
        <SeatBottomBar
          selectedSeats={selectedSeats}
          onContinue={handleContinueToPreview}
        />
      </div>
    );
  };

  return (
    <div className="h-[100dvh] w-full bg-[#050505] text-[#F5F5F5] flex flex-col font-sans relative overflow-hidden">
      {/* Responsive Main Container (Auto-aligns without artificial mobile mockup frames or overlays) */}
      <main className="w-full h-full flex flex-col overflow-hidden">
        {renderAppContent()}
      </main>

      {/* Auditorium Screen & System Settings Modal */}
      {showSettingsModal && (
        <AuditoriumSettingsModal
          currentScreenId={currentScreenConfig.id}
          onSelectScreen={handleSelectScreenConfig}
          projectionMode={projectionMode}
          onChangeProjectionMode={setProjectionMode}
          audioProfile={audioProfile}
          onChangeAudioProfile={setAudioProfile}
          showSweetSpotGuide={showSweetSpotGuide}
          onToggleSweetSpotGuide={() => setShowSweetSpotGuide(!showSweetSpotGuide)}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* Checkout Modal (Supports multiple seats with itemized total) */}
      {showCheckout && selectedSeats.length > 0 && (
        <CheckoutModal
          seats={selectedSeats}
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
