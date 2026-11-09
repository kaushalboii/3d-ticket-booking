export type SeatTier = 'elite' | 'economy' | 'recliner' | 'standard';

export type SeatStatus = 'available' | 'occupied' | 'selected';

export type SeatCategory = 'UP CLOSE' | 'SWEET SPOT' | 'FULL PICTURE';

export interface SeatMetrics {
  distanceMeters: number;
  fovDegrees: number;
  offsetMeters: number;
  offsetDirection: 'left of centre' | 'right of centre' | 'centre';
  category: SeatCategory;
}

export interface Seat {
  id: string; // e.g. 'A1', 'F8', 'H1'
  row: string; // 'A' to 'J'
  number: number; // seat number
  tier: SeatTier;
  tierLabel: string; // '₹190 ELITE' | '₹190 ECONOMY'
  price: number;
  status: SeatStatus;
  x: number; // lateral position in meters
  y: number; // elevation in meters
  z: number; // distance from screen in meters
  metrics: SeatMetrics;
}

export interface Showtime {
  id: string;
  time: string;
  format: '2D' | 'IMAX' | 'ATMOS';
  selected?: boolean;
}

export interface City {
  id: string;
  name: string;
  country: string;
  flag: string;
  theatresCount: number;
}

export interface Theatre {
  id: string;
  name: string;
  brand: string;
  city: string;
  country: string;
  location: string;
  hall: string;
  format: '4K Laser Atmos' | 'IMAX Laser' | 'Dolby Cinema' | 'RealD 3D';
  currency: string;
  elitePrice: number;
  economyPrice: number;
  showtimes: Showtime[];
  occupiedSeats: string[];
  bannerImage?: string;
}

export interface Movie {
  id: string;
  title: string;
  language: string;
  genre: string;
  rating: string;
  duration: string;
  poster: string;
  backdrop: string;
  director: string;
  theatre: string;
  timing: string;
  description?: string;
  tagline?: string;
  theatreIds?: string[];
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  isLoggedIn: boolean;
}

export interface Booking {
  id: string;
  reference: string;
  movieTitle: string;
  language: string;
  theatreName: string;
  hallName: string;
  date: string;
  showtime: string;
  seat: Seat;
  seats?: Seat[];
  ticketPrice: number;
  fee: number;
  total: number;
  currency?: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
}
