import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, RefreshControl, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { AppHeader } from '../components/AppHeader';
import { Button, Card, ErrorBox, Pill, Toast, Txt, useToast } from '../components/ui';
import { colors } from '../theme';
import { api } from '../api';
import type { MenuItem, StockAllocation } from '../types';
import { timeHM } from '../utils/format';
import { menuImage } from '../utils/menuImage';

/** UC-35 Perbarui Stok Gerobak: konfirmasi kiriman gudang + ubah sisa stok manual. */
export default function StockScreen() {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [draft, setDraft] = useState<Record<string, number>>({});
  const [allocs, setAllocs] = useState<StockAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [m, a] = await Promise.all([api.getMenu(), api.getAllocations()]);
      setMenu(m);
      setAllocs(a);
      setDraft({});
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat stok.');
    } finally {
      setLoading(false);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const pending = allocs.filter((a) => a.status === 'menunggu');
  const changed = useMemo(() => menu.filter((m) => draft[m.id] !== undefined && draft[m.id] !== m.stock), [menu, draft]);
  const valueOf = (m: MenuItem) => draft[m.id] ?? m.stock;
  const setValue = (m: MenuItem, v: number) => setDraft((d) => ({ ...d, [m.id]: Math.max(0, Math.min(999, v)) }));

  const confirm = async (a: StockAllocation) => {
    setConfirming(a.id);
    try {
      await api.confirmAllocation(a.id);
      toast.show('Kiriman stok dari gudang sudah diterima.');
      await load();
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Gagal mengonfirmasi.');
    } finally {
      setConfirming(null);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const updated = await api.updateStock(changed.map((m) => ({ menuId: m.id, stock: valueOf(m) })));
      setMenu(updated);
      setDraft({});
      toast.show('Stok gerobak diperbarui. Customer langsung melihat sisa stok terbaru.');
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Gagal menyimpan stok.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <AppHeader title="Stok Gerobak" />
      {loading && menu.length === 0 ? (
        <ActivityIndicator color={colors.maroon} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 14 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.maroon} />}
        >
          {error ? <ErrorBox message={error} /> : null}

          {pending.map((a) => (
            <Card key={a.id} style={{ backgroundColor: colors.orangeSoft, borderColor: colors.orangeSoft }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name="package" size={20} color={colors.orangeSoftFg} />
                <Txt weight="extrabold" size={15} color={colors.orangeSoftFg} style={{ flex: 1 }}>
                  Kiriman dari Gudang {a.warehouse}
                </Txt>
                <Txt size={12} color={colors.orangeSoftFg}>
                  {timeHM(a.createdAt)}
                </Txt>
              </View>
              <View style={{ gap: 4 }}>
                {a.items.map((it) => (
                  <Txt key={it.menuId} size={14} color={colors.text}>
                    +{it.qty} porsi {it.name}
                  </Txt>
                ))}
              </View>
              <Button title="Konfirmasi Terima" icon="check" variant="dark" loading={confirming === a.id} onPress={() => confirm(a)} />
            </Card>
          ))}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Txt weight="extrabold" size={18} color={colors.maroonDark}>
              Sisa stok per menu
            </Txt>
            <Txt size={12} color={colors.textMuted}>
              Terlihat oleh customer
            </Txt>
          </View>
          <Txt size={13} color={colors.textMuted} style={{ marginTop: -8 }}>
            Stok tidak berkurang otomatis. Perbarui setelah berjualan supaya customer melihat angka yang benar.
          </Txt>

          {menu.map((m) => {
            const v = valueOf(m);
            const dirty = draft[m.id] !== undefined && draft[m.id] !== m.stock;
            const img = menuImage(m);
            return (
              <View key={m.id} style={[s.row, dirty && { borderColor: colors.orange }]}>
                {img ? <Image source={img} style={s.thumb} accessibilityLabel={`Foto ${m.name}`} /> : <View style={[s.thumb, { backgroundColor: colors.cream2 }]} />}
                <View style={{ flex: 1, gap: 4 }}>
                  <Txt weight="extrabold" size={15} color={colors.textDark}>
                    {m.name}
                  </Txt>
                  {v === 0 ? <Pill label="Habis" tone="grey" /> : v <= 3 ? <Pill label="Terbatas" tone="orange" /> : <Pill label="Tersedia" tone="green" />}
                </View>
                <View style={s.stepper}>
                  <Pressable accessibilityRole="button" accessibilityLabel={`Kurangi stok ${m.name}`} onPress={() => setValue(m, v - 1)} style={[s.stepBtn, s.minus]}>
                    <Feather name="minus" size={16} color={colors.maroon} />
                  </Pressable>
                  <TextInput
                    accessibilityLabel={`Stok ${m.name}`}
                    value={String(v)}
                    onChangeText={(t) => setValue(m, parseInt(t.replace(/\D/g, ''), 10) || 0)}
                    keyboardType="number-pad"
                    selectTextOnFocus
                    style={s.stockInput}
                  />
                  <Pressable accessibilityRole="button" accessibilityLabel={`Tambah stok ${m.name}`} onPress={() => setValue(m, v + 1)} style={[s.stepBtn, { backgroundColor: colors.maroon }]}>
                    <Feather name="plus" size={16} color={colors.cream} />
                  </Pressable>
                </View>
              </View>
            );
          })}
          <Pressable accessibilityRole="button" onPress={() => setDraft(Object.fromEntries(menu.map((m) => [m.id, 0])))} style={{ alignSelf: 'center', padding: 10 }}>
            <Txt weight="bold" size={14} color={colors.maroon} style={{ textDecorationLine: 'underline' }}>
              Tandai semua habis
            </Txt>
          </Pressable>
        </ScrollView>
      )}

      <Toast message={toast.message} bottom={insets.bottom + 100} />
      <View style={[s.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <Txt size={13} color={colors.textMuted} style={{ flex: 1 }}>
          {changed.length ? `${changed.length} menu diubah` : 'Belum ada perubahan'}
        </Txt>
        {changed.length ? <Button title="Batal" variant="ghost" onPress={() => setDraft({})} /> : null}
        <Button title="Simpan Stok" disabled={!changed.length} loading={saving} onPress={save} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: 16, padding: 10, borderWidth: 2, borderColor: colors.white },
  thumb: { width: 56, height: 56, borderRadius: 10 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.cream, borderRadius: 12, padding: 3 },
  stepBtn: { width: 40, height: 40, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  minus: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.border },
  stockInput: { width: 44, textAlign: 'center', fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 17, color: colors.text, paddingVertical: 6 },
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
    gap: 8,
    elevation: 10,
  },
});
