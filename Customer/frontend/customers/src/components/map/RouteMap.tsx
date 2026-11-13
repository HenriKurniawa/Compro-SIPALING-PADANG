import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { colors } from '../../theme';
import { CartPin, UserPin } from './Pins';
import type { LatLng } from '../../types';

export type RouteMapProps = {
  cart: LatLng;
  cartLabel: string;
  dest?: LatLng;
  destLabel?: string;
  /** Titik antar boleh digeser (checkout Call Riders). */
  onDestChange?: (p: LatLng) => void;
};

/** Peta rute gerobak → pengguna (Android/iOS). Versi browser: RouteMap.web.tsx */
export function RouteMap({ cart, cartLabel, dest, destLabel, onDestChange }: RouteMapProps) {
  const ref = useRef<MapView>(null);
  useEffect(() => {
    const pts = [cart, ...(dest ? [dest] : [])].map((p) => ({ latitude: p.lat, longitude: p.lng }));
    const t = setTimeout(() => ref.current?.fitToCoordinates(pts, { edgePadding: { top: 70, right: 60, bottom: 60, left: 60 }, animated: true }), 400);
    return () => clearTimeout(t);
    // sengaja hanya saat pertama tampil supaya peta tidak lompat saat pin digeser
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MapView
      ref={ref}
      style={StyleSheet.absoluteFill}
      initialRegion={{ latitude: cart.lat, longitude: cart.lng, latitudeDelta: 0.012, longitudeDelta: 0.012 }}
    >
      <Marker coordinate={{ latitude: cart.lat, longitude: cart.lng }} anchor={{ x: 0.5, y: 1 }}>
        <CartPin label={cartLabel} selected />
      </Marker>
      {dest ? (
        <>
          <Marker
            coordinate={{ latitude: dest.lat, longitude: dest.lng }}
            anchor={{ x: 0.5, y: 1 }}
            draggable={!!onDestChange}
            onDragEnd={(e) => onDestChange?.({ lat: e.nativeEvent.coordinate.latitude, lng: e.nativeEvent.coordinate.longitude })}
          >
            <UserPin label={destLabel} />
          </Marker>
          <Polyline
            coordinates={[
              { latitude: cart.lat, longitude: cart.lng },
              { latitude: dest.lat, longitude: dest.lng },
            ]}
            strokeColor={colors.maroon}
            strokeWidth={4}
            lineDashPattern={[8, 6]}
          />
        </>
      ) : null}
    </MapView>
  );
}
