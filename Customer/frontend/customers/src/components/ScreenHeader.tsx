import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Txt } from './ui';
import { colors } from '../theme';

/** Judul halaman dengan tombol kembali (← Detail Menu, ← Checkout, dst.). */
export function ScreenHeader({ title, subtitle, right, back = true }: { title: string; subtitle?: string; right?: React.ReactNode; back?: boolean }) {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  return (
    <View
      style={{
        paddingTop: insets.top + 10,
        paddingBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: colors.cream,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.cream2,
      }}
    >
      <StatusBar style="dark" />
      {back ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          onPress={() => nav.goBack()}
          hitSlop={8}
          style={{ width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream2 }}
        >
          <Feather name="arrow-left" size={22} color={colors.maroonDark} />
        </Pressable>
      ) : null}
      <View style={{ flex: 1 }}>
        <Txt weight="extrabold" size={20} color={colors.maroonDark} accessibilityRole="header">
          {title}
        </Txt>
        {subtitle ? (
          <Txt size={13} color={colors.textMuted}>
            {subtitle}
          </Txt>
        ) : null}
      </View>
      {right}
    </View>
  );
}

/** Bar maroon mengambang di bawah: "Lihat keranjang · Rp46.000 →" */
export function FloatingBar({ label, onPress, icon = 'arrow-right' }: { label: string; onPress: () => void; icon?: React.ComponentProps<typeof Feather>['name'] }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ position: 'absolute', left: 16, right: 16, bottom: insets.bottom + 14 }}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => ({
          minHeight: 56,
          borderRadius: 16,
          backgroundColor: colors.maroon,
          paddingHorizontal: 18,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: pressed ? 0.9 : 1,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
        })}
      >
        <Txt weight="extrabold" size={16} color={colors.cream}>
          {label}
        </Txt>
        <Feather name={icon} size={20} color={colors.cream} />
      </Pressable>
    </View>
  );
}
