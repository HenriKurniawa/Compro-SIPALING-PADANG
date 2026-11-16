import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import minimapRoads from '../assets/login-minimap-roads.svg';
import { BrandLogo } from '../components/layout/BrandLogo';
import { Alert, Button, TextField } from '../components/ui';
import { useAuth } from '../context/auth';
import { cn } from '../lib/utils';

/** Label nama di peta mini dekoratif (posisi dari desain, kotak 520×180) */
const MINIMAP_TAGS = [
  { name: 'Budi', left: 114.4, top: 64.8, inactive: false },
  { name: 'Sinta', left: 270.4, top: 32.4, inactive: false },
  { name: 'Rudi', left: 343.2, top: 104.4, inactive: false },
  { name: 'Wati', left: 197.6, top: 118.8, inactive: true },
];

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      setError('Username dan password wajib diisi.');
      return;
    }
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Username atau password salah. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel kiri: branding */}
      <section className="relative hidden flex-col bg-maroon-700 p-14 lg:flex">
        <div className="flex items-center gap-2.5">
          <BrandLogo size={60} />
          <div>
            <p className="text-[22px] leading-tight font-bold text-cream">SIPALING</p>
            <p className="text-xs font-bold text-sand">PADANG KELILING</p>
          </div>
        </div>

        <div className="mt-[139px]">
          <span className="inline-flex h-7 items-center rounded-full bg-orange px-3 text-[13px] font-bold text-maroon-950">
            PORTAL KOORDINATOR LAPANGAN
          </span>
          <h1 className="mt-[12px] text-[46px] leading-[1.1] font-bold text-cream">
            Pantau semua <br />
            gerobak di wilayahmu <br />
            dari satu peta.
          </h1>
          <p className="mt-[19px] text-[17px] leading-[27px] text-sand">
            Lihat siapa yang sedang bekerja, di mana posisinya, dan sisa <br />
            stok tiap gerobak secara langsung.
          </p>
        </div>

        <div
          className="relative mt-auto h-[180px] w-[520px] max-w-full overflow-hidden rounded-[20px] bg-maroon-900/55"
          aria-hidden
        >
          <img
            src={minimapRoads}
            alt=""
            width={540.777}
            height={201.78}
            className="absolute top-[-10px] left-[-10px] block max-w-none"
          />
          {MINIMAP_TAGS.map((t) => (
            <span
              key={t.name}
              className={cn(
                'absolute flex h-[27px] items-center rounded-[10px] px-2.5 text-xs font-bold',
                t.inactive ? 'bg-idle-dot text-white' : 'bg-cream text-maroon-700',
              )}
              style={{ left: t.left, top: t.top }}
            >
              {t.name}
            </span>
          ))}
        </div>
      </section>

      {/* Panel kanan: form login */}
      <section className="flex items-center justify-center bg-cream px-4 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-[420px]" noValidate>
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <BrandLogo size={44} />
            <p className="text-[17px] font-bold text-maroon-900">SIPALING · Korlap</p>
          </div>

          <h2 className="text-[32px] font-bold text-maroon-900">Masuk sebagai Korlap</h2>
          <p className="mt-1.5 text-[15px] text-muted">Gunakan akun wilayah Kertajaya atau Darmo.</p>

          {error && (
            <Alert tone="error" className="mt-[14px] text-[13px]">
              {error}
            </Alert>
          )}

          <TextField
            label="Username"
            className="mt-[18px]"
            inputClassName="h-[50px] rounded-[14px] text-base"
            autoComplete="username"
            placeholder="korlap.kertajaya"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            invalid={!!error}
            required
          />
          <TextField
            label="Password"
            className="mt-[21px]"
            inputClassName="h-[50px] rounded-[14px] text-base"
            autoComplete="current-password"
            revealable
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            invalid={!!error}
            required
          />

          <Button
            type="submit"
            className="mt-6 h-[52px] w-full rounded-[14px] text-[17px]"
            disabled={submitting}
          >
            {submitting ? 'Memproses…' : 'Masuk'}
          </Button>

          <p className="mt-[23px] text-center text-sm text-muted">Lupa password? Hubungi admin Sipaling.</p>
        </form>
      </section>
    </div>
  );
};
