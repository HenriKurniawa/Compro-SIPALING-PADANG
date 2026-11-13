import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Txt } from '../ui';
import { colors } from '../../theme';

/** Pin label gerobak (hijau; maroon kalau dipilih). */
export function CartPin({ label, selected }: { label: string; selected?: boolean }) {
  const bg = selected ? colors.maroon : colors.greenDot;
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={[s.pill, { backgroundColor: bg }]}>
        <Feather name="shopping-cart" size={13} color={colors.white} />
        <Txt weight="extrabold" size={12} color={colors.white}>
          {label}
        </Txt>
      </View>
      <View style={[s.tip, { borderTopColor: bg }]} />
    </View>
  );
}

/** Pin merah posisi pengguna / titik antar. */
export function UserPin({ label }: { label?: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      {label ? (
        <Txt weight="bold" size={11} color={colors.maroonDark} style={s.label}>
          {label}
        </Txt>
      ) : null}
      <View style={s.user}>
        <View style={s.userDot} />
      </View>
      <View style={[s.tip, { borderTopColor: colors.danger }]} />
    </View>
  );
}

const s = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.white,
  },
  tip: { width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', marginTop: -1 },
  user: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.danger, borderWidth: 3, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  userDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.white },
  label: { backgroundColor: colors.white, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, overflow: 'hidden', marginBottom: 3 },
});
