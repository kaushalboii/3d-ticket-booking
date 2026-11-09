import { Movie, Showtime, Theatre, ConcessionItem, Seat } from '../types';

export const MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'CHRONOS: BEYOND HORIZON',
    tagline: 'Time was never the destination.',
    description: 'An elite deep-space reconnaissance crew crosses an unstable Kerr-metric gravitational singularity, only to discover their past missions have already rewritten Earth’s final century. Presented in breathtaking 1.43:1 expanded IMAX laser aspect ratio with 12-channel spatial audio.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=2000&auto=format&fit=crop',
    rating: 'PG-13',
    score: 9.6,
    duration: '2h 48m',
    genres: ['Sci-Fi', 'Thriller', 'Adventure'],
    languages: ['English', 'German', 'Japanese'],
    formats: ['IMAX 3D', 'DOLBY ATMOS', '2D'],
    director: 'Kaelen Vance',
    releaseDate: 'Nov 2026',
    cast: [
      { name: 'Elena Rostova', role: 'Commander Vance', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      { name: 'Marcus Sterling', role: 'Chief Astrophysicist', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
      { name: 'Dr. Hana Kim', role: 'Quantum Engineer', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' }
    ]
  },
  {
    id: 'm2',
    title: 'NEO-TOKYO: VELOCITY',
    tagline: 'In the shadows of neon, speed is survival.',
    description: 'An underground cyber-modified drift pilot is forced into an illegal syndicate tournament running underneath Tokyo’s multi-layered skyways. Features ground-shaking Dolby Atmos bass transducers and high-frame-rate laser projection.',
    posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2000&auto=format&fit=crop',
    rating: 'R',
    score: 9.1,
    duration: '2h 15m',
    genres: ['Action', 'Cyberpunk', 'Thriller'],
    languages: ['Japanese', 'English'],
    formats: ['DOLBY ATMOS', 'IMAX 3D', '4DX'],
    director: 'Kenji Takahashi',
    releaseDate: 'Oct 2026',
    cast: [
      { name: 'Ren Tanaka', role: 'Kite / Pilot 04', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
      { name: 'Mei Lin Chen', role: 'Cipher', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' }
    ]
  },
  {
    id: 'm3',
    title: 'THE ABYSSAL DEEP',
    tagline: 'Some depths were never meant to be breached.',
    description: 'A subterranean oceanic research station at the bottom of the Mariana Trench discovers an ancient sentient biological structure responding to acoustic frequencies. A masterclass in suspense and claustrophobic sound design.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=2000&auto=format&fit=crop',
    rating: 'PG-13',
    score: 8.8,
    duration: '2h 06m',
    genres: ['Horror', 'Sci-Fi', 'Mystery'],
    languages: ['English', 'Spanish'],
    formats: ['IMAX 3D', 'DOLBY ATMOS'],
    director: 'Sarah Jenkins',
    releaseDate: 'Nov 2026',
    cast: [
      { name: 'Julian Hayes', role: 'Dr. Arthur Cole', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
      { name: 'Sofia Alvarez', role: 'Dr. Maria Santos', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' }
    ]
  },
  {
    id: 'm4',
    title: 'VALKYRIE PROTOCOL',
    tagline: 'Artificial intelligence was only the first weapon.',
    description: 'When an autonomous planetary defense grid turns rogue, a decommissioned combat squad must infiltrate the subterranean orbital tether in northern Scandinavia before global missile silos activate.',
    posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=2000&auto=format&fit=crop',
    rating: 'PG-13',
    score: 8.9,
    duration: '2h 22m',
    genres: ['Action', 'Sci-Fi'],
    languages: ['English', 'Swedish'],
    formats: ['IMAX 3D', '4DX', '2D'],
    director: 'Nils Lindqvist',
    releaseDate: 'Dec 2026',
    isUpcoming: true,
    cast: [
      { name: 'Freja Lindholm', role: 'Captain Astrid', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' }
    ]
  },
  {
    id: 'm5',
    title: 'AURA: ECHOES OF ELYSIUM',
    tagline: 'An animated symphony of color, spirit, and memory.',
    description: 'In an ethereal world where emotions materialize as bioluminescent architecture, a young cartographer embarks on a pilgrimage to restore the lost constellations of her ancestors.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop',
    rating: 'PG',
    score: 9.3,
    duration: '1h 54m',
    genres: ['Animation', 'Adventure', 'Fantasy'],
    languages: ['English', 'French'],
    formats: ['DOLBY ATMOS', '2D'],
    director: 'Aurelie Moreau',
    releaseDate: 'Nov 2026',
    cast: [
      { name: 'Amelie Laurent', role: 'Solene (Voice)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }
    ]
  }
];

export const THEATRES: Theatre[] = [
  {
    id: 'th-1',
    name: 'CINESCAPE Grand Luxe Cinema',
    city: 'Los Angeles',
    address: '800 W Olympic Blvd, DTLA',
    auditoriums: ['Auditorium 1 (IMAX Laser)', 'Auditorium 2 (Dolby Atmos Prime)', 'Auditorium 3 (ScreenX)']
  },
  {
    id: 'th-2',
    name: 'CINESCAPE IMAX Horizon Dome',
    city: 'Los Angeles',
    address: '6801 Hollywood Blvd, Hollywood',
    auditoriums: ['Grand Dome 1', 'Laser Lounge 2']
  },
  {
    id: 'th-3',
    name: 'CINESCAPE Century Metropolis',
    city: 'Los Angeles',
    address: '10250 Santa Monica Blvd, Century City',
    auditoriums: ['Hall 1 (VIP Recliner)', 'Hall 2 (Dolby Cinema)']
  }
];

export const SHOWTIMES: Showtime[] = [
  {
    id: 'st-1',
    movieId: 'm1',
    theatreId: 'th-1',
    theatreName: 'CINESCAPE Grand Luxe Cinema',
    auditoriumId: 'aud-1',
    auditoriumName: 'Auditorium 1 (IMAX Laser)',
    format: 'IMAX 3D',
    date: 'Today, 24 Oct',
    time: '19:30',
    pricing: { standard: 17.50, premium: 23.00, vip_recliner: 31.00 }
  },
  {
    id: 'st-2',
    movieId: 'm1',
    theatreId: 'th-1',
    theatreName: 'CINESCAPE Grand Luxe Cinema',
    auditoriumId: 'aud-1',
    auditoriumName: 'Auditorium 1 (IMAX Laser)',
    format: 'IMAX 3D',
    date: 'Today, 24 Oct',
    time: '22:15',
    pricing: { standard: 17.50, premium: 23.00, vip_recliner: 31.00 }
  },
  {
    id: 'st-3',
    movieId: 'm1',
    theatreId: 'th-1',
    theatreName: 'CINESCAPE Grand Luxe Cinema',
    auditoriumId: 'aud-2',
    auditoriumName: 'Auditorium 2 (Dolby Atmos Prime)',
    format: 'DOLBY ATMOS',
    date: 'Tomorrow, 25 Oct',
    time: '20:00',
    pricing: { standard: 16.00, premium: 21.00, vip_recliner: 28.50 }
  },
  {
    id: 'st-4',
    movieId: 'm2',
    theatreId: 'th-1',
    theatreName: 'CINESCAPE Grand Luxe Cinema',
    auditoriumId: 'aud-2',
    auditoriumName: 'Auditorium 2 (Dolby Atmos Prime)',
    format: 'DOLBY ATMOS',
    date: 'Today, 24 Oct',
    time: '20:45',
    pricing: { standard: 16.00, premium: 21.00, vip_recliner: 28.50 }
  },
  {
    id: 'st-5',
    movieId: 'm3',
    theatreId: 'th-1',
    theatreName: 'CINESCAPE Grand Luxe Cinema',
    auditoriumId: 'aud-1',
    auditoriumName: 'Auditorium 1 (IMAX Laser)',
    format: 'IMAX 3D',
    date: 'Today, 24 Oct',
    time: '17:00',
    pricing: { standard: 17.50, premium: 23.00, vip_recliner: 31.00 }
  }
];

export const CONCESSIONS: ConcessionItem[] = [
  {
    id: 'c1',
    name: 'Artisan Truffle & Gold Popcorn Combo',
    description: 'Warm white cheddar & black truffle popcorn with two large fountain sodas or mineral water.',
    price: 15.50,
    category: 'Combos',
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&auto=format&fit=crop',
    popular: true
  },
  {
    id: 'c2',
    name: 'Caramel Glaze Gourmet Bucket',
    description: 'Freshly kettle-popped jumbo kernels tossed in salted Belgian butter caramel.',
    price: 9.50,
    category: 'Popcorn',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400&auto=format&fit=crop',
    popular: true
  },
  {
    id: 'c3',
    name: 'Double Loaded Wagyu Nachos',
    description: 'Crisp stone-ground corn chips, smoked cheese fondue, braised beef, guacamole & jalapenos.',
    price: 13.00,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&auto=format&fit=crop'
  },
  {
    id: 'c4',
    name: 'Chilled Blood Orange Italian Soda',
    description: 'Sparkling citrus refreshment with crushed ice and fresh mint.',
    price: 7.25,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop',
    popular: true
  },
  {
    id: 'c5',
    name: 'Artisanal Dark Chocolate Truffles',
    description: 'Box of 6 handcrafted ganache truffles made with 72% Ecuadorian single-origin cacao.',
    price: 8.50,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&auto=format&fit=crop'
  }
];

// Generates 8 rows (A through H) with 12 seats each (96 seats total)
// Tier structure:
// Rows A, B: Standard ($17.50)
// Rows C, D, E: Premium ($23.00)
// Rows F, G, H: VIP Recliner with wider spacing ($31.00)
export function generateAuditoriumSeats(): Seat[] {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;
  const seats: Seat[] = [];

  // Realistic seed for occupied seats to look active and alive
  const initialOccupied = new Set([
    'B-5', 'B-6', 'C-7', 'C-8', 'D-6', 'D-7', 'E-5', 'E-6', 'E-7', 'F-6', 'F-7', 'G-8'
  ]);

  rows.forEach((row, rowIndex) => {
    let tier: 'standard' | 'premium' | 'vip_recliner' = 'standard';
    let price = 17.50;

    if (rowIndex >= 2 && rowIndex <= 4) {
      tier = 'premium';
      price = 23.00;
    } else if (rowIndex >= 5) {
      tier = 'vip_recliner';
      price = 31.00;
    }

    // Realistic stadium seating geometry
    // Distance from the front screen (screen at z = -3)
    const zBase = 4.2 + rowIndex * 2.25;
    // Riser elevation rises progressively (tiered line of sight over row in front)
    const yRiser = 0.25 + rowIndex * 0.78;

    for (let num = 1; num <= seatsPerRow; num++) {
      const id = `${row}-${num}`;

      // Curved amphitheatre arc calculation
      // Column index centered around 0 (-5.5 to +5.5)
      const colNorm = (num - (seatsPerRow + 1) / 2);
      // Gentle curve angle
      const arcAngle = (colNorm / seatsPerRow) * 0.52;
      const radius = zBase;
      const xPos = Math.sin(arcAngle) * radius * 1.5;
      const zPos = Math.cos(arcAngle) * radius;

      seats.push({
        id,
        row,
        number: num,
        tier,
        price,
        status: initialOccupied.has(id) ? 'occupied' : 'available',
        coord3D: {
          x: Number(xPos.toFixed(3)),
          y: Number(yRiser.toFixed(3)),
          z: Number(zPos.toFixed(3))
        }
      });
    }
  });

  return seats;
}
