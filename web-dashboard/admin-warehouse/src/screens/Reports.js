import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp, rupiah } from '../context/AppContext';
import { Card, PageHeader, StatCard, Table, DateFilter, LinkText, Badge } from '../components/ui';
import { colors, fonts, radius } from '../theme';

const sub = (p) => p.items.reduce((t, i) => t + i.qty * i.price, 0);

// Laporan setoran: rekap pembelian per rider, bisa difilter satu tanggal
export function ReportList() {
  const { riders, purchases, navigate } = useApp();
  const [date, setDate] = useState('');

  const filtered = purchases.filter((p) => (!date || p.date === date));
  const rows = riders.map((r) => {
    const ps = filtered.filter((p) => p.riderId === r.id);
    return {
      id: r.id,
      name: r.name,
      gerobak: r.gerobak,
      count: ps.length,
      total: ps.reduce((t, p) => t + sub(p), 0),
    };
  });

  const grandTotal = rows.reduce((t, r) => t + r.total, 0);

  return (
    <View style={{ gap: 20 }}>
      <PageHeader
        title="Laporan Setoran & Penjualan Rider"
        subtitle="Rekapitulasi transaksi pembelian porsi nasi pulut dari pelanggan per gerobak."
      />

      <Card title="Filter Tanggal Penjualan" subtitle="Pilih satu tanggal untuk melihat rekapitulasi atau tampilkan semua.">
        <DateFilter
          value={date}
          onChange={setDate}
          onReset={() => setDate('')}
        />
      </Card>

      {/* Stats Summary */}
      <View style={s.statsRow}>
        <StatCard
          label="Total Setoran Penjualan"
          value={rupiah(grandTotal)}
          note={`${filtered.length} total transaksi pelanggan`}
        />
        <StatCard
          label="Rider Bertransaksi"
          value={`${rows.filter((r) => r.count > 0).length} rider`}
          note={`Dari total ${riders.length} rider aktif`}
        />
      </View>

      {/* Recap Table */}
      <Card title="Rekapitulasi Penjualan per Rider">
        <Table
          rows={rows}
          columns={[
            {
              key: 'id',
              title: 'Nama Rider',
              flex: 1.6,
              render: (r) => (
                <View>
                  <Text style={s.boldText}>{r.name}</Text>
                  <Text style={s.subText}>{r.id}</Text>
                </View>
              ),
            },
            {
              key: 'gerobak',
              title: 'Unit Gerobak',
              render: (r) => <Text style={s.regularText}>{r.gerobak}</Text>,
            },
            {
              key: 'count',
              title: 'Transaksi',
              render: (r) => (
                <Badge
                  text={`${r.count} order`}
                  tone={r.count > 0 ? 'green' : 'gray'}
                />
              ),
            },
            {
              key: 'total',
              title: 'Total Penjualan',
              flex: 1.4,
              render: (r) => (
                <Text style={[s.boldText, { color: colors.maroonDark }]}>
                  {rupiah(r.total)}
                </Text>
              ),
            },
            {
              key: 'a',
              title: 'Aksi',
              render: (r) => (
                <LinkText
                  label="Lihat Rincian →"
                  onPress={() => navigate('reportDetail', { riderId: r.id, date })}
                />
              ),
            },
          ]}
        />
      </Card>
    </View>
  );
}

export function ReportDetail({ riderId, date: d0 = '' }) {
  const { riders, purchases, navigate } = useApp();
  const rider = riders.find((r) => r.id === riderId);
  const [date, setDate] = useState(d0);

  const list = purchases.filter((p) => p.riderId === riderId && (!date || p.date === date));
  const totalAmount = list.reduce((t, p) => t + sub(p), 0);

  return (
    <View style={{ gap: 20 }}>
      <PageHeader
        back="Laporan Setoran"
        onBack={() => navigate('reports')}
        title={`Rincian Penjualan: ${rider?.name || 'Rider'}`}
        subtitle={`ID: ${rider?.id} · Gerobak: ${rider?.gerobak} · Telepon: ${rider?.phone}`}
        action={<Badge text={`${list.length} transaksi`} tone="warn" />}
      />

      <Card title="Filter Tanggal Transaksi">
        <DateFilter
          value={date}
          onChange={setDate}
          onReset={() => setDate('')}
        />
      </Card>

      <StatCard
        label="Total Pembelian Pelanggan"
        value={rupiah(totalAmount)}
        note={`${list.length} struk pembelian tercatat`}
      />

      <Card title="Daftar Pembelian Pelanggan (Struk Transaksi)">
        {list.length === 0 ? (
          <View style={s.emptyBox}>
            <Text style={s.emptyText}>Tidak ada riwayat pembelian pada rentang tanggal ini.</Text>
          </View>
        ) : (
          <View style={{ gap: 14 }}>
            {list.map((p) => (
              <View key={p.id} style={s.receiptCard}>
                <View style={s.receiptHeader}>
                  <Text style={s.receiptCode}>
                    {p.id}{' '}
                    <Text style={{ fontFamily: fonts.regular, color: colors.muted }}>
                      · {p.date}
                    </Text>
                  </Text>
                  <Text style={s.receiptTotal}>Total: {rupiah(sub(p))}</Text>
                </View>

                <Table
                  keyField="menu"
                  rows={p.items}
                  columns={[
                    { key: 'menu', title: 'Menu yang Dibeli', flex: 2 },
                    {
                      key: 'qty',
                      title: 'Jumlah Porsi',
                      render: (i) => <Text style={s.regularText}>{i.qty} porsi</Text>,
                    },
                    {
                      key: 'price',
                      title: 'Harga Satuan',
                      render: (i) => <Text style={s.regularText}>{rupiah(i.price)}</Text>,
                    },
                    {
                      key: 'st',
                      title: 'Subtotal',
                      render: (i) => (
                        <Text style={[s.boldText, { color: colors.maroonDark }]}>
                          {rupiah(i.qty * i.price)}
                        </Text>
                      ),
                    },
                  ]}
                />
              </View>
            ))}
          </View>
        )}
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
  },
  boldText: {
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.text,
    fontSize: 13,
  },
  subText: {
    fontFamily: fonts.regular,
    color: colors.muted,
    fontSize: 11.5,
  },
  regularText: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: 12.5,
  },
  emptyBox: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: fonts.medium,
    color: colors.muted,
    fontSize: 13,
  },
  receiptCard: {
    backgroundColor: '#FAF5ED',
    borderRadius: radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  receiptCode: {
    fontFamily: fonts.bold,
    fontWeight: '700',
    fontSize: 13,
    color: colors.text,
  },
  receiptTotal: {
    fontFamily: fonts.extraBold,
    fontWeight: '800',
    fontSize: 13.5,
    color: colors.maroonDark,
  },
});
