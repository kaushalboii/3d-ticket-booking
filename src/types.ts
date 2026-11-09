export type SeatTier = 'standard' | 'premium' | 'vip_recliner';

export type SeatStatus = 'available' | 'selected' | 'occupied' | 'locked';

export interface SeatCoordinate3D {
  x: number;
  y: number; // Tiered riser height
  z: number;
}

export interface Seat {
  id: string; // e.g. 'D-6'
  row: string;
  number: number;
  tier: SeatTier;
  price: number;
  status: SeatStatus;
  coord3D: SeatCoordinate3D;
  lockedBy?: string;
  lockedUntil?: number;
}

export interface CastMember {
  name: string;
  role: string;
  avatar: string;
}

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  trailerVideoUrl?: string;
  rating: string;
  score: number;
  duration: string;
  genres: string[];
  languages: string[];
  formats: ('IMAX 3D' | 'DOLBY ATMOS' | '2D' | '4DX')[];
  director: string;
  cast: CastMember[];
  releaseDate: string;
  isUpcoming?: boolean;
}

export interface Showtime {
  id: string;
  movieId: string;
  theatreId: string;
  theatreName: string;
  auditoriumId: string;
  auditoriumName: string;
  format: 'IMAX 3D' | 'DOLBY ATMOS' | '2D' | '4DX';
  date: string;
  time: string;
  pricing: Record<SeatTier, number>;
}

export interface Theatre {
  id: string;
  name: string;
  city: string;
  address: string;
  auditoriums: string[];
}

export interface ConcessionItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Combos' | 'Popcorn' | 'Drinks' | 'Snacks';
  image: string;
  popular?: boolean;
}

export interface Booking {
  id: string;
  bookingRef: string;
  movieId: string;
  movieTitle: string;
  posterUrl: string;
  theatreName: string;
  auditoriumName: string;
  format: string;
  date: string;
  time: string;
  seats: Seat[];
  concessions: { item: ConcessionItem; quantity: number }[];
  subtotal: number;
  discount: number;
  bookingFee: number;
  totalAmount: number;
  qrPayload: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
}
