import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Button, ConfirmDialog, ErrorBox, IconButton, Pill, Txt } from '../components/ui';
import { distanceText, openWhatsApp, orderTotal } from '../components/OrderCard';
import { DeliveryMap } from '../components/DeliveryMap';
import { colors } from '../theme';
import { api } from '../api';
import type { ScreenProps } from '../navigation';
import type { LatLng, Order } from '../types';
import { rupiah } from '../utils/format';

export default function DeliveryScreen({ route, navigation }: ScreenProps<'Delivery'>) {
  const { orderId } = route.params;
  const insets = useSafeAreaInsets();
  const [order, setOrder] = useState<Order | null>(null);
  const [me, setMe] = useState<LatLng | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    api
      .getOrders(['diantar', 'diproses'])
      .then((list) => {
        const o = list.find((x) => x.id === orderId);
        if (!o) setError('Pesanan tidak ditemukan atau sudah selesai.');
        setOrder(o ?? null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Gagal memuat pesanan.'));

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setMe({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    })().catch(() => {});
  }, [orderId]);

  const finish = async () => {
    if (!order) return;
    setSaving(true);
    try {
      await api.completeOrder(order.id);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan.');
    } finally {
      setSaving(false);
      setConfirm(false);
    }
  };

  if (done && order) {
    return (
      <View style={[s.done, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <View style={s.check}>
            <Feather name="check" size={56} color={colors.greenDot} />
          </View>
          <Txt weight="extrabold" size={26} color={colors.maroonDark}>
            Pesanan selesai!
          </Txt>
          <Txt size={15} color={colors.textMuted} style={{ textAlign: 'center', lineHeight: 22 }}>
            {order.id} untuk {order.customerName} sudah diterima.{' '}
            <Txt weight="bold" size={15}>
              {rupiah(orderTotal(order))}
            </Txt>{' '}
            tercatat di riwayat hari ini.
          </Txt>
        </View>
        <View style={{ gap: 10 }}>
          <Button title="Kembali ke Pesanan" size="lg" onPress={() => navigation.navigate('Orders')} />
          <Button title="Lihat Setoran" variant="secondary" onPress={() => navigation.navigate('History')} style={{ borderColor: colors.border }} />
        </View>
      </View>
    );
  }

  const dest = order?.location;
  return (
    <View style={{ flex: 1, backgroundColor: '#EFE3C7' }}>
      {dest ? (
        <DeliveryMap dest={dest} me={me} title={order?.customerName} description={order?.address} />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>{error ? null : <ActivityIndicator color={colors.maroon} />}</View>
      )}

      <View style={[s.topBar, { top: insets.top + 12 }]}>
        <IconButton icon="arrow-left" label="Kembali ke daftar pesanan" onPress={() => navigation.goBack()} style={{ backgroundColor: colors.white }} />
        <View style={s.topInfo}>
          <Txt size={12} color={colors.textMuted}>
            Menuju lokasi customer
          </Txt>
          <Txt weight="extrabold" size={16} color={colors.maroonDark}>
            {order ? distanceText(order.distanceKm) : '…'}
          </Txt>
        </View>
        {dest ? (
          <IconButton
            icon="navigation"
            label="Buka di aplikasi peta"
            onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lng}`)}
            style={{ backgroundColor: colors.white }}
          />
        ) : null}
      </View>

      <View style={[s.sheet, { paddingBottom: insets.bottom + 20 }]}>
        <View style={s.handle} />
        {error ? <ErrorBox message={error} /> : null}
        {order ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <Txt size={13} color={colors.textMuted}>
                    {order.id} · {rupiah(orderTotal(order))}
                  </Txt>
                  {order.paymentMethod ? <Pill label={order.paymentMethod === 'qris' ? 'QRIS' : 'Tunai'} tone="cream" /> : null}
                </View>
                <Txt weight="extrabold" size={22} color={colors.maroonDark}>
                  {order.customerName}
                </Txt>
              </View>
              <IconButton icon="message-circle" label="Chat WhatsApp customer" onPress={() => openWhatsApp(order.customerPhone)} style={s.roundBtn} />
              <IconButton icon="phone" label="Telepon customer" onPress={() => Linking.openURL(`tel:+${order.customerPhone}`)} style={s.roundBtn} />
            </View>
            <View style={s.addr}>
              <Feather name="map-pin" size={20} color={colors.orange} style={{ marginTop: 1 }} />
              <View style={{ flex: 1 }}>
                <Txt weight="bold" size={14}>
                  {order.address}
                </Txt>
                {order.note ? (
                  <Txt size={13} color={colors.textMuted}>
                    Catatan: {order.note}
                  </Txt>
                ) : null}
              </View>
            </View>
            <Txt size={14}>{order.items.map((i) => `${i.qty}x ${i.name}`).join(' · ')}</Txt>
            {order.paymentMethod === 'tunai' ? (
              <Txt weight="bold" size={14} color={colors.orangeSoftFg}>
                Tagih tunai {rupiah(orderTotal(order))} saat makanan diserahkan.
              </Txt>
            ) : null}
            <Button title="Pesanan Sudah Diterima" size="lg" onPress={() => setConfirm(true)} />
          </>
        ) : null}
      </View>

      <ConfirmDialog
        visible={confirm}
        title="Makanan sudah sampai?"
        message={`Pastikan pesanan sudah diterima ${order?.customerName ?? 'customer'}. Pesanan akan dipindah ke riwayat.`}
        confirmLabel="Ya, sudah"
        cancelLabel="Belum"
        loading={saving}
        onCancel={() => setConfirm(false)}
        onConfirm={finish}
      />
    </View>
  );
}

const s = StyleSheet.create({
  topBar: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  topInfo: { flex: 1, backgroundColor: colors.white, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8, elevation: 3 },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.cream,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 14,
    elevation: 12,
  },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border },
  roundBtn: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.border },
  addr: { flexDirection: 'row', gap: 10, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.cream2, borderRadius: 14, padding: 12 },
  done: { flex: 1, backgroundColor: colors.cream, paddingHorizontal: 24 },
  check: { width: 112, height: 112, borderRadius: 56, backgroundColor: colors.greenBg, alignItems: 'center', justifyContent: 'center' },
});

