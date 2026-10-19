import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Sparkles, 
  QrCode, 
  ArrowLeft 
} from 'lucide-react';
import { EventData, Photo } from '../types';
import QRCode from 'qrcode';

interface LiveSlideshowProps {
  event: EventData;
  photos: Photo[];
  onBack: () => void;
  onOpenGuestCamera: () => void;
}

export const LiveSlideshow: React.FC<LiveSlideshowProps> = ({
  event,
  photos,
  onBack,
  onOpenGuestCamera,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Generate QR for corner of screen
  useEffect(() => {
    const currentUrl = window.location.href.split('?')[0];
    QRCode.toDataURL(currentUrl, {
      width: 250,
      margin: 1,
      color: { dark: '#2C2420', light: '#FFFFFF' },
    }).then(setQrDataUrl).catch(console.error);
  }, []);

  // Slideshow interval
  useEffect(() => {
    if (!isPlaying || photos.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [isPlaying, photos.length]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.warn);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.warn);
    }
  };

  const currentPhoto = photos[currentIndex] || photos[0];

  if (photos.length === 0) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-6 text-center">
        <div className="bg-[#2C2420] text-white p-10 rounded-3xl max-w-md space-y-4 border border-[#4A3E36]">
          <Tv className="w-12 h-12 text-[#E89271] mx-auto" />
          <h3 className="font-serif font-bold text-2xl">Layar Panggung Siap</h3>
          <p className="text-xs text-[#C8BCB3] leading-relaxed">
            Belum ada foto yang masuk untuk ditampilkan. Tamu dapat memindai QR code di meja untuk mulai memotret!
          </p>
          <button
            onClick={onOpenGuestCamera}
            className="px-6 py-2.5 rounded-full bg-[#E89271] text-white text-xs font-bold"
          >
            Mulai Jepret Foto Pertama
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-[90vh] bg-black text-white flex flex-col justify-between overflow-hidden select-none ${
      isFullscreen ? 'fixed inset-0 z-50 h-screen' : 'rounded-3xl border border-[#3E332B] shadow-2xl'
    }`}>
      
      {/* Background ambient blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-30 transition-all duration-1000 scale-110 pointer-events-none"
        style={{ backgroundImage: `url(${currentPhoto.imageUrl})` }}
      />

      {/* Top Floating Control Bar */}
      <div className="relative z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent">
        
        {/* Event Title Header */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
            title="Keluar Slideshow"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono-retro text-[11px] uppercase tracking-widest text-amber-400 font-bold">
                LIVE STAGE STREAM
              </span>
            </div>
            <h2 className="font-serif font-bold text-lg text-white">
              {event.coupleNames ? `The Wedding of ${event.coupleNames}` : event.title}
            </h2>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center space-x-3">
          <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono-retro text-white/80">
            {currentIndex + 1} / {photos.length}
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
            title={isPlaying ? 'Jeda Slideshow' : 'Putar Slideshow'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
            title="Layar Penuh (Fullscreen)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Main Focus: The Featured Photo Frame & Wishes */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center p-4 sm:p-8 gap-8 max-w-6xl mx-auto w-full">
        
        {/* Photo Box */}
        <div className="relative max-h-[65vh] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 bg-black flex items-center justify-center">
          <img
            key={currentPhoto.id}
            src={currentPhoto.imageUrl}
            alt={`Foto oleh ${currentPhoto.guestName}`}
            className="w-full h-full object-contain animate-fade-in"
          />

          {/* Left / Right Nav Arrows */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % photos.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Guest Caption & Wedding Wishes Side Card */}
        <div className="max-w-md w-full bg-black/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/15 space-y-5 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <p className="text-xs text-amber-300 font-mono-retro font-bold uppercase">
                DIPOTRET OLEH:
              </p>
              <h3 className="font-serif font-bold text-2xl text-white">
                {currentPhoto.guestName}
              </h3>
            </div>
            {currentPhoto.tableNumber && (
              <span className="text-xs bg-[#E89271] text-white px-2.5 py-1 rounded-full font-bold">
                {currentPhoto.tableNumber}
              </span>
            )}
          </div>

          {/* Romantic Wish Message */}
          {currentPhoto.message && (
            <div className="space-y-2">
              <span className="text-xs text-stone-400 font-mono-retro">PESAN & DOA RESTU:</span>
              <p className="font-serif italic text-lg sm:text-xl text-[#FAF7F2] leading-relaxed">
                "{currentPhoto.message}"
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 text-xs text-stone-400">
            <span className="font-mono-retro">
              {new Date(currentPhoto.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            </span>
            <span className="flex items-center space-x-1.5 text-rose-400 font-bold">
              <Heart className="w-4 h-4 fill-rose-400" />
              <span>{currentPhoto.likes} Suka</span>
            </span>
          </div>

        </div>

      </div>

      {/* Bottom Bar with Floating QR Code for Guests */}
      <div className="relative z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-t from-black/90 to-transparent">
        
        <div className="flex items-center space-x-4">
          {qrDataUrl && (
            <div className="p-1.5 bg-white rounded-xl shadow-lg border-2 border-amber-300 shrink-0">
              <img src={qrDataUrl} alt="Scan QR" className="w-14 h-14" />
            </div>
          )}
          <div className="hidden sm:block">
            <h4 className="font-serif font-bold text-sm text-white">
              Ingin fotomu tampil di layar panggung?
            </h4>
            <p className="text-xs text-[#C8BCB3]">
              Arahkan kamera ponsel Anda ke kode QR ini untuk mulai memotret!
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-stone-400 font-mono-retro">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>SATUALBUM DIGITAL PROJECTION</span>
        </div>

      </div>

    </div>
  );
};
