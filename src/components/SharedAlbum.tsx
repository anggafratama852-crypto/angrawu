import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Download, 
  Heart, 
  Search, 
  Sparkles, 
  Clock, 
  Lock, 
  Unlock, 
  Film, 
  Filter, 
  User, 
  Share2, 
  Check, 
  Loader2 
} from 'lucide-react';
import { EventData, Photo } from '../types';
import { PhotoDetailModal } from './PhotoDetailModal';
import { togglePhotoLike, isPhotoLikedByMe } from '../utils/storage';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';

interface SharedAlbumProps {
  event: EventData;
  photos: Photo[];
  onOpenGuestCamera: () => void;
  onManualReveal: () => void;
  onPhotoLiked: (photoId: string, newLikes: number) => void;
}

export const SharedAlbum: React.FC<SharedAlbumProps> = ({
  event,
  photos,
  onOpenGuestCamera,
  onManualReveal,
  onPhotoLiked,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'popular' | 'wishes'>('all');
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  // Check if revealed
  const isRevealed = 
    event.revealMode === 'instant' || 
    Boolean(event.isRevealedManually) || 
    (event.revealTime && new Date() >= new Date(event.revealTime));

  // Compute countdown if scheduled and not revealed yet
  useEffect(() => {
    if (isRevealed || !event.revealTime) return;

    const target = new Date(event.revealTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft(null);
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRevealed, event.revealTime]);

  // Filter photos
  const filteredPhotos = photos.filter((p) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.guestName.toLowerCase().includes(q);
      const matchTable = p.tableNumber?.toLowerCase().includes(q);
      const matchMsg = p.message?.toLowerCase().includes(q);
      if (!matchName && !matchTable && !matchMsg) return false;
    }

    if (filterMode === 'popular') {
      return p.likes >= 5;
    }
    if (filterMode === 'wishes') {
      return Boolean(p.message && p.message.trim().length > 0);
    }
    return true;
  });

  // Handle Quick Like directly on the card
  const handleCardLike = (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    const res = togglePhotoLike(photoId);
    onPhotoLiked(photoId, res.newLikes);
  };

  // Download All Photos as ZIP using JSZip
  const handleDownloadAllZip = async () => {
    if (photos.length === 0) {
      alert('Belum ada foto untuk diunduh.');
      return;
    }

    setIsZipping(true);
    setZipProgress(10);

    try {
      const zip = new JSZip();
      const folder = zip.folder(`SatuAlbum_${event.slug || 'pernikahan'}`) || zip;

      // Helper to fetch blob or dataURL
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        setZipProgress(Math.round(((i + 1) / photos.length) * 80) + 10);

        try {
          if (photo.imageUrl.startsWith('data:image')) {
            // Base64 dataURL
            const base64Data = photo.imageUrl.split(',')[1];
            folder.file(`${i + 1}_${photo.guestName.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`, base64Data, { base64: true });
          } else {
            // External URL fetch
            const resp = await fetch(photo.imageUrl);
            const blob = await resp.blob();
            folder.file(`${i + 1}_${photo.guestName.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`, blob);
          }
        } catch (fetchErr) {
          console.warn('Failed to bundle photo in ZIP:', photo.id, fetchErr);
        }
      }

      // Also include a text file with wishes
      let wishesText = `ALBUM PERNIKAHAN: ${event.title}\nPasangan: ${event.coupleNames}\nTanggal: ${event.eventDate}\nTotal Foto: ${photos.length}\n\n=== UCAPAN & DOA RESTU TAMU ===\n\n`;
      photos.forEach((p, idx) => {
        if (p.message) {
          wishesText += `[#${idx + 1}] Dari: ${p.guestName} (${p.tableNumber || 'Meja Tamu'})\n"${p.message}"\n\n`;
        }
      });
      folder.file('Ucapan_dan_Doa_Tamu.txt', wishesText);

      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `SatuAlbum_${event.coupleNames.replace(/[^a-zA-Z0-9]/g, '_')}_Lengkap.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.error('ZIP generation error:', err);
      alert('Terjadi kendala saat mengompresi album foto.');
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  // IF NOT REVEALED YET: SHOW DELAYED REVEAL COUNTDOWN ROOM
  if (!isRevealed) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-[#2C2420] text-white rounded-3xl p-8 sm:p-14 text-center border-4 border-[#473B33] shadow-2xl relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#E89271]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            
            {/* Lock Icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#3E322A] mx-auto flex items-center justify-center text-[#E89271] border border-[#55463C] shadow-lg animate-pulse">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase font-mono-retro font-bold text-amber-400 tracking-widest">
                SISTEM CUCI FILM ANALOG DIGITAL
              </span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-white mt-2">
                Album Masih Terkunci
              </h2>
              <p className="text-sm text-[#C8BCB3] mt-2 leading-relaxed">
                Roll film dari seluruh kamera tamu sedang "dicuci cetak". Nikmati sensasi nostalgia menunggu waktu reveal untuk melihat semua momen candid bersama!
              </p>
            </div>

            {/* Countdown Clock Display */}
            {timeLeft && (
              <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-sm mx-auto pt-2">
                <div className="bg-[#1C1613] p-4 rounded-2xl border border-[#443831] shadow-inner">
                  <span className="font-mono-retro text-3xl sm:text-4xl font-bold text-[#FFAE19] block">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-mono-retro text-stone-400">Jam</span>
                </div>
                <div className="bg-[#1C1613] p-4 rounded-2xl border border-[#443831] shadow-inner">
                  <span className="font-mono-retro text-3xl sm:text-4xl font-bold text-[#FFAE19] block">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-mono-retro text-stone-400">Menit</span>
                </div>
                <div className="bg-[#1C1613] p-4 rounded-2xl border border-[#443831] shadow-inner">
                  <span className="font-mono-retro text-3xl sm:text-4xl font-bold text-[#FFAE19] block">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-mono-retro text-stone-400">Detik</span>
                </div>
              </div>
            )}

            {/* Live Count */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#3A2F28] border border-[#524339] text-xs text-amber-200">
              <Film className="w-4 h-4 text-[#E89271]" />
              <span>Sudah terkumpul <strong>{photos.length} foto candid</strong> dari para tamu</span>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onOpenGuestCamera}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#E89271] hover:bg-[#d87f5d] text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Tetap Ambil Foto Baru</span>
              </button>

              {/* Host Quick Unlock */}
              <button
                onClick={onManualReveal}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#3D322B] hover:bg-[#504138] text-white text-xs font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Unlock className="w-4 h-4 text-emerald-400" />
                <span>Buka / Reveal Album Sekarang</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // IF REVEALED: FULL SHARED ALBUM GRID VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#2C2420] text-white p-6 sm:p-10 shadow-xl border border-[#44372F]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-mono-retro px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                ALBUM TERBUKA (REVEALED)
              </span>
              <span className="text-xs text-[#A89C92] font-mono-retro">
                {photos.length} Foto Terkumpul
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              {event.coupleNames ? `The Wedding of ${event.coupleNames}` : event.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#C8BCB3]">
              {event.venue} • {event.eventDate}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenGuestCamera}
              className="px-5 py-3 rounded-full bg-[#E89271] hover:bg-[#d87f5d] text-white font-semibold text-xs transition-all shadow-md flex items-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>Tambah Foto Anda</span>
            </button>

            <button
              onClick={handleDownloadAllZip}
              disabled={isZipping || photos.length === 0}
              className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors backdrop-blur-sm flex items-center space-x-2 disabled:opacity-50"
            >
              {isZipping ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Mengompresi ZIP ({zipProgress}%)...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Download Semua Foto (.ZIP)</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E7DCCE] shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Cari nama tamu, nomor meja, atau ucapan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#DCD0C3] text-xs focus:outline-none focus:ring-2 focus:ring-[#E89271] bg-[#FAF7F2]"
          />
          <Search className="w-4 h-4 text-[#A8988B] absolute left-3 top-3" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
              filterMode === 'all'
                ? 'bg-[#2C2420] text-white'
                : 'bg-[#FAF7F2] text-[#6C5E55] hover:bg-[#F2ECE3]'
            }`}
          >
            Semua ({photos.length})
          </button>
          <button
            onClick={() => setFilterMode('popular')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 flex items-center space-x-1 ${
              filterMode === 'popular'
                ? 'bg-[#2C2420] text-white'
                : 'bg-[#FAF7F2] text-[#6C5E55] hover:bg-[#F2ECE3]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Paling Populer</span>
          </button>
          <button
            onClick={() => setFilterMode('wishes')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
              filterMode === 'wishes'
                ? 'bg-[#2C2420] text-white'
                : 'bg-[#FAF7F2] text-[#6C5E55] hover:bg-[#F2ECE3]'
            }`}
          >
            Dengan Pesan Doa
          </button>
        </div>

      </div>

      {/* PHOTOS GRID */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E7DCCE] p-8 space-y-4">
          <Camera className="w-12 h-12 text-[#C8BCB3] mx-auto" />
          <h3 className="font-serif font-bold text-xl text-[#2C2420]">
            Belum ada foto yang cocok
          </h3>
          <p className="text-xs text-[#7B6E64] max-w-sm mx-auto">
            {searchQuery
              ? 'Coba ganti kata kunci pencarian Anda.'
              : 'Jadilah orang pertama yang mengabadikan momen di acara ini!'}
          </p>
          <button
            onClick={onOpenGuestCamera}
            className="px-5 py-2.5 rounded-full bg-[#E89271] text-white text-xs font-bold shadow"
          >
            Buka Kamera Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => {
            const isLiked = isPhotoLikedByMe(photo.id);
            return (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group cursor-pointer bg-white rounded-2xl p-3 pb-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E7DCCE] flex flex-col justify-between transform hover:-translate-y-1"
              >
                {/* Photo Frame */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black shadow-inner">
                  <img
                    src={photo.imageUrl}
                    alt={`Foto oleh ${photo.guestName}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Floating Like Button */}
                  <button
                    onClick={(e) => handleCardLike(e, photo.id)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-xs text-white flex items-center justify-center transition-all z-10 active:scale-90"
                    title="Sukai foto"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                  </button>
                </div>

                {/* Card Meta Details */}
                <div className="mt-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif font-bold text-[#2C2420] truncate">
                      {photo.guestName}
                    </span>
                    {photo.tableNumber && (
                      <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.2 rounded font-medium shrink-0">
                        {photo.tableNumber}
                      </span>
                    )}
                  </div>

                  {/* Message snippet if present */}
                  {photo.message && (
                    <p className="text-xs text-[#6C5E55] italic font-serif line-clamp-2 leading-relaxed bg-[#FAF7F2] p-2 rounded-lg border border-[#F2ECE3]">
                      "{photo.message}"
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-[#A8988B] pt-1 border-t border-gray-100">
                    <span className="font-mono-retro">
                      {new Date(photo.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                    <span className="flex items-center space-x-1 text-rose-600 font-semibold font-mono-retro">
                      <Heart className="w-3 h-3 fill-rose-500" />
                      <span>{photo.likes}</span>
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Photo Detail Modal */}
      <PhotoDetailModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onLikeChanged={onPhotoLiked}
      />

    </div>
  );
};
