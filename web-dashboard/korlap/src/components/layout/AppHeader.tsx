import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { BrandLogo } from './BrandLogo';

/** Header maroon yang dipakai halaman Peta Rider dan Profil. Konten kanan diisi lewat `children`. */
export const AppHeader = ({ children }: { children?: ReactNode }) => {
  const { user } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 bg-maroon-900 px-5">
      <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="Kembali ke Peta Rider">
        <BrandLogo size={44} />
        <div className="min-w-0">
          <p className="truncate text-[17px] leading-tight font-bold text-cream">
            SIPALING <span className="text-sand">· Korlap</span>
          </p>
          <p className="truncate text-xs text-sand">Wilayah {user?.region}</p>
        </div>
      </Link>
      <div className="flex items-center gap-4">{children}</div>
    </header>
  );
};
