import React, { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { ConfirmDialog, IconButton, Txt } from './ui';
import { colors, radius } from '../theme';
import { useSession } from '../context/SessionContext';
import type { RootStackParamList } from '../navigation';
import { initials } from '../utils/format';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** Header maroon + tombol menu samping, dipakai di semua halaman utama rider. */
export function AppHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const { rider } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={[s.header, { paddingTop: insets.top + 8 }]}>
      <IconButton icon="menu" label="Buka menu" dark onPress={() => setMenuOpen(true)} />
      <View style={{ flex: 1 }}>
        <Txt weight="extrabold" size={19} color={colors.cream} accessibilityRole="header">
          {title}
        </Txt>
        {rider ? (
          <Txt size={12} color={colors.cream2}>
            {rider.name} · {rider.cartId} · {rider.warehouse}
          </Txt>
        ) : null}
      </View>
      {right ?? <Image source={require('../../assets/logo.png')} style={s.logo} accessibilityLabel="Logo Sipaling" />}
      <SideMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

function SideMenu({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const { rider, working, logout } = useSession();
  const [confirm, setConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  type MenuKey = 'Orders' | 'Offline' | 'Stock' | 'History';
  const go = (name: MenuKey) => {
    onClose();
    if (route.name !== name) navigation.navigate(name);
  };

  const items: { key: MenuKey; label: string; icon: React.ComponentProps<typeof Feather>['name']; section?: string }[] = [
    { key: 'Orders', label: 'Pesanan Online', icon: 'wifi', section: 'PEMESANAN' },
    { key: 'Offline', label: 'Pesanan Offline', icon: 'shopping-bag' },
    { key: 'Stock', label: 'Stok Gerobak', icon: 'package', section: 'GEROBAK' },
    { key: 'History', label: 'Riwayat & Setoran', icon: 'file-text', section: 'LAPORAN' },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      {/* Di browser, menu tetap di dalam bingkai HP (maks. 430px), tidak menempel ke tepi layar laptop. */}
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]} onPress={onClose} accessibilityLabel="Tutup menu" />
        <View style={{ flex: 1, width: '100%', maxWidth: 430, flexDirection: 'row' }}>
        <View style={[s.drawer, { paddingBottom: insets.bottom + 16 }]}>
          <View style={[s.profile, { paddingTop: insets.top + 20 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={s.avatar}>
                <Txt weight="extrabold" size={22} color={colors.maroon}>
                  {rider ? initials(rider.name) : ''}
                </Txt>
              </View>
              <IconButton icon="x" label="Tutup menu" dark onPress={onClose} />
            </View>
            <View>
              <Txt weight="extrabold" size={20} color={colors.cream}>
                {rider?.name}
              </Txt>
              <Txt size={13} color={colors.cream2}>
                Gerobak {rider?.cartId} · Gudang {rider?.warehouse}
              </Txt>
            </View>
            <View style={s.statusPill}>
              <View style={[s.dot, { backgroundColor: working ? '#8FD07F' : '#B8ADA6' }]} />
              <Txt weight="bold" size={13} color={colors.cream}>
                {working ? 'Sedang bekerja' : 'Tidak bekerja'}
              </Txt>
            </View>
          </View>

          <View style={{ flex: 1, padding: 12, gap: 4 }}>
            {items.map((it) => {
              const active = route.name === it.key;
              return (
                <View key={it.key}>
                  {it.section ? (
                    <Txt weight="extrabold" size={12} color={colors.textMuted} style={{ letterSpacing: 1.2, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 4 }}>
                      {it.section}
                    </Txt>
                  ) : null}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => go(it.key)}
                    style={[s.navItem, active && { backgroundColor: colors.cream2 }]}
                  >
                    <Feather name={it.icon} size={22} color={colors.maroon} />
                    <Txt weight={active ? 'extrabold' : 'bold'} size={16} color={active ? colors.maroonDark : colors.text}>
                      {it.label}
                    </Txt>
                  </Pressable>
                </View>
              );
            })}
          </View>

          <View style={{ borderTopWidth: 1, borderTopColor: colors.cream2, paddingHorizontal: 12, paddingTop: 12 }}>
            <Pressable accessibilityRole="button" onPress={() => setConfirm(true)} style={s.navItem}>
              <Feather name="log-out" size={22} color={colors.danger} />
              <Txt weight="extrabold" size={16} color={colors.danger}>
                Keluar
              </Txt>
            </Pressable>
          </View>
        </View>
        <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Tutup menu" />
        </View>
      </View>

      <ConfirmDialog
        visible={confirm}
        title="Keluar dari akun?"
        message="Status kerjamu akan otomatis berhenti dan gerobak disembunyikan dari peta."
        confirmLabel="Keluar"
        danger
        loading={loggingOut}
        onCancel={() => setConfirm(false)}
        onConfirm={async () => {
          setLoggingOut(true);
          try {
            await logout();
          } finally {
            setLoggingOut(false);
            setConfirm(false);
            onClose();
          }
        }}
      />
    </Modal>
  );
}

const s = StyleSheet.create({
  header: {
    backgroundColor: colors.maroonDark,
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: { width: 40, height: 40, borderRadius: 10, borderWidth: 2, borderColor: colors.cream2 },
  drawer: { width: 304, backgroundColor: colors.cream },
  profile: { backgroundColor: colors.maroon, paddingHorizontal: 20, paddingBottom: 20, gap: 14 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.cream2,
    borderWidth: 3,
    borderColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(100,28,22,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  dot: { width: 9, height: 9, borderRadius: 5 },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 12, paddingVertical: 14, borderRadius: radius.md },
});
