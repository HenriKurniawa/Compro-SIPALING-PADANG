import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, SectionList, StyleSheet, TextInput, View } from 'react-native';
import { AppHeader } from '../components/AppHeader';
import { Chip, ErrorBox, Pill, Segmented, Txt, inputStyle } from '../components/ui';
import { colors } from '../theme';
import { api } from '../api';
import type { Transaction, TransactionSource } from '../types';
import { addDays, dateLong, dateShort, isValidYmd, isoDate, itemsSummary, rupiah, timeHM } from '../utils/format';

type Range = 'hari' | 'kemarin' | '7' | 'pilih';
type Kind = 'semua' | TransactionSource;

/** UC-21 Riwayat Pembelian + UC-22 Laporan Setoran (difilter per tanggal). */
export default function HistoryScreen() {
  const today = isoDate(new Date());
  const [range, setRange] = useState<Range>('hari');
  const [kind, setKind] = useState<Kind>('semua');
  const [from, setFrom] = useState(isoDate(addDays(new Date(), -4)));
  const [to, setTo] = useState(today);
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const period = useMemo(() => {
    const d = new Date();
    if (range === 'hari') return { from: today, to: today, label: 'hari ini' };
    if (range === 'kemarin') {
      const y = isoDate(addDays(d, -1));
      return { from: y, to: y, label: 'kemarin' };
    }
    if (range === '7') return { from: isoDate(addDays(d, -6)), to: today, label: '7 hari terakhir' };
    const ok = isValidYmd(from) && isValidYmd(to) && from <= to;
    return ok ? { from, to, label: `${dateShort(from)}–${dateShort(to)}` } : null;
  }, [range, from, to, today]);

  const load = useCallback(async () => {
    if (!period) return;
    setLoading(true);
    try {
      setData(await api.getTransactions({ from: period.from, to: period.to, source: kind === 'semua' ? undefined : kind }));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat riwayat.');
    } finally {
      setLoading(false);
    }
  }, [period, kind]);
  useEffect(() => {
    load();
  }, [load]);

  const sum = (xs: Transaction[]) => xs.reduce((s, t) => s + t.total, 0);
  const sections = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    data.forEach((t) => {
      const k = isoDate(new Date(t.createdAt));
      map.set(k, [...(map.get(k) ?? []), t]);
    });
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0])).map(([k, items]) => ({ key: k, title: dateLong(k), total: sum(items), data: items }));
  }, [data]);

  const header = (
    <View style={{ gap: 12, paddingBottom: 4 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {(
          [
            ['hari', 'Hari ini'],
            ['kemarin', 'Kemarin'],
            ['7', '7 hari'],
            ['pilih', 'Pilih tanggal'],
          ] as [Range, string][]
        ).map(([k, l]) => (
          <Chip key={k} label={l} on={range === k} onPress={() => setRange(k)} />
        ))}
      </ScrollView>

      {range === 'pilih' ? (
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <DateField label="Dari" value={from} onChange={setFrom} />
            <DateField label="Sampai" value={to} onChange={setTo} />
          </View>
          {!period ? (
            <Txt size={12} color={colors.redFg}>
              Isi tanggal dengan format TTTT-BB-HH dan pastikan tanggal awal tidak melewati tanggal akhir.
            </Txt>
          ) : null}
        </View>
      ) : null}

      <View style={s.summary}>
        <Txt size={13} color={colors.cream2}>
          Total setoran · {period?.label ?? '-'}
        </Txt>
        <Txt weight="extrabold" size={32} color={colors.cream}>
          {rupiah(sum(data))}
        </Txt>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Stat label="Tunai" value={rupiah(sum(data.filter((t) => t.method === 'tunai')))} />
          <Stat label="QRIS" value={rupiah(sum(data.filter((t) => t.method === 'qris')))} />
          <Stat label="Transaksi" value={String(data.length)} />
        </View>
      </View>

      <Segmented<Kind>
        value={kind}
        onChange={setKind}
        options={[
          { key: 'semua', label: 'Semua' },
          { key: 'online', label: 'Online' },
          { key: 'offline', label: 'Offline' },
        ]}
      />
      {error ? <ErrorBox message={error} /> : null}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <AppHeader title="Riwayat & Setoran" />
      <SectionList
        sections={sections}
        keyExtractor={(t) => t.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListHeaderComponent={header}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.maroon} />}
        renderSectionHeader={({ section }) => (
          <View style={s.sectionHead}>
            <Txt weight="extrabold" size={15} color={colors.maroonDark}>
              {section.title}
            </Txt>
            <Txt weight="bold" size={13} color={colors.textMuted}>
              {rupiah(section.total)}
            </Txt>
          </View>
        )}
        renderItem={({ item: t, index, section }) => (
          <View
            style={[
              s.row,
              index === 0 && { borderTopLeftRadius: 18, borderTopRightRadius: 18 },
              index === section.data.length - 1 && { borderBottomLeftRadius: 18, borderBottomRightRadius: 18, borderBottomWidth: 1 },
            ]}
          >
            <View style={{ flex: 1, gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <Txt weight="extrabold" size={14} color={colors.maroonDark}>
                  {t.id}
                </Txt>
                <Pill label={t.source === 'online' ? 'Online' : 'Offline'} tone={t.source === 'online' ? 'orange' : 'maroon'} />
                <Pill label={t.method === 'qris' ? 'QRIS' : 'Tunai'} tone="cream" />
              </View>
              <Txt size={13} color={colors.textMuted} style={{ lineHeight: 19 }}>
                {itemsSummary(t.items)}
                {t.orderType ? ` · ${t.orderType === 'antar' ? 'Antar' : 'Pick up'}` : ''}
                {t.memberName ? ` · Member ${t.memberName}` : ''}
              </Txt>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Txt weight="extrabold" size={15}>
                {rupiah(t.total)}
              </Txt>
              <Txt size={12} color={colors.textMuted}>
                {timeHM(t.createdAt)}
              </Txt>
            </View>
          </View>
        )}
        ListEmptyComponent={
          loading ? null : (
            <View style={{ alignItems: 'center', paddingVertical: 40, gap: 6 }}>
              <Txt weight="extrabold" size={17} color={colors.maroonDark}>
                Belum ada transaksi
              </Txt>
              <Txt size={14} color={colors.textMuted}>
                Coba pilih rentang tanggal lain.
              </Txt>
            </View>
          )
        }
      />
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.stat}>
      <Txt size={12} color={colors.cream2}>
        {label}
      </Txt>
      <Txt weight="extrabold" size={14} color={colors.cream} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Txt>
    </View>
  );
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <View style={{ flex: 1, gap: 4 }}>
      <Txt weight="bold" size={13}>
        {label}
      </Txt>
      <TextInput
        accessibilityLabel={`Tanggal ${label.toLowerCase()}`}
        value={value}
        onChangeText={onChange}
        placeholder="2026-10-30"
        placeholderTextColor="#A08A80"
        keyboardType="numbers-and-punctuation"
        maxLength={10}
        style={[inputStyle, { minHeight: 46, fontSize: 15 }]}
      />
    </View>
  );
}

const s = StyleSheet.create({
  summary: { backgroundColor: colors.maroon, borderRadius: 20, padding: 18, gap: 10 },
  stat: { flex: 1, backgroundColor: 'rgba(100,28,22,0.55)', borderRadius: 12, padding: 10 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 18, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    backgroundColor: colors.white,
    borderColor: colors.cream2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
  },
});
