import { avatarTone, cn, riderUpdateShort } from '../../lib/utils';
import type { Rider, RiderFilter } from '../../types';
import { Avatar, Icon, StatusBadge } from '../ui';

interface RiderSidebarProps {
  riders: Rider[];
  visibleRiders: Rider[];
  filter: RiderFilter;
  onFilterChange: (f: RiderFilter) => void;
  search: string;
  onSearchChange: (s: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  now: number;
  loading: boolean;
  error: string | null;
}

const FILTERS: Array<{ value: RiderFilter; label: string }> = [
  { value: 'all', label: 'Semua' },
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Tidak aktif' },
];

export const RiderSidebar = ({
  riders,
  visibleRiders,
  filter,
  onFilterChange,
  search,
  onSearchChange,
  selectedId,
  onSelect,
  now,
  loading,
  error,
}: RiderSidebarProps) => {
  const activeCount = riders.filter((r) => r.status === 'active').length;
  const stats = [
    { label: 'Aktif', value: activeCount, className: 'bg-success-bg text-success-fg' },
    { label: 'Tidak aktif', value: riders.length - activeCount, className: 'bg-idle-bg text-idle-fg' },
    { label: 'Total', value: riders.length, className: 'bg-sand text-ink' },
  ];

  return (
    <aside className="flex w-[340px] shrink-0 flex-col border-r border-sand bg-white">
      <div className="px-5 pt-[25px]">
        <h1 className="text-[26px] font-bold text-maroon-900">Peta Rider</h1>

        <div className="mt-2 grid grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.label} className={cn('h-16 rounded-[14px] px-3 pt-[13px]', s.className)}>
              <p className="text-xs font-bold">{s.label}</p>
              <p className="text-2xl leading-tight font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        <label className="mt-3.5 flex h-11 items-center gap-2 rounded-xl border border-line bg-cream px-3 focus-within:border-orange">
          <Icon name="search" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama rider atau ID gerobak"
            aria-label="Cari nama rider atau ID gerobak"
            className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-placeholder"
          />
        </label>

        <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Filter status rider">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              role="radio"
              aria-checked={filter === f.value}
              onClick={() => onFilterChange(f.value)}
              className={cn(
                'h-[37px] cursor-pointer rounded-full border text-[13px] font-bold',
                filter === f.value
                  ? 'border-maroon-700 bg-maroon-700 text-cream'
                  : 'border-line bg-white text-ink hover:bg-cream',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-3 flex-1 space-y-1 overflow-y-auto px-3 pb-3" aria-label="Daftar rider">
        {loading && <li className="px-2 py-4 text-sm text-muted">Memuat data rider…</li>}
        {error && <li className="px-2 py-4 text-sm font-bold text-danger">{error}</li>}
        {!loading && !error && visibleRiders.length === 0 && (
          <li className="px-2 py-4 text-sm text-muted">Tidak ada rider yang cocok.</li>
        )}
        {visibleRiders.map((rider) => {
          const selected = rider.id === selectedId;
          return (
            <li key={rider.id}>
              <button
                type="button"
                onClick={() => onSelect(rider.id)}
                aria-pressed={selected}
                className={cn(
                  'flex h-[70px] w-full cursor-pointer items-center gap-[11px] rounded-[14px] border-2 px-3 text-left',
                  selected ? 'border-orange bg-cream' : 'border-transparent bg-white hover:bg-cream/60',
                )}
              >
                <Avatar name={rider.name} size={42} fontSize={14} tone={avatarTone(rider.status)} status={rider.status} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-bold text-maroon-900">{rider.name}</span>
                  <span className="block truncate text-xs text-muted">
                    {rider.cartId} · {rider.lastLocationLabel ?? 'Lokasi belum tersedia'}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <StatusBadge status={rider.status} />
                  <span className="text-[11px] text-muted">{riderUpdateShort(rider, now)}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
