import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { USE_MOCK } from '../api';
import { DEMO_POSITION } from '../api/mockApi';
import type { LatLng } from '../types';

/**
 * Posisi pengguna untuk mencari gerobak terdekat (radius 1,5 km).
 * Mode demo selalu memakai posisi contoh supaya gerobak contoh terlihat.
 */
export function useMyPosition() {
  const [pos, setPos] = useState<LatLng | null>(USE_MOCK ? DEMO_POSITION : null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (USE_MOCK) return;
    let alive = true;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (alive) setDenied(true);
        return;
      }
      const p = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      if (alive) setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
    })().catch(() => alive && setDenied(true));
    return () => {
      alive = false;
    };
  }, []);

  return { pos, denied };
}
