import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Film, 
  Clock, 
  Users, 
  Camera, 
  Image as ImageIcon, 
  Download, 
  Printer, 
  Tv, 
  Save, 
  Check, 
  Unlock, 
  Lock, 
  Sparkles, 
  AlertCircle,
  Share2,
  Trash2
} from 'lucide-react';
import { EventData, FilmPresetId, Photo } from '../types';
import { FILM_PRESETS } from '../utils/filmFilters';
import { saveEvent } from '../utils/storage';

interface HostDashboardProps {
  event: EventData;
  photos: Photo[];
  onUpdateEvent: (updated: EventData) => void;
  onNavigate: (view: string) => void;
  onDeletePhoto: (photoId: string) => void;
}

export const HostDashboard: React.FC<HostDashboardProps> = ({
  event,
  photos,
  onUpdateEvent,
  onNavigate,
  onDeletePhoto,
}) => {
  // Form states
  const [coupleNames, setCoupleNames] = useState(event.coupleNames);
  const [venue, setVenue] = useState(event.venue);
  const [welcomeMessage, setWelcomeMessage] = useState(event.welcomeMessage);
  const [selectedPreset, setSelectedPreset] = useState<FilmPresetId>(event.preset);
  const [photosPerGuest, setPhotosPerGuest] = useState(event.photosPerGuest);
  const [revealMode, setRevealMode] = useState<'instant' | 'scheduled'>(event.revealMode);
  const [revealTime, setRevealTime] = useState(event.revealTime || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Compute live stats
  const uniqueGuests = new Set(photos.map((p) => p.guestName.toLowerCase().trim())).size;
  const totalLikes = photos.reduce((acc, p) => acc + p.likes, 0);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: EventData = {
      ...event,
      coupleNames,
      venue,
      welcomeMessage,
      preset: selectedPreset,
      photosPerGuest: Number(photosPerGuest),
      revealMode,
      revealTime: revealTime || new Date().toISOString(),
    };
    saveEvent(updated);
    onUpdateEvent(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleToggleManualReveal = () => {
    const updated: EventData = {
      ...event,
      isRevealedManually: !event.isRevealedManually,
    };
    saveEvent(updated);
    onUpdateEvent(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E7DCCE]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono-retro uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 font-bold">
              STUDIO PENGANTIN
            </span>
            <span className="text-xs text-[#7B6E64]">Kelola Kamera Sekali Pakai & Pengaturan Acara</span>
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#2C2420] mt-1">
            {event.coupleNames ? `The Wedding of ${event.coupleNames}` : event.title}
          </h1>
        </div>

        {/* Action quick links */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('camera')}
            className="px-4 py-2 rounded-xl bg-[#2C2420] hover:bg-[#433831] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-[#E89271]" />
            <span>Kamera Tamu</span>
          </button>
          <button
            onClick={() => onNavigate('table-cards')}
            className="px-4 py-2 rounded-xl bg-white border border-[#D8C7B5] text-[#2C2420] text-xs font-semibold hover:bg-[#F3ECE1] flex items-center space-x-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#E89271]" />
            <span>Cetak Kartu QR</span>
          </button>
          <button
            onClick={() => onNavigate('slideshow')}
            className="px-4 py-2 rounded-xl bg-white border border-[#D8C7B5] text-[#2C2420] text-xs font-semibold hover:bg-[#F3ECE1] flex items-center space-x-1.5 transition-colors"
          >
            <Tv className="w-3.5 h-3.5 text-[#E89271]" />
            <span>Layar Panggung</span>
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-5 rounded-2xl border border-[#E7DCCE] shadow-xs">
          <div className="flex items-center justify-between text-[#8E8075] text-xs font-mono-retro">
            <span>TOTAL FOTO</span>
            <ImageIcon className="w-4 h-4 text-[#E89271]" />
          </div>
          <p className="font-serif font-bold text-3xl text-[#2C2420] mt-2">
            {photos.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Terkumpul di album</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7DCCE] shadow-xs">
          <div className="flex items-center justify-between text-[#8E8075] text-xs font-mono-retro">
            <span>TAMU KONTRIBUTOR</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif font-bold text-3xl text-[#2C2420] mt-2">
            {uniqueGuests}
          </p>
          <span className="text-[11px] text-[#7B6E64]">Orang telah memotret</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7DCCE] shadow-xs">
          <div className="flex items-center justify-between text-[#8E8075] text-xs font-mono-retro">
            <span>PRESET ROLL FILM</span>
            <Film className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="font-serif font-bold text-lg text-[#2C2420] mt-2 truncate">
            {FILM_PRESETS[event.preset]?.name || 'Portra 400'}
          </p>
          <span className="text-[11px] text-[#7B6E64]">Estetika seragam</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7DCCE] shadow-xs">
          <div className="flex items-center justify-between text-[#8E8075] text-xs font-mono-retro">
            <span>STATUS REVEAL</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              event.isRevealedManually || event.revealMode === 'instant'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {event.isRevealedManually || event.revealMode === 'instant' ? 'Terbuka' : 'Terkunci'}
            </span>
          </div>
          <button
            onClick={handleToggleManualReveal}
            className="text-[11px] text-[#E89271] hover:underline font-semibold mt-1 block"
          >
            {event.isRevealedManually ? 'Kunci Kembali' : 'Buka / Reveal Sekarang'}
          </button>
        </div>

      </div>

      {/* SETTINGS FORM & PHOTO MANAGEMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Settings Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DCCE] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#F2ECE3] pb-4">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#2C2420]">
                Pengaturan Kamera & Acara
              </h2>
              <p className="text-xs text-[#7B6E64]">Sesuaikan roll film, kuota foto, dan sambutan tamu</p>
            </div>
            {savedSuccess && (
              <span className="inline-flex items-center space-x-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>Tersimpan!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#443831] uppercase tracking-wider mb-1.5">
                  Nama Pasangan Pengantin
                </label>
                <input
                  type="text"
                  value={coupleNames}
                  onChange={(e) => setCoupleNames(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C7B5] text-xs focus:ring-2 focus:ring-[#E89271] bg-[#FAF7F2]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#443831] uppercase tracking-wider mb-1.5">
                  Lokasi / Venue Resepsi
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C7B5] text-xs focus:ring-2 focus:ring-[#E89271] bg-[#FAF7F2]"
                />
              </div>
            </div>

            {/* Film Preset Selector */}
            <div>
              <label className="block text-xs font-bold text-[#443831] uppercase tracking-wider mb-2">
                Pilih Preset Roll Film Analog Acara
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.values(FILM_PRESETS).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPreset(p.id)}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedPreset === p.id
                        ? 'border-[#E89271] bg-[#FAF2E6] shadow-xs'
                        : 'border-[#E7DCCE] hover:border-[#D8C7B5] bg-[#FFFDF9]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-bold text-xs text-[#2C2420]">{p.name}</span>
                      {selectedPreset === p.id && <Check className="w-3.5 h-3.5 text-[#E89271]" />}
                    </div>
                    <p className="text-[10px] text-[#7B6E64] line-clamp-2">{p.tagline}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quota Photos per Guest */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#443831] uppercase tracking-wider mb-1.5">
                  Batas Foto per Tamu
                </label>
                <select
                  value={photosPerGuest}
                  onChange={(e) => setPhotosPerGuest(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C7B5] text-xs focus:ring-2 focus:ring-[#E89271] bg-[#FAF7F2]"
                >
                  <option value={5}>5 Foto / Tamu</option>
                  <option value={10}>10 Foto / Tamu (Direkomendasikan)</option>
                  <option value={15}>15 Foto / Tamu</option>
                  <option value={0}>Tanpa Batas (Unlimited)</option>
                </select>
                <p className="text-[11px] text-[#8E8075] mt-1">
                  Membatasi kuota membuat tamu lebih selektif mengambil momen terbaik!
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#443831] uppercase tracking-wider mb-1.5">
                  Waktu Pengungkapan Album (Reveal)
                </label>
                <select
                  value={revealMode}
                  onChange={(e) => setRevealMode(e.target.value as 'instant' | 'scheduled')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C7B5] text-xs focus:ring-2 focus:ring-[#E89271] bg-[#FAF7F2]"
                >
                  <option value="instant">Instant (Langsung Terbuka)</option>
                  <option value="scheduled">Terjadwal (Sensasi Menunggu Cuci Film)</option>
                </select>
                <p className="text-[11px] text-[#8E8075] mt-1">
                  Pilih "Terjadwal" untuk membuka album pada jam 22:00 malam acara.
                </p>
              </div>
            </div>

            {/* Welcome message */}
            <div>
              <label className="block text-xs font-bold text-[#443831] uppercase tracking-wider mb-1.5">
                Pesan Sambutan untuk Tamu di Kamera
              </label>
              <textarea
                rows={2}
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C7B5] text-xs focus:ring-2 focus:ring-[#E89271] bg-[#FAF7F2]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#2C2420] hover:bg-[#433831] text-white text-xs font-bold transition-all shadow-md flex items-center space-x-2"
            >
              <Save className="w-4 h-4 text-[#E89271]" />
              <span>Simpan Perubahan Pengaturan</span>
            </button>

          </form>
        </div>

        {/* Quick Links & Moderation Side Box */}
        <div className="space-y-6">
          
          {/* Box 1: Quick QR Card Preview */}
          <div className="bg-[#FAF2E6] rounded-3xl p-6 border border-[#E7DCCE] space-y-4">
            <h3 className="font-serif font-bold text-base text-[#2C2420]">
              Bagikan Tautan Kamera Tamu
            </h3>
            <p className="text-xs text-[#6C5E55] leading-relaxed">
              Anda juga bisa membagikan link langsung ini ke grup WhatsApp keluarga, bridesmaid, atau wedding organizer.
            </p>
            <div className="p-3 bg-white rounded-xl border border-[#DECFC0] text-xs font-mono-retro text-[#7B6E64] truncate">
              {window.location.href}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Tautan acara berhasil disalin ke clipboard!');
              }}
              className="w-full py-2.5 rounded-xl bg-[#2C2420] text-white text-xs font-semibold hover:bg-[#433831] transition-colors"
            >
              Salin Tautan Acara
            </button>
          </div>

          {/* Box 2: Latest Photos stream to moderate */}
          <div className="bg-white rounded-3xl p-6 border border-[#E7DCCE] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#2C2420]">
                Foto Terbaru Tamu
              </h3>
              <span className="text-xs text-[#8E8075]">{photos.length} item</span>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {photos.slice(0, 6).map((photo) => (
                <div
                  key={photo.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#F2ECE3] text-xs"
                >
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.guestName}
                      className="w-10 h-10 rounded-lg object-cover bg-black shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-serif font-bold text-[#2C2420] truncate">{photo.guestName}</p>
                      <p className="text-[10px] text-[#8E8075] truncate">{photo.tableNumber || 'Tamu'}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeletePhoto(photo.id)}
                    className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    title="Hapus foto ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('album')}
              className="w-full py-2 text-center text-xs font-semibold text-[#E89271] hover:underline"
            >
              Lihat Semua di Galeri Album →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
