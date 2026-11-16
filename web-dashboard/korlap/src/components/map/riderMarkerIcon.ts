import L from 'leaflet';
import truckIcon from '../../assets/icons/truck.svg';
import type { Rider } from '../../types';

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Marker pil sesuai desain: ikon gerobak + nama depan + titik hijau (aktif) */
export const riderMarkerIcon = (rider: Rider, selected: boolean) => {
  const active = rider.status === 'active';
  const firstName = escapeHtml(rider.name.split(' ')[0]!);
  const html = `
    <div class="absolute flex h-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl border-2 border-white px-3 text-[13px] font-bold text-cream shadow-[0_2px_6px_rgba(61,17,13,0.25)] ${
      active ? 'bg-maroon-700' : 'bg-idle-dot'
    } ${selected ? 'shadow-[0_4px_12px_rgba(61,17,13,0.4)]' : ''}">
      <span class="inline-flex size-4 items-center justify-center"><img src="${truckIcon}" alt="" class="block max-w-none" /></span>
      <span>${firstName}</span>
      ${active ? '<span class="size-2 rounded-full bg-live-dot"></span>' : ''}
    </div>`;

  return L.divIcon({ className: '', html, iconSize: [0, 0], iconAnchor: [0, 0] });
};
