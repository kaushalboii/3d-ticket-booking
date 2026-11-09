import { Seat, Showtime, Movie, SeatCategory } from '../types';

export const VELS_CINEMA_INFO = {
  name: 'Vels Theatres: Chennai',
  hall: 'Screen 1 (Velan 4K Laser Dolby Atmos)',
  location: 'Vels Theatres, GST Road, Pallavaram, Chennai',
  date: 'Mon, 09 November, 2026',
  showtime: '11:10 PM',
  movieTitle: 'Scene - Tamil',
  movieFormat: '4K Laser Atmos',
  currency: '₹',
};

export const MOVIES_LIST: Movie[] = [
  {
    id: 'm-scene',
    title: 'Scene',
    language: 'Tamil',
    genre: 'Crime • Thriller • Drama',
    rating: 'UA 16+',
    duration: '2h 18m',
    theatre: 'Vels Theatres: Chennai',
    timing: '11:10 PM',
    director: 'K. Rajavel',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'm-amaran',
    title: 'Amaran',
    language: 'Tamil',
    genre: 'Action • Biography • Drama',
    rating: 'UA',
    duration: '2h 47m',
    theatre: 'Vels Theatres: Chennai',
    timing: '06:30 PM',
    director: 'Rajkumar Periasamy',
    poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'm-dune2',
    title: 'Dune: Part Two',
    language: 'English',
    genre: 'Sci-Fi • Adventure',
    rating: 'UA 13+',
    duration: '2h 46m',
    theatre: 'Vels Theatres: Chennai',
    timing: '02:45 PM',
    director: 'Denis Villeneuve',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    backdrop: '/dune_clean_screen.jpg',
  },
];

export const VELS_SHOWTIMES: Showtime[] = [
  { id: 'st-1', time: '10:30 AM', format: '2D' },
  { id: 'st-2', time: '02:30 PM', format: '2D' },
  { id: 'st-3', time: '06:30 PM', format: 'ATMOS' },
  { id: 'st-4', time: '11:10 PM', format: 'ATMOS', selected: true },
];

// Initial occupied/sold seats matching the Vels Theatres BookMyShow screenshot
const VELS_OCCUPIED_SEATS = new Set([
  'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'A16', 'A17',
  'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12', 'B13', 'B14', 'B15', 'B16', 'B17', 'B18',
  'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17', 'C18',
  'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15', 'D16', 'D17', 'D18',
  'E6', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12', 'E13', 'E14', 'E15', 'E16', 'E17', 'E18',
  'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18',
  'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13', 'G14', 'G15', 'G16', 'G17', 'G18',
  'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12', 'H13', 'H14', 'H15', 'H16', 'H17', 'H18',
  'I6', 'I7', 'I8', 'I9', 'I10', 'I11', 'I12', 'I13', 'I14', 'I15', 'I16', 'I17', 'I18',
  'J5', 'J6', 'J7', 'J8', 'J9', 'J10', 'J11', 'J12', 'J13', 'J14', 'J15', 'J16', 'J17',
  'C19', 'C20', 'C21', 'C22', 'C23', 'C24',
  'D19', 'D20', 'E19', 'E20', 'F19', 'F20', 'G19', 'G20', 'H19', 'H20', 'I19', 'I20',
]);

// Row distances from the front screen in meters
// Screen is at front (z = 0)
// Row J is closest (Economy), Row A is back (Elite top tier)
const VELS_ROW_Z_DISTANCES: Record<string, number> = {
  J: 5.2,
  I: 6.3,
  H: 7.4,
  G: 8.5,
  F: 9.6,
  E: 10.7,
  D: 11.8,
  C: 12.9,
  B: 14.0,
  A: 15.2,
};

const VELS_ROW_Y_ELEVATIONS: Record<string, number> = {
  J: 0.15,
  I: 0.45,
  H: 0.75,
  G: 1.05,
  F: 1.35,
  E: 1.68,
  D: 2.02,
  C: 2.38,
  B: 2.75,
  A: 3.12,
};

// Generates the exact Vels Theatres seating layout aligned with BookMyShow screenshot
export function generateVelsTheatresSeats(): Seat[] {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const screenWidth = 12.0;

  rows.forEach((row) => {
    const isEconomy = row === 'J';
    const tier = isEconomy ? 'economy' : 'elite';
    const tierLabel = isEconomy ? '₹190 ECONOMY' : '₹190 ELITE';
    const price = 190;
    const z = VELS_ROW_Z_DISTANCES[row] || 8.0;
    const y = VELS_ROW_Y_ELEVATIONS[row] || 1.2;

    let category: SeatCategory = 'SWEET SPOT';
    if (['J', 'I', 'H'].includes(row)) category = 'UP CLOSE';
    else if (['G', 'F', 'E', 'D'].includes(row)) category = 'SWEET SPOT';
    else category = 'FULL PICTURE';

    // Columns configuration per row based on screenshot:
    // Left bank, Center bank, Right bank
    let seatNumbers: number[] = [];
    if (row === 'A') {
      // 1-9, 10-17, 18-27
      seatNumbers = [
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        10, 11, 12, 13, 14, 15, 16, 17,
        18, 19, 20, 21, 22, 23, 24, 25, 26, 27
      ];
    } else if (['B', 'C'].includes(row)) {
      // 1-5, 6-18, 19-24
      seatNumbers = [
        1, 2, 3, 4, 5,
        6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24
      ];
    } else if (['D', 'E', 'F', 'G', 'H'].includes(row)) {
      // 1-5, 6-18, 19-20
      seatNumbers = [
        1, 2, 3, 4, 5,
        6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        19, 20
      ];
    } else if (row === 'I') {
      // 1-3 (Economy), 4-5 (Elite), 6-18 (Elite), 19-20 (Elite)
      seatNumbers = [
        1, 2, 3, 4, 5,
        6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        19, 20
      ];
    } else if (row === 'J') {
      // 1-4, 5-17, 18-19
      seatNumbers = [
        1, 2, 3, 4,
        5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
        18, 19
      ];
    }

    seatNumbers.forEach((num) => {
      const id = `${row}${num}`;

      // Calculate lateral offset X across the theatre (-6.0m to +6.0m)
      // Center of hall is between seat 11 and 12
      const centerCol = 12.0;
      let x = (num - centerCol) * 0.52;
      // Add aisle spacing
      if (num <= 5) x -= 0.6; // left bank pushed left across aisle
      if (num >= 19) x += 0.6; // right bank pushed right across aisle

      // Distance to screen
      const dist = Math.sqrt(x * x + z * z);
      // Field of view
      const fov = Math.round(2 * Math.atan((screenWidth / 2) / z) * (180 / Math.PI));
      const absOffset = Math.abs(x);
      let offsetDirection: 'left of centre' | 'right of centre' | 'centre' = 'centre';
      if (x < -0.15) offsetDirection = 'left of centre';
      else if (x > 0.15) offsetDirection = 'right of centre';

      seats.push({
        id,
        row,
        number: num,
        tier: (row === 'J' || (row === 'I' && num <= 3)) ? 'economy' : 'elite',
        tierLabel: (row === 'J' || (row === 'I' && num <= 3)) ? '₹190 ECONOMY' : '₹190 ELITE',
        price,
        status: VELS_OCCUPIED_SEATS.has(id) ? 'occupied' : 'available',
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
        z: Number(z.toFixed(2)),
        metrics: {
          distanceMeters: Number(dist.toFixed(1)),
          fovDegrees: fov,
          offsetMeters: Number(absOffset.toFixed(1)),
          offsetDirection,
          category,
        },
      });
    });
  });

  return seats;
}
