import { useCallback, useMemo, useState } from 'react';
import type L from 'leaflet';
import { Link } from 'react-router-dom';
import { AppHeader } from '../components/layout/AppHeader';
import { MapLegend, ShowAllButton, ZoomControls } from '../components/map/MapOverlays';
import { RiderDetailCard } from '../components/map/RiderDetailCard';
import { RiderMap, type MapCommand } from '../components/map/RiderMap';
import { RiderSidebar } from '../components/map/RiderSidebar';
import { Avatar } from '../components/ui';
import { useAuth } from '../context/auth';
import { useNow, useRiders } from '../context/riders';
import { secondsSince } from '../lib/utils';
import type { RiderFilter } from '../types';

export const PetaRiderPage = () => {
  const { user } = useAuth();
  const { riders, loading, error } = useRiders();
  const now = useNow();

  const [filter, setFilter] = useState<RiderFilter>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [command, setCommand] = useState<MapCommand | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  const visibleRiders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return riders.filter(
      (r) =>
        (filter === 'all' || r.status === filter) &&
        (!q || r.name.toLowerCase().includes(q) || r.cartId.toLowerCase().includes(q)),
    );
  }, [riders, filter, search]);

  // Detail ditutup jika rider terpilih tersaring keluar dari daftar
  const selectedRider = visibleRiders.find((r) => r.id === selectedId) ?? null;

  const latestUpdateSeconds = useMemo(() => {
    const times = riders.filter((r) => r.status === 'active' && r.lastUpdateAt).map((r) => secondsSince(r.lastUpdateAt!, now));
    return times.length ? Math.min(...times) : null;
  }, [riders, now]);

  const selectRider = useCallback((id: string) => {
    setSelectedId(id);
    setCommand({ type: 'focus', riderId: id, nonce: Date.now() });
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <AppHeader>
        <div className="hidden h-8 items-center gap-2 rounded-full bg-cream/10 px-3 text-[13px] text-cream md:flex" aria-live="polite">
          <span className="size-2 rounded-full bg-live-dot" />
          {latestUpdateSeconds === null ? 'Belum ada rider aktif' : `Lokasi diperbarui ${latestUpdateSeconds} detik lalu`}
        </div>
        <Link
          to="/profil"
          className="flex h-11 items-center gap-2.5 rounded-full bg-cream/10 py-1 pr-3.5 pl-1 hover:bg-cream/20"
          aria-label="Buka profil"
        >
          {user && <Avatar name={user.name} size={36} fontSize={14} tone="orange" />}
          <span className="text-sm font-bold text-cream">{user?.name}</span>
        </Link>
      </AppHeader>

      <div className="flex min-h-0 flex-1">
        <RiderSidebar
          riders={riders}
          visibleRiders={visibleRiders}
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
          selectedId={selectedRider?.id ?? null}
          onSelect={selectRider}
          now={now}
          loading={loading}
          error={error}
        />

        <section className="relative min-w-0 flex-1" aria-label="Peta lokasi rider">
          <RiderMap
            riders={visibleRiders}
            selectedId={selectedRider?.id ?? null}
            onSelect={selectRider}
            command={command}
            onReady={setMap}
          />

          {selectedRider && (
            <RiderDetailCard
              rider={selectedRider}
              now={now}
              onClose={() => setSelectedId(null)}
              onCenter={() => setCommand({ type: 'focus', riderId: selectedRider.id, zoomIn: true, nonce: Date.now() })}
              className="absolute top-5 right-5 z-[1000]"
            />
          )}

          <div className="absolute bottom-5 left-5 z-[1000]">
            <MapLegend />
          </div>
          <div className="absolute right-5 bottom-5 z-[1000] flex items-end gap-3">
            <ShowAllButton onClick={() => setCommand({ type: 'fit-all', nonce: Date.now() })} />
            <ZoomControls onZoomIn={() => map?.zoomIn()} onZoomOut={() => map?.zoomOut()} />
          </div>
        </section>
      </div>
    </div>
  );
};
