import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GonjongCart, MotifBackground, GOLD } from '../components/Brand';
import { Txt } from '../components/ui';
import { colors } from '../theme';

export default function SplashScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.maroon, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <StatusBar style="light" />
      <MotifBackground />
      <View style={{ alignItems: 'center', gap: 12 }}>
        <GonjongCart width={220} />
        <Txt weight="extrabold" size={34} color={colors.cream} style={{ letterSpacing: 4, marginTop: 6 }}>
          SIPALING
        </Txt>
        <Txt weight="bold" size={15} color={GOLD}>
          NasPad · Padang Keliling
        </Txt>
        <Txt size={14} color={colors.cream} style={{ textAlign: 'center', opacity: 0.85, marginTop: 6 }}>
          Nasi padang hangat, datang ke dekatmu.
        </Txt>
      </View>
      <View style={{ position: 'absolute', bottom: 40, alignItems: 'center', gap: 4 }}>
        <Txt size={12} color={colors.cream} style={{ opacity: 0.75 }}>
          Sipaling NasPad · Padang Keliling
        </Txt>
        <Txt size={12} color={colors.cream} style={{ opacity: 0.6 }}>
          versi 1.0.0
        </Txt>
      </View>
    </View>
  );
}
