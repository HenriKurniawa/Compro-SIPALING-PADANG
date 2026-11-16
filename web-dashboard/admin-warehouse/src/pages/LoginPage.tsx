import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWarehouse } from '../context/WarehouseContext';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, accounts } = useWarehouse();
  const navigate = useNavigate();

  const [selectedWarehouse, setSelectedWarehouse] = useState<'Kertajaya' | 'Darmo'>('Kertajaya');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSelectWarehouse = (w: 'Kertajaya' | 'Darmo') => {
    setSelectedWarehouse(w);
    setError('');
    if (w === 'Kertajaya') {
      setUsername('admin');
      setPassword('password');
    } else {
      const darmoAcc = accounts.find((a) => a.warehouse === 'Darmo');
      if (darmoAcc && darmoAcc.activated) {
        setUsername(darmoAcc.username);
        setPassword(darmoAcc.password || 'password');
      } else {
        setUsername('admin.darmo');
        setPassword('password');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Harap masukkan username dan password');
      return;
    }

    const success = login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Username atau password salah, atau akun belum diaktivasi.');
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-[#F8F3EA] text-[#331A15]">
      {/* 1. Left Brand Hero Section */}
      <div className="w-full md:w-1/2 bg-[#4A1515] motif-songket text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
        <div>
          {/* Brand header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F47716] text-white font-extrabold text-lg flex items-center justify-center shadow-md">
              SP
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wide">SIPALING</span>
              <span className="text-xs font-semibold text-[#F8D7C4] uppercase tracking-wider">
                Nasi Padang · Sistem Admin Warehouse
              </span>
            </div>
          </div>

          {/* Operational Pill Tag */}
          <div className="mt-12 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-[#F8D7C4] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#F47716]"></span>
              SISTEM OPERASIONAL WAREHOUSE & LOGISTIK
            </span>
          </div>

          {/* Big Headline */}
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Kelola stok gudang dan distribusi ke gerobak dari satu dashboard.
          </h1>

          <p className="mt-6 text-sm md:text-base text-white/80 max-w-lg leading-relaxed">
            Input stok masuk dari dapur pusat, distribusi stok keluar ke masing-masing gerobak rider,
            dan pantau persediaan secara real-time di wilayah Kertajaya & Darmo.
          </p>

          {/* Mini Flow Diagram Card */}
          <div className="mt-10 p-5 rounded-2xl bg-black/25 border border-white/10 max-w-md">
            <div className="flex items-center justify-between text-xs text-white/70 mb-3">
              <span className="px-2 py-0.5 rounded bg-[#F47716]/30 text-[#F8D7C4] font-bold">
                ⌂ Gudang Depo
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider">
                ALUR DISTRIBUSI GEROBAK RIDER
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#F47716]"></div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-[#F47716] to-[#10B981]"></div>
              <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
              <div className="flex-1 h-0.5 bg-white/20"></div>
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
            </div>
            <div className="flex justify-between text-[11px] text-white/60 mt-2 font-mono">
              <span>Dapur Pusat</span>
              <span>Gudang Transit</span>
              <span>Gerobak Rider</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-xs text-white/50">
          © 2026 SIPALING — Warehouse Management System
        </div>
      </div>

      {/* 2. Right Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#EADBCE] shadow-xl p-8">
          {/* Top navigation tabs */}
          <div className="flex border-b border-[#EADBCE] pb-3 mb-6">
            <button className="text-sm font-extrabold text-[#4A1515] border-b-2 border-[#F47716] pb-2 mr-6 cursor-pointer">
              Masuk sebagai Admin
            </button>
            <Link
              to="/activate"
              className="text-sm font-bold text-[#7A534B] hover:text-[#4A1515] pb-2 cursor-pointer transition-none"
            >
              Aktivasi / Registrasi
            </Link>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-[#4A1515]">Masuk Warehouse</h2>
            <p className="text-xs text-[#7A534B] mt-1">
              Gunakan kredensial akun Gudang Kertajaya atau Darmo.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Pilih Wilayah Operasional */}
            <div>
              <label className="block text-xs font-bold text-[#4A1515] mb-2 uppercase tracking-wide">
                Pilih Wilayah Operasional:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectWarehouse('Kertajaya')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-none cursor-pointer ${
                    selectedWarehouse === 'Kertajaya'
                      ? 'bg-[#FFF5EC] border-[#F47716] text-[#F47716]'
                      : 'bg-white border-[#EADBCE] text-[#7A534B] hover:bg-[#FAF6F0]'
                  }`}
                >
                  Gudang Kertajaya
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectWarehouse('Darmo')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-none cursor-pointer ${
                    selectedWarehouse === 'Darmo'
                      ? 'bg-[#FFF5EC] border-[#F47716] text-[#F47716]'
                      : 'bg-white border-[#EADBCE] text-[#7A534B] hover:bg-[#FAF6F0]'
                  }`}
                >
                  Gudang Darmo
                </button>
              </div>
            </div>

            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-[#4A1515] mb-1.5 uppercase tracking-wide">
                Username
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-[#7A534B]">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EADBCE] bg-white text-[#331A15] text-sm font-medium focus:border-[#F47716] focus:ring-1 focus:ring-[#F47716] outline-none"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-[#4A1515] mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-[#7A534B]">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#EADBCE] bg-white text-[#331A15] text-sm font-medium focus:border-[#F47716] focus:ring-1 focus:ring-[#F47716] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#7A534B] hover:text-[#331A15] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 w-full py-3 px-4 rounded-xl bg-[#F47716] hover:bg-[#D96009] text-white text-sm font-extrabold shadow-sm cursor-pointer transition-none"
            >
              Masuk ke Sistem Gudang
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-[#EADBCE]/60">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#7A534B] mb-2">
              AKUN DEMO CEPAT:
            </span>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleSelectWarehouse('Kertajaya')}
                className="w-full p-2 rounded-xl bg-[#FFFBF5] border border-[#EADBCE] text-left text-xs text-[#331A15] hover:bg-[#FFF5EC] cursor-pointer"
              >
                <span className="font-bold text-[#F47716]">Kertajaya:</span> admin / password
              </button>
              <button
                type="button"
                onClick={() => handleSelectWarehouse('Darmo')}
                className="w-full p-2 rounded-xl bg-[#FFFBF5] border border-[#EADBCE] text-left text-xs text-[#331A15] hover:bg-[#FFF5EC] cursor-pointer"
              >
                <span className="font-bold text-[#F47716]">Darmo:</span> admin.darmo / password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
