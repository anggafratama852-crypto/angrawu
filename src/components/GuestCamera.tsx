import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  FlipHorizontal, 
  Zap, 
  ZapOff, 
  Sparkles, 
  Check, 
  Film, 
  User, 
  Upload, 
  ArrowLeft,
  Heart,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { EventData, Photo, GuestSession } from '../types';
import { FILM_PRESETS, processImageWithFilmFilter, formatRetroDateStamp } from '../utils/filmFilters';
import { playShutterSound, playFlashBeep } from '../utils/cameraAudio';
import { savePhoto, getGuestSession, saveGuestSession } from '../utils/storage';
import confetti from 'canvas-confetti';

interface GuestCameraProps {
  event: EventData;
  onPhotoTaken: (photo: Photo) => void;
  onNavigateToAlbum: () => void;
  onBackToHome: () => void;
}

export const GuestCamera: React.FC<GuestCameraProps> = ({
  event,
  onPhotoTaken,
  onNavigateToAlbum,
  onBackToHome,
}) => {
  // Guest Session State
  const [guestName, setGuestName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [shotsTaken, setShotsTaken] = useState(0);

  // Camera Hardware State
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [flashEnabled, setFlashEnabled] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [guestMessage, setGuestMessage] = useState('');

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const preset = FILM_PRESETS[event.preset] || FILM_PRESETS['kodak-portra'];
  const maxShots = event.photosPerGuest; // 0 means unlimited
  const shotsRemaining = maxShots > 0 ? Math.max(0, maxShots - shotsTaken) : 99;

  // Load existing session for this event
  useEffect(() => {
    const existing = getGuestSession(event.id);
    if (existing && existing.guestName) {
      setGuestName(existing.guestName);
      setTableNumber(existing.tableNumber || '');
      setShotsTaken(existing.shotsTaken || 0);
      setIsSessionStarted(true);
    }
  }, [event.id]);

  // Start Camera Stream
  useEffect(() => {
    if (!isSessionStarted) return;

    let isMounted = true;

    async function initCamera() {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setHasCameraPermission(true);
      } catch (err) {
        console.warn('Camera access error or unsupported:', err);
        if (isMounted) {
          setHasCameraPermission(false);
        }
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [isSessionStarted, facingMode]);

  // Handle flash sound on toggle
  const toggleFlash = () => {
    const next = !flashEnabled;
    setFlashEnabled(next);
    if (next) playFlashBeep();
  };

  // Switch Camera Front / Back
  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Start Guest Session form submit
  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const session: GuestSession = {
      guestName: guestName.trim(),
      tableNumber: tableNumber.trim(),
      shotsTaken: shotsTaken,
    };
    saveGuestSession(event.id, session);
    setIsSessionStarted(true);
  };

  // Capture Photo from Camera
  const handleCapture = async () => {
    if (maxShots > 0 && shotsTaken >= maxShots) {
      alert(`Anda telah menggunakan seluruh ${maxShots} kuota roll foto Anda! Terima kasih sudah mengabadikan momen.`);
      return;
    }

    // Play tactile audio shutter
    playShutterSound();

    // Trigger visual screen flash
    if (flashEnabled) {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 350);
    }

    setIsProcessing(true);
    setProcessingStep('Mengambil frame rana analog...');

    try {
      let dataUrl = '';

      if (videoRef.current && hasCameraPermission) {
        setProcessingStep(`Menerapkan ${preset.name} & cap tanggal retro...`);
        dataUrl = await processImageWithFilmFilter(videoRef.current, event.preset, {
          flashBoost: flashEnabled,
        });
      } else {
        throw new Error('Video stream tidak tersedia');
      }

      setCapturedPreview(dataUrl);
      setProcessingStep('');
    } catch (err) {
      console.error('Capture error:', err);
      alert('Gagal mengambil foto dari kamera. Anda bisa menggunakan opsi unggah file foto.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle File Upload Fallback
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playShutterSound();
    setIsProcessing(true);
    setProcessingStep('Mengembangkan foto dengan filter film...');

    try {
      const reader = new FileReader();
      reader.onload = async (eventLoad) => {
        const img = new Image();
        img.onload = async () => {
          const processedUrl = await processImageWithFilmFilter(img, event.preset, {
            flashBoost: flashEnabled,
          });
          setCapturedPreview(processedUrl);
          setIsProcessing(false);
          setProcessingStep('');
        };
        img.src = eventLoad.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File process error:', err);
      setIsProcessing(false);
    }
  };

  // Save Final Photo with Message
  const handleSaveAndSend = () => {
    if (!capturedPreview) return;

    const newPhoto: Photo = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventId: event.id,
      guestName: guestName || 'Tamu Istimewa',
      tableNumber: tableNumber ? (tableNumber.toLowerCase().includes('meja') ? tableNumber : `Meja ${tableNumber}`) : undefined,
      message: guestMessage.trim() || undefined,
      imageUrl: capturedPreview,
      filterId: event.preset,
      timestamp: new Date().toISOString(),
      likes: 1,
    };

    savePhoto(newPhoto);
    onPhotoTaken(newPhoto);

    // Update guest session shots
    const newShots = shotsTaken + 1;
    setShotsTaken(newShots);
    saveGuestSession(event.id, {
      guestName,
      tableNumber,
      shotsTaken: newShots,
    });

    // Festive celebration
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#E89271', '#F59E0B', '#10B981'],
    });

    // Reset captured preview
    setCapturedPreview(null);
    setGuestMessage('');
  };

  // VIEW 1: Guest Identification Welcome Screen
  if (!isSessionStarted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DCCE] shadow-xl relative overflow-hidden">
          {/* Top banner */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-[#E89271] to-rose-400" />

          <button
            onClick={onBackToHome}
            className="inline-flex items-center space-x-1.5 text-xs text-[#7B6E64] hover:text-[#2C2420] mb-5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="text-center space-y-2 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2C2420] to-[#554338] mx-auto flex items-center justify-center text-amber-200 shadow-md">
              <Camera className="w-7 h-7 text-[#E89271]" />
            </div>
            <h2 className="font-serif font-bold text-2xl text-[#2C2420]">
              Selamat Datang di Kamera Sekali Pakai
            </h2>
            <p className="text-xs font-serif italic text-[#8B4828]">
              {event.coupleNames ? `The Wedding of ${event.coupleNames}` : event.title}
            </p>
            <p className="text-xs text-[#6C5E55] leading-relaxed pt-1">
              {event.welcomeMessage}
            </p>
          </div>

          <form onSubmit={handleStartSession} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#443831] uppercase tracking-wider mb-1.5">
                Nama Anda <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dimas & Anisa"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D8C7B5] focus:outline-none focus:ring-2 focus:ring-[#E89271] text-sm bg-[#FAF7F2]"
                />
                <User className="w-4 h-4 text-[#A8988B] absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#443831] uppercase tracking-wider mb-1.5">
                Nomor Meja / Kategori (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Meja 4 / Bridesmaid / VIP"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#D8C7B5] focus:outline-none focus:ring-2 focus:ring-[#E89271] text-sm bg-[#FAF7F2]"
              />
            </div>

            {/* Film Preset info pill */}
            <div className="p-3 bg-[#FAF2E6] rounded-xl border border-[#E8DAC8] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Film className="w-4 h-4 text-[#E89271]" />
                <span className="font-semibold text-[#443831]">Roll Film Acara:</span>
              </div>
              <span className="font-mono-retro font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                {preset.name}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#2C2420] hover:bg-[#433831] text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <Camera className="w-4 h-4 text-[#E89271]" />
              <span>Buka Kamera Sekarang</span>
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={onNavigateToAlbum}
              className="text-xs text-[#8B7C72] hover:text-[#2C2420] underline font-medium"
            >
              Atau langsung lihat album bersama yang sudah ada
            </button>
          </div>
        </div>
      </div>
    );
  }

  // VIEW 2: Photo Captured Preview & Wish Message Dialog
  if (capturedPreview) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-6">
        <div className="max-w-md w-full bg-[#2C2420] text-white rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-[#473B33] space-y-5 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-[#473B33] pb-3 text-xs text-[#D3C7BD]">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono-retro font-bold text-amber-300">HASIL KAMERA DISPOSABLE</span>
            </div>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
              FILM DEVELOPED
            </span>
          </div>

          {/* Polaroid-like Photo Preview Box */}
          <div className="bg-[#FAF7F2] p-3 pb-5 rounded-2xl shadow-xl text-[#2C2420]">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black relative">
              <img
                src={capturedPreview}
                alt="Captured vintage"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-3 flex items-center justify-between px-1 text-xs text-[#7B6E64]">
              <span className="font-serif italic font-medium">{event.coupleNames}</span>
              <span className="font-mono-retro font-bold text-amber-800">
                {formatRetroDateStamp()}
              </span>
            </div>
          </div>

          {/* Form: Message / Wish for the couple */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#D3C7BD] mb-1">
                Tulis Pesan & Doa untuk Pengantin (Opsional):
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Happy wedding Rama & Shinta! Semoga bahagia selalu sampai maut memisahkan ❤️"
                value={guestMessage}
                onChange={(e) => setGuestMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1613] border border-[#4D4037] text-white text-xs placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#E89271]"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#A89C92]">
              <span>Pengirim: <strong>{guestName}</strong></span>
              {tableNumber && <span>{tableNumber}</span>}
            </div>
          </div>

          {/* Buttons: Kirim / Retake */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => {
                setCapturedPreview(null);
                setGuestMessage('');
              }}
              className="py-3 px-4 rounded-xl bg-[#3E332B] hover:bg-[#4E4137] text-white text-xs font-semibold transition-colors"
            >
              Jepret Ulang
            </button>
            <button
              onClick={handleSaveAndSend}
              className="py-3 px-4 rounded-xl bg-[#E89271] hover:bg-[#d87f5d] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan ke Album</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // VIEW 3: Handheld Vintage Disposable Camera Viewfinder
  return (
    <div className="relative max-w-lg mx-auto px-3 sm:px-4 py-4 select-none">
      
      {/* Visual Shutter Flash Screen Overlay */}
      {isFlashing && (
        <div className="fixed inset-0 bg-white z-50 pointer-events-none animate-flash" />
      )}

      {/* Camera Top Bar: Back & Profile */}
      <div className="flex items-center justify-between mb-3 text-xs text-[#7B6E64] px-1">
        <button
          onClick={onBackToHome}
          className="flex items-center space-x-1 text-[#54433A] hover:text-[#2C2420] font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Keluar Kamera</span>
        </button>

        <button
          onClick={onNavigateToAlbum}
          className="font-semibold text-[#E89271] hover:underline flex items-center space-x-1"
        >
          <Film className="w-3.5 h-3.5" />
          <span>Lihat Album Bersama ({shotsTaken} Foto Anda)</span>
        </button>
      </div>

      {/* THE DISPOSABLE CAMERA BODY CHASSIS */}
      <div className="relative bg-[#2C2420] rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-[#3D322B] text-white">
        
        {/* Camera Top Plate (Shutter Button, Counter, Flash Switch) */}
        <div className="flex items-center justify-between pb-4 border-b border-[#43372F] mb-4">
          
          {/* Guest Info & Film Roll Badge */}
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono-retro text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                {guestName}
              </span>
              {tableNumber && (
                <span className="text-[10px] bg-[#3E332B] px-1.5 py-0.2 rounded text-stone-300">
                  {tableNumber}
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#A89C92] font-mono-retro">
              PRESET: {preset.name.toUpperCase()}
            </p>
          </div>

          {/* Mechanical Shot Counter Dial */}
          <div className="flex items-center space-x-2">
            <div className="bg-[#1C1613] px-3 py-1 rounded-lg border-2 border-[#4A3D34] shadow-inner text-center">
              <span className="text-[9px] uppercase font-mono-retro text-stone-400 block tracking-tight">
                SISA FOTO
              </span>
              <span className="font-mono-retro text-base font-bold text-[#FFAE19] leading-none">
                {maxShots > 0 ? shotsRemaining : '∞'}
              </span>
            </div>
          </div>
        </div>

        {/* Central Camera Viewfinder Box */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black shadow-inner border-2 border-[#4A3D34]">
          
          {/* Video Stream */}
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              hasCameraPermission ? 'opacity-100' : 'opacity-20'
            }`}
          />

          {/* Developing Overlay if currently processing */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3 z-30 animate-fade-in">
              <Loader2 className="w-8 h-8 text-[#E89271] animate-spin" />
              <h4 className="font-serif font-bold text-base text-amber-200">
                Mencuci Roll Film Analog...
              </h4>
              <p className="text-xs text-[#A89C92] font-mono-retro">
                {processingStep || 'Menerapkan color grade & grain...'}
              </p>
            </div>
          )}

          {/* Camera Permission Denied or Not Started State */}
          {hasCameraPermission === false && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <AlertCircle className="w-10 h-10 text-amber-400" />
              <div>
                <h4 className="font-semibold text-sm text-white">Kamera Belum Diizinkan</h4>
                <p className="text-xs text-[#A89C92] mt-1 max-w-xs leading-relaxed">
                  Izinkan akses kamera di browser Anda, atau gunakan tombol di bawah untuk mengambil atau memilih foto dari galeri HP.
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-[#E89271] text-white text-xs font-bold shadow flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Pilih Foto dari Galeri</span>
              </button>
            </div>
          )}

          {/* Viewfinder Reticle / Vintage Optical Guides */}
          <div className="absolute inset-4 pointer-events-none flex flex-col justify-between border border-white/25 rounded-xl p-3">
            <div className="flex justify-between items-center text-[10px] font-mono-retro text-white/80">
              <span className="bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
                [+] {facingMode === 'environment' ? 'BACK CAM' : 'SELFIE'}
              </span>
              <span className="bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs text-amber-300">
                {flashEnabled ? '⚡ BLITZ AKTIF' : 'BLITZ MATI'}
              </span>
            </div>

            <div className="flex justify-between items-end">
              <span className="text-[11px] font-serif italic text-white/85 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs max-w-[180px] truncate">
                {event.coupleNames}
              </span>
              {/* Glowing retro orange date stamp preview */}
              <span className="font-mono-retro text-sm sm:text-lg font-bold text-[#FFAE19] drop-shadow-[0_0_6px_rgba(255,100,0,0.8)]">
                {formatRetroDateStamp()}
              </span>
            </div>
          </div>

        </div>

        {/* Camera Control Deck (Flash Toggle, Shutter Button, Switch Camera) */}
        <div className="mt-5 flex items-center justify-around">
          
          {/* Flash Toggle Button */}
          <button
            onClick={toggleFlash}
            className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${
              flashEnabled ? 'text-amber-400 bg-amber-400/10' : 'text-stone-400 hover:text-white'
            }`}
            title="Toggle Blitz"
          >
            <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center">
              {flashEnabled ? <Zap className="w-5 h-5 fill-amber-400" /> : <ZapOff className="w-5 h-5" />}
            </div>
            <span className="text-[9px] font-mono-retro uppercase tracking-wider">
              {flashEnabled ? 'Flash ON' : 'Flash OFF'}
            </span>
          </button>

          {/* THE BIG SHUTTER BUTTON */}
          <div className="relative group">
            <button
              onClick={handleCapture}
              disabled={isProcessing || (maxShots > 0 && shotsTaken >= maxShots)}
              className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#99341D] via-[#E85D36] to-[#F27E58] p-1.5 shadow-2xl transform active:scale-95 transition-all flex items-center justify-center border-4 border-[#1C1613] disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-105"
              aria-label="Ambil Foto Sekarang"
            >
              {/* Inner ring */}
              <div className="w-full h-full rounded-full border-2 border-white/40 flex items-center justify-center bg-radial from-[#F57B56] to-[#D94723]">
                <Camera className="w-7 h-7 text-white drop-shadow-sm" />
              </div>
            </button>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono-retro uppercase text-stone-400 whitespace-nowrap">
              JEPRET
            </span>
          </div>

          {/* Switch Facing Mode / Fallback upload */}
          <div className="flex flex-col items-center space-y-1">
            <button
              onClick={switchCamera}
              className="w-10 h-10 rounded-full border border-stone-500 hover:border-white text-stone-300 hover:text-white flex items-center justify-center transition-colors"
              title="Balik Kamera Depan / Belakang"
            >
              <FlipHorizontal className="w-5 h-5" />
            </button>
            <span className="text-[9px] font-mono-retro uppercase tracking-wider text-stone-400">
              Putar
            </span>
          </div>

        </div>

        {/* Bottom Auxiliary Action: Galeri File Upload */}
        <div className="mt-7 pt-4 border-t border-[#3E332B] flex items-center justify-between text-xs text-[#A89C92]">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1.5 hover:text-white transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-[#E89271]" />
            <span>Unggah dari Galeri HP</span>
          </button>

          <span className="font-mono-retro text-[10px] text-amber-200/60">
            AUTO-FILM COLOR GRADE
          </span>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

      </div>

      {/* Helpful Toast Reminder */}
      <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
        <Sparkles className="w-4 h-4 text-[#E89271] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Tips Kamera Sekali Pakai:</strong> Jangan ragu memotret momen candid tak terduga, tawa meja, dan pose spontan bersama teman-teman!
        </p>
      </div>

    </div>
  );
};
