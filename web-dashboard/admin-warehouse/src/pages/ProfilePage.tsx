import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWarehouse } from '../context/WarehouseContext';
import { LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

export const ProfilePage: React.FC = () => {
  const { user, logout, updatePassword } = useWarehouse();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error' | ''; text: string }>({
    type: '',
    text: '',
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'AK';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg({ type: '', text: '' });

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwdMsg({ type: 'error', text: 'Harap isi semua kolom password' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: 'error', text: 'Password baru dan konfirmasi tidak cocok' });
      return;
    }

    if (newPassword.length < 6) {
      setPwdMsg({ type: 'error', text: 'Password baru minimal 6 karakter' });
      return;
    }

    const res = updatePassword(oldPassword, newPassword);
    if (res.success) {
      setPwdMsg({ type: 'success', text: 'Password berhasil diperbarui!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPwdMsg({ type: 'error', text: res.message || 'Gagal mengubah password' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header Profil dengan Navigasi Kembali */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#EADBCE]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#4A1515]">Profil Saya</h1>
          <p className="text-xs text-[#7A534B] mt-1">
            Informasi akun petugas gudang dan pengaturan kata sandi.
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#EADBCE] bg-white text-[#331A15] text-xs font-bold hover:bg-[#FAF6F0] cursor-pointer shadow-xs self-start sm:self-auto transition-none"
        >
          ← Kembali ke Ringkasan
        </button>
      </div>

      {/* 2. Grid Dua Kolom: Info Akun & Ubah Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolom Kiri: Kartu Identitas Akun */}
        <div className="bg-white rounded-3xl border border-[#EADBCE] shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 pb-6 border-b border-[#F0E6DE]">
              <div className="w-16 h-16 rounded-full bg-[#F47716] text-white font-extrabold text-xl flex items-center justify-center shadow-sm flex-shrink-0">
                {getInitials(user?.name)}
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#331A15]">
                  {user?.name || 'Admin Kertajaya'}
                </h2>
                <span className="text-xs font-semibold text-[#7A534B]">
                  {user?.role || 'Warehouse Officer'}
                </span>
              </div>
            </div>

            <div className="divide-y divide-[#F0E6DE] text-xs">
              <div className="py-3.5 flex items-center justify-between">
                <span className="text-[#7A534B] font-semibold">Username</span>
                <span className="font-mono font-bold text-[#331A15]">{user?.username}</span>
              </div>
              <div className="py-3.5 flex items-center justify-between">
                <span className="text-[#7A534B] font-semibold">Wilayah Tugas</span>
                <span className="font-bold text-[#F47716]">
                  Gudang {user?.warehouse || 'Kertajaya'}
                </span>
              </div>
              <div className="py-3.5 flex items-center justify-between">
                <span className="text-[#7A534B] font-semibold">Status Akun</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E3F2DC] text-[#1E5C16] font-bold text-[11px] border border-[#C6E6B8]">
                  ✓ Aktif
                </span>
              </div>
              <div className="py-3.5 flex items-center justify-between">
                <span className="text-[#7A534B] font-semibold">Akses Sistem</span>
                <span className="font-bold text-[#331A15]">Stock-In & Stock-Out Gudang</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Form Ubah Password */}
        <div className="bg-white rounded-3xl border border-[#EADBCE] shadow-sm p-6">
          <h3 className="text-base font-extrabold text-[#4A1515] mb-4">Ubah Password</h3>

          {pwdMsg.text && (
            <div
              className={`mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                pwdMsg.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {pwdMsg.type === 'success' ? (
                <CheckCircle size={16} className="flex-shrink-0" />
              ) : (
                <AlertCircle size={16} className="flex-shrink-0" />
              )}
              <span>{pwdMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#4A1515] mb-1.5 uppercase tracking-wide">
                Password Lama
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan password saat ini"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADBCE] bg-white text-[#331A15] text-xs font-medium focus:border-[#F47716] focus:ring-1 focus:ring-[#F47716] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A1515] mb-1.5 uppercase tracking-wide">
                Password Baru
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADBCE] bg-white text-[#331A15] text-xs font-medium focus:border-[#F47716] focus:ring-1 focus:ring-[#F47716] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A1515] mb-1.5 uppercase tracking-wide">
                Ulangi Password Baru
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang password baru"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADBCE] bg-white text-[#331A15] text-xs font-medium focus:border-[#F47716] focus:ring-1 focus:ring-[#F47716] outline-none"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 px-4 rounded-xl bg-[#4A1515] hover:bg-[#6B1D16] text-white text-xs font-extrabold shadow-sm cursor-pointer transition-none"
            >
              Simpan Password
            </button>
          </form>
        </div>
      </div>

      {/* 3. Kartu Keluar dari Akun (Identik dengan standar Korlap) */}
      <div className="bg-white rounded-3xl border border-[#EADBCE] shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-extrabold text-[#331A15]">Keluar dari akun</h3>
          <p className="text-xs text-[#7A534B] mt-0.5">
            Kamu akan diarahkan kembali ke halaman login warehouse.
          </p>
        </div>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-red-300 bg-white text-red-600 text-xs font-bold hover:bg-red-50 cursor-pointer shadow-xs transition-none"
        >
          <LogOut size={14} />
          <span>Keluar</span>
        </button>
      </div>

      {/* Modal Konfirmasi Logout */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Konfirmasi Keluar Akun"
        subtitle="Sesi aktif gudang akan diakhiri"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setShowLogoutModal(false)}>
              Batal
            </Button>
            <Button variant="orange" size="sm" onClick={handleLogout}>
              Ya, Keluar Akun
            </Button>
          </>
        }
      >
        <p className="text-xs text-[#331A15] leading-relaxed">
          Apakah kamu yakin ingin keluar dari akun <strong className="font-bold">{user?.name}</strong>?
          Data transaksi yang telah tersimpan di sistem tidak akan hilang.
        </p>
      </Modal>
    </div>
  );
};
