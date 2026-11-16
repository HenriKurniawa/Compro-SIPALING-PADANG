import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Rider, RiderStatus } from '../types';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/** "Budi Santoso" → "BS" */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');

/** Format jam gaya Indonesia: 13.40 */
export const formatClock = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}.${String(d.getMinutes()).padStart(2, '0')}`;
};

export const secondsSince = (iso: string, now: number) =>
  Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));

/** Label singkat untuk daftar: "5 dtk lalu" / "terakhir 13.40" / "belum aktif" */
export const riderUpdateShort = (rider: Rider, now: number) => {
  if (!rider.lastUpdateAt) return 'belum aktif';
  if (rider.status === 'inactive') return `terakhir ${formatClock(rider.lastUpdateAt)}`;
  const s = secondsSince(rider.lastUpdateAt, now);
  if (s < 60) return `${s} dtk lalu`;
  return `${Math.floor(s / 60)} mnt lalu`;
};

/** Link WhatsApp dari nomor lokal "0812-3456-7890" → https://wa.me/6281234567890 */
export const whatsappLink = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  const intl = digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
};

export const avatarTone = (status: RiderStatus) => (status === 'active' ? 'active' : 'inactive') as 'active' | 'inactive';
