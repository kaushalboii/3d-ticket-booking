import { Seat, Showtime, Movie, SeatMetrics } from '../types';

export const MERIDIAN_CINEMA_INFO = {
  name: 'Meridian',
  auditorium: 'Auditorium 1 · Dolby Atmos Laser',
  city: 'London',
  movieTitle: 'Dune: Part Two',
  movieFormat: 'IMAX Laser 4K',
  date: 'Thu 14 Nov',
  showtime: '20:45',
  basePrice: 12.5,
  currency: '€',
};

export const MERIDIAN_SHOWTIMES: Showtime[] = [
  { id: 'st-1', time: '18:30', format: 'Standard', isSelected: false },
  { id: 'st-2', time: '20:45', format: 'Laser Atmos', isSelected: true },
  { id: 'st-3', time: '21:30', format: 'IMAX 4K', isSelected: false },
  { id: 'st-4', time: '23:10', format: 'Standard', isSelected: false },
];

export const MERIDIAN_DATES = [
  { day: 'Thu', date: '14 Nov', full: 'Thu 14 Nov 2026', active: true },
  { day: 'Fri', date: '15 Nov', full: 'Fri 15 Nov 2026', active: false },
  { day: 'Sat', date: '16 Nov', full: 'Sat 16 Nov 2026', active: false },
  { day: 'Sun', date: '17 Nov', full: 'Sun 17 Nov 2026', active: false },
];

// Calculate calibrated physical metrics for any seat
export function calculateMeridianSeatMetrics(
  rowChar: string,
  seatNum: number,
  totalRows: number = 8,
  seatsInRow: number = 14
): SeatMetrics {
  const rowIndex = rowChar.charCodeAt(0) - 65; // A=0, B=1, ...
  const centerSeat = (seatsInRow + 1) / 2; // e.g. 7.5
  const seatOffset = seatNum - centerSeat;

  // Real cinema physical metrics
  const minDistance = 5.2; // Row A distance
  const maxDistance = 14.8; // Row H distance
  const distanceRatio = rowIndex / Math.max(1, totalRows - 1);
  const distanceMeters = minDistance + distanceRatio * (maxDistance - minDistance);

  // Field of view: 82° up front down to 42° in back
  const fovDegrees = Math.round(82 - distanceRatio * 40 - Math.abs(seatOffset) * 0.8);

  // Horizontal offset from screen center line
  const offsetMeters = Math.abs(seatOffset) * 0.62;

  let offsetDirection = 'dead centre';
  if (seatOffset < -0.3) {
    offsetDirection = `${offsetMeters.toFixed(1)} m left of centre`;
  } else if (seatOffset > 0.3) {
    offsetDirection = `${offsetMeters.toFixed(1)} m right of centre`;
  }

  // Category based on cinema acoustics and viewing angle
  let category: 'UP CLOSE' | 'SWEET SPOT' | 'FULL PICTURE' = 'FULL PICTURE';
  if (rowIndex <= 2) {
    category = 'UP CLOSE';
  } else if (rowIndex >= 3 && rowIndex <= 6 && Math.abs(seatOffset) <= 3) {
    category = 'SWEET SPOT';
  } else {
    category = 'FULL PICTURE';
  }

  return {
    distanceMeters,
    fovDegrees,
    offsetMeters,
    offsetDirection,
    category,
  };
}

// Generate the 8 rows x 14 seats Meridian Auditorium Layout matching the video
export function generateMeridianSeats(): Seat[] {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 14;
  const seats: Seat[] = [];

  // Taken / Occupied seats matching reference video frame sequence
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
    // 3D coordinates in Three.js world space
    // Screen is at Z = 0, Y = 4.4, X = 0
    // Rows step back from Z = 5.2 to Z = 13.5
    const rowZ = 5.4 + rIdx * 1.15;
    // Tiered stadium seating elevation
    const rowY = (rIdx * 0.32) + 0.1;

    for (let s = 1; s <= seatsPerRow; s++) {
      const seatId = `${row}${s}`;
      const isOccupied = occupiedSet.has(seatId);

      // Centered X coordinate with slight curvature
      const centerIndex = (seatsPerRow + 1) / 2;
      const xOffset = (s - centerIndex) * 0.68;
      // Gentle amphitheatre arc towards screen
      const curveZOffset = Math.pow(xOffset * 0.22, 2) * 0.45;

      const metrics = calculateMeridianSeatMetrics(row, s, rows.length, seatsPerRow);

      // Row F Seat 6 is the signature Sweet Spot seat from screenshot
      if (row === 'F' && s === 6) {
        metrics.distanceMeters = 9.8;
        metrics.fovDegrees = 61;
        metrics.offsetMeters = 0.9;
        metrics.offsetDirection = 'left of centre';
        metrics.category = 'SWEET SPOT';
      }

      const isRecliner = rIdx >= 6;
      const tier = isRecliner ? 'recliner' : 'standard';
      const tierLabel = isRecliner ? 'Recliner' : 'Standard';
      const price = isRecliner ? 16.5 : 12.5;

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
