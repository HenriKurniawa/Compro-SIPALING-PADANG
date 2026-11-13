import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { Feather } from '@expo/vector-icons';
import { AppHeader } from '../components/AppHeader';
import { Button, ErrorBox, IconButton, Sheet, SheetTitle, Toast, Txt, inputStyle, useToast } from '../components/ui';
import { colors } from '../theme';
import { api } from '../api';
import type { ScreenProps } from '../navigation';
import type { Member, MenuItem, PaymentMethod, Transaction } from '../types';
import { rupiah } from '../utils/format';
import { menuImage } from '../utils/menuImage';

type Phase = 'menu' | 'pilih' | 'qris' | 'tunai' | 'selesai';

export default function OfflineScreen({ navigation }: ScreenProps<'Offline'>) {
  const insets = useSafeAreaInsets();
  const toast = useToast(2200);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<Phase>('menu');
  const [member, setMember] = useState<Member | null>(null);
  const [trx, setTrx] = useState<Transaction | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setMenu(await api.getMenu());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat menu.');
    } finally {
      setLoading(false);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const picked = useMemo(() => menu.filter((m) => cart[m.id]).map((m) => ({ ...m, qty: cart[m.id] })), [menu, cart]);
  const count = picked.reduce((s, m) => s + m.qty, 0);
  const total = picked.reduce((s, m) => s + m.qty * m.price, 0);

  const change = (m: MenuItem, d: number) => {
    const q = Math.max(0, Math.min(m.stock, (cart[m.id] ?? 0) + d));
    if (d > 0 && q === (cart[m.id] ?? 0)) {
      toast.show(`Stok ${m.name} tinggal ${m.stock} porsi.`);
      return;
    }
    setCart((c) => {
      const next = { ...c, [m.id]: q };
      if (!q) delete next[m.id];
      return next;
    });
    if (d > 0) toast.show(q === 1 ? `${m.name} masuk keranjang` : `${m.name} jadi ${q} porsi`);
  };

  const reset = () => {
    setCart({});
    setMember(null);
    setTrx(null);
    setPhase('menu');
    load();
  };

  const pay = async (method: PaymentMethod, cashReceived?: number) => {
    const t = await api.createOfflineTransaction({
      items: picked.map((m) => ({ menuId: m.id, qty: m.qty })),
      method,
      cashReceived,
      memberPhone: member?.phone,
    });
    setTrx(t);
    setPhase('selesai');
  };

  if (phase === 'qris') return <QrisView total={total} onBack={() => setPhase('pilih')} onPaid={() => pay('qris')} />;
  if (phase === 'tunai') return <CashView total={total} onBack={() => setPhase('pilih')} onPaid={(cash) => pay('tunai', cash)} />;
  if (phase === 'selesai' && trx)
    return <SuccessView trx={trx} onNew={reset} onHistory={() => navigation.navigate('History')} />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <AppHeader
        title="Pesanan Offline"
        right={
          <Pressable accessibilityRole="button" onPress={() => setCart({})} disabled={!count} style={[s.clearBtn, !count && { opacity: 0.5 }]}>
            <Txt weight="bold" size={13} color={colors.cream}>
              Kosongkan
            </Txt>
          </Pressable>
        }
      />
      {loading && menu.length === 0 ? (
        <ActivityIndicator color={colors.maroon} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={menu}
          keyExtractor={(m) => m.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 14 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 14 }}
          ListHeaderComponent={error ? <ErrorBox message={error} /> : null}
          renderItem={({ item: m }) => <MenuCard m={m} qty={cart[m.id] ?? 0} onChange={(d) => change(m, d)} />}
        />
      )}

      <Toast message={toast.message} bottom={insets.bottom + 104} right={count ? `${count} porsi` : undefined} />

      <View style={[s.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {count ? <Feather name="shopping-cart" size={16} color={colors.maroon} /> : null}
            <Txt size={13} color={colors.textMuted}>
              {count ? `${count} porsi dipilih` : 'Belum ada menu dipilih'}
            </Txt>
          </View>
          <Txt weight="extrabold" size={22} color={colors.maroonDark}>
            {rupiah(total)}
          </Txt>
        </View>
        <Button title="Pilih Pembayaran" disabled={!count} onPress={() => setPhase('pilih')} />
      </View>

      <PaySheet
        visible={phase === 'pilih'}
        picked={picked}
        total={total}
        member={member}
        onMember={setMember}
        onClose={() => setPhase('menu')}
        onPick={(m) => setPhase(m)}
      />
    </View>
  );
}

/* ---------- Kartu menu ---------- */
function MenuCard({ m, qty, onChange }: { m: MenuItem; qty: number; onChange: (d: number) => void }) {
  const out = m.stock <= 0;
  const img = menuImage(m);
  return (
    <View style={[s.card, qty > 0 && { borderColor: colors.orange }, out && { opacity: 0.6 }]}>
      <View>
        {img ? (
          <Image source={img} style={s.photo} accessibilityLabel={`Foto ${m.name}`} />
        ) : (
          <View style={[s.photo, { backgroundColor: colors.cream2 }]} />
        )}
        {qty > 0 ? (
          <View style={s.qtyBadge}>
            <Txt weight="extrabold" size={13} color={colors.onOrange}>
              {qty}
            </Txt>
          </View>
        ) : null}
      </View>
      <Txt weight="extrabold" size={14} color={colors.textDark} numberOfLines={1}>
        {m.name}
      </Txt>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Txt weight="extrabold" size={14} color={colors.maroon}>
          {rupiah(m.price)}
        </Txt>
        <Txt weight="bold" size={11} color={out ? colors.greyFg : m.stock <= 3 ? colors.orangeSoftFg : colors.textMuted}>
          {out ? 'Habis' : `Sisa ${m.stock}`}
        </Txt>
      </View>
      {out ? (
        <View style={[s.addBtn, { borderColor: colors.border }]}>
          <Txt weight="bold" size={12} color={colors.greyFg}>
            Stok habis
          </Txt>
        </View>
      ) : qty === 0 ? (
        <Pressable accessibilityRole="button" accessibilityLabel={`Tambah ${m.name} ke keranjang`} onPress={() => onChange(1)} style={s.addBtn}>
          <Feather name="plus" size={14} color={colors.maroon} />
          <Txt weight="bold" size={12} color={colors.maroon}>
            Tambah ke keranjang
          </Txt>
        </Pressable>
      ) : (
        <View style={s.stepper}>
          <Pressable accessibilityRole="button" accessibilityLabel={`Kurangi ${m.name}`} onPress={() => onChange(-1)} style={[s.stepBtn, s.stepMinus]}>
            <Feather name="minus" size={16} color={colors.maroon} />
          </Pressable>
          <Txt weight="extrabold" size={16} accessibilityLiveRegion="polite">
            {qty}
          </Txt>
          <Pressable accessibilityRole="button" accessibilityLabel={`Tambah ${m.name}`} onPress={() => onChange(1)} style={[s.stepBtn, { backgroundColor: colors.maroon }]}>
            <Feather name="plus" size={16} color={colors.cream} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

/* ---------- Popup pilih pembayaran (+ kaitkan member, UC-34) ---------- */
function PaySheet({
  visible,
  picked,
  total,
  member,
  onMember,
  onClose,
  onPick,
}: {
  visible: boolean;
  picked: (MenuItem & { qty: number })[];
  total: number;
  member: Member | null;
  onMember: (m: Member | null) => void;
  onClose: () => void;
  onPick: (m: 'qris' | 'tunai') => void;
}) {
  const [phone, setPhone] = useState('');
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const find = async () => {
    if (phone.replace(/\D/g, '').length < 10) return;
    setSearching(true);
    setNotFound(false);
    try {
      const m = await api.findMember(phone);
      onMember(m);
      setNotFound(!m);
    } finally {
      setSearching(false);
    }
  };

  return (
    <Sheet visible={visible} onClose={onClose} center>
      <SheetTitle title="Pilih pembayaran" onClose={onClose} />
      <View style={s.summary}>
        {picked.map((m) => (
          <View key={m.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Txt size={15}>
              <Txt weight="bold" size={15}>
                {m.qty}x
              </Txt>{' '}
              {m.name}
            </Txt>
            <Txt size={15} color={colors.textMuted}>
              {rupiah(m.qty * m.price)}
            </Txt>
          </View>
        ))}
        <View style={s.totalRow}>
          <Txt weight="extrabold" size={17}>
            Total
          </Txt>
          <Txt weight="extrabold" size={17}>
            {rupiah(total)}
          </Txt>
        </View>
      </View>

      {/* UC-34: kaitkan akun member supaya transaksi dihitung untuk loyalitas */}
      {member ? (
        <View style={s.member}>
          <Feather name="award" size={18} color={colors.greenFg} />
          <View style={{ flex: 1 }}>
            <Txt weight="bold" size={14} color={colors.greenFg}>
              Member: {member.name}
            </Txt>
            <Txt size={12} color={colors.greenFg}>
              {member.rewardAvailable
                ? 'Punya bonus 1 paket nasi + lauk. Tanyakan apakah mau dipakai.'
                : `${member.completedTransactions % 10}/10 transaksi menuju bonus`}
            </Txt>
          </View>
          <IconButton icon="x" label="Lepas member" onPress={() => onMember(null)} style={{ width: 36, height: 36, backgroundColor: 'transparent' }} />
        </View>
      ) : (
        <View style={{ gap: 6 }}>
          <Txt weight="bold" size={13} nativeID="lbl-member">
            Nomor HP member (opsional)
          </Txt>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput
              accessibilityLabelledBy="lbl-member"
              value={phone}
              onChangeText={(t) => {
                setPhone(t);
                setNotFound(false);
              }}
              onSubmitEditing={find}
              keyboardType="phone-pad"
              placeholder="08xxxxxxxxxx"
              placeholderTextColor="#A08A80"
              style={[inputStyle, { flex: 1, minHeight: 46, fontSize: 15 }]}
            />
            <Button title="Cek" variant="secondary" loading={searching} onPress={find} style={{ minHeight: 46 }} />
          </View>
          {notFound ? (
            <Txt size={12} color={colors.redFg}>
              Nomor belum terdaftar sebagai member. Lanjutkan tanpa member.
            </Txt>
          ) : null}
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <PayOption icon="grid" title="QRIS" sub="Scan kode QR" onPress={() => onPick('qris')} />
        <PayOption icon="credit-card" title="Tunai" sub="Bayar cash" onPress={() => onPick('tunai')} />
      </View>
    </Sheet>
  );
}

function PayOption({ icon, title, sub, onPress }: { icon: React.ComponentProps<typeof Feather>['name']; title: string; sub: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Bayar dengan ${title}`} onPress={onPress} style={({ pressed }) => [s.payOpt, pressed && { backgroundColor: colors.cream2 }]}>
      <Feather name={icon} size={30} color={colors.maroon} />
      <Txt weight="extrabold" size={17} color={colors.maroonDark}>
        {title}
      </Txt>
      <Txt size={12} color={colors.textMuted}>
        {sub}
      </Txt>
    </Pressable>
  );
}

/* ---------- QRIS ---------- */
function QrisView({ total, onBack, onPaid }: { total: number; onBack: () => void; onPaid: () => Promise<void> }) {
  const insets = useSafeAreaInsets();
  const [payload, setPayload] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    api.getQrisPayload(total).then(setPayload).catch((e) => setError(e instanceof Error ? e.message : 'Gagal membuat QRIS.'));
  }, [total]);

  return (
    <View style={[s.full, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 }]}>
      <PageTitle title="Bayar dengan QRIS" onBack={onBack} />
      <ScrollView contentContainerStyle={{ alignItems: 'center', gap: 18, paddingVertical: 8 }}>
        <Txt size={15} color={colors.textMuted}>
          Tunjukkan kode ini ke pembeli
        </Txt>
        <View style={s.qrCard}>
          {payload ? <QRCode value={payload} size={230} color={colors.toast} backgroundColor={colors.white} /> : <ActivityIndicator color={colors.maroon} style={{ height: 230 }} />}
        </View>
        <View style={{ alignItems: 'center' }}>
          <Txt size={14} color={colors.textMuted}>
            Total dibayar
          </Txt>
          <Txt weight="extrabold" size={32} color={colors.maroonDark}>
            {rupiah(total)}
          </Txt>
        </View>
        <Txt size={13} color={colors.textMuted} style={{ textAlign: 'center', paddingHorizontal: 12 }}>
          Cek notifikasi dana masuk di aplikasi QRIS gerobak sebelum menekan tombol di bawah.
        </Txt>
        {error ? <ErrorBox message={error} /> : null}
      </ScrollView>
      <Button
        title="Pembayaran Diterima"
        size="lg"
        loading={saving}
        disabled={!payload}
        onPress={async () => {
          setSaving(true);
          try {
            await onPaid();
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Gagal menyimpan transaksi.');
            setSaving(false);
          }
        }}
      />
    </View>
  );
}

/* ---------- Tunai ---------- */
function CashView({ total, onBack, onPaid }: { total: number; onBack: () => void; onPaid: (cash: number) => Promise<void> }) {
  const insets = useSafeAreaInsets();
  const [cash, setCash] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const short = cash < total;
  const diff = cash - total;
  const chips = [
    { label: 'Uang pas', v: total },
    { label: 'Rp50.000', v: 50000 },
    { label: 'Rp100.000', v: 100000 },
  ];

  return (
    <View style={[s.full, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 }]}>
      <PageTitle title="Bayar Tunai" onBack={onBack} />
      <ScrollView contentContainerStyle={{ gap: 16, paddingVertical: 8 }} keyboardShouldPersistTaps="handled">
        <View style={s.box}>
          <Txt size={14} color={colors.textMuted}>
            Total belanja
          </Txt>
          <Txt weight="extrabold" size={30} color={colors.maroonDark}>
            {rupiah(total)}
          </Txt>
        </View>
        <View style={{ gap: 8 }}>
          <Txt weight="bold" size={14} nativeID="lbl-cash">
            Uang diterima
          </Txt>
          <View style={s.cashInput}>
            <Txt weight="extrabold" size={20} color={colors.textMuted}>
              Rp
            </Txt>
            <TextInput
              accessibilityLabelledBy="lbl-cash"
              value={cash ? rupiah(cash).replace('Rp', '') : ''}
              onChangeText={(t) => setCash(parseInt(t.replace(/\D/g, ''), 10) || 0)}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor="#A08A80"
              style={{ flex: 1, fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 24, color: colors.text, paddingVertical: 12 }}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {chips.map((c) => (
              <Pressable key={c.label} accessibilityRole="button" onPress={() => setCash(c.v)} style={s.cashChip}>
                <Txt weight="bold" size={14}>
                  {c.label}
                </Txt>
              </Pressable>
            ))}
          </View>
        </View>
        <View
          style={[
            s.changeBox,
            { backgroundColor: short ? (cash ? colors.redBg : colors.cream2) : colors.greenBg },
          ]}
        >
          <Txt weight="bold" size={15} color={short ? (cash ? colors.redFg : colors.text) : colors.greenFg}>
            {short ? 'Uang kurang' : 'Kembalian'}
          </Txt>
          <Txt weight="extrabold" size={22} color={short ? (cash ? colors.redFg : colors.text) : colors.greenFg}>
            {rupiah(Math.abs(diff))}
          </Txt>
        </View>
        {error ? <ErrorBox message={error} /> : null}
      </ScrollView>
      <Button
        title="Selesaikan Pembayaran"
        size="lg"
        disabled={short}
        loading={saving}
        onPress={async () => {
          setSaving(true);
          try {
            await onPaid(cash);
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Gagal menyimpan transaksi.');
            setSaving(false);
          }
        }}
      />
    </View>
  );
}

/* ---------- Berhasil ---------- */
function SuccessView({ trx, onNew, onHistory }: { trx: Transaction; onNew: () => void; onHistory: () => void }) {
  const insets = useSafeAreaInsets();
  const rows: [string, string][] = [
    ['ID pembelian', trx.id],
    ['Metode', trx.method === 'qris' ? 'QRIS' : 'Tunai'],
    ['Total', rupiah(trx.total)],
    ...(trx.method === 'tunai' && trx.change !== undefined ? ([['Kembalian', rupiah(trx.change)]] as [string, string][]) : []),
    ...(trx.memberName ? ([['Member', trx.memberName]] as [string, string][]) : []),
  ];
  return (
    <View style={[s.full, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 20 }]}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <View style={s.check}>
          <Feather name="check" size={56} color={colors.greenDot} />
        </View>
        <Txt weight="extrabold" size={26} color={colors.maroonDark}>
          Pembayaran berhasil
        </Txt>
        <View style={[s.box, { alignSelf: 'stretch', gap: 10 }]}>
          {rows.map(([k, v]) => (
            <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Txt size={15} color={colors.textMuted}>
                {k}
              </Txt>
              <Txt weight="bold" size={15}>
                {v}
              </Txt>
            </View>
          ))}
        </View>
        <Txt size={13} color={colors.textMuted} style={{ textAlign: 'center' }}>
          Jangan lupa perbarui stok gerobak di menu Stok Gerobak.
        </Txt>
      </View>
      <View style={{ gap: 10 }}>
        <Button title="Pesanan Baru" size="lg" onPress={onNew} />
        <Button title="Lihat Setoran" variant="secondary" onPress={onHistory} style={{ borderColor: colors.border }} />
      </View>
    </View>
  );
}

function PageTitle({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
      <IconButton icon="arrow-left" label="Kembali" onPress={onBack} />
      <Txt weight="extrabold" size={21} color={colors.maroonDark} accessibilityRole="header">
        {title}
      </Txt>
    </View>
  );
}

const s = StyleSheet.create({
  clearBtn: { paddingHorizontal: 12, minHeight: 40, justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,248,236,0.5)' },
  card: { flex: 1, backgroundColor: colors.white, borderRadius: 14, padding: 9, gap: 6, borderWidth: 2, borderColor: colors.white },
  photo: { width: '100%', height: 88, borderRadius: 10 },
  qtyBadge: {
    position: 'absolute',
    right: 6,
    top: 6,
    minWidth: 26,
    height: 26,
    paddingHorizontal: 7,
    borderRadius: 13,
    backgroundColor: colors.orange,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    minHeight: 40,
    borderWidth: 1.5,
    borderColor: colors.maroon,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 2,
  },
  stepper: { minHeight: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.cream, borderRadius: 10, padding: 3, marginTop: 2 },
  stepBtn: { width: 40, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  stepMinus: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.border },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.cream2,
    paddingHorizontal: 16,
    paddingTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 10,
  },
  summary: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.cream2, borderRadius: 14, padding: 14, gap: 7 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 9, marginTop: 2 },
  member: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.greenBg, borderRadius: 12, paddingLeft: 12, paddingVertical: 6 },
  payOpt: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.maroon,
    backgroundColor: colors.white,
  },
  full: { flex: 1, backgroundColor: colors.cream, paddingHorizontal: 20 },
  qrCard: { backgroundColor: colors.white, borderRadius: 22, padding: 20, elevation: 4 },
  box: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.cream2, borderRadius: 18, padding: 16 },
  cashInput: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 2, borderColor: colors.maroon, borderRadius: 14, backgroundColor: colors.white, paddingHorizontal: 16 },
  cashChip: { minHeight: 40, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white, justifyContent: 'center' },
  changeBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 16, padding: 16 },
  check: { width: 112, height: 112, borderRadius: 56, backgroundColor: colors.greenBg, alignItems: 'center', justifyContent: 'center' },
});
