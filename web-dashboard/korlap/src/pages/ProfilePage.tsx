import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { Alert, Avatar, Button, ConfirmDialog, Icon, TextField } from '../components/ui';
import { useAuth } from '../context/auth';
import { useRiders } from '../context/riders';

const MIN_PASSWORD = 8;
const card = 'rounded-[22px] border border-sand bg-white';

export const ProfilePage = () => {
  const { user, logout, changePassword } = useAuth();
  const { riders } = useRiders();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState<{ tone: 'error' | 'success'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  if (!user) return null;

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!oldPassword) return setFeedback({ tone: 'error', message: 'Password lama wajib diisi.' });
    if (newPassword.length < MIN_PASSWORD)
      return setFeedback({ tone: 'error', message: `Password baru minimal ${MIN_PASSWORD} karakter.` });
    if (newPassword !== confirmPassword)
      return setFeedback({ tone: 'error', message: 'Ulangi password baru belum sama.' });

    setSaving(true);
    try {
      await changePassword(oldPassword, newPassword);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFeedback({ tone: 'success', message: 'Password berhasil diperbarui.' });
    } catch (err) {
      setFeedback({ tone: 'error', message: err instanceof Error ? err.message : 'Gagal memperbarui password.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setConfirmLogout(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const details: Array<[string, string]> = [
    ['Username', user.username],
    ['Wilayah', user.region],
    ['No. HP', user.phone],
    ['Rider dipantau', `${riders.length} rider`],
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader>
        <Link
          to="/"
          className="flex h-[38px] items-center gap-1.5 rounded-xl bg-cream/10 pr-3 pl-2 text-sm font-bold text-cream hover:bg-cream/20"
        >
          <Icon name="chevronLeft" />
          Kembali ke Peta
        </Link>
      </AppHeader>

      <main className="mx-auto w-full max-w-[1032px] px-4 pt-[46px] pb-12">
        <h1 className="text-[30px] font-bold text-maroon-900">Profil Saya</h1>

        <div className="mt-[18px] grid gap-[22px] lg:grid-cols-[459fr_519fr]">
          <section className={`${card} p-[29px]`} aria-label="Data akun">
            <div className="flex items-center gap-4">
              <Avatar name={user.name} size={72} fontSize={26} tone="orange" />
              <div>
                <h2 className="text-[22px] font-bold text-maroon-900">{user.name}</h2>
                <span className="mt-0.5 inline-flex h-[23px] items-center rounded-full bg-danger-bg px-2 text-xs font-bold text-maroon-800">
                  Koordinator Lapangan
                </span>
              </div>
            </div>

            <dl className="mt-[22px] grid grid-cols-[142px_1fr] gap-y-[13px] text-[15px]">
              {details.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-muted">{label}</dt>
                  <dd className="font-bold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={`${card} px-[21px] py-[33px]`} aria-labelledby="pw-judul">
            <h2 id="pw-judul" className="text-xl font-bold text-maroon-900">
              Ubah Password
            </h2>
            <form onSubmit={handleChangePassword} noValidate>
              <TextField
                label="Password lama"
                type="password"
                className="mt-[13px]"
                inputClassName="h-[47px] text-[15px]"
                autoComplete="current-password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <TextField
                label="Password baru"
                type="password"
                className="mt-[18px]"
                inputClassName="h-[47px] text-[15px]"
                autoComplete="new-password"
                placeholder={`Minimal ${MIN_PASSWORD} karakter`}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                label="Ulangi password baru"
                type="password"
                className="mt-[18px]"
                inputClassName="h-[47px] text-[15px]"
                autoComplete="new-password"
                placeholder="Ketik ulang password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {feedback && (
                <Alert tone={feedback.tone} className="mt-[14px]">
                  {feedback.message}
                </Alert>
              )}

              <Button type="submit" variant="maroon" className="mt-[14px] h-[45px] px-[22px] text-[15px]" disabled={saving}>
                {saving ? 'Menyimpan…' : 'Simpan Password'}
              </Button>
            </form>
          </section>
        </div>

        <section className={`${card} mt-6 flex flex-wrap items-center justify-between gap-4 px-[29px] py-[22px]`}>
          <div>
            <h2 className="text-[17px] font-bold text-maroon-900">Keluar dari akun</h2>
            <p className="text-sm text-muted">Kamu perlu masuk lagi untuk melihat peta rider.</p>
          </div>
          <Button variant="danger-outline" className="h-[49px] px-4 text-[15px]" onClick={() => setConfirmLogout(true)}>
            <Icon name="logout" />
            Keluar
          </Button>
        </section>
      </main>

      <ConfirmDialog
        open={confirmLogout}
        title="Keluar dari akun?"
        description="Kamu akan kembali ke halaman login."
        confirmLabel="Keluar"
        onConfirm={handleLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </div>
  );
};
