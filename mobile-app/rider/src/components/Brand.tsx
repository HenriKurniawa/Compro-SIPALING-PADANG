import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Line, Path, Pattern, Rect } from 'react-native-svg';
import { colors } from '../theme';

export const GOLD = '#E9B44C';

/** Latar maroon bermotif songket (splash & login). */
export function MotifBackground({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.maroon }, style]} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id="motif" width={56} height={56} patternUnits="userSpaceOnUse">
            <Path d="M28 4 L52 28 L28 52 L4 28 Z" stroke={GOLD} strokeOpacity={0.14} strokeWidth={1.4} fill="none" />
            <Path d="M28 16 L40 28 L28 40 L16 28 Z" stroke={GOLD} strokeOpacity={0.1} strokeWidth={1.2} fill="none" />
            <Circle cx={28} cy={28} r={2.2} fill={GOLD} fillOpacity={0.16} />
            <Circle cx={0} cy={0} r={2} fill={GOLD} fillOpacity={0.12} />
            <Circle cx={56} cy={56} r={2} fill={GOLD} fillOpacity={0.12} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#motif)" />
      </Svg>
    </View>
  );
}

/** Ilustrasi garis emas: atap gonjong Rumah Gadang + gerobak nasi padang. */
export function GonjongCart({ width = 220 }: { width?: number }) {
  const h = (width * 150) / 220;
  return (
    <Svg width={width} height={h} viewBox="0 0 220 150" accessibilityLabel="Ilustrasi gerobak Sipaling">
      {/* atap gonjong */}
      <Path
        d="M8 80 C40 76 56 52 48 12 C68 46 90 58 110 58 C130 58 152 46 172 12 C164 52 180 76 212 80"
        stroke={GOLD}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M30 80 C70 70 150 70 190 80" stroke={GOLD} strokeWidth={3} strokeLinecap="round" fill="none" />
      <Path d="M100 40 L110 26 L120 40" stroke={GOLD} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* tiang */}
      <Line x1={52} y1={80} x2={52} y2={92} stroke={GOLD} strokeWidth={3} strokeLinecap="round" />
      <Line x1={168} y1={80} x2={168} y2={92} stroke={GOLD} strokeWidth={3} strokeLinecap="round" />
      {/* badan gerobak */}
      <Rect x={40} y={92} width={140} height={32} rx={6} stroke={GOLD} strokeWidth={4} fill="none" />
      <Line x1={56} y1={108} x2={164} y2={108} stroke={GOLD} strokeWidth={2.5} strokeDasharray="8 6" strokeLinecap="round" />
      {/* pegangan */}
      <Path d="M180 100 L204 96" stroke={GOLD} strokeWidth={4} strokeLinecap="round" />
      {/* roda */}
      <Circle cx={68} cy={134} r={10} stroke={GOLD} strokeWidth={4} fill="none" />
      <Circle cx={152} cy={134} r={10} stroke={GOLD} strokeWidth={4} fill="none" />
      <Circle cx={68} cy={134} r={2.5} fill={GOLD} />
      <Circle cx={152} cy={134} r={2.5} fill={GOLD} />
    </Svg>
  );
}
