import React, { useState } from 'react';
import { 
  Camera, 
  Sparkles, 
  QrCode, 
  Tv, 
  Printer, 
  Heart, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  Layers, 
  Download, 
  ChevronRight, 
  HelpCircle,
  Film,
  Zap,
  ArrowRight
} from 'lucide-react';
import { EventData, FilmPresetId } from '../types';
import { FILM_PRESETS, formatRetroDateStamp } from '../utils/filmFilters';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onOpenCreateModal: () => void;
  activeEvent: EventData;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenCreateModal,
  activeEvent,
}) => {
  // Before / After Slider state
  const [sliderPos, setSliderPos] = useState(55);
  const [activePresetPreview, setActivePresetPreview] = useState<FilmPresetId>('kodak-portra');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const presetsList = Object.values(FILM_PRESETS);

  const faqs = [
    {
      q: 'Apakah tamu undangan harus mengunduh aplikasi terlebih dahulu?',
      a: 'Sama sekali tidak! Tamu cukup mengarahkan kamera ponsel ke kode QR di kartu meja. Tautan langsung membuka kamera sekali pakai vintage di browser (Safari, Chrome, Samsung Internet) dalam 2 detik.',
    },
    {
      q: 'Apa bedanya dengan tamu memotret pakai kamera ponsel biasa lalu kirim ke WhatsApp?',
      a: 'Dengan WhatsApp, foto sering terkompresi, tamu malas kirim, dan tercecer di puluhan obrolan. Di SatuAlbum, setiap jepretan otomatis diselaraskan dengan estetika film analog pilihan (misal Kodak Portra 400), diberi cap tanggal retro oranye, dan langsung terpusat ke satu album bersama pengantin beserta ucapan doa.',
    },
    {
      q: 'Bagaimana cara kerja fitur "Reveal / Waktu Buka Album"?',
      a: 'Anda bisa mengatur apakah foto bisa langsung dilihat oleh para tamu (Instant), atau terkunci dan baru diungkapkan pada jam tertentu (misal pukul 22:00 malam setelah resepsi). Ini menghadirkan sensasi nostalgia analog menunggu roll film "dicuci cetak"!',
    },
    {
      q: 'Apakah saya sebagai pengantin bisa mengunduh semua foto resolusi asli?',
      a: 'Tentu saja! Di studio pengantin, tersedia tombol "Download Semua Foto (.ZIP)" satu klik untuk menyimpan seluruh momen candid tamu Anda langsung ke komputer atau Google Drive.',
    },
    {
      q: 'Bagaimana cara memasang foto live di proyektor panggung?',
      a: 'Buka fitur "Layar Panggung" di laptop yang terhubung ke proyektor atau videotron ballroom. Layar akan menampilkan slideshow foto-foto tamu secara real-time yang memukau dengan QR code di pojok.',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-8 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Top Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#EFE6D8] border border-[#DFCFC0] text-xs font-semibold text-[#54433A] mb-6 shadow-xs animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#E89271] animate-pulse"></span>
            <span>Kamera Sekali Pakai Digital Berbasis QR</span>
            <span className="text-[#A18F84]">|</span>
            <span className="text-[#964726]">Tanpa Download Aplikasi</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#241E1A] leading-[1.15] max-w-4xl mx-auto">
            Tangkap Setiap Sudut Momen Pernikahan dari{' '}
            <span className="italic underline decoration-[#E89271]/60 decoration-wavy decoration-2 text-[#9A4624]">
              Mata Tamu Anda
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-[#6B5E55] max-w-2xl mx-auto leading-relaxed">
            Biarkan teman & keluarga menjadi fotografer momen candid. Cukup scan QR code di meja, jepret dengan filter film analog nostalgia, dan satukan semua kenangan ke dalam satu album.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('camera')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#2C2420] hover:bg-[#433831] text-[#FAF7F2] font-semibold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-3 group"
            >
              <Camera className="w-5 h-5 text-[#E89271] group-hover:rotate-12 transition-transform" />
              <span>Coba Demo Kamera Tamu</span>
              <ArrowRight className="w-4 h-4 text-amber-200 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenCreateModal}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#E89271] hover:bg-[#d87f5d] text-white font-semibold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Buat Acara Baru (Gratis)</span>
            </button>
          </div>

          {/* Mini Quick Access to Demo Event */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-[#8E8075]">
            <span>Sedang melihat acara demo:</span>
            <button 
              onClick={() => onNavigate('album')}
              className="font-medium text-[#2C2420] hover:text-[#E89271] underline inline-flex items-center space-x-1"
            >
              <span>{activeEvent.title}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hero Feature Visual: Handheld Disposable Camera Mockup Preview */}
          <div className="mt-14 max-w-4xl mx-auto relative">
            <div className="relative mx-auto rounded-3xl bg-gradient-to-b from-[#332A24] to-[#1C1613] p-4 sm:p-7 shadow-2xl border-4 border-[#473B33] text-left">
              
              {/* Camera Top Details */}
              <div className="flex items-center justify-between pb-4 border-b border-[#4A3E36] mb-4 text-[#D3C7BD]">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <span className="font-mono-retro text-xs uppercase tracking-wider font-bold text-amber-400">
                    DISPOSABLE VIEW • READY
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs font-mono-retro">
                  <span className="bg-[#261E1A] px-2.5 py-1 rounded text-amber-300 border border-amber-900/40">
                    FILM: KODAK PORTRA 400
                  </span>
                  <span className="bg-[#261E1A] px-2.5 py-1 rounded text-emerald-400 border border-emerald-900/40">
                    SISA: 8 / 10 SHOTS
                  </span>
                </div>
              </div>

              {/* Viewfinder Preview Image with authentic date stamp */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/9] shadow-inner bg-black">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
                  alt="Wedding Candid Preview"
                  className="w-full h-full object-cover sepia-[0.18] contrast-[1.08] brightness-[1.05] saturate-[1.12]"
                />
                
                {/* Viewfinder corner guides */}
                <div className="absolute inset-5 pointer-events-none border border-white/30 rounded-lg flex flex-col justify-between p-3">
                  <div className="flex justify-between text-white/70 font-mono-retro text-[10px]">
                    <span>[+] FOCUS</span>
                    <span>ISO 400</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-white/80 text-xs font-serif italic bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                      "Rama & Shinta's Big Day"
                    </span>
                    <span className="font-mono-retro text-lg sm:text-2xl font-bold text-[#FFAE19] drop-shadow-[0_0_8px_rgba(255,100,0,0.8)] tracking-wider">
                      {formatRetroDateStamp()}
                    </span>
                  </div>
                </div>

                {/* Shutter Button floating prompt */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors">
                  <button
                    onClick={() => onNavigate('camera')}
                    className="px-5 py-3 rounded-full bg-white/90 hover:bg-white text-[#2C2420] text-sm font-bold shadow-xl backdrop-blur-sm flex items-center space-x-2 transform hover:scale-105 transition-all"
                  >
                    <Camera className="w-4 h-4 text-[#E89271]" />
                    <span>Klik Untuk Buka Kamera Tamu Langsung</span>
                  </button>
                </div>
              </div>

              {/* Camera Bottom Bar */}
              <div className="pt-4 flex items-center justify-between text-xs text-[#A89C92]">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Blitz Lampu Otomatis Aktif</span>
                </div>
                <span className="font-mono-retro text-amber-200/70">SATUALBUM DISPOSABLE CAM 35MM</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. INTERACTIVE BEFORE / AFTER SLIDER: PRESET FILM COMPARISON */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase font-mono-retro text-[#E89271] font-bold tracking-widest">
            ESTETIKA FILM KONSISTEN
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2420] mt-2">
            Bukan Sekadar Foto HP, Ini Nuansa Film Analog Nostalgia
          </h2>
          <p className="text-[#6B5E55] mt-3 text-sm sm:text-base">
            Setiap tamu memotret dari berbagai merek HP yang berbeda, namun SatuAlbum otomatis menyelaraskan warna dengan preset film legendaris dan cap tanggal oranye 90-an.
          </p>

          {/* Preset Switcher tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {presetsList.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setActivePresetPreview(preset.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activePresetPreview === preset.id
                    ? 'bg-[#2C2420] text-white shadow-xs'
                    : 'bg-[#EFE6D8] text-[#54433A] hover:bg-[#E5D9C8]'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Before / After Slider Box */}
        <div className="relative max-w-4xl mx-auto aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-xl border border-[#DECFC0] select-none bg-black">
          {/* AFTER (Filtered) Image Layer */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=1200&q=80"
              alt="Film Graded Wedding"
              className={`w-full h-full object-cover ${FILM_PRESETS[activePresetPreview].filterClass}`}
            />
            {/* Retro Date Stamp */}
            <div className="absolute bottom-4 right-5 font-mono-retro text-lg sm:text-2xl font-bold text-[#FFAE19] drop-shadow-[0_0_8px_rgba(255,100,0,0.8)]">
              {formatRetroDateStamp()}
            </div>
            {/* Label After */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-200 border border-amber-500/30">
              Hasil SatuAlbum: {FILM_PRESETS[activePresetPreview].name}
            </div>
          </div>

          {/* BEFORE (Raw Phone) Image Layer with Clip Path */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src="https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=1200&q=80"
              alt="Raw Phone Camera"
              className="w-full h-full object-cover max-w-none"
              style={{ width: '100%', height: '100%', minWidth: '100%' }}
            />
            {/* Label Before */}
            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#2C2420] border border-black/10">
              Kamera HP Standar (Sebelum)
            </div>
          </div>

          {/* Slider Divider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize flex items-center justify-center"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-9 h-9 rounded-full bg-white shadow-lg border-2 border-[#2C2420] flex items-center justify-center text-[#2C2420]">
              <Sliders className="w-4 h-4 rotate-90" />
            </div>
          </div>

          {/* Native Range input overlaid for smooth dragging */}
          <input
            type="range"
            min="5"
            max="95"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-10"
            aria-label="Before after comparison slider"
          />
        </div>

        <p className="text-center text-xs text-[#8E8075] mt-3">
          💡 Geser garis di tengah untuk membandingkan foto mentah vs hasil olahan film analog SatuAlbum.
        </p>
      </section>

      {/* 3. HEAD-TO-HEAD COMPARISON: DISPOSABLE ANALOG FISIK VS SATUALBUM */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF2E6] rounded-3xl p-6 sm:p-12 border border-[#E5D7C5]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-mono-retro text-[#E89271] font-bold tracking-widest">
              PERBANDINGAN CERDAS
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#2C2420] mt-2">
              Kamera Sekali Pakai Analog vs SatuAlbum.id
            </h2>
            <p className="text-[#6B5E55] mt-2 text-sm">
              Sama-sama memberikan pengalaman candid nostalgia, tetapi tanpa risiko foto rusak dan biaya jutaan rupiah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Box Analog Fisik */}
            <div className="bg-white/70 rounded-2xl p-6 border border-[#E2D5C4] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EADFCF]">
                <h3 className="font-serif font-bold text-lg text-[#5A4D45]">Kamera Analog Fisik</h3>
                <span className="text-xs bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-semibold">
                  Biaya Tinggi & Berisiko
                </span>
              </div>
              <ul className="space-y-3 text-sm text-[#6C5E55]">
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Biaya beli kamera Rp 250k - Rp 400k per meja (15 meja = ~Rp 4,5 Juta).</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Biaya cuci cetak film tambahan Rp 80k - Rp 150k per roll.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Banyak foto terbakar, gelap gulita, atau blur karena tamu lupa nyalakan flash.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Ribet mengumpulkan kembali kamera fisik dari meja setelah acara bubar.</span>
                </li>
              </ul>
            </div>

            {/* Box SatuAlbum.id */}
            <div className="bg-[#2C2420] text-white rounded-2xl p-6 border border-[#43372F] space-y-4 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E89271]/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between pb-3 border-b border-[#43372F]">
                <div className="flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-[#E89271]" />
                  <h3 className="font-serif font-bold text-lg text-white">SatuAlbum.id Digital</h3>
                </div>
                <span className="text-xs bg-[#E89271] text-white px-2.5 py-0.5 rounded-full font-bold">
                  Solusi Praktis & Hemat
                </span>
              </div>
              <ul className="space-y-3 text-sm text-[#D3C7BD]">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Hemat hingga 80-90%, cukup cetak kartu QR meja yang anggun.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Estetika film analog (Portra 400, CineStill) diterapkan otomatis dengan jernih.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Tamu bisa menulis pesan doa & nomor meja bersama setiap foto.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Fitur Reveal seru, Live Slideshow panggung, dan unduh semua foto dalam ZIP.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CARA KERJA 3 LANGKAH MUDAH */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-mono-retro text-[#E89271] font-bold tracking-widest">
            ALUR MUDAH
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2420] mt-2">
            Bagaimana SatuAlbum Bekerja di Hari Pernikahan Anda?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-7 border border-[#EADBCC] shadow-xs hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-serif font-bold text-xl mb-5">
              1
            </div>
            <h3 className="font-serif font-bold text-xl text-[#2C2420] mb-2">
              Buat Acara & Cetak Kartu Meja QR
            </h3>
            <p className="text-sm text-[#6C5E55] leading-relaxed">
              Tentukan nama pasangan, pilih preset film favorit (Portra atau Fuji), dan gunakan fitur cetak otomatis kartu meja QR berdesain elegan.
            </p>
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center text-xs text-[#E89271] font-semibold">
              <Printer className="w-4 h-4 mr-1.5" />
              <span>Desain kartu meja siap cetak A6/A5</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-7 border border-[#EADBCC] shadow-xs hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-900 flex items-center justify-center font-serif font-bold text-xl mb-5">
              2
            </div>
            <h3 className="font-serif font-bold text-xl text-[#2C2420] mb-2">
              Tamu Scan QR & Jepret Tanpa Aplikasi
            </h3>
            <p className="text-sm text-[#6C5E55] leading-relaxed">
              Setiap tamu mengarahkan kamera HP ke QR kartu meja, memasukkan nama mereka, dan langsung memotret dengan kamera retro disposable.
            </p>
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center text-xs text-[#E89271] font-semibold">
              <Camera className="w-4 h-4 mr-1.5" />
              <span>Suara shutter klik & blitz retro</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-7 border border-[#EADBCC] shadow-xs hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center font-serif font-bold text-xl mb-5">
              3
            </div>
            <h3 className="font-serif font-bold text-xl text-[#2C2420] mb-2">
              Album Terkumpul & Diungkapkan Bersama
            </h3>
            <p className="text-sm text-[#6C5E55] leading-relaxed">
              Tunggu waktu Reveal di akhir resepsi untuk melihat ratusan momen candid tak terduga yang diabadikan teman dan kerabat Anda!
            </p>
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center text-xs text-[#E89271] font-semibold">
              <Clock className="w-4 h-4 mr-1.5" />
              <span>Hitung mundur reveal & unduh ZIP</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FITUR UNGGULAN: LIVE SLIDESHOW & PRINTABLE CARDS SHOWCASE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Card 1: Live Slideshow Panggung */}
          <div className="bg-gradient-to-br from-[#2D231E] to-[#1A1411] rounded-3xl p-8 text-white space-y-5 shadow-xl border border-[#40332B]">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Tv className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-white">
              Layar Panggung & Proyektor Real-Time
            </h3>
            <p className="text-sm text-[#C8BCB3] leading-relaxed">
              Tampilkan foto-foto kiriman tamu secara live di videotron atau layar proyektor panggung. Suasana resepsi jadi lebih interaktif dan tamu semakin bersemangat mengabadikan momen!
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('slideshow')}
                className="inline-flex items-center space-x-2 text-sm font-semibold text-[#E89271] hover:text-white transition-colors"
              >
                <span>Buka Mode Layar Panggung</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Generator Kartu Meja QR */}
          <div className="bg-white rounded-3xl p-8 space-y-5 shadow-md border border-[#E7DCCE]">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-[#2C2420]">
              Generator Kartu Meja QR Siap Cetak
            </h3>
            <p className="text-sm text-[#6C5E55] leading-relaxed">
              Tak perlu sewa desainer grafis. SatuAlbum menyediakan generator kartu meja akrilik / tent card otomatis berisikan QR code unik acara, nama pasangan, dan nomor meja (Meja 1-20 / VIP).
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('table-cards')}
                className="inline-flex items-center space-x-2 text-sm font-semibold text-[#E89271] hover:text-[#2C2420] transition-colors"
              >
                <span>Desain & Cetak Kartu Meja Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. PAKET HARGA TRANSPARAN (RUPIAH INDONESIA) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-mono-retro text-[#E89271] font-bold tracking-widest">
            BIAYA TERJANGKAU
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2420] mt-2">
            Pilihan Paket untuk Setiap Skala Acara
          </h2>
          <p className="text-[#6B5E55] mt-2 text-sm">
            Tanpa langganan bulanan. Sekali bayar untuk seluruh rangkaian hari bahagia Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Paket 1: Uji Coba Gratis */}
          <div className="bg-white rounded-3xl p-7 border border-[#E7DCCE] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                Uji Coba Gratis
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#2C2420] mt-3">Free Trial</h3>
              <p className="text-xs text-[#7B6E64] mt-1">Cocok untuk mencoba bersama keluarga dekat.</p>
              
              <div className="mt-6 mb-6">
                <span className="text-3xl font-bold text-[#2C2420]">Rp 0</span>
                <span className="text-xs text-[#7B6E64]"> / selamanya</span>
              </div>

              <ul className="space-y-3 text-xs text-[#5E5249]">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Hingga 5 Tamu Berkontribusi</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>10 Foto per Tamu</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Preset Kodak Portra 400</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>QR Code Acara Digital</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <button
                onClick={onOpenCreateModal}
                className="w-full py-3 rounded-xl border-2 border-[#2C2420] text-[#2C2420] font-semibold text-xs hover:bg-[#2C2420] hover:text-white transition-colors"
              >
                Mulai Uji Coba Gratis
              </button>
            </div>
          </div>

          {/* Paket 2: Intimate Wedding (Popular) */}
          <div className="bg-[#FAF2E6] rounded-3xl p-7 border-2 border-[#E89271] shadow-lg flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E89271] text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Paling Populer
            </div>

            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                Intimate Gathering
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#2C2420] mt-3">Intimate Wedding</h3>
              <p className="text-xs text-[#7B6E64] mt-1">Untuk akad nikah & intimate dinner.</p>
              
              <div className="mt-6 mb-6">
                <span className="text-3xl font-bold text-[#2C2420]">Rp 249.000</span>
                <span className="text-xs text-[#7B6E64]"> / satu acara</span>
              </div>

              <ul className="space-y-3 text-xs text-[#5E5249]">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Hingga 50 Tamu Berkontribusi</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Pilihan 6 Preset Film Lengkap</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Generator Kartu Meja Siap Print</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Mode Slideshow Layar Panggung</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Unduh Semua Foto (.ZIP Full Res)</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <button
                onClick={onOpenCreateModal}
                className="w-full py-3 rounded-xl bg-[#E89271] hover:bg-[#d87f5d] text-white font-semibold text-xs shadow-md transition-all"
              >
                Pilih Paket Intimate
              </button>
            </div>
          </div>

          {/* Paket 3: Grand Wedding */}
          <div className="bg-white rounded-3xl p-7 border border-[#E7DCCE] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-800">
                Grand Ballroom
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#2C2420] mt-3">Grand Celebration</h3>
              <p className="text-xs text-[#7B6E64] mt-1">Untuk pesta resepsi besar ratusan tamu.</p>
              
              <div className="mt-6 mb-6">
                <span className="text-3xl font-bold text-[#2C2420]">Rp 499.000</span>
                <span className="text-xs text-[#7B6E64]"> / satu acara</span>
              </div>

              <ul className="space-y-3 text-xs text-[#5E5249]">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span><strong>Tamu Tanpa Batas (Unlimited)</strong></span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Foto Per Tamu Bebas / Unlimited</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Semua Fitur Intimate + Prioritas Support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Penyimpanan Album Selamanya (Lifetime)</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <button
                onClick={onOpenCreateModal}
                className="w-full py-3 rounded-xl bg-[#2C2420] hover:bg-[#433831] text-white font-semibold text-xs transition-colors"
              >
                Pilih Grand Celebration
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 7. FAQ PERTANYAAN POPULER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-mono-retro text-[#E89271] font-bold tracking-widest">
            TANYA JAWAB
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#2C2420] mt-2">
            Pertanyaan yang Sering Diajukan
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#E9DFC2] overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between font-serif font-semibold text-[#2C2420] text-base"
              >
                <span>{faq.q}</span>
                <span className="text-xl text-[#E89271] ml-4 font-mono-retro">
                  {openFaq === idx ? '−' : '+'}
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-sm text-[#6C5E55] leading-relaxed border-t border-[#F2EAE0] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. BOTTOM CTA BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#2C2420] via-[#382D27] to-[#2C2420] rounded-3xl p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Abadikan Keajaiban Pernikahan Anda Hari Ini
            </h2>
            <p className="text-[#C8BCB3] text-sm sm:text-base">
              Hadirkan kehangatan kamera analog digital yang akan selalu Anda dan pasangan kenang sepanjang masa.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenCreateModal}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#E89271] hover:bg-[#d87f5d] text-white font-semibold text-sm transition-all shadow-md"
              >
                Buat Album Acara Anda Sekarang
              </button>
              <button
                onClick={() => onNavigate('camera')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all backdrop-blur-sm"
              >
                Coba Kamera Tamu (Demo)
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
