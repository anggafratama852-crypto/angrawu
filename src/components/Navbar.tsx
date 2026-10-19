import React, { useState } from 'react';
import { Camera, Film, Image as ImageIcon, Tv, Printer, Plus, Menu, X, Sparkles, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenCreateModal: () => void;
  activeEventTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenCreateModal,
  activeEventTitle,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Beranda', icon: Sparkles },
    { id: 'camera', label: 'Kamera Tamu', icon: Camera, badge: 'POV Tamu' },
    { id: 'album', label: 'Album Bersama', icon: ImageIcon },
    { id: 'slideshow', label: 'Layar Panggung', icon: Tv },
    { id: 'table-cards', label: 'Cetak Kartu QR', icon: Printer },
    { id: 'dashboard', label: 'Studio Acara', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EADFCF] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => onNavigate('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#302621] to-[#5C4A3E] flex items-center justify-center text-amber-200 shadow-sm group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5 text-[#E89271]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif font-bold text-xl tracking-tight text-[#2C2420]">
                  satualbum<span className="text-[#E89271]">.id</span>
                </span>
                <span className="text-[10px] uppercase font-mono-retro px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 font-semibold tracking-wider">
                  FILM ROLL
                </span>
              </div>
              <p className="text-[11px] text-[#7A6E65] hidden sm:block">
                Kamera Sekali Pakai Pernikahan & Acara
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#EFE8DC] text-[#2C2420] shadow-xs'
                      : 'text-[#6B5E55] hover:text-[#2C2420] hover:bg-[#F3ECE1]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#E89271]' : 'text-[#8C7E74]'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 text-[10px] bg-[#E89271]/15 text-[#E89271] px-1.5 py-0.2 rounded-full font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-[#2C2420] hover:bg-[#433831] text-[#FAF7F2] text-sm font-medium transition-all shadow-sm hover:shadow"
            >
              <Plus className="w-4 h-4 text-[#E89271]" />
              <span>Buat Acara Baru</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => onNavigate('camera')}
              className="px-3 py-1.5 rounded-full bg-[#E89271] text-white text-xs font-semibold flex items-center space-x-1 shadow-xs"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Jepret</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#5C4A3E] hover:bg-[#EFE8DC]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#EADFCF] px-4 pt-2 pb-6 space-y-2">
          {activeEventTitle && (
            <div className="py-2 px-3 bg-[#EFE8DC] rounded-lg text-xs font-medium text-[#5C4A3E] flex items-center justify-between mb-3">
              <span className="truncate">Acara Aktif: {activeEventTitle}</span>
              <Film className="w-3.5 h-3.5 text-[#E89271] shrink-0 ml-2" />
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-[#EFE8DC] text-[#2C2420] font-semibold'
                    : 'text-[#6B5E55] hover:bg-[#F3ECE1]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#E89271]' : 'text-[#8C7E74]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-[#E89271]/20 text-[#E89271] px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-[#EADFCF]">
            <button
              onClick={() => {
                onOpenCreateModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#2C2420] text-white text-sm font-medium"
            >
              <Plus className="w-4 h-4 text-[#E89271]" />
              <span>Buat Acara Baru</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
