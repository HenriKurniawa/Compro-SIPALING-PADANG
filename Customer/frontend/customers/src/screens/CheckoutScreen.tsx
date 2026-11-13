import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ScreenHeader';
import { Field } from '../components/Field';
import { Button, ErrorBox, Txt } from '../components/ui';
import { RouteMap } from '../components/map/RouteMap';
import { useOrder } from '../context/OrderContext';
import { useMyPosition } from '../hooks/useMyPosition';
import { MIN_ORDER_ANTAR, api, errMsg } from '../api';
import { cartName, distance, rupiah } from '../utils/format';
import { menuImage } from '../utils/menuImage';
import { colors, radius } from '../theme';
import type { LatLng, OrderType } from '../types';
import type { ScreenProps } from '../navigation';

export default function CheckoutScreen({ navigation }: ScreenProps<'Checkout'>) {
  const insets = useSafeAreaInsets();
  const { cart, basket, basketTotal, clearBasket, setActive } = useOrder();
  const { pos } = useMyPosition();
  const [type, setType] = useState<OrderType>('pickup');
  const [dest, setDest] = useState<LatLng | null>(null);
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lines = Object.values(basket);
  if (!cart || lines.length === 0) return null;

  const point = dest ?? pos;
  const belowMin = type === 'antar' && basketTotal < MIN_ORDER_ANTAR;
  const needAddress = type === 'antar' && address.trim().length < 5;

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      const order = await api.createOrder({
        cartId: cart.id,
        type,
        items: lines.map((l) => ({ menuId: l.item.id, qty: l.qty })),
        ...(type === 'antar' ? { location: point ?? undefined, address: address.trim(), note: note.trim() || undefined } : { note: note.trim() || undefined }),
      });
      setActive(order);
      clearBasket();
      navigation.reset({ index: 1, routes: [{ name: 'Tabs' }, { name: 'Track', params: { justCreated: true } }] });
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.cream }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title="Checkout" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
        {/* Ringkasan pesanan */}
        <View style={{ backgroundColor: colors.maroon, borderRadius: radius.lg, padding: 14, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Feather name="shopping-cart" size={18} color="#E9B44C" />
              <Txt weight="extrabold" size={17} color={colors.cream}>
                {cartName(cart.id)}
              </Txt>
              <Txt size={13} color={colors.cream} style={{ opacity: 0.8 }}>
                · {cart.riderName}
              </Txt>
            </View>
            <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} hitSlop={8}>
              <Txt weight="bold" size={13} color="#E9B44C">
                Ubah
              </Txt>
            </Pressable>
          </View>
          {lines.map((l) => {
            const img = menuImage(l.item);
            return (
              <View key={l.item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,248,236,0.1)', borderRadius: 12, padding: 8 }}>
                {img ? <Image source={img} style={{ width: 46, height: 46, borderRadius: 10 }} /> : null}
                <View style={{ flex: 1 }}>
                  <Txt weight="bold" size={14} color={colors.cream}>
                    {l.item.name}
                  </Txt>
                  <Txt size={13} color={colors.cream} style={{ opacity: 0.8 }}>
                    {l.qty} × {rupiah(l.item.price)}
                  </Txt>
                </View>
                <Txt weight="extrabold" size={14} color={colors.cream}>
                  {rupiah(l.qty * l.item.price)}
                </Txt>
              </View>
            );
          })}
        </View>

        {/* Pilihan Pick Up / Call Riders */}
        <Txt weight="extrabold" size={17} color={colors.maroonDark}>
          Mau ambil di mana?
        </Txt>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Option
            on={type === 'pickup'}
            icon="shopping-bag"
            title="Pick Up"
            desc={`Ambil di gerobak · ${distance(cart.distanceKm)}`}
            onPress={() => setType('pickup')}
          />
          <Option on={type === 'antar'} icon="truck" title="Call Riders" desc={`Diantar · min. ${rupiah(MIN_ORDER_ANTAR)}`} onPress={() => setType('antar')} />
        </View>

        {/* Peta rute */}
        <View style={{ height: 200, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.cream2 }}>
          <RouteMap
            key={type}
            cart={cart.location}
            cartLabel={'#' + cart.id.replace('GRB-', '')}
            dest={point ?? undefined}
            destLabel={type === 'antar' ? 'Antar ke sini' : 'Kamu'}
            onDestChange={type === 'antar' ? setDest : undefined}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            backgroundColor: type === 'antar' ? colors.maroonSoft : colors.cream2,
            borderRadius: 12,
            padding: 12,
          }}
        >
          <Feather name="map-pin" size={18} color={colors.maroon} />
          <Txt size={14} color={colors.text} style={{ flex: 1, lineHeight: 20 }}>
            {type === 'antar'
              ? 'Tahan & geser pin merah ke titik antar yang tepat, lalu tulis alamat lengkapnya.'
              : `Datang ke ${cartName(cart.id)} dan tunjukkan nomor pesananmu ke rider.`}
          </Txt>
        </View>

        {type === 'antar' ? (
          <Field
            label="Alamat lengkap"
            placeholder="Contoh: Kos Melati, Jl. Ketintang No. 12, kamar 4"
            value={address}
            onChangeText={setAddress}
            multiline
            error={address.length > 0 && needAddress ? 'Tulis alamat lebih lengkap ya.' : undefined}
          />
        ) : null}
        <Field label="Catatan untuk rider (opsional)" placeholder="Contoh: sambal dipisah" value={note} onChangeText={setNote} />

        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: colors.greenBg, borderRadius: 12, padding: 12 }}>
          <Feather name="message-circle" size={18} color={colors.greenFg} />
          <Txt size={14} color={colors.greenFg} style={{ flex: 1, lineHeight: 20 }}>
            Bayar setelah rider menerima pesanan, lewat chatbot WhatsApp (QRIS atau transfer).
          </Txt>
        </View>
        {belowMin ? <ErrorBox message={`Minimal pembelian Call Riders ${rupiah(MIN_ORDER_ANTAR)}. Tambah menu atau pilih Pick Up.`} /> : null}
        {error ? <ErrorBox message={error} /> : null}
      </ScrollView>

      <View style={{ padding: 16, paddingBottom: insets.bottom + 14, borderTopWidth: 1, borderTopColor: colors.cream2, backgroundColor: colors.white, gap: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Txt size={15} color={colors.textMuted}>
            Total
          </Txt>
          <Txt weight="extrabold" size={20} color={colors.maroonDark}>
            {rupiah(basketTotal)}
          </Txt>
        </View>
        <Button
          title={type === 'antar' ? 'Panggil Gerobak' : 'Konfirmasi Pesanan'}
          variant="dark"
          size="lg"
          loading={loading}
          disabled={belowMin || needAddress}
          onPress={submit}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

function Option({
  on,
  icon,
  title,
  desc,
  onPress,
}: {
  on: boolean;
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  desc: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: on }}
      onPress={onPress}
      style={{
        flex: 1,
        borderRadius: radius.lg,
        borderWidth: 2,
        borderColor: on ? colors.maroon : colors.cream2,
        backgroundColor: on ? '#FFF1E2' : colors.white,
        padding: 12,
        gap: 6,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Feather name={icon} size={22} color={colors.maroon} />
        <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.maroon, alignItems: 'center', justifyContent: 'center' }}>
          {on ? <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: colors.maroon }} /> : null}
        </View>
      </View>
      <Txt weight="extrabold" size={15} color={colors.textDark}>
        {title}
      </Txt>
      <Txt size={12} color={colors.textMuted}>
        {desc}
      </Txt>
    </Pressable>
  );
}
