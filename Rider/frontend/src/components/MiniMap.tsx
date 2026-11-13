import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { colors } from '../theme';
import type { LatLng } from '../types';

/** Peta kecil di kartu pesanan (Android/iOS). Versi browser ada di MiniMap.web.tsx. */
export function MiniMap({ location }: { location: LatLng; address?: string }) {
  return (
    <View style={s.box} pointerEvents="none" accessibilityLabel="Peta mini lokasi customer">
      <MapView
        style={StyleSheet.absoluteFill}
        liteMode
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
        initialRegion={{ latitude: location.lat, longitude: location.lng, latitudeDelta: 0.008, longitudeDelta: 0.008 }}
      >
        <Marker coordinate={{ latitude: location.lat, longitude: location.lng }} pinColor={colors.orange} />
      </MapView>
    </View>
  );
}

const s = StyleSheet.create({
  box: { height: 96, borderRadius: 12, overflow: 'hidden', backgroundColor: '#EFE3C7' },
});
