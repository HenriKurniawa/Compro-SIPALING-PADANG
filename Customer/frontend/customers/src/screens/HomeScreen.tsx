import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Button, ErrorBox, Txt } from '../components/ui';
import { FloatingBar } from '../components/ScreenHeader';
import { CartsMap } from '../components/map/CartsMap';
import { useSession } from '../context/SessionContext';
import { useOrder } from '../context/OrderContext';
import { useMyPosition } from '../hooks/useMyPosition';
import { SEARCH_RADIUS_KM, api, errMsg } from '../api';
import { cartName, distance, rupiah } from '../utils/format';
import { colors, radius } from '../theme';
import type { Cart } from '../types';
import type { RootStackParamList } from '../navigation';

export default function HomeScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { customer } = useSession();
  const { active, setActive, loyalty, refreshLoyalty, pickCart, refreshActive } = useOrder();
  const { pos, denied } = useMyPosition();
  const [carts, setCarts] = useState<Cart[] | null>(null);
  const [selected, setSelected] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!pos) return;
    setError(null);
    try {
      const list = await api.getNearbyCarts(pos);
      setCarts(list);
      setSelected((s) => s ?? list[0]?.id);
    } catch (e) {
      setError(errMsg(e));
    }
  }, [pos]);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      refreshLoyalty();
      refreshActive();
    }, [refreshLoyalty, refreshActive]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([load(), refreshLoyalty(), refreshActive()]);
    setRefreshing(false);
  };

  const openMenu = (c: Cart) => {
    pickCart(c);
    nav.navigate('Menu');
  };

  const ongoing = active && active.status !== 'selesai' && active.status !== 'ditolak';
  const firstName = customer?.name.split(' ')[0] ?? '';

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 16, paddingBottom: ongoing ? 100 : 24, gap: 14 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.maroon} />}
      >
        {/* Sapaan + lonceng */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Txt size={14} color={colors.textMuted}>
              Mau makan apa hari ini?
            </Txt>
            <Txt weight="extrabold" size={24} color={colors.maroonDark} accessibilityRole="header">
              Halo, {firstName}!
            </Txt>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={active ? 'Notifikasi: ada kabar pesanan' : 'Notifikasi'}
            onPress={() => (active ? nav.navigate('Track') : undefined)}
            style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: colors.cream2, alignItems: 'center', justifyContent: 'center' }}
          >
            <Feather name="bell" size={22} color={colors.maroonDark} />
            {active ? <View style={{ position: 'absolute', top: 10, right: 11, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.orange, borderWidth: 2, borderColor: colors.cream2 }} /> : null}
          </Pressable>
        </View>

        {/* Kartu poin */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${loyalty?.points ?? 0} poin. Lihat kartu poin`}
          onPress={() => nav.navigate('Points')}
          style={{ backgroundColor: colors.maroon, borderRadius: radius.lg, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}
        >
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,248,236,0.14)', alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="award" size={24} color="#E9B44C" />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Txt weight="extrabold" size={22} color={colors.cream}>
              {loyalty?.points ?? 0} poin
            </Txt>
            <Txt size={13} color={colors.cream} style={{ opacity: 0.85 }}>
              {loyalty?.rewards ? `${loyalty.rewards} paket gratis siap dipakai!` : `Kumpulkan ${loyalty?.target ?? 10} poin, gratis 1 paket nasi + lauk`}
            </Txt>
          </View>
          <Feather name="chevron-right" size={22} color={colors.cream} />
        </Pressable>

        {/* Kabar pesanan: diterima / ditolak */}
        {active?.status === 'menunggu_bayar' ? (
          <Notice
            icon="check-circle"
            tone="green"
            title={`${cartName(active.cartId)} menerima pesananmu`}
            body="Selesaikan pembayaran lewat chatbot WhatsApp supaya rider mulai memasak."
            action="Pesan via WA"
            onPress={() => nav.navigate('Track')}
          />
        ) : null}
        {active?.status === 'ditolak' ? (
          <Notice
            icon="x-circle"
            tone="red"
            title={`${cartName(active.cartId)} menolak pesananmu`}
            body={`Alasan: ${active.rejectReason ?? '-'}. Coba pilih gerobak lain di dekatmu.`}
            action="Oke, pilih gerobak lain"
            onPress={() => setActive(null)}
          />
        ) : null}

        {/* Peta */}
        <View style={{ height: 250, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.cream2 }}>
          {pos && carts ? (
            <CartsMap
              me={pos}
              carts={carts}
              selectedId={selected}
              onSelect={(c) => setSelected(c.id)}
            />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, gap: 8 }}>
              {denied ? (
                <Txt size={14} color={colors.textMuted} style={{ textAlign: 'center' }}>
                  Izinkan akses lokasi supaya kami bisa mencari gerobak di dekatmu.
                </Txt>
              ) : (
                <ActivityIndicator color={colors.maroon} />
              )}
            </View>
          )}
        </View>

        {/* Daftar gerobak */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Txt weight="extrabold" size={19} color={colors.maroonDark}>
            Gerobak di dekatmu
          </Txt>
          <Txt size={13} color={colors.textMuted}>
            radius {String(SEARCH_RADIUS_KM).replace('.', ',')} km
          </Txt>
        </View>
        {error ? <ErrorBox message={error} /> : null}
        {carts && carts.length === 0 ? (
          <View style={{ alignItems: 'center', padding: 24, gap: 8, backgroundColor: colors.white, borderRadius: radius.lg }}>
            <Feather name="map" size={34} color={colors.textMuted} />
            <Txt weight="bold" size={15} color={colors.textDark}>
              Belum ada gerobak di sekitarmu
            </Txt>
            <Txt size={14} color={colors.textMuted} style={{ textAlign: 'center' }}>
              Tarik ke bawah untuk memuat ulang beberapa saat lagi.
            </Txt>
          </View>
        ) : null}
        {carts?.map((c) => (
          <CartCard key={c.id} cart={c} selected={c.id === selected} onSelect={() => setSelected(c.id)} onOpen={() => openMenu(c)} />
        ))}
      </ScrollView>

      {ongoing ? <FloatingBar label={`Lacak Pesanan · ${rupiah(active.total)}`} onPress={() => nav.navigate('Track')} /> : null}
    </View>
  );
}

function CartCard({ cart, selected, onSelect, onOpen }: { cart: Cart; selected: boolean; onSelect: () => void; onOpen: () => void }) {
  const inStock = cart.stock.filter((s) => s.stock > 0);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${cart.riderName}, ${cartName(cart.id)}, ${distance(cart.distanceKm)}`}
      onPress={selected ? onOpen : onSelect}
      style={{
        backgroundColor: selected ? '#FFF1E2' : colors.white,
        borderRadius: radius.lg,
        borderWidth: 2,
        borderColor: selected ? colors.maroon : colors.cream2,
        padding: 14,
        gap: 10,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.greenBg, alignItems: 'center', justifyContent: 'center' }}>
          <Feather name="shopping-cart" size={20} color={colors.greenDot} />
        </View>
        <View style={{ flex: 1 }}>
          <Txt weight="extrabold" size={16} color={colors.textDark}>
            {cart.riderName} · {cartName(cart.id)}
          </Txt>
          <Txt size={13} color={colors.textMuted}>
            <Feather name="navigation" size={12} color={colors.textMuted} /> {distance(cart.distanceKm)} dari kamu
          </Txt>
        </View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {inStock.slice(0, 4).map((s) => (
          <View key={s.menuId} style={{ backgroundColor: colors.cream2, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Txt weight="semibold" size={12} color={colors.text}>
              {s.name} {s.stock}
            </Txt>
          </View>
        ))}
        {inStock.length === 0 ? (
          <Txt size={13} color={colors.danger} weight="semibold">
            Stok habis
          </Txt>
        ) : null}
      </View>
      {selected ? <Button title="Lihat menu" variant="dark" icon="book-open" onPress={onOpen} /> : null}
    </Pressable>
  );
}

function Notice({
  icon,
  tone,
  title,
  body,
  action,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  tone: 'green' | 'red';
  title: string;
  body: string;
  action: string;
  onPress: () => void;
}) {
  const bg = tone === 'green' ? colors.greenBg : colors.redBg;
  const fg = tone === 'green' ? colors.greenFg : colors.redFg;
  return (
    <View accessibilityRole="alert" style={{ backgroundColor: bg, borderRadius: radius.lg, padding: 14, gap: 10 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Feather name={icon} size={22} color={fg} />
        <View style={{ flex: 1, gap: 2 }}>
          <Txt weight="extrabold" size={15} color={fg}>
            {title}
          </Txt>
          <Txt size={14} color={fg} style={{ lineHeight: 20 }}>
            {body}
          </Txt>
        </View>
      </View>
      <Button title={action} variant="dark" onPress={onPress} icon={tone === 'green' ? 'message-circle' : undefined} />
    </View>
  );
}
