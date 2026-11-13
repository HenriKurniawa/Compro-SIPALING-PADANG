import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Txt } from './ui';
import { colors } from '../theme';
import type { LatLng } from '../types';

type Props = { dest: LatLng; me: LatLng | null; title?: string; description?: string };

/** Pengganti peta rute saat dibuka di browser. Peta asli hanya tampil di aplikasi HP. */
export function DeliveryMap({ title }: Props) {
  return (
    <View style={s.wrap} accessibilityLabel="Ilustrasi rute antar">
      <View style={[s.road, { top: '22%', transform: [{ rotate: '4deg' }] }]} />
      <View style={[s.road, { top: '46%', height: 14, transform: [{ rotate: '-3deg' }] }]} />
      <View style={[s.roadV, { left: '38%', transform: [{ rotate: '5deg' }] }]} />
      <View style={[s.roadV, { left: '78%', width: 12, transform: [{ rotate: '-3deg' }] }]} />
      <View style={[s.dot, { left: '22%', top: '52%', backgroundColor: colors.maroon }]}>
        <Feather name="truck" size={18} color={colors.cream} />
      </View>
      <View style={[s.dot, { left: '74%', top: '20%', backgroundColor: colors.orange }]}>
        <Feather name="map-pin" size={18} color={colors.white} />
      </View>
      {title ? (
        <Txt weight="extrabold" size={12} color={colors.maroonDark} style={[s.tag, { left: '68%', top: '13%' }]}>
          {title.split(' ')[0]}
        </Txt>
      ) : null}
      <Txt size={12} color={colors.textMuted} style={s.note}>
        Pratinjau web · peta asli tampil di aplikasi HP
      </Txt>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#EFE3C7', overflow: 'hidden' },
  road: { position: 'absolute', left: -20, right: -20, height: 18, backgroundColor: colors.cream },
  roadV: { position: 'absolute', top: -20, bottom: -20, width: 16, backgroundColor: colors.cream },
  dot: { position: 'absolute', width: 40, height: 40, borderRadius: 20, borderWidth: 3, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  tag: { position: 'absolute', backgroundColor: colors.white, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
  note: { position: 'absolute', left: 16, top: '58%', backgroundColor: 'rgba(255,248,236,0.9)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
});
