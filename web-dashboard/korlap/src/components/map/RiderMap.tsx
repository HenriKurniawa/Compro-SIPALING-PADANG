import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import type { Rider } from '../../types';
import { riderMarkerIcon } from './riderMarkerIcon';

/** Titik tengah default: wilayah Kertajaya, Surabaya */
const DEFAULT_CENTER: L.LatLngTuple = [-7.2785, 112.7705];
const DEFAULT_ZOOM = 15;
const FOCUS_ZOOM = 17;
const FIT_PADDING: L.PointExpression = [60, 60];

export interface MapCommand {
  type: 'focus' | 'fit-all';
  riderId?: string;
  /** true: perbesar ke level jalan (tombol "Pusatkan Peta"); false: hanya geser peta */
  zoomIn?: boolean;
  /** Nilai unik agar perintah yang sama tetap dijalankan ulang */
  nonce: number;
}

interface RiderMapProps {
  riders: Rider[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  command: MapCommand | null;
  onReady?: (map: L.Map) => void;
}

export const RiderMap = ({ riders, selectedId, onSelect, command, onReady }: RiderMapProps) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const positioned = useMemo(() => riders.filter((r) => r.position), [riders]);
  const didInitialFit = useRef(false);

  useEffect(() => {
    if (map) onReady?.(map);
  }, [map, onReady]);

  // Sekali di awal: tampilkan semua rider yang punya lokasi
  useEffect(() => {
    if (!map || didInitialFit.current || positioned.length === 0) return;
    didInitialFit.current = true;
    map.fitBounds(L.latLngBounds(positioned.map((r) => [r.position!.lat, r.position!.lng])), { padding: FIT_PADDING });
  }, [map, positioned]);

  useEffect(() => {
    if (!map || !command) return;
    if (command.type === 'fit-all' && positioned.length > 0) {
      map.flyToBounds(L.latLngBounds(positioned.map((r) => [r.position!.lat, r.position!.lng])), {
        padding: FIT_PADDING,
        duration: 0.6,
      });
    }
    if (command.type === 'focus') {
      const target = riders.find((r) => r.id === command.riderId)?.position;
      if (target) {
        const zoom = command.zoomIn ? Math.max(map.getZoom(), FOCUS_ZOOM) : map.getZoom();
        map.flyTo([target.lat, target.lng], zoom, { duration: 0.6 });
      }
    }
    // Hanya dijalankan saat perintah baru masuk
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command?.nonce, map]);

  return (
    <MapContainer
      ref={setMap}
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      zoomControl={false}
      className="korlap-map size-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      {positioned.map((rider) => (
        <Marker
          key={rider.id}
          position={[rider.position!.lat, rider.position!.lng]}
          icon={riderMarkerIcon(rider, rider.id === selectedId)}
          zIndexOffset={rider.id === selectedId ? 1000 : rider.status === 'active' ? 100 : 0}
          title={`${rider.name} (${rider.cartId})`}
          eventHandlers={{ click: () => onSelect(rider.id) }}
        />
      ))}
    </MapContainer>
  );
};
