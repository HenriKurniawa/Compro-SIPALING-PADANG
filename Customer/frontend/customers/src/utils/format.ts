const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/** 43000 -> "Rp43.000" */
export function rupiah(n: number): string {
  const s = Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (n < 0 ? '-Rp' : 'Rp') + s;
}

const pad = (n: number) => (n < 10 ? '0' + n : String(n));

/** ISO -> "12:52" (jam lokal) */
export function timeHM(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Date -> "2026-10-30" (tanggal lokal) */
export function isoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

/** "2026-10-30" -> "Jumat, 30 Okt 2026" */
export function dateLong(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${DAYS[date.getDay()]}, ${d} ${MONTHS[m - 1]} ${y}`;
}

/** "2026-10-26" -> "26 Okt" */
export function dateShort(ymd: string): string {
  const [, m, d] = ymd.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

export function isValidYmd(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function itemsSummary(items: { name: string; qty: number }[]): string {
  return items.map((i) => `${i.qty}x ${i.name}`).join(', ');
}

/** ISO -> "12 Nov 2026 · 12:15" */
export function dateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} · ${timeHM(iso)}`;
}

/** "GRB-012" -> "Gerobak #012" */
export function cartName(id: string): string {
  return 'Gerobak #' + id.replace(/^GRB-/, '');
}

/** 0.3 -> "300 m", 1.2 -> "1,2 km" */
export function distance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1).replace('.', ',')} km`;
}
