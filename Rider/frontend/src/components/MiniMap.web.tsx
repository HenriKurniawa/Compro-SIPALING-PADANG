import React from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Txt } from './ui';
import { colors } from '../theme';
import type { LatLng } from '../types';

/** Pengganti peta kecil saat dibuka di browser (react-native-maps tidak jalan di web). */
export function MiniMap({ location }: { location: LatLng; address?: string }) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={() => Linking.openURL(`https://www.google.com/maps?q=${location.lat},${location.lng}`)}
      style={s.box}
    >
      <View style={[s.road, { top: 34, left: -10, right: -10, transform: [{ rotate: '4deg' }] }]} />
      <View style={[s.road, { top: -10, bottom: -10, left: 120, width: 12, height: undefined, transform: [{ rotate: '6deg' }] }]} />
      <View style={s.pin}>
        <Feather name="map-pin" size={16} color={colors.white} />
      </View>
      <Txt weight="bold" size={12} color={colors.textMuted} style={s.label}>
        Buka di Google Maps
      </Txt>
    </Pressable>
  );
}

const s = StyleSheet.create({
  box: { height: 96, borderRadius: 12, overflow: 'hidden', backgroundColor: '#EFE3C7', alignItems: 'center', justifyContent: 'center' },
  road: { position: 'absolute', height: 12, backgroundColor: colors.cream },
  pin: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.orange, borderWidth: 3, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  label: { position: 'absolute', right: 10, bottom: 8, backgroundColor: 'rgba(255,248,236,0.9)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
});
