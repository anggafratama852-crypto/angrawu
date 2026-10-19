import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Camera, 
  Sparkles, 
  QrCode, 
  Download, 
  ArrowLeft, 
  Check, 
  Layers, 
  Settings2,
  Sliders
} from 'lucide-react';
import { EventData } from '../types';
import QRCode from 'qrcode';

interface TableCardsGeneratorProps {
  event: EventData;
  onBack: () => void;
  onOpenGuestCamera: () => void;
}

export const TableCardsGenerator: React.FC<TableCardsGeneratorProps> = ({
  event,
  onBack,
  onOpenGuestCamera,
}) => {
  const [tableCount, setTableCount] = useState(12);
  const [includeVip, setIncludeVip] = useState(true);
  const [includeFamily, setIncludeFamily] = useState(true);
  const [cardTheme, setCardTheme] = useState<'ivory' | 'luxe' | 'retro'>('ivory');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState(
    'Bantu kami mengabadikan setiap senyum & tawa di hari bahagia ini!'
  );

  // Generate QR Code
  useEffect(() => {
    const currentUrl = window.location.href.split('#')[0].split('?')[0];
    QRCode.toDataURL(currentUrl, {
      width: 400,
      margin: 1,
      color: {
        dark: '#2C2420',
        light: '#FFFFFF',
      },
    })
      .then(setQrDataUrl)
      .catch(console.error);
  }, []);

  // Generate list of table names
  const tableList: string[] = [];
  if (includeVip) tableList.push('Meja VIP');
  if (includeFamily) tableList.push('Meja Keluarga');
  for (let i = 1; i <= tableCount; i++) {
    tableList.push(`Meja ${i}`);
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner (Hidden in print) */}
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E7DCCE]">
        <div className="space-y-1">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 text-xs text-[#7B6E64] hover:text-[#2C2420] mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>
          <h1 className="font-serif font-bold text-3xl text-[#2C2420]">
            Generator Kartu Meja QR Siap Cetak
          </h1>
          <p className="text-xs sm:text-sm text-[#6C5E55]">
            Cetak kartu meja akrilik atau tent-card untuk diletakkan di setiap meja resepsi.
          </p>
        </div>

        {/* Print Action */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenGuestCamera}
            className="px-4 py-2.5 rounded-xl border border-[#D8C7B5] text-[#2C2420] text-xs font-semibold hover:bg-[#F3ECE1] transition-colors"
          >
            Tes Kamera Tamu
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-xl bg-[#2C2420] hover:bg-[#433831] text-white text-xs font-bold transition-all shadow-md flex items-center space-x-2"
          >
            <Printer className="w-4 h-4 text-[#E89271]" />
            <span>Cetak / Simpan PDF (Print)</span>
          </button>
        </div>
      </div>

      {/* Configuration Controls (Hidden in print) */}
      <div className="no-print bg-white p-6 rounded-2xl border border-[#E7DCCE] shadow-xs grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Table count */}
        <div>
          <label className="block text-xs font-bold text-[#443831] uppercase tracking-wider mb-2">
            Jumlah Meja Bernomor
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={tableCount}
            onChange={(e) => setTableCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] text-xs bg-[#FAF7F2]"
          />
          <p className="text-[11px] text-[#8E8075] mt-1">Meja 1 s/d Meja {tableCount}</p>
        </div>

        {/* Special tables checkboxes */}
        <div>
          <label className="block text-xs font-bold text-[#443831] uppercase tracking-wider mb-2">
            Meja Khusus
          </label>
          <div className="space-y-2 text-xs text-[#5C4F46]">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeVip}
                onChange={(e) => setIncludeVip(e.target.checked)}
                className="rounded text-[#E89271] focus:ring-[#E89271]"
              />
              <span>Sertakan Meja VIP</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeFamily}
                onChange={(e) => setIncludeFamily(e.target.checked)}
                className="rounded text-[#E89271] focus:ring-[#E89271]"
              />
              <span>Sertakan Meja Keluarga</span>
            </label>
          </div>
        </div>

        {/* Theme select */}
        <div>
          <label className="block text-xs font-bold text-[#443831] uppercase tracking-wider mb-2">
            Tema Desain Kartu
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setCardTheme('ivory')}
              className={`p-2 rounded-xl text-[11px] font-semibold border text-center transition-all ${
                cardTheme === 'ivory' ? 'border-[#E89271] bg-amber-50 text-[#8B4828]' : 'border-gray-200'
              }`}
            >
              Warm Ivory
            </button>
            <button
              onClick={() => setCardTheme('luxe')}
              className={`p-2 rounded-xl text-[11px] font-semibold border text-center transition-all ${
                cardTheme === 'luxe' ? 'border-[#2C2420] bg-zinc-900 text-white' : 'border-gray-200'
              }`}
            >
              Modern Luxe
            </button>
            <button
              onClick={() => setCardTheme('retro')}
              className={`p-2 rounded-xl text-[11px] font-semibold border text-center transition-all ${
                cardTheme === 'retro' ? 'border-amber-600 bg-amber-100 text-amber-900' : 'border-gray-200'
              }`}
            >
              Retro Film
            </button>
          </div>
        </div>

        {/* Total generated info */}
        <div className="flex flex-col justify-end">
          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E7DCCE] text-xs space-y-1">
            <div className="flex justify-between text-[#7B6E64]">
              <span>Total Kartu Meja:</span>
              <strong className="text-[#2C2420] font-mono-retro">{tableList.length} Kartu</strong>
            </div>
            <div className="flex justify-between text-[#7B6E64]">
              <span>Ukuran Standar:</span>
              <span>A6 / Akrilik 10x15cm</span>
            </div>
          </div>
        </div>

      </div>

      {/* PRINTABLE CARDS CONTAINER */}
      <div id="printable-table-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tableList.map((tableName, idx) => (
          <div
            key={idx}
            className={`relative rounded-3xl p-7 border-2 flex flex-col justify-between text-center transition-all break-inside-avoid shadow-md ${
              cardTheme === 'luxe'
                ? 'bg-zinc-950 text-white border-zinc-700'
                : cardTheme === 'retro'
                ? 'bg-[#F5EADB] text-[#2C2420] border-[#C8B097]'
                : 'bg-[#FFFDF9] text-[#2C2420] border-[#EADFCF]'
            }`}
            style={{ minHeight: '440px' }}
          >
            {/* Top decorative header */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-center space-x-1.5 text-xs text-[#E89271] font-mono-retro font-bold">
                <Camera className="w-3.5 h-3.5" />
                <span className="uppercase tracking-widest text-[10px]">KAMERA SEKALI PAKAI</span>
              </div>
              <h2 className="font-serif text-2xl font-bold tracking-tight">
                {event.coupleNames ? `The Wedding of ${event.coupleNames}` : event.title}
              </h2>
              <p className="text-[11px] opacity-75 font-serif italic">
                {customSubtitle}
              </p>
            </div>

            {/* Central QR Code box */}
            <div className="my-5 flex flex-col items-center">
              <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-[#EADFCF]/60">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Scan QR Meja" className="w-36 h-36" />
                ) : (
                  <div className="w-36 h-36 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                    Memuat QR...
                  </div>
                )}
              </div>
              <p className="mt-2 text-[10px] uppercase font-mono-retro font-bold tracking-wider opacity-70">
                Arahkan Kamera HP ke QR Code Ini
              </p>
            </div>

            {/* Table Badge Number */}
            <div className="my-2">
              <span className={`inline-block font-serif font-bold text-lg px-5 py-1.5 rounded-full border shadow-xs ${
                cardTheme === 'luxe'
                  ? 'bg-white text-black border-white'
                  : 'bg-[#2C2420] text-[#FAF7F2] border-[#2C2420]'
              }`}>
                {tableName}
              </span>
            </div>

            {/* 3 Step Instructions for Guests */}
            <div className="mt-4 pt-4 border-t border-current/15 text-[10px] space-y-1 text-left opacity-85">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold">1.</span>
                <span>Pindai QR tanpa perlu install aplikasi</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold">2.</span>
                <span>Jepret momen candid bersama teman di meja ini</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold">3.</span>
                <span>Tulis ucapan doa restu untuk pengantin ✨</span>
              </div>
            </div>

            {/* Subtle branding watermark */}
            <div className="mt-3 text-[9px] font-mono-retro opacity-50 tracking-widest text-center">
              SATUALBUM.ID • KODAK PORTRA PRESET
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
