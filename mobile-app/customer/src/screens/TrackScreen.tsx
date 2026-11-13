import React, { useEffect, useRef, useState } from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ScreenHeader';
import { Button, ConfirmDialog, ErrorBox, Pill, Sheet, Txt, useToast, Toast } from '../components/ui';
import type { Tone } from '../components/ui';
import { RouteMap } from '../components/map/RouteMap';
import { useOrder } from '../context/OrderContext';
import { USE_MOCK, api, errMsg } from '../api';
import { demoPay } from '../api/mockApi';
import { cartName, itemsSummary, rupiah, timeHM } from '../utils/format';
import { colors, radius } from '../theme';
import type { Order, OrderStatus } from '../types';
import type { ScreenProps } from '../navigation';

const STATUS: Record<OrderStatus, { label: string; tone: Tone; title: (o: Order) => string; eta?: string }> = {
  menunggu_rider: { label: 'Menunggu rider', tone: 'orange', title: () => 'Menunggu rider menerima pesananmu', eta: 'Biasanya kurang dari 2 menit' },
  menunggu_bayar: { label: 'Menunggu pembayaran', tone: 'orange', title: () => 'Pesanan diterima! Yuk bayar lewat WhatsApp' },
  verifikasi: { label: 'Cek pembayaran', tone: 'orange', title: () => 'Rider sedang mengecek pembayaranmu' },
  diproses: {
    label: 'Diproses',
    tone: 'green',
    title: (o) => (o.type === 'antar' ? 'Mohon ditunggu, Rider sedang membuat makanan' : 'Rider sedang membuat makanan. Ambil di gerobak setelah siap'),
    eta: 'Estimasi 10–15 menit',
  },
  diantar: { label: 'Diantar', tone: 'green', title: () => 'Rider sedang menuju lokasimu', eta: 'Estimasi 5–10 menit' },
  selesai: { label: 'Selesai', tone: 'green', title: () => 'Pesanan selesai. Selamat makan!' },
  ditolak: { label: 'Ditolak', tone: 'maroon', title: () => 'Maaf, pesananmu ditolak' },
};

const STEP_INDEX: Record<OrderStatus, number> = {
  menunggu_rider: 0,
  ditolak: 0,
  menunggu_bayar: 1,
  verifikasi: 1,
  diproses: 2,
  diantar: 3,
  selesai: 4,
};

export default function TrackScreen({ navigation, route }: ScreenProps<'Track'>) {
  const insets = useSafeAreaInsets();
  const { active: order, setActive, refreshActive, refreshLoyalty } = useOrder();
  const [created, setCreated] = useState(!!route.params?.justCreated);
  const [paidSheet, setPaidSheet] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const prev = useRef<OrderStatus | undefined>(order?.status);

  // Muncul pop-up "Pembayaran dikonfirmasi" saat status pindah ke diproses.
  useEffect(() => {
    if (prev.current === 'verifikasi' && order?.status === 'diproses') setPaidSheet(true);
    prev.current = order?.status;
  }, [order?.status]);

  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        <ScreenHeader title="Lacak pesanan" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 }}>
          <Feather name="package" size={40} color={colors.textMuted} />
          <Txt weight="bold" size={16} color={colors.textDark}>
            Tidak ada pesanan aktif
          </Txt>
          <Button title="Kembali ke beranda" variant="dark" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  const st = STATUS[order.status];
  const step = STEP_INDEX[order.status];
  const steps = ['Pesanan diterima', 'Pembayaran dikonfirmasi', 'Makanan dibuat', order.type === 'antar' ? 'Diantar ke lokasimu' : 'Siap diambil'];

  const pay = async () => {
    if (USE_MOCK) {
      demoPay(order.id);
      toast.show('Mode demo: pembayaran dianggap sudah dikirim di WhatsApp.');
      refreshActive();
      return;
    }
    if (order.whatsappUrl) Linking.openURL(order.whatsappUrl);
  };

  const cancel = async () => {
    setBusy(true);
    setError(null);
    try {
      await api.cancelOrder(order.id);
      setConfirmCancel(false);
      setActive(null);
      navigation.goBack();
    } catch (e) {
      setConfirmCancel(false);
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  const finish = () => {
    setActive(null);
    refreshLoyalty();
    navigation.navigate('Tabs', { screen: order.status === 'selesai' ? 'History' : 'Home' });
  };

  const waRider = () => Linking.openURL(`https://wa.me/${order.riderPhone}?text=${encodeURIComponent(`Halo, saya pemesan ${order.id}`)}`);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScreenHeader title="Lacak pesanan" subtitle={`${order.id} · ${timeHM(order.createdAt)}`} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: insets.bottom + 24 }}>
        {/* Status */}
        <View style={{ gap: 6 }}>
          <Pill label={st.label} tone={st.tone} style={{ alignSelf: 'flex-start' }} />
          <Txt weight="extrabold" size={21} color={colors.maroonDark} style={{ lineHeight: 28 }} accessibilityLiveRegion="polite">
            {st.title(order)}
          </Txt>
          {st.eta ? (
            <Txt size={14} color={colors.textMuted}>
              <Feather name="clock" size={13} color={colors.textMuted} /> {st.eta}
            </Txt>
          ) : null}
        </View>

        {error ? <ErrorBox message={error} /> : null}

        {/* Aksi sesuai status */}
        {order.status === 'menunggu_bayar' ? (
          <View style={{ backgroundColor: colors.greenBg, borderRadius: radius.lg, padding: 14, gap: 10 }}>
            <Txt weight="extrabold" size={15} color={colors.greenFg}>
              {cartName(order.cartId)} menerima pesananmu
            </Txt>
            <Txt size={14} color={colors.greenFg} style={{ lineHeight: 20 }}>
              Ketuk tombol di bawah untuk membuka chatbot WhatsApp, lalu bayar {rupiah(order.total)} lewat QRIS atau transfer. Rider memasak setelah pembayaran dicek.
            </Txt>
            <Button title="Pesan via WA" icon="message-circle" variant="dark" onPress={pay} />
          </View>
        ) : null}
        {order.status === 'ditolak' ? (
          <View style={{ backgroundColor: colors.redBg, borderRadius: radius.lg, padding: 14, gap: 10 }}>
            <Txt weight="extrabold" size={15} color={colors.redFg}>
              Alasan dari rider: {order.rejectReason ?? '-'}
            </Txt>
            <Txt size={14} color={colors.redFg}>
              Kamu belum membayar apa pun. Coba pesan dari gerobak lain di dekatmu.
            </Txt>
            <Button title="Pilih gerobak lain" variant="dark" onPress={finish} />
          </View>
        ) : null}
        {order.status === 'selesai' ? (
          <View style={{ backgroundColor: colors.greenBg, borderRadius: radius.lg, padding: 14, gap: 10, flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="award" size={26} color={colors.greenFg} />
            <Txt weight="bold" size={14} color={colors.greenFg} style={{ flex: 1 }}>
              +1 poin masuk ke kartumu. Terima kasih sudah jajan di Sipaling!
            </Txt>
          </View>
        ) : null}

        {/* Peta */}
        {order.status !== 'ditolak' && order.cartLocation ? (
          <View style={{ height: 210, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.cream2 }}>
            <RouteMap
              cart={order.cartLocation}
              cartLabel={'#' + order.cartId.replace('GRB-', '')}
              dest={order.type === 'antar' ? order.location : undefined}
              destLabel="Kamu"
            />
          </View>
        ) : null}

        {/* Progres 4 langkah */}
        {order.status !== 'ditolak' ? (
          <View style={{ backgroundColor: colors.maroon, borderRadius: radius.lg, padding: 16, gap: 0 }}>
            {steps.map((label, i) => {
              const done = step > i || order.status === 'selesai';
              const current = step === i && order.status !== 'selesai';
              return (
                <View key={label} style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ alignItems: 'center' }}>
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: done ? '#E9B44C' : current ? colors.cream : 'rgba(255,248,236,0.18)',
                      }}
                    >
                      {done ? <Feather name="check" size={15} color={colors.maroonDark} /> : <Txt weight="extrabold" size={12} color={current ? colors.maroon : colors.cream}>{i + 1}</Txt>}
                    </View>
                    {i < steps.length - 1 ? <View style={{ width: 2, height: 22, backgroundColor: done ? '#E9B44C' : 'rgba(255,248,236,0.25)' }} /> : null}
                  </View>
                  <Txt
                    weight={current ? 'extrabold' : 'semibold'}
                    size={15}
                    color={colors.cream}
                    style={{ paddingTop: 3, opacity: done || current ? 1 : 0.6 }}
                  >
                    {label}
                  </Txt>
                </View>
              );
            })}
          </View>
        ) : null}

        {/* Rider */}
        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.cream2, padding: 14, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.greenBg, alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="shopping-cart" size={20} color={colors.greenDot} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt weight="extrabold" size={16} color={colors.textDark}>
                {cartName(order.cartId)}
              </Txt>
              <Txt size={13} color={colors.textMuted}>
                Rider {order.riderName} · {order.type === 'antar' ? 'Call Riders' : 'Pick Up'}
              </Txt>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: colors.cream2 }} />
          <Row icon="file-text" text={itemsSummary(order.items)} right={rupiah(order.total)} />
          {order.type === 'antar' && order.address ? <Row icon="map-pin" text={order.address} /> : null}
          {order.note ? <Row icon="edit-3" text={`Catatan: ${order.note}`} /> : null}
        </View>

        {order.status !== 'ditolak' && order.status !== 'selesai' ? (
          <Button title="Hubungi Rider via WhatsApp" icon="phone" variant="secondary" onPress={waRider} />
        ) : null}
        {order.status === 'menunggu_rider' || order.status === 'menunggu_bayar' ? (
          <Button title="Batalkan pesanan" variant="ghost" onPress={() => setConfirmCancel(true)} />
        ) : null}
        {order.status === 'selesai' ? <Button title="Lihat riwayat" variant="dark" onPress={finish} /> : null}
      </ScrollView>

      {/* Pop-up sukses */}
      <SuccessSheet
        visible={created && order.status === 'menunggu_rider'}
        title="Pesanan berhasil dibuat"
        body={`Pesananmu sudah dikirim ke ${cartName(order.cartId)}. Tunggu rider menerimanya, lalu kami kabari untuk pembayaran.`}
        onClose={() => setCreated(false)}
      />
      <SuccessSheet
        visible={paidSheet}
        title="Pembayaran dikonfirmasi"
        body="Rider sudah menerima pembayaranmu dan mulai membuat makanan."
        onClose={() => setPaidSheet(false)}
      />
      <ConfirmDialog
        visible={confirmCancel}
        title="Batalkan pesanan?"
        message="Pesanan yang dibatalkan tidak bisa dikembalikan."
        confirmLabel="Ya, batalkan"
        cancelLabel="Tidak"
        danger
        loading={busy}
        onConfirm={cancel}
        onCancel={() => setConfirmCancel(false)}
      />
      <Toast message={toast.message} bottom={insets.bottom + 20} />
    </View>
  );
}

function Row({ icon, text, right }: { icon: React.ComponentProps<typeof Feather>['name']; text: string; right?: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
      <Feather name={icon} size={16} color={colors.textMuted} style={{ marginTop: 2 }} />
      <Txt size={14} color={colors.text} style={{ flex: 1, lineHeight: 20 }}>
        {text}
      </Txt>
      {right ? (
        <Txt weight="extrabold" size={14} color={colors.maroonDark}>
          {right}
        </Txt>
      ) : null}
    </View>
  );
}

function SuccessSheet({ visible, title, body, onClose }: { visible: boolean; title: string; body: string; onClose: () => void }) {
  return (
    <Sheet visible={visible} onClose={onClose} center>
      <View style={{ alignItems: 'center', gap: 12, paddingTop: 6 }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.greenBg, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.greenDot, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="check" size={32} color={colors.white} />
          </View>
        </View>
        <Txt weight="extrabold" size={21} color={colors.maroonDark} style={{ textAlign: 'center' }}>
          {title}
        </Txt>
        <Txt size={15} color={colors.textMuted} style={{ textAlign: 'center', lineHeight: 22 }}>
          {body}
        </Txt>
      </View>
      <Button title="Oke" variant="dark" onPress={onClose} />
    </Sheet>
  );
}
