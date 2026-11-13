import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GonjongCart, MotifBackground, GOLD } from './Brand';
import { Txt } from './ui';
import { colors } from '../theme';

/** Kerangka login & daftar: latar motif maroon, ilustrasi emas, kartu krem di bawah. */
export function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.maroon }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" />
      <MotifBackground />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', paddingTop: insets.top + 28, paddingBottom: 26, gap: 10 }}>
          <GonjongCart width={170} />
          <Txt weight="extrabold" size={26} color={colors.cream} style={{ letterSpacing: 3 }}>
            SIPALING
          </Txt>
          <Txt weight="semibold" size={13} color={GOLD}>
            NasPad · Padang Keliling
          </Txt>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.cream,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 22,
            paddingBottom: insets.bottom + 24,
            gap: 16,
          }}
        >
          <View style={{ gap: 4 }}>
            <Txt weight="extrabold" size={23} color={colors.maroonDark}>
              {title}
            </Txt>
            {subtitle ? (
              <Txt size={14} color={colors.textMuted} style={{ lineHeight: 20 }}>
                {subtitle}
              </Txt>
            ) : null}
          </View>
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
