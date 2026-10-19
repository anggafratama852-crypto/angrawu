import React, { useState } from 'react';
import { X, Heart, Download, Share2, Sparkles, User, Calendar, MapPin } from 'lucide-react';
import { Photo } from '../types';
import { FILM_PRESETS, formatRetroDateStamp } from '../utils/filmFilters';
import { togglePhotoLike, isPhotoLikedByMe } from '../utils/storage';

interface PhotoDetailModalProps {
  photo: Photo | null;
  onClose: () => void;
  onLikeChanged: (photoId: string, newLikes: number) => void;
}

export const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({
  photo,
  onClose,
  onLikeChanged,
}) => {
  if (!photo) return null;

  const isLiked = isPhotoLikedByMe(photo.id);
  const [likes, setLikes] = useState(photo.likes);
  const [liked, setLiked] = useState(isLiked);
  const preset = FILM_PRESETS[photo.filterId] || FILM_PRESETS['kodak-portra'];

  const handleLike = () => {
    const res = togglePhotoLike(photo.id);
    setLikes(res.newLikes);
    setLiked(res.isLiked);
    onLikeChanged(photo.id, res.newLikes);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.imageUrl;
    link.download = `SatuAlbum-${photo.guestName.replace(/\s+/g, '_')}-${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative max-w-2xl w-full bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#E7DCCE] animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Photo Container */}
        <div className="bg-black relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden flex items-center justify-center">
          <img
            src={photo.imageUrl}
            alt={`Foto oleh ${photo.guestName}`}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Details & Wishes Area */}
        <div className="p-6 sm:p-8 space-y-5">
          
          {/* Header Row: Guest Name & Table */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-xl text-[#2C2420]">
                  {photo.guestName}
                </span>
                {photo.tableNumber && (
                  <span className="text-xs bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                    {photo.tableNumber}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7B6E64] flex items-center space-x-1.5 font-mono-retro">
                <Calendar className="w-3.5 h-3.5 text-[#E89271]" />
                <span>
                  {new Date(photo.timestamp).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span>Preset: {preset.name}</span>
              </p>
            </div>

            {/* Like button */}
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border transition-all ${
                liked
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-stone-200 text-stone-600 hover:border-rose-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="text-xs font-bold">{likes}</span>
            </button>
          </div>

          {/* Sweet Message / Wedding Wish */}
          {photo.message ? (
            <div className="bg-[#FAF2E6] rounded-2xl p-4 border border-[#E7DCCE]">
              <p className="text-xs font-semibold text-[#8B4828] uppercase tracking-wider mb-1">
                Pesan & Doa Restu:
              </p>
              <p className="font-serif italic text-sm text-[#3E322A] leading-relaxed">
                "{photo.message}"
              </p>
            </div>
          ) : (
            <p className="text-xs italic text-[#A8988B]">Tidak ada pesan teks terlampir.</p>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#E7DCCE] flex items-center justify-between">
            <span className="text-xs text-[#8B7C72]">
              Kamera Sekali Pakai • SatuAlbum.id
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#2C2420] hover:bg-[#433831] text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <Download className="w-4 h-4 text-[#E89271]" />
                <span>Unduh Foto</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
