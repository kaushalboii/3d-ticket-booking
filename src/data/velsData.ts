import { Seat, Showtime, Movie, SeatCategory, Theatre, City } from '../types';

export const CITIES_LIST: City[] = [
  { id: 'city-chennai', name: 'Chennai', country: 'India', flag: '🇮🇳', theatresCount: 14 },
  { id: 'city-mumbai', name: 'Mumbai', country: 'India', flag: '🇮🇳', theatresCount: 22 },
  { id: 'city-bengaluru', name: 'Bengaluru', country: 'India', flag: '🇮🇳', theatresCount: 18 },
  { id: 'city-delhi', name: 'Delhi-NCR', country: 'India', flag: '🇮🇳', theatresCount: 26 },
  { id: 'city-newyork', name: 'New York', country: 'USA', flag: '🇺🇸', theatresCount: 31 },
  { id: 'city-london', name: 'London', country: 'UK', flag: '🇬🇧', theatresCount: 19 },
];

export const THEATRES_LIST: Theatre[] = [
  {
    id: 'theatre-vels',
    name: 'Vels Theatres',
    brand: 'Vels Cineplex',
    city: 'Chennai',
    country: 'India',
    location: 'GST Road, Pallavaram, Chennai',
    hall: 'Screen 1 (Velan 4K Laser Dolby Atmos)',
    format: '4K Laser Atmos',
    currency: '₹',
    elitePrice: 190,
    economyPrice: 190,
    showtimes: [
      { id: 'st-1', time: '10:30 AM', format: '2D' },
      { id: 'st-2', time: '02:30 PM', format: '2D' },
      { id: 'st-3', time: '06:30 PM', format: 'ATMOS' },
      { id: 'st-4', time: '11:10 PM', format: 'ATMOS', selected: true },
    ],
    occupiedSeats: [
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
    ],
    bannerImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'theatre-pvr-phoenix',
    name: 'PVR Luxe IMAX',
    brand: 'PVR INOX',
    city: 'Chennai',
    country: 'India',
    location: 'Phoenix Marketcity, Velachery, Chennai',
    hall: 'Screen 4 (IMAX Laser 12-Channel)',
    format: 'IMAX Laser',
    currency: '₹',
    elitePrice: 380,
    economyPrice: 280,
    showtimes: [
      { id: 'st-p1', time: '09:45 AM', format: 'IMAX' },
      { id: 'st-p2', time: '01:15 PM', format: 'IMAX' },
      { id: 'st-p3', time: '05:00 PM', format: 'IMAX', selected: true },
      { id: 'st-p4', time: '09:30 PM', format: 'IMAX' },
    ],
    occupiedSeats: ['D8', 'D9', 'D10', 'E8', 'E9', 'E10', 'F8', 'F9', 'F10', 'C11', 'C12', 'G7', 'G8', 'H9'],
    bannerImage: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'theatre-bkc-maison',
    name: 'PVR INOX Maison',
    brand: 'PVR Maison',
    city: 'Mumbai',
    country: 'India',
    location: 'Jio World Drive, Bandra Kurla Complex, Mumbai',
    hall: 'Luxe Suite (Dolby Vision Laser Atmos)',
    format: 'Dolby Cinema',
    currency: '₹',
    elitePrice: 480,
    economyPrice: 350,
    showtimes: [
      { id: 'st-m1', time: '11:00 AM', format: 'ATMOS' },
      { id: 'st-m2', time: '03:20 PM', format: 'ATMOS', selected: true },
      { id: 'st-m3', time: '07:15 PM', format: 'ATMOS' },
      { id: 'st-m4', time: '10:50 PM', format: 'ATMOS' },
    ],
    occupiedSeats: ['F7', 'F8', 'F9', 'G7', 'G8', 'G9', 'E10', 'E11', 'D7', 'D8'],
    bannerImage: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'theatre-vega-city',
    name: 'PVR Superplex IMAX',
    brand: 'PVR INOX',
    city: 'Bengaluru',
    country: 'India',
    location: 'Vega City Mall, Bannerghatta Road, Bengaluru',
    hall: 'Audi 6 (Commercial Laser IMAX 3D)',
    format: 'IMAX Laser',
    currency: '₹',
    elitePrice: 350,
    economyPrice: 250,
    showtimes: [
      { id: 'st-b1', time: '10:00 AM', format: 'IMAX' },
      { id: 'st-b2', time: '01:45 PM', format: 'IMAX' },
      { id: 'st-b3', time: '06:15 PM', format: 'IMAX', selected: true },
      { id: 'st-b4', time: '10:15 PM', format: 'IMAX' },
    ],
    occupiedSeats: ['C8', 'C9', 'D8', 'D9', 'E8', 'E9', 'F8', 'F9'],
    bannerImage: 'https://images.unsplash.com/photo-1586899028174-e7098604235b?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'theatre-amc-lincoln',
    name: 'AMC Lincoln Square 13',
    brand: 'AMC Theatres',
    city: 'New York',
    country: 'USA',
    location: '1998 Broadway & 68th St, New York, NY',
    hall: 'Auditorium 1 (1.43:1 Dual Laser IMAX GT)',
    format: 'IMAX Laser',
    currency: '$',
    elitePrice: 26,
    economyPrice: 20,
    showtimes: [
      { id: 'st-ny1', time: '12:00 PM', format: 'IMAX' },
      { id: 'st-ny2', time: '03:45 PM', format: 'IMAX' },
      { id: 'st-ny3', time: '07:30 PM', format: 'IMAX', selected: true },
      { id: 'st-ny4', time: '11:15 PM', format: 'IMAX' },
    ],
    occupiedSeats: ['E10', 'E11', 'F10', 'F11', 'G10', 'G11', 'D9', 'D10'],
    bannerImage: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'theatre-bfi-london',
    name: 'BFI IMAX Waterloo',
    brand: 'BFI Cinemas',
    city: 'London',
    country: 'UK',
    location: '1 Charlie Chaplin Walk, South Bank, Waterloo, London',
    hall: 'Main Auditorium (12-Ch Laser IMAX)',
    format: 'IMAX Laser',
    currency: '£',
    elitePrice: 24,
    economyPrice: 18,
    showtimes: [
      { id: 'st-lon1', time: '11:30 AM', format: 'IMAX' },
      { id: 'st-lon2', time: '03:00 PM', format: 'IMAX' },
      { id: 'st-lon3', time: '06:45 PM', format: 'IMAX', selected: true },
      { id: 'st-lon4', time: '10:20 PM', format: 'IMAX' },
    ],
    occupiedSeats: ['D11', 'D12', 'E11', 'E12', 'F11', 'F12', 'G11'],
    bannerImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop',
  },
];

export const VELS_CINEMA_INFO = {
  name: THEATRES_LIST[0].name,
  hall: THEATRES_LIST[0].hall,
  location: THEATRES_LIST[0].location,
  date: 'Mon, 09 November, 2026',
  showtime: '11:10 PM',
  movieTitle: 'Scene - Tamil',
  movieFormat: THEATRES_LIST[0].format,
  currency: THEATRES_LIST[0].currency,
};

export const MOVIES_LIST: Movie[] = [
  {
    id: 'm-scene',
    title: 'Scene',
    language: 'Tamil',
    genre: 'Crime • Thriller • Drama',
    rating: 'UA 16+',
    duration: '2h 18m',
    theatre: 'Vels Theatres',
    timing: '11:10 PM',
    director: 'K. Rajavel',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
    theatreIds: ['theatre-vels', 'theatre-pvr-phoenix', 'theatre-bkc-maison'],
  },
  {
    id: 'm-amaran',
    title: 'Amaran',
    language: 'Tamil',
    genre: 'Action • Biography • Drama',
    rating: 'UA',
    duration: '2h 47m',
    theatre: 'Vels Theatres',
    timing: '06:30 PM',
    director: 'Rajkumar Periasamy',
    poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1600&auto=format&fit=crop',
    theatreIds: ['theatre-vels', 'theatre-pvr-phoenix', 'theatre-vega-city'],
  },
  {
    id: 'm-dune2',
    title: 'Dune: Part Two',
    language: 'English',
    genre: 'Sci-Fi • Adventure',
    rating: 'UA 13+',
    duration: '2h 46m',
    theatre: 'PVR Luxe IMAX',
    timing: '05:00 PM',
    director: 'Denis Villeneuve',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    backdrop: '/dune_clean_screen.jpg',
    theatreIds: ['theatre-vels', 'theatre-pvr-phoenix', 'theatre-bkc-maison', 'theatre-amc-lincoln', 'theatre-bfi-london'],
  },
  {
    id: 'm-chronos',
    title: 'Chronos: Beyond Horizon',
    language: 'English',
    genre: 'Sci-Fi • Mystery • Thriller',
    rating: 'UA 16+',
    duration: '2h 48m',
    theatre: 'AMC Lincoln Square 13',
    timing: '07:30 PM',
    director: 'Kaelen Vance',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
    theatreIds: ['theatre-pvr-phoenix', 'theatre-amc-lincoln', 'theatre-bfi-london'],
  },
  {
    id: 'm-neotokyo',
    title: 'Neo-Tokyo: Velocity',
    language: 'Japanese',
    genre: 'Cyberpunk • Action • Anime',
    rating: 'A',
    duration: '2h 15m',
    theatre: 'BFI IMAX Waterloo',
    timing: '06:45 PM',
    director: 'Kenji Takahashi',
    poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1600&auto=format&fit=crop',
    theatreIds: ['theatre-bkc-maison', 'theatre-vega-city', 'theatre-amc-lincoln', 'theatre-bfi-london'],
  },
];

export const VELS_SHOWTIMES: Showtime[] = THEATRES_LIST[0].showtimes;

// Row distances from the front screen in meters
const ROW_Z_DISTANCES: Record<string, number> = {
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

const ROW_Y_ELEVATIONS: Record<string, number> = {
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

// Generates dynamic seating layout customized to the specific Theatre
export function generateTheatreSeats(theatre: Theatre = THEATRES_LIST[0]): Seat[] {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const screenWidth = 12.0;
  const occupiedSet = new Set(theatre.occupiedSeats || []);

  rows.forEach((row) => {
    const isEconomy = row === 'J';
    const tier = isEconomy ? 'economy' : 'elite';
    const price = isEconomy ? theatre.economyPrice : theatre.elitePrice;
    const tierLabel = isEconomy
      ? `${theatre.currency}${theatre.economyPrice} ECONOMY`
      : `${theatre.currency}${theatre.elitePrice} ELITE`;

    const z = ROW_Z_DISTANCES[row] || 8.0;
    const y = ROW_Y_ELEVATIONS[row] || 1.2;

    let category: SeatCategory = 'SWEET SPOT';
    if (['J', 'I', 'H'].includes(row)) category = 'UP CLOSE';
    else if (['G', 'F', 'E', 'D'].includes(row)) category = 'SWEET SPOT';
    else category = 'FULL PICTURE';

    let seatNumbers: number[] = [];
    if (row === 'A') {
      seatNumbers = [
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        10, 11, 12, 13, 14, 15, 16, 17,
        18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
      ];
    } else if (['B', 'C'].includes(row)) {
      seatNumbers = [
        1, 2, 3, 4, 5,
        6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24,
      ];
    } else if (['D', 'E', 'F', 'G', 'H'].includes(row)) {
      seatNumbers = [
        1, 2, 3, 4, 5,
        6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        19, 20,
      ];
    } else if (row === 'I') {
      seatNumbers = [
        1, 2, 3, 4, 5,
        6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        19, 20,
      ];
    } else if (row === 'J') {
      seatNumbers = [
        1, 2, 3, 4,
        5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
        18, 19,
      ];
    }

    seatNumbers.forEach((num) => {
      const id = `${row}${num}`;
      const centerCol = 12.0;
      let x = (num - centerCol) * 0.52;
      if (num <= 5) x -= 0.6;
      if (num >= 19) x += 0.6;

      const dist = Math.sqrt(x * x + z * z);
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
        tierLabel: (row === 'J' || (row === 'I' && num <= 3))
          ? `${theatre.currency}${theatre.economyPrice} ECONOMY`
          : `${theatre.currency}${theatre.elitePrice} ELITE`,
        price,
        status: occupiedSet.has(id) ? 'occupied' : 'available',
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

// Backward compatibility alias
export function generateVelsTheatresSeats(): Seat[] {
  return generateTheatreSeats(THEATRES_LIST[0]);
}
