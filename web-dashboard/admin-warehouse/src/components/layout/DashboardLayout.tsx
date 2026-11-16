import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useWarehouse } from '../../context/WarehouseContext';
import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileText,
  Users,
  MapPin,
  LifeBuoy,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useWarehouse();
  const navigate = useNavigate();
  const location = useLocation();

  const getInitials = (name?: string) => {
    if (!name) return 'AK';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const navItems = [
    { label: 'Ringkasan', path: '/', icon: LayoutDashboard },
    { label: 'Stok Masuk', path: '/stock-in', icon: ArrowDownToLine },
    { label: 'Stok Keluar', path: '/stock-out', icon: ArrowUpFromLine },
    { label: 'Laporan Setoran', path: '/reports', icon: FileText },
    { label: 'Rider & Gerobak', path: '/riders', icon: Users },
  ];

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F9FA] text-[#331A15]">
      {/* 1. ASIDE: Sidebar Navigasi Semantik */}
      <aside className="w-64 flex-shrink-0 bg-[#4A1515] motif-songket text-white flex flex-col justify-between border-r border-[#380E0E] shadow-xl z-20 select-none">
        {/* Top: Logo & Navigasi */}
        <div className="flex flex-col">
          {/* Header Brand */}
          <div className="p-5 pb-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F47716] text-white font-extrabold text-base flex items-center justify-center shadow-sm">
              SP
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-extrabold tracking-wide text-white">SIPALING</span>
              <span className="text-[10px] font-semibold text-[#F8D7C4] uppercase tracking-wider">
                Admin Warehouse — Gudang
              </span>
            </div>
          </div>

          {/* Wilayah Badge */}
          <div className="px-5 py-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-none"></span>
              <span>Gudang {user?.warehouse || 'Kertajaya'}</span>
            </div>
          </div>

          {/* Navigasi List */}
          <div className="px-3 pt-2">
            <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-white/50">
              OPERASIONAL GUDANG
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-none ${
                      isActive
                        ? 'bg-[#F47716] text-white shadow-sm'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom: Bantuan Operasional (Sesuai arahan user, profil akun sidebar dihapus karena sudah ada di header) */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-3">
          <div className="rounded-xl bg-black/25 border border-white/10 p-3 text-xs">
            <div className="flex items-center gap-2 text-white font-bold mb-1">
              <LifeBuoy size={14} className="text-[#F47716]" />
              <span>Bantuan Operasional</span>
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Ada kendala stok atau sinkronisasi? Hubungi admin pusat via hotline.
            </p>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTAINER: Header & Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* HEADER: Info admin cabang aktif & Profile chip (Identik dengan standar Korlap) */}
        <header className="h-16 flex-shrink-0 bg-white border-b border-[#EADBCE] px-6 flex items-center justify-between z-10 shadow-xs">
          {/* Left: Info Wilayah & Status Sistem */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#4A1515]">
              <MapPin size={15} className="text-[#F47716]" />
              <span className="text-sm font-extrabold">Gudang {user?.warehouse || 'Kertajaya'}</span>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E3F2DC] text-[#1E5C16] text-[11px] font-bold border border-[#C6E6B8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E5C16]"></span>
              <span>Sistem Terhubung</span>
            </div>
          </div>

          {/* Right: Tanggal & Topbar Profile Chip */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-xs font-semibold text-[#7A534B] bg-[#FFFBF5] px-3 py-1.5 rounded-lg border border-[#EADBCE]">
              {currentDate}
            </div>

            {/* Profile Chip Button */}
            <button
              onClick={() => navigate('/profile')}
              className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border transition-none cursor-pointer ${
                location.pathname === '/profile'
                  ? 'bg-[#FFF5EC] border-[#F47716]'
                  : 'bg-[#FFFBF5] hover:bg-[#FFF5EC] border-[#EADBCE]'
              }`}
              title="Kelola Profil Akun"
            >
              <div className="w-8 h-8 rounded-full bg-[#F47716] text-white font-extrabold text-xs flex items-center justify-center">
                {getInitials(user?.name)}
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-[#331A15]">
                  {user?.name || 'Admin Kertajaya'}
                </span>
                <span className="text-[10px] text-[#7A534B]">
                  {user?.role || 'Warehouse Officer'}
                </span>
              </div>
            </button>
          </div>
        </header>

        {/* 3. MAIN: Konten Utama yang dapat di-scroll */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F8F9FA]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
