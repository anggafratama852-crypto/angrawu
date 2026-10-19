import { EventData, Photo, GuestSession } from '../types';
import { INITIAL_DEMO_EVENT, INITIAL_DEMO_PHOTOS } from './mockData';

const STORAGE_KEYS = {
  EVENTS: 'satualbum_events_v1',
  PHOTOS: 'satualbum_photos_v1',
  GUEST_SESSION: 'satualbum_guest_session_v1',
  ACTIVE_EVENT_ID: 'satualbum_active_event_id_v1',
  LIKED_PHOTOS: 'satualbum_liked_photos_v1',
};

export function getStoredEvents(): EventData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      const initial = [INITIAL_DEMO_EVENT];
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [INITIAL_DEMO_EVENT];
  }
}

export function saveEvent(event: EventData): void {
  const events = getStoredEvents();
  const existingIdx = events.findIndex((e) => e.id === event.id);
  if (existingIdx >= 0) {
    events[existingIdx] = event;
  } else {
    events.unshift(event);
  }
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
}

export function getEventById(id: string): EventData | undefined {
  const events = getStoredEvents();
  return events.find((e) => e.id === id || e.slug === id);
}

export function getStoredPhotos(eventId?: string): Photo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    let photos: Photo[] = [];
    if (!raw) {
      photos = [...INITIAL_DEMO_PHOTOS];
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
    } else {
      photos = JSON.parse(raw);
    }
    if (eventId) {
      return photos.filter((p) => p.eventId === eventId);
    }
    return photos;
  } catch {
    return eventId ? INITIAL_DEMO_PHOTOS.filter((p) => p.eventId === eventId) : INITIAL_DEMO_PHOTOS;
  }
}

export function savePhoto(photo: Photo): void {
  const photos = getStoredPhotos();
  photos.unshift(photo);
  localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
}

export function togglePhotoLike(photoId: string): { newLikes: number; isLiked: boolean } {
  try {
    const likedRaw = localStorage.getItem(STORAGE_KEYS.LIKED_PHOTOS);
    const likedSet = new Set<string>(likedRaw ? JSON.parse(likedRaw) : []);
    const isCurrentlyLiked = likedSet.has(photoId);

    const photos = getStoredPhotos();
    const photo = photos.find((p) => p.id === photoId);
    if (!photo) return { newLikes: 0, isLiked: false };

    if (isCurrentlyLiked) {
      likedSet.delete(photoId);
      photo.likes = Math.max(0, photo.likes - 1);
    } else {
      likedSet.add(photoId);
      photo.likes += 1;
    }

    localStorage.setItem(STORAGE_KEYS.LIKED_PHOTOS, JSON.stringify(Array.from(likedSet)));
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
    return { newLikes: photo.likes, isLiked: !isCurrentlyLiked };
  } catch {
    return { newLikes: 1, isLiked: true };
  }
}

export function isPhotoLikedByMe(photoId: string): boolean {
  try {
    const likedRaw = localStorage.getItem(STORAGE_KEYS.LIKED_PHOTOS);
    if (!likedRaw) return false;
    const likedSet = new Set<string>(JSON.parse(likedRaw));
    return likedSet.has(photoId);
  } catch {
    return false;
  }
}

export function getGuestSession(eventId: string): GuestSession | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.GUEST_SESSION}_${eventId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveGuestSession(eventId: string, session: GuestSession): void {
  try {
    localStorage.setItem(`${STORAGE_KEYS.GUEST_SESSION}_${eventId}`, JSON.stringify(session));
  } catch {
    // Ignore storage quota
  }
}
