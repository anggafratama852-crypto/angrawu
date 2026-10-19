import React, { useState, useEffect } from 'react';
import { EventData, Photo } from './types';
import { 
  getStoredEvents, 
  getStoredPhotos, 
  saveEvent, 
  getEventById 
} from './utils/storage';
import { INITIAL_DEMO_EVENT } from './utils/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { GuestCamera } from './components/GuestCamera';
import { SharedAlbum } from './components/SharedAlbum';
import { LiveSlideshow } from './components/LiveSlideshow';
import { TableCardsGenerator } from './components/TableCardsGenerator';
import { HostDashboard } from './components/HostDashboard';
import { CreateEventModal } from './components/CreateEventModal';

export default function App() {
  // Active Event
  const [activeEvent, setActiveEvent] = useState<EventData>(() => {
    const events = getStoredEvents();
    return events[0] || INITIAL_DEMO_EVENT;
  });

  // Current view
  const [currentView, setCurrentView] = useState<string>('landing');
  const [photos, setPhotos] = useState<Photo[]>(() => {
    return getStoredPhotos(activeEvent.id);
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sync photos when active event changes
  useEffect(() => {
    setPhotos(getStoredPhotos(activeEvent.id));
  }, [activeEvent.id]);

  // Handle URL hash / parameter routing (e.g., if scanned from table QR code)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const hash = window.location.hash.replace('#', '');

    if (viewParam === 'camera' || hash === 'camera') {
      setCurrentView('camera');
    } else if (viewParam === 'album' || hash === 'album') {
      setCurrentView('album');
    } else if (viewParam === 'slideshow' || hash === 'slideshow') {
      setCurrentView('slideshow');
    }
  }, []);

  // Update URL hash when view changes without full reload
  const navigateTo = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'landing') {
      window.history.pushState(null, '', window.location.pathname);
    } else {
      window.history.pushState(null, '', `${window.location.pathname}#${view}`);
    }
  };

  // Photo handlers
  const handlePhotoTaken = (newPhoto: Photo) => {
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  const handlePhotoLiked = (photoId: string, newLikes: number) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, likes: newLikes } : p))
    );
  };

  const handleDeletePhoto = (photoId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus foto ini dari album?')) {
      const updated = photos.filter((p) => p.id !== photoId);
      setPhotos(updated);
      localStorage.setItem('satualbum_photos_v1', JSON.stringify(updated));
    }
  };

  // Host Reveal Handler
  const handleManualReveal = () => {
    const updated: EventData = {
      ...activeEvent,
      isRevealedManually: true,
    };
    saveEvent(updated);
    setActiveEvent(updated);
  };

  const handleEventCreated = (newEvent: EventData) => {
    setActiveEvent(newEvent);
    setPhotos([]);
    navigateTo('camera');
  };

  const handleUpdateEvent = (updated: EventData) => {
    setActiveEvent(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2C2420]">
      {/* Navigation bar (hidden in live slideshow fullscreen or print) */}
      {currentView !== 'slideshow' && (
        <Navbar
          currentView={currentView}
          onNavigate={navigateTo}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          activeEventTitle={activeEvent.coupleNames}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={navigateTo}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            activeEvent={activeEvent}
          />
        )}

        {currentView === 'camera' && (
          <GuestCamera
            event={activeEvent}
            onPhotoTaken={handlePhotoTaken}
            onNavigateToAlbum={() => navigateTo('album')}
            onBackToHome={() => navigateTo('landing')}
          />
        )}

        {currentView === 'album' && (
          <SharedAlbum
            event={activeEvent}
            photos={photos}
            onOpenGuestCamera={() => navigateTo('camera')}
            onManualReveal={handleManualReveal}
            onPhotoLiked={handlePhotoLiked}
          />
        )}

        {currentView === 'slideshow' && (
          <div className="p-2 sm:p-6">
            <LiveSlideshow
              event={activeEvent}
              photos={photos}
              onBack={() => navigateTo('landing')}
              onOpenGuestCamera={() => navigateTo('camera')}
            />
          </div>
        )}

        {currentView === 'table-cards' && (
          <TableCardsGenerator
            event={activeEvent}
            onBack={() => navigateTo('landing')}
            onOpenGuestCamera={() => navigateTo('camera')}
          />
        )}

        {currentView === 'dashboard' && (
          <HostDashboard
            event={activeEvent}
            photos={photos}
            onUpdateEvent={handleUpdateEvent}
            onNavigate={navigateTo}
            onDeletePhoto={handleDeletePhoto}
          />
        )}
      </main>

      {/* Footer (hidden in slideshow or camera) */}
      {currentView !== 'slideshow' && currentView !== 'camera' && (
        <Footer
          onNavigate={navigateTo}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />
      )}

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
}
