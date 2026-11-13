import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { AppHeader } from '../components/AppHeader';
import { AddressBlock, ItemList, OrderCard, TypePill, distanceText } from '../components/OrderCard';
import { Button, Card, ConfirmDialog, ErrorBox, Segmented, Sheet, SheetTitle, Toast, Txt, inputStyle, useToast } from '../components/ui';
import { colors } from '../theme';
import { api } from '../api';
import { useSession } from '../context/SessionContext';
import { useLocationBroadcast } from '../hooks/useLocationBroadcast';
import type { ScreenProps } from '../navigation';
import { REJECT_REASONS, type Order, type OrderStatus } from '../types';

type Tab = 'baru' | 'proses' | 'antar';
const TAB_STATUSES: Record<Tab, OrderStatus[]> = {
  baru: ['baru'],
  proses: ['menunggu_bayar', 'verifikasi', 'diproses'],
  antar: ['diantar'],
};
const ACTIVE: OrderStatus[] = ['baru', 'menunggu_bayar', 'verifikasi', 'diproses', 'diantar'];
const POLL_MS = 8000;

export default function OrdersScreen({ navigation }: ScreenProps<'Orders'>) {
  const { working, setWorking } = useSession();
  const { permissionDenied } = useLocationBroadcast(working);
  const toast = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<Tab>('baru');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);
  const [confirmStop, setConfirmStop] = useState(false);
  const [pickupConfirm, setPickupConfirm] = useState<Order | null>(null);

  // Popup pesanan baru: tampil untuk pesanan "baru" yang belum ditutup rider.
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [rejecting, setRejecting] = useState<Order | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      setOrders(await api.getOrders(ACTIVE));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat pesanan.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Ambil ulang pesanan berkala selama rider bekerja dan layar ini terbuka.
  useFocusEffect(
    useCallback(() => {
      if (!working) return;
      load();
      const t = setInterval(() => load(true), POLL_MS);
      return () => clearInterval(t);
    }, [working, load]),
  );

  const counts = useMemo(() => {
    const c = { baru: 0, proses: 0, antar: 0 } as Record<Tab, number>;
    orders.forEach((o) => (Object.keys(TAB_STATUSES) as Tab[]).forEach((k) => TAB_STATUSES[k].includes(o.status) && c[k]++));
    return c;
  }, [orders]);
  const list = orders.filter((o) => TAB_STATUSES[tab].includes(o.status));
  const incoming = working ? orders.find((o) => o.status === 'baru' && !dismissed.includes(o.id)) : undefined;

  // Pindah ke tab yang ada isinya saat tab sekarang kosong (sekali saat pertama dimuat).
  const firstLoad = useRef(true);
  useEffect(() => {
    if (!firstLoad.current || orders.length === 0) return;
    firstLoad.current = false;
    if (counts[tab] === 0) setTab(counts.baru ? 'baru' : counts.proses ? 'proses' : 'antar');
  }, [orders, counts, tab]);

  const run = async (id: string, fn: () => Promise<unknown>, msg: string, nextTab?: Tab): Promise<boolean> => {
    setBusyId(id);
    try {
      await fn();
      toast.show(msg);
      if (nextTab) setTab(nextTab);
      await load(true);
      return true;
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Terjadi kesalahan.');
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const accept = (o: Order) => run(o.id, () => api.acceptOrder(o.id), `Permintaan ${o.customerName} diterima. Tunggu customer membayar.`, 'proses');

  const toggleWork = async (next: boolean) => {
    setToggling(true);
    try {
      await setWorking(next);
      if (!next) {
        setOrders([]);
        toast.show('Kamu berhenti bekerja. Gerobak disembunyikan dari peta.');
      }
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Gagal mengubah status kerja.');
    } finally {
      setToggling(false);
      setConfirmStop(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <AppHeader title="Pesanan Online" />

      <View style={{ padding: 16, paddingBottom: 12, gap: 12 }}>
        {working ? (
          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 }}>
            <View style={s.liveDot} />
            <View style={{ flex: 1 }}>
              <Txt weight="extrabold" size={16}>
                Sedang bekerja
              </Txt>
              <Txt size={12} color={colors.textMuted}>
                Lokasi aktif · terlihat di peta Korlap & customer
              </Txt>
            </View>
            <Button title="Berhenti" variant="secondary" onPress={() => setConfirmStop(true)} style={{ minHeight: 44, paddingHorizontal: 14 }} />
          </Card>
        ) : (
          <Button title="Mulai Bekerja" icon="power" size="lg" loading={toggling} onPress={() => toggleWork(true)} style={{ minHeight: 64 }} />
        )}
        {working && permissionDenied ? (
          <ErrorBox message="Izin lokasi ditolak. Aktifkan lokasi untuk aplikasi ini supaya gerobakmu tampil di peta." />
        ) : null}
        {working ? (
          <Segmented<Tab>
            value={tab}
            onChange={setTab}
            options={[
              { key: 'baru', label: 'Baru', count: counts.baru },
              { key: 'proses', label: 'Diproses', count: counts.proses },
              { key: 'antar', label: 'Diantar', count: counts.antar },
            ]}
          />
        ) : null}
      </View>

      {working ? (
        <FlatList
          data={list}
          keyExtractor={(o) => o.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 96, gap: 12 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={() => load()} tintColor={colors.maroon} />}
          ListHeaderComponent={error ? <ErrorBox message={error} /> : null}
          ListEmptyComponent={
            loading ? null : (
              <View style={{ alignItems: 'center', paddingVertical: 40, gap: 6 }}>
                <Txt weight="extrabold" size={17} color={colors.maroonDark}>
                  Belum ada pesanan di sini
                </Txt>
                <Txt size={14} color={colors.textMuted}>
                  Permintaan baru akan muncul sebagai pemberitahuan.
                </Txt>
              </View>
            )
          }
          renderItem={({ item: o }) => (
            <OrderCard
              order={o}
              busy={busyId === o.id}
              onAccept={() => accept(o)}
              onReject={() => setRejecting(o)}
              onVerify={() => run(o.id, () => api.verifyPayment(o.id), `Pembayaran ${o.id} valid. Silakan siapkan makanan.`)}
              onDeliver={() =>
                run(o.id, () => api.startDelivery(o.id), `Mengantar ${o.id} ke ${o.customerName}.`, 'antar').then(
                  (ok) => ok && navigation.navigate('Delivery', { orderId: o.id }),
                )
              }
              onPickedUp={() => setPickupConfirm(o)}
              onOpenDelivery={() => navigation.navigate('Delivery', { orderId: o.id })}
            />
          )}
        />
      ) : (
        <View style={s.idle}>
          <View style={s.idleIcon}>
            <Feather name="truck" size={52} color={colors.maroon} />
          </View>
          <Txt weight="extrabold" size={21} color={colors.maroonDark} style={{ textAlign: 'center' }}>
            Kamu sedang tidak bekerja
          </Txt>
          <Txt size={15} color={colors.textMuted} style={{ textAlign: 'center', lineHeight: 22 }}>
            Tekan <Txt weight="bold" size={15}>Mulai Bekerja</Txt> supaya gerobakmu tampil di peta dan bisa menerima pesanan online.
          </Txt>
          <Pressable accessibilityRole="link" onPress={() => navigation.navigate('Offline')} style={{ padding: 10 }}>
            <Txt weight="bold" size={15} color={colors.maroon} style={{ textDecorationLine: 'underline' }}>
              Catat pembeli langsung (offline)
            </Txt>
          </Pressable>
        </View>
      )}

      <Toast message={toast.message} />

      {/* Popup permintaan baru (UC-17) */}
      <Sheet visible={!!incoming && !rejecting} onClose={() => incoming && setDismissed((d) => [...d, incoming.id])}>
        {incoming ? (
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Txt weight="extrabold" size={13} color={colors.maroon} style={{ letterSpacing: 1 }}>
                PERMINTAAN BARU MASUK
              </Txt>
              <TypePill type={incoming.type} />
            </View>
            <View>
              <Txt weight="extrabold" size={24} color={colors.maroonDark}>
                {incoming.customerName}
              </Txt>
              <Txt size={14} color={colors.textMuted}>
                {incoming.id} · {distanceText(incoming.distanceKm)} dari gerobak
              </Txt>
            </View>
            <ItemList order={incoming} />
            <AddressBlock order={incoming} map={false} />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
              <Button
                title="Tolak"
                variant="secondary"
                size="lg"
                onPress={() => {
                  // Tutup popup dulu, baru buka lembar alasan (iOS tidak bisa membuka 2 modal sekaligus).
                  const o = incoming;
                  setDismissed((d) => [...d, o.id]);
                  setTimeout(() => setRejecting(o), 400);
                }}
                style={{ flex: 1 }}
              />
              <Button title="Terima" size="lg" loading={busyId === incoming.id} onPress={() => accept(incoming)} style={{ flex: 1.6 }} />
            </View>
          </>
        ) : null}
      </Sheet>

      <RejectSheet
        order={rejecting}
        onClose={() => setRejecting(null)}
        onDone={(o, reason) => {
          setRejecting(null);
          setOrders((prev) => prev.filter((x) => x.id !== o.id));
          toast.show(`Alasan "${reason}" dikirim ke ${o.customerName}.`);
        }}
      />

      <ConfirmDialog
        visible={confirmStop}
        title="Berhenti bekerja?"
        message="Gerobakmu akan disembunyikan dari peta dan kamu tidak menerima pesanan online baru."
        confirmLabel="Berhenti"
        loading={toggling}
        onCancel={() => setConfirmStop(false)}
        onConfirm={() => toggleWork(false)}
      />
      <ConfirmDialog
        visible={!!pickupConfirm}
        title="Pesanan sudah diambil?"
        message={pickupConfirm ? `Pastikan ${pickupConfirm.customerName} sudah menerima pesanan ${pickupConfirm.id}.` : ''}
        confirmLabel="Ya, sudah"
        cancelLabel="Belum"
        loading={!!pickupConfirm && busyId === pickupConfirm.id}
        onCancel={() => setPickupConfirm(null)}
        onConfirm={() => {
          const o = pickupConfirm;
          if (!o) return;
          run(o.id, () => api.completeOrder(o.id), `Pesanan ${o.id} selesai diambil ${o.customerName}.`).finally(() => setPickupConfirm(null));
        }}
      />
    </View>
  );
}

/* ---------- Lembar alasan penolakan ---------- */
function RejectSheet({ order, onClose, onDone }: { order: Order | null; onClose: () => void; onDone: (o: Order, reason: string) => void }) {
  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setReason(null);
    setNote('');
    setError(null);
  }, [order?.id]);

  const send = async () => {
    if (!order || !reason) return;
    setSending(true);
    try {
      await api.rejectOrder(order.id, reason, note.trim() || undefined);
      onDone(order, reason);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal mengirim alasan.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet visible={!!order} onClose={onClose}>
      <SheetTitle title="Kenapa pesanan ditolak?" onClose={onClose} />
      <Txt size={14} color={colors.textMuted}>
        Alasan ini dikirim ke {order?.customerName} supaya ia bisa memesan ke gerobak lain.
      </Txt>
      <View accessibilityRole="radiogroup" style={{ gap: 8 }}>
        {REJECT_REASONS.map((r) => {
          const on = reason === r;
          return (
            <Pressable
              key={r}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              onPress={() => setReason(r)}
              style={[s.reason, { borderColor: on ? colors.maroon : colors.cream2 }]}
            >
              <View style={[s.radio, on ? { borderWidth: 6, borderColor: colors.maroon } : null]} />
              <Txt weight="bold" size={15}>
                {r}
              </Txt>
            </Pressable>
          );
        })}
      </View>
      <View style={{ gap: 6 }}>
        <Txt weight="bold" size={14} nativeID="lbl-note">
          Catatan tambahan (opsional)
        </Txt>
        <TextInput
          accessibilityLabelledBy="lbl-note"
          value={note}
          onChangeText={setNote}
          placeholder="Contoh: rendang tinggal 1 porsi"
          placeholderTextColor="#A08A80"
          multiline
          style={[inputStyle, { minHeight: 64, paddingTop: 12, textAlignVertical: 'top' }]}
        />
      </View>
      {error ? <ErrorBox message={error} /> : null}
      <Button title="Kirim Alasan ke Customer" variant="dark" size="lg" disabled={!reason} loading={sending} onPress={send} />
    </Sheet>
  );
}

const s = StyleSheet.create({
  liveDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.greenDot, borderWidth: 4, borderColor: colors.greenBg, marginLeft: 4 },
  idle: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingBottom: 80, gap: 12 },
  idleIcon: { width: 112, height: 112, borderRadius: 56, backgroundColor: colors.cream2, alignItems: 'center', justifyContent: 'center' },
  reason: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 2, backgroundColor: colors.white, minHeight: 52 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#B89A86' },
});
