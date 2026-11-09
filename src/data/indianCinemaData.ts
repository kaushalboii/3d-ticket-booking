import { Seat, Showtime, Movie, SeatMetrics, ScreenConfig } from '../types';

export const CINESCAPE_INFO = {
  name: 'CINESCAPE Global Flagship',
  shortName: 'CINESCAPE',
  hall: 'Audi 3 · Fri 14 Nov',
  city: 'Global',
  location: 'Global Flagship · London · Tokyo · New York · Mumbai',
  movieTitle: 'Scene - Tamil',
  movieFormat: 'IMAX Laser 4K & Dolby Atmos',
  date: 'Fri 14 Nov',
  showtime: '19:45',
  standardPrice: 190,
  reclinerPrice: 250,
  currency: '₹',
};

export const INDIAN_CINEMA_INFO = CINESCAPE_INFO;

export const CINESCAPE_LOCATIONS = [
  { id: 'london', city: 'London', flag: '🇬🇧', venue: 'West End Leicester Sq' },
  { id: 'tokyo', city: 'Tokyo', flag: '🇯🇵', venue: 'Shinjuku IMAX Tower' },
  { id: 'nyc', city: 'New York', flag: '🇺🇸', venue: 'Lincoln Square 70mm' },
  { id: 'mumbai', city: 'Mumbai', flag: '🇮🇳', venue: 'Bandra Grand Pavilion' },
  { id: 'singapore', city: 'Singapore', flag: '🇸🇬', venue: 'Marina Bay Laser' },
];

export const INDIAN_SHOWTIMES: Showtime[] = [
  { id: 'st-1', time: '17:30', format: '2D' },
  { id: 'st-2', time: '19:45', format: 'IMAX', selected: true },
  { id: 'st-3', time: '22:15', format: '2D' },
];

export const INDIAN_DATES = [
  { day: 'Fri', date: '14 Nov', active: true },
  { day: 'Sat', date: '15 Nov', active: false },
  { day: 'Sun', date: '16 Nov', active: false },
  { day: 'Mon', date: '17 Nov', active: false },
];

export const INDIAN_SCREENS: ScreenConfig[] = [
  {
    id: 'audi-3',
    name: 'Audi 3 · IMAX 4K Laser (Reference Standard)',
    shortName: 'Audi 3',
    format: 'IMAX 4K Laser & Dolby Atmos',
    description: 'Exact 3-bank layout (3 - 8 - 3), 14 seats/row, curved IMAX 70mm aspect screen with 64-channel Dolby Atmos. (Matches reference video)',
    banks: [3, 8, 3],
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    seatsPerRow: 14,
    standardPrice: 190,
    reclinerPrice: 250,
    isReference: true,
  },
  {
    id: 'audi-1',
    name: 'Audi 1 · Grand Dolby Cinema',
    shortName: 'Audi 1',
    format: 'Dolby Vision 4K & Dolby Atmos 128-CH',
    description: 'Premier grand auditorium with wide 4-8-4 seating, dual 4K Christie RGB Laser, and 128-speaker object sound.',
    banks: [4, 8, 4],
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    seatsPerRow: 16,
    standardPrice: 210,
    reclinerPrice: 280,
    isReference: false,
  },
  {
    id: 'audi-2',
    name: 'Audi 2 · VIP Gold Class Suite',
    shortName: 'Audi 2',
    format: 'VIP Push-Button Recliners & Personal Audio',
    description: 'Exclusive luxury boutique screen with motorized full-flat leather recliners, personal butler call button, and privacy dividers.',
    banks: [2, 6, 2],
    rows: ['A', 'B', 'C', 'D', 'E', 'F'],
    seatsPerRow: 10,
    standardPrice: 320,
    reclinerPrice: 380,
    isReference: false,
  },
  {
    id: 'audi-4',
    name: 'Audi 4 · 4DX Motion Experience',
    shortName: 'Audi 4',
    format: '4DX Motion Dynamics & Environmental FX',
    description: 'Synchronized multi-directional motion seating, air bursts, water mist, wind, and lightning strobe effects.',
    banks: [3, 6, 3],
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    seatsPerRow: 12,
    standardPrice: 290,
    reclinerPrice: 340,
    isReference: false,
  },
];

export const INDIAN_MOVIES: Movie[] = [
  {
    id: 'mov-1',
    title: 'Scene - Tamil',
    language: 'Tamil',
    genre: 'Action · Crime Thriller',
    rating: '8.8 / 10',
    duration: '2h 35m',
    poster: '/dune_clean_screen.jpg',
    backdrop: '/dune_clean_screen.jpg',
    director: 'Lokesh Kanagaraj',
    theatre: 'CINESCAPE Global Flagship',
    timing: '19:45',
    synopsis: 'A high-octane cinematic ride projected on the curved giant screen with uncompressed audio fidelity.',
  },
  {
    id: 'mov-2',
    title: 'Dune: Part Two',
    language: 'English / Tamil',
    genre: 'Sci-Fi · Epic Adventure',
    rating: '8.9 / 10',
    duration: '2h 46m',
    poster: '/dune_clean_screen.jpg',
    backdrop: '/dune_clean_screen.jpg',
    director: 'Denis Villeneuve',
    theatre: 'CINESCAPE Global Flagship',
    timing: '22:15',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators.',
  },
  {
    id: 'mov-3',
    title: 'Amaran',
    language: 'Tamil',
    genre: 'Biography · Action · War',
    rating: '8.7 / 10',
    duration: '2h 48m',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    director: 'Rajkumar Periasamy',
    theatre: 'CINESCAPE Global Flagship',
    timing: '17:30',
    synopsis: 'The heroic journey of Major Mukund Varadarajan with pulse-pounding battle sequences.',
  },
  {
    id: 'mov-4',
    title: 'Leo',
    language: 'Tamil',
    genre: 'Action Thriller',
    rating: '8.6 / 10',
    duration: '2h 44m',
    poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80',
    director: 'Lokesh Kanagaraj',
    theatre: 'CINESCAPE Global Flagship',
    timing: '21:00',
    synopsis: 'A mild-mannered cafe owner in Himachal becomes the target of a vicious drug cartel.',
  },
];

// Physical sightline metrics calibrated to video frames
export function calculateSeatMetrics(
  rowChar: string,
  seatNum: number,
  totalRows: number = 9,
  seatsInRow: number = 14
): SeatMetrics {
  const rowIndex = rowChar.charCodeAt(0) - 65; // A=0, B=1, ... I=8
  const centerSeat = 7.5; // (14 + 1) / 2
  const seatOffset = seatNum - centerSeat;

  const minDistance = 5.2; // Row A
  const maxDistance = 13.5; // Row I
  const distanceRatio = rowIndex / Math.max(1, totalRows - 1);
  const distanceMeters = +(minDistance + distanceRatio * (maxDistance - minDistance)).toFixed(1);

  const fovDegrees = Math.round(92 - distanceRatio * 48 - Math.abs(seatOffset) * 0.9);
  const offsetMeters = +(Math.abs(seatOffset) * 0.58).toFixed(1);

  let offsetDirection = 'dead centre';
  if (seatOffset < -0.3) {
    offsetDirection = `${offsetMeters} m left of centre`;
  } else if (seatOffset > 0.3) {
    offsetDirection = `${offsetMeters} m right of centre`;
  }

  let category: 'UP CLOSE' | 'SWEET SPOT' | 'FULL PICTURE' = 'FULL PICTURE';
  if (rowIndex <= 2) {
    category = 'UP CLOSE';
  } else if (rowIndex >= 3 && rowIndex <= 6) {
    category = 'SWEET SPOT';
  } else {
    category = 'FULL PICTURE';
  }

  // Exact calibrate for specific video reference seats:
  if (rowChar === 'B' && seatNum === 4) {
    return {
      distanceMeters: 6.3,
      fovDegrees: 86,
      offsetMeters: 2.2,
      offsetDirection: 'left of centre',
      category: 'UP CLOSE',
    };
  }
  if (rowChar === 'F' && seatNum === 8) {
    return {
      distanceMeters: 9.8,
      fovDegrees: 60,
      offsetMeters: 0.3,
      offsetDirection: 'right of centre',
      category: 'SWEET SPOT',
    };
  }
  if (rowChar === 'I' && seatNum === 12) {
    return {
      distanceMeters: 13.3,
      fovDegrees: 45,
      offsetMeters: 3.3,
      offsetDirection: 'right of centre',
      category: 'FULL PICTURE',
    };
  }

  return {
    distanceMeters,
    fovDegrees,
    offsetMeters,
    offsetDirection,
    category,
  };
}

// Generate the 9 rows x 14 seats layout matching video frame 00:00
export function generateIndianCinemaSeats(): Seat[] {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const seatsPerRow = 14;
  const seats: Seat[] = [];

  // Taken seats matching video frame 00:00
  const occupiedSet = new Set([
    'A1', 'A2', 'A8', 'A9', 'A13', 'A14',
    'B1', 'B2', 'B7', 'B10', 'B13', 'B14',
    'C6', 'C7', 'C8', 'C9',
    'D3', 'D4', 'D11', 'D12',
    'E5', 'E6', 'E9', 'E10',
    'F3', 'F4', 'F9', 'F10',
    'G5', 'G6', 'G7', 'G8',
    'H6', 'H7', 'H8', 'H9',
    'I7', 'I8', 'I9', 'I10',
  ]);

  rows.forEach((row, rIdx) => {
    // 3D coordinates in Three.js auditorium space
    const isReclinerRow = row === 'I';
    const rowZ = 5.2 + rIdx * 1.15;
    const rowY = rIdx * 0.32 + 0.1;

    for (let s = 1; s <= seatsPerRow; s++) {
      const seatId = `${row}${s}`;
      const isOccupied = occupiedSet.has(seatId);

      // Seat coordinates with aisle spacing (3 - 8 - 3)
      let xAisleOffset = 0;
      if (s <= 3) {
        xAisleOffset = -0.4;
      } else if (s >= 12) {
        xAisleOffset = 0.4;
      }

      const centerIndex = (seatsPerRow + 1) / 2;
      const xPos = (s - centerIndex) * 0.68 + xAisleOffset;
      const curveZOffset = Math.pow(xPos * 0.2, 2) * 0.45;

      const metrics = calculateSeatMetrics(row, s, rows.length, seatsPerRow);
      const tier: 'standard' | 'recliner' = isReclinerRow ? 'recliner' : 'standard';
      const tierLabel = isReclinerRow ? 'Recliner' : 'Standard';
      const price = isReclinerRow ? 250 : 190;

      seats.push({
        id: seatId,
        row,
        number: s,
        tier,
        tierLabel,
        price,
        status: isOccupied ? 'occupied' : 'available',
        x: xPos,
        y: rowY,
        z: rowZ + curveZOffset,
        metrics,
      });
    }
  });

  return seats;
}

export function generateSeatsForScreen(screenId: string = 'audi-3'): Seat[] {
  const screen = INDIAN_SCREENS.find((s) => s.id === screenId) || INDIAN_SCREENS[0];
  const rows = screen.rows;
  const seatsPerRow = screen.seatsPerRow;
  const seats: Seat[] = [];

  const occupiedSet = new Set([
    'A1', 'A2', 'A8', 'A9', 'A13', 'A14',
    'B1', 'B2', 'B7', 'B10', 'B13', 'B14',
    'C6', 'C7', 'C8', 'C9',
    'D3', 'D4', 'D11', 'D12',
    'E5', 'E6', 'E9', 'E10',
    'F3', 'F4', 'F9', 'F10',
    'G5', 'G6', 'G7', 'G8',
    'H6', 'H7', 'H8', 'H9',
    'I7', 'I8', 'I9', 'I10',
  ]);

  rows.forEach((row, rIdx) => {
    const isReclinerRow = rIdx === rows.length - 1;
    const rowZ = 5.2 + rIdx * 1.15;
    const rowY = rIdx * 0.32 + 0.1;

    for (let s = 1; s <= seatsPerRow; s++) {
      const seatId = `${row}${s}`;
      const isOccupied = occupiedSet.has(seatId);

      let xAisleOffset = 0;
      if (screen.banks.length === 3) {
        const leftBankEnd = screen.banks[0];
        const rightBankStart = leftBankEnd + screen.banks[1] + 1;
        if (s <= leftBankEnd) {
          xAisleOffset = -0.4;
        } else if (s >= rightBankStart) {
          xAisleOffset = 0.4;
        }
      }

      const centerIndex = (seatsPerRow + 1) / 2;
      const xPos = (s - centerIndex) * 0.68 + xAisleOffset;
      const curveZOffset = Math.pow(xPos * 0.2, 2) * 0.45;

      const metrics = calculateSeatMetrics(row, s, rows.length, seatsPerRow);
      const tier: 'standard' | 'recliner' = isReclinerRow ? 'recliner' : 'standard';
      const tierLabel = isReclinerRow ? 'VIP Recliner' : 'Standard';
      const price = isReclinerRow ? screen.reclinerPrice : screen.standardPrice;

      seats.push({
        id: seatId,
        row,
        number: s,
        tier,
        tierLabel,
        price,
        status: isOccupied ? 'occupied' : 'available',
        x: xPos,
        y: rowY,
        z: rowZ + curveZOffset,
        metrics,
      });
    }
  });

  return seats;
}
