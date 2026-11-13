import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { colors } from '../theme';
import type { LatLng } from '../types';

type Props = { dest: LatLng; me: LatLng | null; title?: string; description?: string };

/** Peta rute antar (Android/iOS). Versi browser ada di DeliveryMap.web.tsx. */
export function DeliveryMap({ dest, me, title, description }: Props) {
  const ref = useRef<MapView>(null);

  // Arahkan peta supaya posisi rider & customer kelihatan semua.
  useEffect(() => {
    const pts = [dest, ...(me ? [me] : [])].map((p) => ({ latitude: p.lat, longitude: p.lng }));
    const t = setTimeout(() => {
      ref.current?.fitToCoordinates(pts, { edgePadding: { top: 120, right: 60, bottom: 80, left: 60 }, animated: true });
    }, 400);
    return () => clearTimeout(t);
  }, [dest, me]);

  return (
    <MapView
      ref={ref}
      style={StyleSheet.absoluteFill}
      showsUserLocation
      initialRegion={{ latitude: dest.lat, longitude: dest.lng, latitudeDelta: 0.02, longitudeDelta: 0.02 }}
    >
      <Marker coordinate={{ latitude: dest.lat, longitude: dest.lng }} title={title} description={description} pinColor={colors.orange} />
      {me ? (
        <Polyline
          coordinates={[
            { latitude: me.lat, longitude: me.lng },
            { latitude: dest.lat, longitude: dest.lng },
          ]}
          strokeColor={colors.maroon}
          strokeWidth={4}
          lineDashPattern={[8, 6]}
        />
      ) : null}
    </MapView>
  );
}
