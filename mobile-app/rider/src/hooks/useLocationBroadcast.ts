import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { api } from '../api';

/**
 * Selama rider "Sedang bekerja", kirim posisi GPS ke backend ±10 detik sekali (FR-RDR-01).
 * Catatan: ini hanya berjalan saat aplikasi terbuka. Untuk tetap mengirim di latar belakang
 * (layar mati), perlu expo-task-manager + development build — lihat README.
 */
export function useLocationBroadcast(working: boolean) {
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    if (!working) return;
    let sub: Location.LocationSubscription | null = null;
    let cancelled = false;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (cancelled) return;
      if (status !== 'granted') {
        setPermissionDenied(true);
        return;
      }
      setPermissionDenied(false);
      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 10000, distanceInterval: 0 },
        (pos) => {
          // Gagal kirim sesekali tidak apa-apa; posisi berikutnya akan dicoba lagi.
          try {
            api.sendLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              recordedAt: new Date(pos.timestamp).toISOString(),
            });
          } catch {}
        },
      );
      if (cancelled) sub.remove();
    })();

    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, [working]);

  return { permissionDenied };
}
