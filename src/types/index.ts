export type FilmPresetId = 
  | 'kodak-portra' 
  | 'fuji-quicksnap' 
  | 'cinestill-800t' 
  | 'ilford-bw' 
  | 'warm-90s' 
  | 'classic-polaroid';

export interface FilmPreset {
  id: FilmPresetId;
  name: string;
  tagline: string;
  description: string;
  badgeColor: string;
  filterClass: string;
  colorGrade: {
    brightness: number; // 0.8 to 1.3
    contrast: number; // 0.8 to 1.4
    saturation: number; // 0 to 1.5
    sepia: number; // 0 to 0.5
    hueRotate: number; // degrees
    tintR?: number; // tint offset
    tintG?: number;
    tintB?: number;
    warmth: number;
    grainIntensity: number; // 0 to 1
  };
}

export interface Photo {
  id: string;
  eventId: string;
  guestName: string;
  tableNumber?: string;
  message?: string;
  imageUrl: string;
  originalUrl?: string;
  filterId: FilmPresetId;
  timestamp: string; // ISO string
  likes: number;
  isFavorite?: boolean;
}

export interface EventData {
  id: string;
  slug: string;
  title: string;
  coupleNames: string;
  eventDate: string; // YYYY-MM-DD
  eventTime?: string; // HH:mm
  venue: string;
  revealMode: 'instant' | 'scheduled';
  revealTime: string; // ISO string
  isRevealedManually?: boolean;
  preset: FilmPresetId;
  photosPerGuest: number; // 0 means unlimited, or e.g. 10
  welcomeMessage: string;
  coverUrl: string;
  hostEmail: string;
  passcode?: string;
  createdAt: string;
}

export interface GuestSession {
  guestName: string;
  tableNumber: string;
  shotsTaken: number;
}
