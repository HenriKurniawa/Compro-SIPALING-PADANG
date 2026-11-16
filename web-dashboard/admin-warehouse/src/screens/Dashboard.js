import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp, today } from '../context/AppContext';
import { Card, PageHeader, StatCard, Table, Badge, Alert, Button } from '../components/ui';
import { colors, fonts, radius } from '../theme';

export default function Dashboard() {
  const { user, stockIns, stockOuts, riders, warehouseStock, navigate } = useApp();

  const sum = (arr) =>
    arr.reduce((t, r) => t + r.items.reduce((x, i) => x + Number(i.qty || 0), 0), 0);

  const d = today();
  const inToday = sum(stockIns.filter((r) => r.date === d));
  const outToday = sum(stockOuts.filter((r) => r.date === d));
  const totalStock = Object.values(warehouseStock).reduce((a, b) => a + b, 0);
  const lowStockItems = Object.entries(warehouseStock).filter(([, v]) => v < 100);

  const recentDistributions = stockOuts.slice(0, 6).map((o) => ({
    ...o,
    rider: riders.find((r) => r.id === o.riderId)?.name || 'Rider',
    totalPorsi: sum([o]),
  }));

  return (
    <View style={{ gap: 20 }}>
      {/* Page Header with Action Buttons */}
      <PageHeader
        title={`Ringkasan Operasional Gudang ${user?.warehouse || 'Pusat'}`}
        subtitle="Pantau stok porsi nasi pulut, pergerakan masuk & alokasi ke rider secara real-time."
        action={
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button
              small
              variant="ghost"
              label="+ Stok Masuk"
              onPress={() => navigate('stockInForm')}
            />
            <Button
              small
              variant="orange"
              label="+ Alokasi Rider"
              onPress={() => navigate('stockOutForm')}
            />
          </View>
        }
      />

      {/* Metric Cards Row */}
      <View style={s.statsRow}>
        <StatCard
          label="Total Stok Tersedia"
          value={totalStock.toLocaleString('id-ID')}
          note="Porsi siap distribusi"
        />
        <StatCard
          label="Stok Masuk Hari Ini"
          value={inToday.toLocaleString('id-ID')}
          note="Porsi dari dapur pusat"
        />
        <StatCard
          label="Stok Keluar Hari Ini"
          value={outToday.toLocaleString('id-ID')}
          note="Porsi dibawa rider"
        />
        <StatCard
          label="Gerobak Beroperasi"
          value={`${stockOuts.filter((o) => o.date === d).length || riders.length} / ${riders.length} unit`}
          note="1 rider = 1 unit gerobak aktif"
        />
      </View>

      {/* Two Column Layout */}
      <View style={s.gridRow}>
        {/* Left Column: Recent Distributions */}
        <Card
          title="Distribusi Gerobak Hari Ini"
          subtitle="Daftar alokasi stok porsi ke rider yang sedang berjalan."
          style={{ flex: 1.8 }}
          right={
            <Button
              small
              variant="ghost"
              label="Lihat Semua →"
              onPress={() => navigate('stockOut')}
            />
          }
        >
          <Table
            rows={recentDistributions}
            columns={[
              {
                key: 'id',
                title: 'ID Alokasi',
                flex: 1.4,
                render: (r) => (
                  <Text style={s.codeText}>{r.id}</Text>
                ),
              },
              {
                key: 'rider',
                title: 'Rider & Gerobak',
                flex: 1.6,
                render: (r) => (
                  <View>
                    <Text style={s.boldText}>{r.rider}</Text>
                    <Text style={s.subText}>{r.gerobak}</Text>
                  </View>
                ),
              },
              {
                key: 'totalPorsi',
                title: 'Alokasi Porsi',
                render: (r) => (
                  <Text style={[s.boldText, { color: colors.maroonDark }]}>
                    {r.totalPorsi} porsi
                  </Text>
                ),
              },
              {
                key: 'status',
                title: 'Status',
                render: (r) => (
                  <Badge
                    text={r.status}
                    tone={r.status === 'Berjalan' ? 'green' : 'warn'}
                  />
                ),
              },
            ]}
          />
        </Card>

        {/* Right Column: Inventory & Alerts */}
        <View style={{ flex: 1.2, gap: 16 }}>
          {/* Inventory Breakdown Card */}
          <Card title="Persediaan per Menu" subtitle="Status ketersediaan stok fisik gudang.">
            <View style={{ gap: 10 }}>
              {Object.entries(warehouseStock).map(([menu, qty]) => {
                const isLow = qty < 100;
                return (
                  <View key={menu} style={s.menuStockRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.menuName}>{menu}</Text>
                      <Text style={s.menuStatusText}>
                        {isLow ? 'Stok menipis' : 'Stok mencukupi'}
                      </Text>
                    </View>
                    <View style={[s.stockPill, isLow && s.stockPillLow]}>
                      <Text style={[s.stockPillText, isLow && s.stockPillTextLow]}>
                        {qty} porsi
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </Card>

          {/* Low Stock Alerts */}
          <Card title="Peringatan Operasional" subtitle="Perhatian untuk admin gudang.">
            {lowStockItems.length === 0 ? (
              <Alert
                tone="green"
                title="Semua Stok Aman"
                text="Semua persediaan menu berada di atas batas aman 100 porsi."
              />
            ) : (
              lowStockItems.map(([m, v]) => (
                <Alert
                  key={m}
                  tone="warn"
                  title={`${m} — Hanya ${v} porsi tersisa!`}
                  text="Jumlah porsi mendekati batas minimum. Harap jadwalkan penambahan stok."
                />
              ))
            )}
          </Card>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
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
  codeText: {
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.maroon,
    fontSize: 12,
  },
  menuStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuName: {
    fontFamily: fonts.bold,
    fontWeight: '700',
    fontSize: 13,
    color: colors.text,
  },
  menuStatusText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  stockPill: {
    backgroundColor: colors.greenBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  stockPillLow: {
    backgroundColor: colors.warnBg,
  },
  stockPillText: {
    fontFamily: fonts.bold,
    fontWeight: '700',
    fontSize: 12,
    color: colors.green,
  },
  stockPillTextLow: {
    color: colors.warn,
  },
});
