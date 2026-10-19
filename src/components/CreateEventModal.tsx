import React, { useState } from 'react';
import { X, Sparkles, Camera, Calendar, MapPin, Heart, Film, ArrowRight } from 'lucide-react';
import { EventData, FilmPresetId } from '../types';
import { FILM_PRESETS } from '../utils/filmFilters';
import { saveEvent } from '../utils/storage';
import confetti from 'canvas-confetti';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: EventData) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
}) => {
  const [coupleNames, setCoupleNames] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [venue, setVenue] = useState('');
  const [preset, setPreset] = useState<FilmPresetId>('kodak-portra');
  const [photosPerGuest, setPhotosPerGuest] = useState(10);
  const [welcomeMessage, setWelcomeMessage] = useState(
    'Terima kasih sudah hadir di hari bahagia kami! Scan QR, jepret foto candid terbaikmu, dan tulis pesan manis untuk kami berdua ✨'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupleNames.trim()) return;

    const slug = coupleNames
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newEvent: EventData = {
      id: `event-${Date.now()}`,
      slug: slug || 'wedding',
      title: `The Wedding of ${coupleNames.trim()}`,
      coupleNames: coupleNames.trim(),
      eventDate,
      venue: venue.trim() || 'Lokasi Resepsi',
      revealMode: 'instant',
      revealTime: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
      isRevealedManually: true,
      preset,
      photosPerGuest,
      welcomeMessage,
      coverUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      hostEmail: 'anggafratama852@gmail.com',
      createdAt: new Date().toISOString(),
    };

    saveEvent(newEvent);
    onEventCreated(newEvent);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-xl w-full bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E7DCCE] animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-200/60 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#E89271]" />
            <span>Kamera Sekali Pakai Baru</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#2C2420]">
            Buat Album Acara Pernikahan
          </h2>
          <p className="text-xs text-[#7B6E64]">
            Hanya butuh 1 menit untuk menyiapkan kamera retro digital dan kode QR untuk meja tamu Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-[#443831] uppercase tracking-wider mb-1.5">
              Nama Pasangan Pengantin <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Rian & Nadia"
              value={coupleNames}
              onChange={(e) => setCoupleNames(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D8C7B5] text-xs focus:ring-2 focus:ring-[#E89271] bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#443831] uppercase tracking-wider mb-1.5">
                Tanggal Acara
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D8C7B5] text-xs focus:ring-2 focus:ring-[#E89271] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#443831] uppercase tracking-wider mb-1.5">
                Lokasi / Venue Resepsi
              </label>
              <input
                type="text"
                placeholder="Contoh: Plataran Senayan, Jakarta"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D8C7B5] text-xs focus:ring-2 focus:ring-[#E89271] bg-white"
              />
            </div>
          </div>

          {/* Film Preset Selection */}
          <div>
            <label className="block text-xs font-bold text-[#443831] uppercase tracking-wider mb-1.5">
              Preset Film Analog untuk Seluruh Tamu
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(FILM_PRESETS).slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={`p-2.5 rounded-xl border-2 cursor-pointer transition-all text-left ${
                    preset === p.id
                      ? 'border-[#E89271] bg-amber-50 text-[#8B4828]'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  <p className="font-serif font-bold text-xs">{p.name}</p>
                  <p className="text-[10px] text-stone-500 line-clamp-1">{p.tagline}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Photos quota */}
          <div>
            <label className="block text-xs font-bold text-[#443831] uppercase tracking-wider mb-1.5">
              Batas Foto per Tamu
            </label>
            <select
              value={photosPerGuest}
              onChange={(e) => setPhotosPerGuest(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D8C7B5] text-xs focus:ring-2 focus:ring-[#E89271] bg-white"
            >
              <option value={5}>5 Foto / Tamu</option>
              <option value={10}>10 Foto / Tamu (Paling Populer)</option>
              <option value={15}>15 Foto / Tamu</option>
              <option value={0}>Unlimited (Bebas tanpa batas)</option>
            </select>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#2C2420] hover:bg-[#433831] text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <Camera className="w-4 h-4 text-[#E89271]" />
              <span>Buat Acara & Siapkan Kamera</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
