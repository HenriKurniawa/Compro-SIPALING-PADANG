import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWarehouse } from '../context/WarehouseContext';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const ActivatePage: React.FC = () => {
  const { accounts, activate } = useWarehouse();
  const navigate = useNavigate();

  const [selectedAdminId, setSelectedAdminId] = useState('ADM-02'); // Default to Darmo which needs activation
  const [username, setUsername] = useState('admin.darmo');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !password || !confirmPassword) {
      setError('Harap isi semua kolom formulir');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return;
    }

    activate({
      adminId: selectedAdminId,
      username: username.trim(),
      password,
    });

    setSuccess('Akun berhasil diaktivasi! Mengalihkan ke dashboard...');
    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-[#F8F3EA] text-[#331A15]">
      {/* 1. Left Brand Hero Section */}
      <div className="w-full md:w-1/2 bg-[#4A1515] motif-songket text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
        <div>
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

          <div className="mt-12 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-[#F8D7C4] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#F47716]"></span>
              SISTEM OPERASIONAL WAREHOUSE & LOGISTIK
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Kelola stok gudang dan distribusi ke gerobak dari satu dashboard.
          </h1>

          <p className="mt-6 text-sm md:text-base text-white/80 max-w-lg leading-relaxed">
            Input stok masuk dari dapur pusat, distribusi stok keluar ke masing-masing gerobak rider,
            dan pantau persediaan secara real-time di wilayah Kertajaya & Darmo.
          </p>
        </div>

        <div className="mt-12 text-xs text-white/50">
          © 2026 SIPALING — Warehouse Management System
        </div>
      </div>

      {/* 2. Right Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#EADBCE] shadow-xl p-8">
          <div className="flex border-b border-[#EADBCE] pb-3 mb-6">
            <Link
              to="/login"
              className="text-sm font-bold text-[#7A534B] hover:text-[#4A1515] pb-2 mr-6 cursor-pointer transition-none"
            >
              Masuk sebagai Admin
            </Link>
            <button className="text-sm font-extrabold text-[#4A1515] border-b-2 border-[#F47716] pb-2 cursor-pointer">
              Aktivasi / Registrasi
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-[#4A1515]">Aktivasi Admin Gudang</h2>
            <p className="text-xs text-[#7A534B] mt-1">
              Pilih salah satu gudang yang tersedia untuk membuat username dan password baru.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle size={16} className="flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A1515] mb-2 uppercase tracking-wide">
                Pilih Wilayah Gudang:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {accounts.map((acc) => {
                  const isSelected = selectedAdminId === acc.id;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => {
                        setSelectedAdminId(acc.id);
                        setUsername(acc.username || `admin.${acc.warehouse.toLowerCase()}`);
                      }}
                      className={`p-3 rounded-xl text-left border cursor-pointer transition-none ${
                        isSelected
                          ? 'bg-[#FFF5EC] border-[#F47716]'
                          : 'bg-white border-[#EADBCE] hover:bg-[#FAF6F0]'
                      }`}
                    >
                      <div className="text-xs font-extrabold text-[#331A15]">
                        Admin {acc.warehouse}
                      </div>
                      <div className="text-[10px] mt-1 font-semibold">
                        {acc.activated ? (
                          <span className="text-green-700">✓ Sudah Aktif</span>
                        ) : (
                          <span className="text-[#F47716]">+ Siap Diaktivasi</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A1515] mb-1.5 uppercase tracking-wide">
                Buat Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: admin.darmo"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADBCE] bg-white text-[#331A15] text-sm font-medium focus:border-[#F47716] focus:ring-1 focus:ring-[#F47716] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#4A1515] mb-1.5 uppercase tracking-wide">
                  Buat Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 karakter"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EADBCE] bg-white text-[#331A15] text-sm font-medium focus:border-[#F47716] focus:ring-1 focus:ring-[#F47716] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4A1515] mb-1.5 uppercase tracking-wide">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EADBCE] bg-white text-[#331A15] text-sm font-medium focus:border-[#F47716] focus:ring-1 focus:ring-[#F47716] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-3 px-4 rounded-xl bg-[#F47716] hover:bg-[#D96009] text-white text-sm font-extrabold shadow-sm cursor-pointer transition-none"
            >
              Aktifkan Akun Gudang
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
