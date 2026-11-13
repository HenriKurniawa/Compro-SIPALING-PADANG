import React from 'react';
import { DimensionValue, StyleSheet, View } from 'react-native';
import { Txt } from '../ui';
import { colors } from '../../theme';
import type { LatLng } from '../../types';

/**
 * Peta ilustrasi untuk versi browser (react-native-maps tidak jalan di web).
 * Titik diletakkan sesuai posisi lat/lng relatif satu sama lain.
 */
export type FakeMarker = { key: string; pos: LatLng; node: React.ReactNode };

export function FakeMap({ markers, route, note = true }: { markers: FakeMarker[]; route?: [LatLng, LatLng]; note?: boolean }) {
  const pts = markers.map((m) => m.pos);
  const lats = pts.map((p) => p.lat);
  const lngs = pts.map((p) => p.lng);
  const pad = 0.0025;
  const minLat = Math.min(...lats) - pad;
  const maxLat = Math.max(...lats) + pad;
  const minLng = Math.min(...lngs) - pad;
  const maxLng = Math.max(...lngs) + pad;
  const x = (p: LatLng) => 8 + ((p.lng - minLng) / (maxLng - minLng || 1)) * 84;
  const y = (p: LatLng) => 10 + ((maxLat - p.lat) / (maxLat - minLat || 1)) * 70;
  const pct = (n: number) => `${n}%` as DimensionValue;

  let line: React.ReactNode = null;
  if (route) {
    // garis putus-putus sederhana dari titik A ke B
    const [a, b] = route;
    const dots = Array.from({ length: 14 }, (_, i) => {
      const t = (i + 0.5) / 14;
      return { left: pct(x(a) + (x(b) - x(a)) * t), top: pct(y(a) + (y(b) - y(a)) * t) };
    });
    line = dots.map((d, i) => <View key={i} style={[s.dash, d]} />);
  }

  return (
    <View style={s.wrap} accessibilityLabel="Peta">
      <View style={[s.road, { top: '24%', transform: [{ rotate: '4deg' }] }]} />
      <View style={[s.road, { top: '52%', height: 14, transform: [{ rotate: '-3deg' }] }]} />
      <View style={[s.road, { top: '78%', height: 10, transform: [{ rotate: '2deg' }] }]} />
      <View style={[s.roadV, { left: '30%', transform: [{ rotate: '6deg' }] }]} />
      <View style={[s.roadV, { left: '70%', width: 12, transform: [{ rotate: '-4deg' }] }]} />
      <View style={[s.park, { left: '6%', top: '60%' }]} />
      <View style={[s.park, { left: '78%', top: '6%', width: 70 }]} />
      {line}
      {markers.map((m) => (
        <View key={m.key} style={[s.marker, { left: pct(x(m.pos)), top: pct(y(m.pos)) }]}>
          {m.node}
        </View>
      ))}
      {note ? (
        <Txt size={11} color={colors.textMuted} style={s.note}>
          Pratinjau web · peta asli tampil di HP
        </Txt>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#EFE3C7', overflow: 'hidden' },
  road: { position: 'absolute', left: -20, right: -20, height: 18, backgroundColor: colors.cream },
  roadV: { position: 'absolute', top: -20, bottom: -20, width: 16, backgroundColor: colors.cream },
  park: { position: 'absolute', width: 90, height: 60, borderRadius: 18, backgroundColor: '#D9E6C9' },
  dash: { position: 'absolute', width: 6, height: 6, marginLeft: -3, marginTop: -3, borderRadius: 3, backgroundColor: colors.maroon },
  marker: { position: 'absolute', transform: [{ translateX: '-50%' }, { translateY: '-100%' }] },
  note: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'rgba(255,248,236,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
