import React from 'react';
import { Camera, Heart, Sparkles, ShieldCheck, Mail, Globe, Instagram } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenCreateModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCreateModal }) => {
  return (
    <footer className="bg-[#241E1A] text-[#D8CEC5] border-t border-[#3A312B] pt-14 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#E89271] flex items-center justify-center text-[#241E1A]">
                <Camera className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-2xl text-[#FAF7F2] tracking-tight">
                satualbum<span className="text-[#E89271]">.id</span>
              </span>
            </div>
            <p className="text-sm text-[#A89C92] max-w-md leading-relaxed">
              Kamera sekali pakai digital berbasis QR code untuk pernikahan dan momen perayaan di Indonesia.
              Ubah setiap tamu menjadi fotografer candid dengan nuansa film vintage tanpa instal aplikasi.
            </p>
            <div className="flex items-center space-x-3 text-xs text-[#8E8075] pt-2">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Preset Kodak Portra & Fuji QuickSnap</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Privat & Aman</span>
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-serif font-semibold text-white text-base mb-4">Fitur Utama</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('camera')} className="hover:text-white transition-colors text-left">
                  Kamera Tamu Retro (Disposable POV)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('album')} className="hover:text-white transition-colors text-left">
                  Galeri & Shared Album
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('slideshow')} className="hover:text-white transition-colors text-left">
                  Layar Panggung Proyektor Live
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('table-cards')} className="hover:text-white transition-colors text-left">
                  Generator Kartu Meja QR Siap Cetak
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors text-left">
                  Studio Pengaturan Acara
                </button>
              </li>
            </ul>
          </div>

          {/* Action & Info */}
          <div>
            <h4 className="font-serif font-semibold text-white text-base mb-4">Mulai Acara Anda</h4>
            <p className="text-xs text-[#A89C92] mb-4">
              Ingin pernikahan Anda memiliki sudut pandang intim dari meja tamu? Buat album dalam 60 detik.
            </p>
            <button
              onClick={onOpenCreateModal}
              className="w-full py-2.5 px-4 bg-[#E89271] hover:bg-[#d87f5d] text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              Buat Acara Baru (Gratis)
            </button>
            <div className="mt-4 flex items-center space-x-3 text-xs text-[#8E8075]">
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5" />
                <span>halo@satualbum.id</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Globe className="w-3.5 h-3.5" />
                <span>Indonesia</span>
              </span>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#332A25] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7B6E64] gap-4">
          <p>© {new Date().getFullYear()} SatuAlbum Indonesia. Terinspirasi oleh estetika film analog & cinta abadi.</p>
          <div className="flex items-center space-x-1 text-[#9E9085]">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 mx-0.5" />
            <span>untuk pernikahan di seluruh Nusantara</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
