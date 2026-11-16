import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useApp } from '../context/AppContext';
import { Card, PageHeader, Table, Badge, DateFilter, Select, Field } from '../components/ui';
import { colors, fonts, radius } from '../theme';

// Riwayat Stock In & Stock Out. Tiap baris bisa dibuka -> rincian menu.
export default function History() {
  const { stockIns, stockOuts, riders } = useApp();
  const [date, setDate] = useState('');
  const [type, setType] = useState('');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);

  const name = (id) => riders.find((r) => r.id === id)?.name;

  const all = [
    ...stockIns.map((r) => ({
      id: r.id,
      date: r.date,
      type: 'in',
      source: 'Penerimaan Dapur Pusat',
      who: r.by,
      items: r.items,
    })),
    ...stockOuts.map((r) => ({
      id: r.id,
      date: r.date,
      type: 'out',
      source: `Rider ${name(r.riderId) || 'Rider'} · ${r.gerobak}`,
      who: 'Admin Gudang',
      items: r.items,
    })),
  ]
    .filter(
      (r) =>
        (!date || r.date === date) &&
        (!type || r.type === type) &&
        (r.id + r.source).toLowerCase().includes(q.toLowerCase())
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <View style={{ gap: 20 }}>
      <PageHeader
        title="Riwayat Mutasi Stok Gudang"
        subtitle="Log komprehensif seluruh pergerakan stok masuk dari dapur pusat dan alokasi ke rider."
      />

      {/* Filter Section */}
      <Card title="Filter & Pencarian Mutasi" subtitle="Pilih satu tanggal atau biarkan kosong untuk semua riwayat.">
        <DateFilter
          value={date}
          onChange={setDate}
          onReset={() => {
            setDate('');
            setType('');
            setQ('');
          }}
          extra={
            <Select
              label="Jenis Mutasi"
              value={type}
              onChange={setType}
              placeholder="Semua Mutasi"
              style={{ width: 200, marginRight: 10, marginBottom: 0 }}
              options={[
                { value: '', label: 'Semua (Masuk & Keluar)' },
                { value: 'in', label: 'Hanya Stock In (Masuk)' },
                { value: 'out', label: 'Hanya Stock Out (Keluar)' },
              ]}
            />
          }
        />
        <Field
          value={q}
          onChangeText={setQ}
          placeholder="Cari kode transaksi atau nama rider..."
          style={{ marginTop: 14, marginBottom: 0 }}
        />
      </Card>

      {/* History List */}
      <Card
        title="Catatan Pergerakan Stok"
        subtitle="Klik baris transaksi untuk melihat rincian porsi tiap menu."
      >
        {all.length === 0 ? (
          <View style={s.emptyBox}>
            <Text style={s.emptyText}>Tidak ada riwayat mutasi pada kriteria pencarian ini.</Text>
          </View>
        ) : (
          <View style={s.historyList}>
            {all.map((r) => {
              const total = r.items.reduce((t, i) => t + Number(i.qty || 0), 0);
              const isOpen = open === r.id;
              const isIn = r.type === 'in';

              return (
                <View key={r.id} style={s.historyItemCard}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setOpen(isOpen ? null : r.id)}
                    style={[s.itemHeaderRow, Platform.OS === 'web' && { cursor: 'pointer' }]}
                  >
                    <Text style={s.expandIcon}>{isOpen ? '▼' : '▶'}</Text>
                    <View style={{ flex: 1.4 }}>
                      <Text style={s.itemCode}>{r.id}</Text>
                      <Text style={s.itemDate}>{r.date}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Badge
                        text={isIn ? 'Stock In' : 'Stock Out'}
                        tone={isIn ? 'green' : 'warn'}
                      />
                    </View>
                    <Text style={s.itemSource}>{r.source}</Text>
                    <Text
                      style={[
                        s.itemQty,
                        { color: isIn ? colors.green : colors.maroonDark },
                      ]}
                    >
                      {isIn ? '+' : '−'}
                      {total} porsi
                    </Text>
                    <Text style={s.itemWho}>{r.who}</Text>
                  </TouchableOpacity>

                  {/* Accordion Detail Breakdown */}
                  {isOpen && (
                    <View style={s.detailContainer}>
                      <Text style={s.detailTitle}>Rincian Menu:</Text>
                      <Table
                        keyField="menu"
                        rows={r.items}
                        columns={[
                          { key: 'menu', title: 'Menu Padang', flex: 2 },
                          {
                            key: 'qty',
                            title: 'Jumlah Porsi',
                            render: (i) => (
                              <Text
                                style={{
                                  fontFamily: fonts.bold,
                                  fontWeight: '700',
                                  color: isIn ? colors.green : colors.maroon,
                                }}
                              >
                                {isIn ? '+' : '−'}
                                {i.qty} porsi
                              </Text>
                            ),
                          },
                          {
                            key: 'note',
                            title: 'Catatan',
                            flex: 2,
                            render: (i) => (
                              <Text style={{ fontFamily: fonts.regular, color: colors.muted }}>
                                {i.note || '-'}
                              </Text>
                            ),
                          },
                        ]}
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
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
  historyList: {
    gap: 8,
  },
  historyItemCard: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.sm,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  itemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  expandIcon: {
    width: 22,
    color: colors.muted,
    fontSize: 10,
  },
  itemCode: {
    fontFamily: fonts.bold,
    fontWeight: '700',
    fontSize: 13,
    color: colors.text,
  },
  itemDate: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  itemSource: {
    flex: 1.8,
    fontFamily: fonts.medium,
    fontSize: 12.5,
    color: colors.textSecondary,
  },
  itemQty: {
    flex: 1,
    fontFamily: fonts.extraBold,
    fontWeight: '800',
    fontSize: 13,
  },
  itemWho: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 11.5,
    color: colors.muted,
    textAlign: 'right',
  },
  detailContainer: {
    backgroundColor: '#FAF5ED',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  detailTitle: {
    fontFamily: fonts.bold,
    fontWeight: '700',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
});
