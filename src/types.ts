export type SeatTier = 'standard' | 'elite' | 'recliner' | 'economy';

export type SeatStatus = 'available' | 'occupied' | 'selected';

export type SeatCategory = 'UP CLOSE' | 'SWEET SPOT' | 'FULL PICTURE';

export interface SeatMetrics {
  distanceMeters: number;
  fovDegrees: number;
  offsetMeters: number;
  offsetDirection: string; // e.g. 'left of centre', 'right of centre', 'dead centre'
  category: SeatCategory;
}

export interface Seat {
  id: string; // e.g. 'B4', 'F8', 'I12'
  row: string; // 'A' to 'I'
  number: number; // 1 to 14
  tier: SeatTier;
  tierLabel: string; // 'Standard' | 'Recliner'
  price: number; // ₹190 or ₹250
  status: SeatStatus;
  x: number; // 3D lateral coordinate
  y: number; // 3D elevation
  z: number; // 3D depth from screen
  metrics: SeatMetrics;
}

export interface Showtime {
  id: string;
  time: string;
  format: string; // '2D' | 'IMAX' | 'ATMOS'
  selected?: boolean;
  isSelected?: boolean;
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
  synopsis?: string;
  description?: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  isLoggedIn: boolean;
}

export interface ScreenConfig {
  id: string; // 'audi-3' | 'audi-1' | 'audi-2' | 'audi-4'
  name: string; // 'Audi 3 · IMAX 4K Laser (Reference Standard)'
  shortName: string; // 'Audi 3'
  format: string; // 'IMAX 4K Laser & Dolby Atmos'
  description: string;
  banks: number[]; // [3, 8, 3]
  rows: string[];
  seatsPerRow: number;
  standardPrice: number;
  reclinerPrice: number;
  isReference: boolean;
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
  seats: Seat[];
  ticketPrice: number;
  fee: number;
  total: number;
  currency?: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
}
