import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Menu as MenuIcon,
  MessageCircle,
  Minus,
  Navigation,
  Plus,
  ShieldCheck,
  Sparkles,
  Store,
  UtensilsCrossed,
  Wifi,
  X,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { api, LINKS, USE_MOCK } from './api';
import type { CartInfo, MenuItem } from './api';

const rupiah = (n: number) => 'Rp' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export default function App() {
  // Gerobak dari tag NFC / QR, mis. https://sipaling.id/?gerobak=GRB-012
  const [cart, setCart] = useState<CartInfo | null>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('gerobak');
    if (id) api.getCart(id).then(setCart);
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero cart={cart} />
        <Features />
        <Promo />
        <Steps />
        <MenuSection />
        <Register cart={cart} />
        <Faq />
        <Download />
      </main>
      <Footer />
    </>
  );
}

/* ---------------- Header ---------------- */
function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ['#fitur', 'Kenali Sipaling'],
    ['#cara', 'Cara daftar'],
    ['#menu', 'Menu Sipaling'],
    ['#faq', 'Tanya jawab'],
  ];
  return (
    <header className="header">
      <div className="header-inner" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <a href="#" className="brand" aria-label="Sipaling NasPad, ke atas halaman">
          <img src="/logo.png" alt="" />
          <span>
            <span className="brand-name">SIPALING</span>
            <br />
            <span className="brand-sub">NasPad · Padang Keliling</span>
          </span>
        </a>
        <nav className={`nav ${open ? 'open' : ''}`} aria-label="Navigasi utama">
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <a href="#unduh" className="btn btn-primary btn-small">
          Masuk
        </a>
        <button className="menu-toggle" aria-label={open ? 'Tutup menu' : 'Buka menu'} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero({ cart }: { cart: CartInfo | null }) {
  return (
    <section className="hero motif" id="beranda">
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="chip">
            <Wifi size={14} style={{ transform: 'rotate(90deg)' }} aria-hidden /> Sentuh NFC di gerobak
          </span>
          <h1>Nasi Padang Keliling, Sekarang Bisa Dilacak!</h1>
          <p className="hero-sub">Lihat gerobak terdekat, cek sisa lauk, pesan lewat WhatsApp.</p>
          {cart ? (
            <span className="cart-badge">
              <MapPin size={15} aria-hidden /> Kamu sedang di Gerobak #{cart.id.replace(/\D/g, '')} – Rider {cart.riderName}
            </span>
          ) : null}
          <div>
            <a href="#daftar" className="btn btn-primary">
              Daftar Gratis &amp; Dapat Poin <ArrowRight size={18} aria-hidden />
            </a>
          </div>
          <p className="hero-note">Cukup nomor WhatsApp, kurang dari 1 menit.</p>
        </div>

        <div className="hero-art" aria-hidden>
          <div className="hero-circle" />
          <div className="handnote">
            Lauknya
            <br />
            mantap.
            <br />
            Carinya
            <br />
            gampang.
            <svg width="70" height="30" viewBox="0 0 70 30" style={{ display: 'block', margin: '6px auto 0' }}>
              <path d="M4 6 C 20 30, 45 28, 64 12" stroke="#F47716" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M56 10 L65 11 L61 19" stroke="#F47716" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="phone">
            <div className="phone-screen">
              <div className="phone-top">
                <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, letterSpacing: 1 }}>HALO, SASAW</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--maroon-dark)' }}>Gerobak di sekitarmu</div>
              </div>
              <div className="phone-map">
                <svg width="100%" height="100%" viewBox="0 0 230 260" preserveAspectRatio="none">
                  <rect x="12" y="20" width="70" height="60" rx="10" fill="#cfdcc0" />
                  <rect x="150" y="170" width="70" height="70" rx="10" fill="#cfdcc0" />
                  <path d="M-5 120 L240 140" stroke="#fff8ec" strokeWidth="14" />
                  <path d="M120 -5 L110 270" stroke="#fff8ec" strokeWidth="12" strokeDasharray="0" />
                  <path d="M118 0 L108 270" stroke="#F47716" strokeWidth="2" strokeDasharray="5 5" />
                </svg>
                <span style={{ position: 'absolute', left: 30, top: 32, width: 28, height: 28, borderRadius: 14, background: '#fff', border: '2px solid #922D20', display: 'grid', placeItems: 'center' }}>
                  <Store size={14} color="#922D20" />
                </span>
                <span style={{ position: 'absolute', left: 150, top: 90, width: 30, height: 30, borderRadius: 15, background: '#F47716', border: '2px solid #fff', color: '#3D110D', fontSize: 10, fontWeight: 800, display: 'grid', placeItems: 'center' }}>
                  #12
                </span>
                <span style={{ position: 'absolute', left: 36, top: 190, width: 16, height: 16, borderRadius: 8, background: '#2F6FE4', border: '3px solid #fff' }} />
                <span style={{ position: 'absolute', left: 10, bottom: 8, background: '#fff', borderRadius: 6, padding: '3px 6px', fontSize: 9, fontWeight: 700 }}>
                  Rendang 5 · Ayam Pop 8
                </span>
              </div>
              <div className="phone-bottom">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <b>Gerobak #012 · Budi</b>
                  <span style={{ color: 'var(--muted)' }}>650 m</span>
                </div>
                <div style={{ background: 'var(--orange)', color: 'var(--on-orange)', textAlign: 'center', fontWeight: 800, fontSize: 12, padding: 8, borderRadius: 10 }}>
                  Lihat Gerobak
                </div>
              </div>
            </div>
          </div>
          <div className="plate">
            <img src="/menu/rendang.jpg" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Fitur ---------------- */
function Features() {
  const items: [ReactNode, string, string][] = [
    [<Navigation size={20} />, 'Lacak Gerobak Live', 'Lihat posisi gerobak terdekat secara langsung.'],
    [<UtensilsCrossed size={20} />, 'Cek Stok Menu Real-time', 'Tahu lauk yang masih ada sebelum menghampiri.'],
    [<MessageCircle size={20} />, 'Pesan via WhatsApp', 'Konfirmasi pesanan dan pembayaran lewat WhatsApp.'],
    [<MapPin size={20} />, 'Panggil Gerobak (radius 1,5 km)', 'Minta rider terdekat datang ke lokasimu.'],
  ];
  return (
    <section className="section" id="fitur">
      <div className="container">
        <p className="eyebrow">Kenali Sipaling</p>
        <h2 className="h2">Lauk favorit, lebih dekat.</h2>
        <div className="grid-4">
          {items.map(([icon, title, desc]) => (
            <div className="feature" key={title}>
              <span className="feature-icon" aria-hidden>
                {icon}
              </span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Promo (carousel) ---------------- */
function Promo() {
  const slides = [
    { eyebrow: 'Keuntungan jadi member', title: 'Daftar hari ini, dan dapatkan 1 poin', sub: 'Poin langsung masuk ke akunmu setelah pendaftaran selesai.', big: '1', unit: 'poin' },
    { eyebrow: 'Program loyalitas', title: 'Setiap 10 transaksi, gratis 1 paket', sub: 'Berlaku untuk pesanan online maupun beli langsung di gerobak.', big: '10', unit: 'transaksi' },
  ];
  const [i, setI] = useState(0);
  const s = slides[i];
  const go = (d: number) => setI((v) => (v + d + slides.length) % slides.length);
  return (
    <section className="container" aria-roledescription="carousel" aria-label="Promo">
      <div className="promo" aria-live="polite">
        <div className="promo-copy">
          <p className="eyebrow">{s.eyebrow}</p>
          <h3>{s.title}</h3>
          <p>{s.sub}</p>
        </div>
        <div className="points" aria-hidden>
          <Sparkles size={22} />
          <b>{s.big}</b>
          <span style={{ fontWeight: 700 }}>{s.unit}</span>
        </div>
      </div>
      <div className="carousel-ctrl">
        <div className="dots">
          {slides.map((_, k) => (
            <button key={k} className={`dot ${k === i ? 'on' : ''}`} aria-label={`Promo ${k + 1}`} aria-current={k === i} onClick={() => setI(k)} />
          ))}
        </div>
        <div className="arrows">
          <button className="arrow" aria-label="Promo sebelumnya" onClick={() => go(-1)}>
            <ChevronLeft size={18} />
          </button>
          <button className="arrow" aria-label="Promo berikutnya" onClick={() => go(1)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Langkah ---------------- */
function Steps() {
  const steps = [
    ['Tap NFC di gerobak', 'Tempelkan HP ke stiker NFC, atau scan QR code di samping gerobak.'],
    ['Daftar pakai nomor WA', 'Isi nama dan nomor WhatsApp, lalu masukkan kode OTP yang dikirim.'],
    ['Unduh app & pesan', 'Masuk ke aplikasi, pilih gerobak terdekat, lalu pesan.'],
  ];
  return (
    <section className="section" id="cara">
      <div className="container">
        <p className="eyebrow">Cara daftar</p>
        <h2 className="h2">Tiga langkah, siap makan.</h2>
        <ol className="steps">
          {steps.map(([t, d], k) => (
            <li className="step" key={t}>
              <span className="step-num">0{k + 1}</span>
              <div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- Menu (UC-23) ---------------- */
function MenuSection() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  useEffect(() => {
    api.getMenu().then(setMenu).catch(() => setMenu([]));
  }, []);
  if (!menu.length) return null;
  return (
    <section className="section" id="menu" style={{ paddingTop: 0 }}>
      <div className="container">
        <p className="eyebrow">Menu Sipaling</p>
        <h2 className="h2">Lauk andalan di gerobak.</h2>
        <div className="menu-grid">
          {menu.map((m) => (
            <div className="menu-card" key={m.id}>
              <img src={m.imageUrl} alt={m.name} loading="lazy" />
              <b>{m.name}</b>
              <span>{rupiah(m.price)}</span>
            </div>
          ))}
        </div>
        <p className="small-note">Sisa stok tiap gerobak bisa dilihat langsung di aplikasi.</p>
      </div>
    </section>
  );
}

/* ---------------- Form daftar (UC-01, UC-02, UC-33) ---------------- */
type Step = 'form' | 'otp' | 'password' | 'done';

function normalizePhone(raw: string): string {
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('62')) d = d.slice(2);
  if (d.startsWith('0')) d = d.slice(1);
  return d;
}

function Register({ cart }: { cart: CartInfo | null }) {
  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [token, setToken] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const local = normalizePhone(phone);
  const fullPhone = '62' + local;
  const phoneOk = local.length >= 9 && local.length <= 13 && local.startsWith('8');
  const nameOk = name.trim().length >= 3;

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setBusy(false);
    }
  };

  const sendOtp = (e?: FormEvent) => {
    e?.preventDefault();
    if (!nameOk || !phoneOk || !agree) return;
    run(async () => {
      await api.requestOtp({ name: name.trim(), phone: fullPhone, cartId: cart?.id });
      setOtp(['', '', '', '', '', '']);
      setStep('otp');
      setCountdown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    });
  };

  const code = otp.join('');
  const verify = (e?: FormEvent) => {
    e?.preventDefault();
    if (code.length !== 6) return;
    run(async () => {
      const r = await api.verifyOtp(fullPhone, code);
      setToken(r.registrationToken);
      setStep('password');
    });
  };

  const setDigit = (k: number, v: string) => {
    const digits = v.replace(/\D/g, '');
    if (digits.length > 1) {
      // tempel kode 6 digit sekaligus
      const next = digits.slice(0, 6).split('');
      setOtp([...next, '', '', '', '', '', ''].slice(0, 6));
      otpRefs.current[Math.min(next.length, 5)]?.focus();
      return;
    }
    const next = [...otp];
    next[k] = digits;
    setOtp(next);
    if (digits && k < 5) otpRefs.current[k + 1]?.focus();
  };

  const pwOk = pw.length >= 8;
  const finish = (e: FormEvent) => {
    e.preventDefault();
    if (!pwOk || pw !== pw2) return;
    run(async () => {
      await api.completeRegistration(token, pw);
      setStep('done');
    });
  };

  return (
    <section className="section register motif" id="daftar">
      <div className="container register-inner">
        <p className="eyebrow">Daftar akun</p>
        <h2 className="h2">Kenalan dulu, makan enak kemudian</h2>

        {step === 'form' && (
          <form className="card-form" onSubmit={sendOtp} noValidate>
            <h3>Mulai dari sini, yuk.</h3>
            <p className="lead">Pakai nomor WhatsApp aktif, kode OTP dikirim lewat WhatsApp.</p>
            {error && <div className="error" role="alert">{error}</div>}
            <div className="field">
              <label htmlFor="nama">Nama lengkap</label>
              <input id="nama" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu" autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="wa">Nomor WhatsApp</label>
              <div className="phone-input">
                <span>+62</span>
                <input id="wa" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="812 3456 7890" autoComplete="tel-national" />
              </div>
              {phone && !phoneOk ? <small style={{ color: 'var(--red-fg)' }}>Nomor WhatsApp diawali 8 dan berisi 9–13 angka.</small> : null}
            </div>
            <label className="check">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span>
                Saya setuju nomor WhatsApp dan lokasi saya diproses sesuai <a href="#kebijakan-privasi">Kebijakan Privasi</a> (UU PDP).
              </span>
            </label>
            <button className="btn btn-primary" disabled={!nameOk || !phoneOk || !agree || busy}>
              {busy ? 'Mengirim…' : 'Kirim Kode OTP'} <ArrowRight size={18} aria-hidden />
            </button>
            <p className="hint">
              <ShieldCheck size={16} aria-hidden /> Data kamu aman dan tidak dibagikan ke pihak lain.
            </p>
          </form>
        )}

        {step === 'otp' && (
          <form className="card-form" onSubmit={verify}>
            <button type="button" className="linkbtn" style={{ alignSelf: 'flex-start', display: 'flex', gap: 6, alignItems: 'center', textDecoration: 'none' }} onClick={() => setStep('form')}>
              <ArrowLeft size={16} /> Ganti nomor
            </button>
            <h3>Verifikasi nomor WhatsApp</h3>
            <p className="lead">
              Masukkan 6 digit kode yang dikirim ke WhatsApp <b>+62 {local}</b>.
            </p>
            {error && <div className="error" role="alert">{error}</div>}
            <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
              <legend className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                Kode OTP
              </legend>
              <div className="otp">
                {otp.map((d, k) => (
                  <input
                    key={k}
                    ref={(el) => {
                      otpRefs.current[k] = el;
                    }}
                    aria-label={`Digit ${k + 1}`}
                    inputMode="numeric"
                    autoComplete={k === 0 ? 'one-time-code' : 'off'}
                    value={d}
                    onChange={(e) => setDigit(k, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otp[k] && k > 0) otpRefs.current[k - 1]?.focus();
                    }}
                  />
                ))}
              </div>
            </fieldset>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, flexWrap: 'wrap', gap: 8 }}>
              <span style={{ color: 'var(--muted)' }}>Kode berlaku 5 menit.</span>
              <button type="button" className="linkbtn" disabled={countdown > 0 || busy} onClick={() => sendOtp()}>
                {countdown > 0 ? `Kirim ulang dalam 0:${String(countdown).padStart(2, '0')}` : 'Kirim ulang kode'}
              </button>
            </div>
            <button className="btn btn-primary" disabled={code.length !== 6 || busy}>
              {busy ? 'Memeriksa…' : 'Verifikasi'}
            </button>
            {USE_MOCK && <p className="hint">Mode demo: kode OTP 123456</p>}
          </form>
        )}

        {step === 'password' && (
          <form className="card-form" onSubmit={finish}>
            <h3>Buat password</h3>
            <p className="lead">Password ini dipakai untuk masuk ke aplikasi Sipaling bersama nomor WhatsApp-mu.</p>
            {error && <div className="error" role="alert">{error}</div>}
            <div className="field">
              <label htmlFor="pw">Password</label>
              <input id="pw" type="password" className="input" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Minimal 8 karakter" autoComplete="new-password" />
            </div>
            <div className="field">
              <label htmlFor="pw2">Ulangi password</label>
              <input id="pw2" type="password" className={`input ${pw2 && pw2 !== pw ? 'err' : ''}`} value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" />
              {pw2 && pw2 !== pw ? <small style={{ color: 'var(--red-fg)' }}>Password belum sama.</small> : null}
            </div>
            <button className="btn btn-primary" disabled={!pwOk || pw !== pw2 || busy}>
              {busy ? 'Menyimpan…' : 'Buat Akun'}
            </button>
          </form>
        )}

        {step === 'done' && (
          <div className="card-form success" role="status">
            <span className="success-icon">
              <Check size={44} />
            </span>
            <h3>Akun berhasil dibuat!</h3>
            <p className="lead" style={{ margin: 0 }}>
              Selamat datang, {name.trim().split(' ')[0]}. <b>+1 poin</b> sudah masuk ke akunmu. Unduh aplikasinya, lalu masuk pakai nomor WhatsApp dan password tadi.
            </p>
            <div className="stores" style={{ justifyContent: 'center' }}>
              <StoreButtons />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function Faq() {
  const faqs = [
    ['Apakah gratis?', 'Gratis. Daftar cukup dengan nama, nomor WhatsApp, dan password. Kamu hanya membayar makanan yang dipesan.'],
    ['Bagaimana poin dihitung?', 'Setiap transaksi yang selesai, online maupun beli langsung di gerobak, menambah hitunganmu. Setiap 10 transaksi, kamu dapat 1 paket nasi + lauk gratis.'],
    ['Kenapa butuh lokasi saya?', 'Lokasi dipakai untuk menampilkan gerobak dalam radius 1,5 km dan sebagai titik antar saat memanggil rider. Lokasi pencarianmu tidak disimpan.'],
    ['Area mana saja yang dilayani?', 'Saat ini gerobak Sipaling berkeliling di sekitar wilayah Kertajaya dan Darmo, Surabaya.'],
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="section" id="faq">
      <div className="container faq">
        <div className="faq-intro">
          <p className="eyebrow">Tanya jawab</p>
          <h2 className="h2" style={{ marginBottom: 12 }}>
            Masih penasaran?
          </h2>
          <p>Pertanyaan yang paling sering ditanyakan pelanggan Sipaling.</p>
        </div>
        <div className="faq-list">
          {faqs.map(([q, a], k) => {
            const on = open === k;
            return (
              <div className={`faq-item ${on ? 'open' : ''}`} key={q}>
                <button className="faq-q" aria-expanded={on} onClick={() => setOpen(on ? -1 : k)}>
                  {q}
                  {on ? <Minus size={18} color="#922D20" aria-hidden /> : <Plus size={18} color="#922D20" aria-hidden />}
                </button>
                {on && <p className="faq-a">{a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Unduh ---------------- */
function StoreButtons() {
  return (
    <>
      <a className="store" href={LINKS.appStore} aria-label="Unduh di App Store">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M16.4 12.6c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.5 1.3 0 1.7-.8 3.2-.8s1.9.8 3.3.8 2.2-1.2 3-2.5c1-1.4 1.4-2.8 1.4-2.8s-2.6-1-2.5-4.1zM14 5.1c.7-.8 1.1-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4z" />
        </svg>
        <span>
          <small>Unduh di</small>
          <b>App Store</b>
        </span>
      </a>
      <a className="store" href={LINKS.playStore} aria-label="Unduh di Google Play">
        <svg width="20" height="22" viewBox="0 0 20 22" fill="currentColor" aria-hidden>
          <path d="M1 0.6 11.4 11 1 21.4c-.4-.2-.6-.7-.6-1.2V1.8c0-.5.2-1 .6-1.2zm11.4 11.4 2.9 2.9-12.2 6.9 9.3-9.8zm0-2-9.3-9.8 12.2 6.9-2.9 2.9zm3.9-1.6 3 1.7c.9.5.9 1.3 0 1.8l-3 1.7-3.1-3.1 3.1-2.1z" />
        </svg>
        <span>
          <small>Dapatkan di</small>
          <b>Google Play</b>
        </span>
      </a>
    </>
  );
}

function Download() {
  return (
    <section className="section download" id="unduh">
      <div className="container download-inner">
        <div className="download-copy">
          <p className="eyebrow">Unduh aplikasi Sipaling</p>
          <h2 className="h2">Gerobak di genggaman.</h2>
          <p className="desc">Cari gerobak terdekat, cek sisa lauk, pesan Pick Up atau panggil rider ke lokasimu, dan pantau poinmu dari satu aplikasi.</p>
          <div className="stores">
            <StoreButtons />
          </div>
          <p className="small-note">Sudah punya akun? Masuk langsung di aplikasi.</p>
        </div>
        <div className="qr-card">
          <span className="qr">
            <QRCodeSVG value={LINKS.download} size={96} fgColor="#2A1C16" />
          </span>
          <b>
            Scan untuk
            <br />
            unduh aplikasi
          </b>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="footer motif">
      <div className="container footer-top">
        <div className="footer-brand">
          <b>SIPALING</b>
          <small>NasPad · Padang Keliling</small>
          <p>Rasa Minang, dekat di hati.</p>
        </div>
        <div className="footer-right">
          <a className="wa-btn" href={LINKS.whatsapp} target="_blank" rel="noreferrer">
            <MessageCircle size={18} aria-hidden /> Hubungi via WhatsApp
          </a>
          <div className="socials">
            <a href="#" aria-label="Instagram Sipaling">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </a>
            <a href="#" aria-label="TikTok Sipaling">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
                <path d="M14 3c.5 2.6 2.4 4.3 5 4.5" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook Sipaling">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M15 4h-2.5A3.5 3.5 0 0 0 9 7.5V21M6 11h8" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Sipaling NasPad · Padang Keliling</span>
        <nav aria-label="Informasi">
          <a href="#kebijakan-privasi">Kebijakan Privasi</a>
          <a href="#syarat">Syarat &amp; Ketentuan</a>
        </nav>
      </div>
    </footer>
  );
}
