import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenHeader, FloatingBar } from '../components/ScreenHeader';
import { Button, ErrorBox, Txt } from '../components/ui';
import { useOrder } from '../context/OrderContext';
import { api, errMsg } from '../api';
import { cartName, distance, rupiah } from '../utils/format';
import { menuImage } from '../utils/menuImage';
import { colors, radius } from '../theme';
import type { MenuItem } from '../types';
import type { ScreenProps } from '../navigation';

export default function MenuScreen({ navigation }: ScreenProps<'Menu'>) {
  const { cart, basket, setQty, basketTotal, basketCount } = useOrder();
  const [menu, setMenu] = useState<MenuItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!cart) return;
    setError(null);
    try {
      setMenu(await api.getCartMenu(cart.id));
    } catch (e) {
      setError(errMsg(e));
    }
  }, [cart]);
  useEffect(() => {
    load();
  }, [load]);

  if (!cart) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScreenHeader title="Detail Menu" subtitle={`${cart.riderName} · ${cartName(cart.id)} · ${distance(cart.distanceKm)}`} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: basketCount ? 110 : 30, gap: 12 }}>
        {error ? (
          <View style={{ gap: 10 }}>
            <ErrorBox message={error} />
            <Button title="Coba lagi" variant="secondary" onPress={load} />
          </View>
        ) : null}
        {!menu && !error ? <ActivityIndicator color={colors.maroon} style={{ marginTop: 40 }} /> : null}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 }}>
          {menu?.map((m) => (
            <MenuCard key={m.id} item={m} qty={basket[m.id]?.qty ?? 0} onQty={(q) => setQty(m, q)} />
          ))}
        </View>
        {menu ? (
          <Txt size={13} color={colors.textMuted} style={{ textAlign: 'center', marginTop: 4 }}>
            Stok diperbarui langsung oleh rider gerobak.
          </Txt>
        ) : null}
      </ScrollView>
      {basketCount > 0 ? (
        <FloatingBar label={`Lihat keranjang (${basketCount}) · ${rupiah(basketTotal)}`} onPress={() => navigation.navigate('Checkout')} />
      ) : null}
    </View>
  );
}

function MenuCard({ item, qty, onQty }: { item: MenuItem; qty: number; onQty: (q: number) => void }) {
  const soldOut = item.stock <= 0;
  const img = menuImage(item);
  return (
    <View style={{ width: '48.5%', backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.cream2, overflow: 'hidden' }}>
      <View style={{ width: '100%', aspectRatio: 1.4, backgroundColor: colors.cream2 }}>
        {img ? <Image source={img} style={{ width: '100%', height: '100%', opacity: soldOut ? 0.45 : 1 }} resizeMode="cover" accessibilityIgnoresInvertColors /> : null}
        {soldOut ? (
          <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: colors.textDark, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Txt weight="bold" size={12} color={colors.white}>
              Habis
            </Txt>
          </View>
        ) : null}
      </View>
      <View style={{ padding: 10, gap: 6, flex: 1 }}>
        <Txt weight="bold" size={14} color={colors.textDark} numberOfLines={2} style={{ minHeight: 36 }}>
          {item.name}
        </Txt>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Txt weight="extrabold" size={15} color={colors.maroon}>
            {rupiah(item.price)}
          </Txt>
          <Txt size={12} color={soldOut ? colors.danger : colors.textMuted}>
            sisa {item.stock}
          </Txt>
        </View>
        {qty > 0 ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.maroon, borderRadius: 12, minHeight: 42 }}>
            <StepBtn icon="minus" label={`Kurangi ${item.name}`} onPress={() => onQty(qty - 1)} />
            <Txt weight="extrabold" size={16} color={colors.cream} style={{ flex: 1, textAlign: 'center' }} accessibilityLabel={`${qty} porsi`}>
              {qty}
            </Txt>
            <StepBtn icon="plus" label={`Tambah ${item.name}`} onPress={() => onQty(qty + 1)} disabled={qty >= item.stock} />
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: soldOut }}
            accessibilityLabel={`Tambah ${item.name} ke keranjang`}
            disabled={soldOut}
            onPress={() => onQty(1)}
            style={{
              minHeight: 42,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: soldOut ? colors.border : colors.maroon,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              paddingHorizontal: 6,
              paddingVertical: 4,
            }}
          >
            <Feather name="plus" size={15} color={soldOut ? colors.disabledFg : colors.maroon} />
            <Txt weight="bold" size={12} color={soldOut ? colors.disabledFg : colors.maroon} style={{ flexShrink: 1, textAlign: 'center' }}>
              {soldOut ? 'Stok habis' : 'Tambah ke keranjang'}
            </Txt>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function StepBtn({ icon, label, onPress, disabled }: { icon: 'plus' | 'minus'; label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      onPress={disabled ? undefined : onPress}
      hitSlop={4}
      style={{ width: 44, height: 42, alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.4 : 1 }}
    >
      <Feather name={icon} size={18} color={colors.cream} />
    </Pressable>
  );
}
