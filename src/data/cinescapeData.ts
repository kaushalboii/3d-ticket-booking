import { Movie, Seat, Showtime, SeatMetrics } from '../types';

export interface CinescapeTheatre {
  id: string;
  name: string;
  location: string;
  screenType: string;
}

export const CINESCAPE_THEATRES: CinescapeTheatre[] = [
  { id: 'th-1', name: 'CINESCAPE Grand IMAX', location: 'Downtown Hub · Screen 1', screenType: 'IMAX Laser 4K & Dolby Atmos' },
  { id: 'th-2', name: 'CINESCAPE Luxe Cinema', location: 'Westfield Promenade · Screen 3', screenType: 'Dolby Cinema 4K' },
  { id: 'th-3', name: 'CINESCAPE CineDome', location: 'Tech City · Screen 2', screenType: 'Laser 4K Atmos' },
];

export const CINESCAPE_MOVIES: Movie[] = [
  {
    id: 'mov-1',
    title: 'Dune: Part Two',
    language: 'English',
    genre: 'Sci-Fi · Adventure',
    rating: '8.8 / 10',
    duration: '2h 46m',
    poster: '/dune_clean_screen.jpg',
    backdrop: '/dune_clean_screen.jpg',
    director: 'Denis Villeneuve',
    theatre: 'CINESCAPE Grand IMAX',
    timing: '20:45',
  },
  {
    id: 'mov-2',
    title: 'Oppenheimer',
    language: 'English',
    genre: 'Biography · Drama · History',
    rating: '8.9 / 10',
    duration: '3h 00m',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    director: 'Christopher Nolan',
    theatre: 'CINESCAPE Grand IMAX',
    timing: '17:30',
  },
  {
    id: 'mov-3',
    title: 'Interstellar: 10th Anniversary',
    language: 'English',
    genre: 'Sci-Fi · Adventure · Drama',
    rating: '8.7 / 10',
    duration: '2h 49m',
    poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80',
    director: 'Christopher Nolan',
    theatre: 'CINESCAPE Luxe Cinema',
    timing: '21:15',
  },
  {
    id: 'mov-4',
    title: 'Spider-Man: Across the Spider-Verse',
    language: 'English',
    genre: 'Animation · Action',
    rating: '8.7 / 10',
    duration: '2h 20m',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1600&auto=format&fit=crop&q=80',
    director: 'Joaquim Dos Santos',
    theatre: 'CINESCAPE CineDome',
    timing: '19:00',
  },
];

export const CINESCAPE_SHOWTIMES: Showtime[] = [
  { id: 'st-1', time: '14:30', format: 'Standard 4K', selected: false },
  { id: 'st-2', time: '17:45', format: 'Dolby Atmos', selected: false },
  { id: 'st-3', time: '20:45', format: 'IMAX Laser 4K', selected: true },
  { id: 'st-4', time: '23:15', format: 'Late Night Atmos', selected: false },
];

export function generateCinescapeAuditoriumSeats(): Seat[] {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const seatsPerRow = 14;
  const seats: Seat[] = [];

  const occupiedSet = new Set([
    'B4', 'B5', 'B10', 'B11',
    'C6', 'C7', 'C8',
    'D3', 'D4', 'D11', 'D12',
    'E5', 'E6', 'E9', 'E10',
    'F3', 'F4', 'F9', 'F10',
    'G5', 'G6', 'G7', 'G8',
    'H7', 'H8',
  ]);

  rows.forEach((row, rIdx) => {
    const rowZ = 5.2 + rIdx * 1.15;
    const rowY = (rIdx * 0.32) + 0.1;

    for (let s = 1; s <= seatsPerRow; s++) {
      const seatId = `${row}${s}`;
      const isOccupied = occupiedSet.has(seatId);

      const centerIndex = (seatsPerRow + 1) / 2;
      const xOffset = (s - centerIndex) * 0.68;
      const curveZOffset = Math.pow(xOffset * 0.22, 2) * 0.45;

      const rowIndex = rIdx;
      const totalRows = rows.length;
      const distanceRatio = rowIndex / Math.max(1, totalRows - 1);
      const distanceMeters = 5.2 + distanceRatio * 9.6;
      const seatOffset = s - centerIndex;
      const fovDegrees = Math.round(82 - distanceRatio * 40 - Math.abs(seatOffset) * 0.8);
      const offsetMeters = Math.abs(seatOffset) * 0.62;

      let offsetDirection = 'centre';
      if (seatOffset < -0.3) offsetDirection = `${offsetMeters.toFixed(1)} m left of centre`;
      else if (seatOffset > 0.3) offsetDirection = `${offsetMeters.toFixed(1)} m right of centre`;

      let category: 'UP CLOSE' | 'SWEET SPOT' | 'FULL PICTURE' = 'FULL PICTURE';
      if (rowIndex <= 2) category = 'UP CLOSE';
      else if (rowIndex >= 3 && rowIndex <= 6 && Math.abs(seatOffset) <= 3) category = 'SWEET SPOT';

      let tier: 'standard' | 'elite' | 'recliner' = 'standard';
      let tierLabel = 'Standard';
      let price = 14.5;

      if (rIdx >= 7) {
        tier = 'recliner';
        tierLabel = 'VIP Recliner';
        price = 22.0;
      } else if (category === 'SWEET SPOT') {
        tier = 'elite';
        tierLabel = 'Prime Sweet Spot';
        price = 18.0;
      }

      const metrics: SeatMetrics = {
        distanceMeters,
        fovDegrees,
        offsetMeters,
        offsetDirection,
        category,
      };

      if (row === 'F' && s === 6) {
        metrics.distanceMeters = 9.8;
        metrics.fovDegrees = 61;
        metrics.offsetMeters = 0.9;
        metrics.offsetDirection = 'left of centre';
        metrics.category = 'SWEET SPOT';
      }

      seats.push({
        id: seatId,
        row,
        number: s,
        tier,
        tierLabel,
        price,
        status: isOccupied ? 'occupied' : 'available',
        x: xOffset,
        y: rowY,
        z: rowZ + curveZOffset,
        metrics,
      });
    }
  });

  return seats;
}
