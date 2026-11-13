import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { CartPin, UserPin } from './Pins';
import type { Cart, LatLng } from '../../types';

export type CartsMapProps = { me: LatLng; carts: Cart[]; selectedId?: string; onSelect: (c: Cart) => void };

/** Peta gerobak di sekitar pengguna (Android/iOS). Versi browser: CartsMap.web.tsx */
export function CartsMap({ me, carts, selectedId, onSelect }: CartsMapProps) {
  const ref = useRef<MapView>(null);
  useEffect(() => {
    const pts = [me, ...carts.map((c) => c.location)].map((p) => ({ latitude: p.lat, longitude: p.lng }));
    const t = setTimeout(() => ref.current?.fitToCoordinates(pts, { edgePadding: { top: 80, right: 50, bottom: 260, left: 50 }, animated: true }), 400);
    return () => clearTimeout(t);
  }, [me, carts]);

  return (
    <MapView
      ref={ref}
      style={StyleSheet.absoluteFill}
      initialRegion={{ latitude: me.lat, longitude: me.lng, latitudeDelta: 0.02, longitudeDelta: 0.02 }}
    >
      <Marker coordinate={{ latitude: me.lat, longitude: me.lng }} anchor={{ x: 0.5, y: 1 }}>
        <UserPin />
      </Marker>
      {carts.map((c) => (
        <Marker
          key={c.id}
          coordinate={{ latitude: c.location.lat, longitude: c.location.lng }}
          anchor={{ x: 0.5, y: 1 }}
          onPress={() => onSelect(c)}
        >
          <CartPin label={'#' + c.id.replace('GRB-', '')} selected={c.id === selectedId} />
        </Marker>
      ))}
    </MapView>
  );
}
