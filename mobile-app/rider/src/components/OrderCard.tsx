import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button, Card, Pill, Txt } from './ui';
import { MiniMap } from './MiniMap';
import { colors } from '../theme';
import type { Order } from '../types';
import { rupiah, timeHM } from '../utils/format';

export const orderTotal = (o: Order) => o.items.reduce((s, i) => s + i.qty * i.price, 0);
export const distanceText = (km: number) => (km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1).replace('.', ',')} km`);
export const openWhatsApp = (phone: string) => Linking.openURL(`https://wa.me/${phone.replace(/\D/g, '')}`);

const STATUS_INFO: Partial<Record<Order['status'], { label: string; tone: 'orange' | 'green' | 'grey' | 'maroon' }>> = {
  menunggu_bayar: { label: 'Menunggu bayar', tone: 'grey' },
  verifikasi: { label: 'Cek pembayaran', tone: 'orange' },
  diproses: { label: 'Siapkan makanan', tone: 'green' },
  diantar: { label: 'Sedang diantar', tone: 'maroon' },
};

export function TypePill({ type }: { type: Order['type'] }) {
  return type === 'antar' ? <Pill label="Antar" tone="orange" /> : <Pill label="Pick up" tone="maroon" />;
}

export function ItemList({ order }: { order: Order }) {
  if (order.items.length === 0) {
    return (
      <View style={[s.items, { flexDirection: 'row', gap: 8, alignItems: 'center' }]}>
        <Feather name="clock" size={16} color={colors.textMuted} />
        <Txt size={14} color={colors.textMuted} style={{ flex: 1 }}>
          Belum ada menu di pesanan ini.
        </Txt>
      </View>
    );
  }
  return (
    <View style={s.items}>
      {order.items.map((it) => (
        <View key={it.menuId} style={s.row}>
          <Txt size={14} style={{ flex: 1 }}>
            <Txt weight="bold" size={14}>
              {it.qty}x
            </Txt>{' '}
            {it.name}
          </Txt>
          <Txt size={14} color={colors.textMuted}>
            {rupiah(it.qty * it.price)}
          </Txt>
        </View>
      ))}
      <View style={[s.row, s.totalRow]}>
        <Txt weight="extrabold" size={15}>
          Total{order.paymentMethod ? ` · ${order.paymentMethod === 'qris' ? 'QRIS' : 'Tunai'}` : ''}
        </Txt>
        <Txt weight="extrabold" size={15}>
          {rupiah(orderTotal(order))}
        </Txt>
      </View>
    </View>
  );
}

export function AddressBlock({ order, map = true }: { order: Order; map?: boolean }) {
  if (order.type !== 'antar') {
    return (
      <Txt size={14} color={colors.textMuted}>
        Customer akan mengambil sendiri di gerobak.
      </Txt>
    );
  }
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Feather name="map-pin" size={18} color={colors.maroon} style={{ marginTop: 2 }} />
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
      {map && order.location ? <MiniMap location={order.location} address={order.address} /> : null}
    </View>
  );
}

type Actions = {
  busy?: boolean;
  onAccept: () => void;
  onReject: () => void;
  onVerify: () => void;
  onDeliver: () => void;
  onPickedUp: () => void;
  onOpenDelivery: () => void;
};

export function OrderCard({ order, busy, ...a }: { order: Order } & Actions) {
  const info = STATUS_INFO[order.status];
  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Txt weight="extrabold" size={13} color={colors.maroonDark}>
          {order.id}
        </Txt>
        <TypePill type={order.type} />
        {info ? <Pill label={info.label} tone={info.tone} /> : null}
        <Txt size={12} color={colors.textMuted} style={{ marginLeft: 'auto' }}>
          masuk {timeHM(order.createdAt)}
        </Txt>
      </View>

      <View>
        <Txt weight="extrabold" size={18} color={colors.maroonDark}>
          {order.customerName}
        </Txt>
        <Txt size={13} color={colors.textMuted}>
          {distanceText(order.distanceKm)} dari gerobak
        </Txt>
      </View>

      <ItemList order={order} />
      <AddressBlock order={order} map={order.status !== 'baru'} />

      {order.status === 'baru' ? (
        <View style={s.twoBtn}>
          <Button title="Tolak" variant="secondary" onPress={a.onReject} disabled={busy} style={{ flex: 1 }} />
          <Button title="Terima" onPress={a.onAccept} loading={busy} style={{ flex: 1 }} />
        </View>
      ) : null}

      {order.status === 'menunggu_bayar' ? (
        <>
          <Hint icon="clock" text="Menunggu customer membayar lewat chatbot WhatsApp. Pesanan pindah ke Cek pembayaran setelah customer konfirmasi." />
          <Button title="Chat Customer" icon="message-circle" variant="secondary" onPress={() => openWhatsApp(order.customerPhone)} />
        </>
      ) : null}

      {order.status === 'verifikasi' ? (
        <>
          <Hint
            icon="alert-circle"
            tone="orange"
            text={`Customer sudah konfirmasi bayar via WhatsApp (${order.paymentMethod === 'tunai' ? 'tunai saat ambil/antar' : 'QRIS'}). Pastikan dana benar-benar masuk sebelum memasak.`}
          />
          <View style={s.twoBtn}>
            <Button title="Chat" icon="message-circle" variant="secondary" onPress={() => openWhatsApp(order.customerPhone)} style={{ flex: 1 }} />
            <Button title="Pembayaran Valid" icon="check" onPress={a.onVerify} loading={busy} style={{ flex: 1.6 }} />
          </View>
        </>
      ) : null}

      {order.status === 'diproses' && order.type === 'antar' ? (
        <Button title="Antarkan" icon="truck" size="lg" onPress={a.onDeliver} loading={busy} />
      ) : null}
      {order.status === 'diproses' && order.type === 'pickup' ? (
        <Button title="Sudah Diambil" icon="check-circle" variant="dark" size="lg" onPress={a.onPickedUp} loading={busy} />
      ) : null}
      {order.status === 'diantar' ? <Button title="Lihat Peta Antar" icon="map" variant="secondary" onPress={a.onOpenDelivery} /> : null}
    </Card>
  );
}

function Hint({ text, icon, tone }: { text: string; icon: React.ComponentProps<typeof Feather>['name']; tone?: 'orange' }) {
  const bg = tone === 'orange' ? colors.orangeSoft : colors.cream;
  const fg = tone === 'orange' ? colors.orangeSoftFg : colors.textMuted;
  return (
    <View style={{ flexDirection: 'row', gap: 10, backgroundColor: bg, borderRadius: 12, padding: 12 }}>
      <Feather name={icon} size={18} color={fg} style={{ marginTop: 1 }} />
      <Txt size={13} color={fg} style={{ flex: 1, lineHeight: 19 }}>
        {text}
      </Txt>
    </View>
  );
}

const s = StyleSheet.create({
  items: { backgroundColor: colors.cream, borderRadius: 12, padding: 12, gap: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.border, borderStyle: 'dashed', paddingTop: 6, marginTop: 2 },
  twoBtn: { flexDirection: 'row', gap: 10 },
});
