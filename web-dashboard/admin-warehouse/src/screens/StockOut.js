import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp, today } from '../context/AppContext';
import {
  Card,
  PageHeader,
  StatCard,
  Table,
  Button,
  Field,
  Select,
  DatePicker,
  DateFilter,
  LinkText,
  ConfirmModal,
  Alert,
  Badge,
  DetailModal,
  MenuPills,
} from '../components/ui';
import ItemRows from '../components/ItemRows';
import { colors, fonts, radius } from '../theme';

const total = (r) => r.items.reduce((t, i) => t + Number(i.qty || 0), 0);

export function StockOutList() {
  const { stockOuts, stockOutApi, riders, navigate } = useApp();
  const [date, setDate] = useState('');
  const [rider, setRider] = useState('');
  const [del, setDel] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const rows = stockOuts.filter(
    (r) => (!date || r.date === date) && (!rider || r.riderId === rider)
  );
  const d = today();
  const todayRows = stockOuts.filter((r) => r.date === d);
  const name = (id) => riders.find((r) => r.id === id)?.name || id;

  const riderOptions = [
    { value: '', label: 'Semua Rider' },
    ...riders.map((r) => ({ value: r.id, label: `${r.name} · ${r.gerobak}` })),
  ];

  return (
    <View style={{ gap: 20 }}>
      <PageHeader
        title="Distribusi Stok ke Gerobak (Stock Out)"
        subtitle="Pendataan dan alokasi porsi nasi pulut yang dibawa oleh rider berkeliling."
        action={
          <Button
            variant="orange"
            label="+ Alokasi ke Rider"
            onPress={() => navigate('stockOutForm')}
          />
        }
      />

      {/* Summary Stat Cards */}
      <View style={s.statsRow}>
        <StatCard
          label="Didistribusikan Hari Ini"
          value={`${todayRows.reduce((t, r) => t + total(r), 0)} porsi`}
          note="Total porsi dibawa rider"
        />
        <StatCard
          label="Gerobak Beroperasi"
          value={`${todayRows.length > 0 ? todayRows.length : riders.filter((r) => r.status === 'Aktif').length} unit`}
          note={`${todayRows.length > 0 ? todayRows.length : riders.filter((r) => r.status === 'Aktif').length} rider aktif bertugas`}
        />
        <StatCard
          label="Total Rider & Gerobak"
          value={`${riders.filter((r) => r.status === 'Aktif').length} orang`}
          note="1 rider = 1 unit gerobak"
        />
      </View>

      {/* Filter and Records Card */}
      <Card
        title="Daftar Distribusi ke Gerobak"
        subtitle="Pilih satu tanggal dan rider untuk memfilter riwayat distribusi."
      >
        <DateFilter
          value={date}
          onChange={setDate}
          onReset={() => {
            setDate('');
            setRider('');
          }}
          extra={
            <Select
              label="Pilih Rider"
              value={rider}
              placeholder="Semua rider"
              style={{ width: 200, marginRight: 10, marginBottom: 0 }}
              options={riderOptions}
              onChange={setRider}
            />
          }
        />

        <View style={{ marginTop: 14 }}>
          <Table
            rows={rows}
            columns={[
              {
                key: 'id',
                title: 'Kode Alokasi',
                flex: 1.3,
                render: (r) => <Text style={s.codeText}>{r.id}</Text>,
              },
              {
                key: 'date',
                title: 'Tanggal',
                render: (r) => <Text style={s.boldText}>{r.date}</Text>,
              },
              {
                key: 'r',
                title: 'Rider & Gerobak',
                flex: 1.8,
                render: (r) => (
                  <View>
                    <Text style={s.boldText}>{name(r.riderId)}</Text>
                    <Text style={s.subText}>Unit {r.gerobak}</Text>
                  </View>
                ),
              },
              {
                key: 'm',
                title: 'Rincian Menu (Porsi)',
                flex: 2.2,
                render: (r) => <MenuPills items={r.items} />,
              },
              {
                key: 't',
                title: 'Total',
                render: (r) => (
                  <Text style={[s.boldText, { color: colors.maroonDark }]}>
                    {total(r)} porsi
                  </Text>
                ),
              },
              {
                key: 's',
                title: 'Status',
                render: (r) => (
                  <Badge
                    text={r.status}
                    tone={r.status === 'Berjalan' ? 'green' : 'warn'}
                  />
                ),
              },
              {
                key: 'a',
                title: 'Aksi',
                flex: 1.4,
                render: (r) => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <LinkText label="Lihat" onPress={() => setViewItem(r)} />
                    <LinkText label="Ubah" onPress={() => navigate('stockOutDetail', { id: r.id })} />
                    <LinkText danger label="Hapus" onPress={() => setDel(r)} />
                  </View>
                ),
              },
            ]}
          />
        </View>
      </Card>

      {/* Detail Modal: Tabel Menu yang Dialokasikan ke Rider */}
      <DetailModal
        visible={!!viewItem}
        title={`Rincian Alokasi Rider (${viewItem?.id || ''})`}
        subtitle="Daftar menu dan jumlah porsi yang dialokasikan ke gerobak rider."
        infoList={viewItem ? [
          { label: 'Rider Bertugas', value: name(viewItem.riderId) },
          { label: 'Nomor Gerobak', value: viewItem.gerobak || '-' },
          { label: 'Tanggal Distribusi', value: viewItem.date },
          { label: 'Status', value: viewItem.status },
        ] : []}
        items={viewItem?.items || []}
        columns={[
          {
            key: 'no',
            title: 'No',
            flex: 0.5,
            render: (_, idx) => (
              <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.muted }}>
                {idx + 1}
              </Text>
            ),
          },
          {
            key: 'menu',
            title: 'Menu Padang',
            flex: 2,
            render: (i) => (
              <Text style={{ fontFamily: fonts.bold, fontWeight: '700', fontSize: 13, color: colors.text }}>
                {i.menu}
              </Text>
            ),
          },
          {
            key: 'qty',
            title: 'Jumlah Porsi',
            flex: 1.2,
            render: (i) => (
              <Text style={{ fontFamily: fonts.bold, fontWeight: '700', fontSize: 13, color: colors.maroon }}>
                {i.qty} porsi
              </Text>
            ),
          },
        ]}
        totalText={`${viewItem ? total(viewItem) : 0} porsi`}
        onClose={() => setViewItem(null)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        visible={!!del}
        title={`Batalkan Alokasi Rider ${del ? name(del.riderId) : ''}?`}
        confirmLabel="Hapus & Kembalikan Stok"
        text="Catatan alokasi ini akan dihapus, dan porsi yang belum terjual akan otomatis dikembalikan ke stok gudang."
        onCancel={() => setDel(null)}
        onConfirm={() => {
          stockOutApi.remove(del.id);
          setDel(null);
        }}
      />
    </View>
  );
}

export function StockOutForm({ id }) {
  const { stockOuts, stockOutApi, riders, warehouseStock, navigate } = useApp();
  const existing = stockOuts.find((r) => r.id === id);

  const [riderId, setRiderId] = useState(existing?.riderId || '');
  const [date, setDate] = useState(existing?.date || today());
  const [items, setItems] = useState(existing?.items || [{ menu: '', qty: '' }]);
  const [err, setErr] = useState('');

  const rider = riders.find((r) => r.id === riderId);

  const save = () => {
    const clean = items.filter((i) => i.menu && Number(i.qty) > 0);
    if (!rider) return setErr('Harap pilih rider tujuan terlebih dahulu.');
    if (!clean.length) return setErr('Isi minimal satu menu dengan jumlah lebih dari 0.');

    // Cek ketersediaan stok
    for (const i of clean) {
      const old = existing?.items.find((x) => x.menu === i.menu)?.qty || 0;
      const currentAvailable = (warehouseStock[i.menu] || 0) + Number(old);
      if (Number(i.qty) > currentAvailable) {
        return setErr(`Stok menu ${i.menu} tidak mencukupi (Tersedia: ${currentAvailable} porsi).`);
      }
    }

    const rec = {
      date,
      riderId,
      gerobak: rider.gerobak,
      items: clean,
      status: existing?.status || 'Berjalan',
    };

    existing ? stockOutApi.update(id, rec) : stockOutApi.add(rec);
    navigate('stockOut');
  };

  return (
    <View style={{ gap: 20 }}>
      <PageHeader
        back="Stok Keluar"
        onBack={() => navigate('stockOut')}
        title={existing ? 'Ubah Rincian Alokasi Rider' : 'Alokasi Stok ke Gerobak Rider'}
        subtitle="Pilih rider tujuan, lalu tentukan porsi tiap menu yang dibawa untuk penjualan hari ini."
      />

      <Card title="Informasi Tujuan Distribusi">
        <View style={s.formFieldsRow}>
          <Select
            label="Pilih Rider Bertugas"
            value={riderId}
            onChange={setRiderId}
            placeholder="Pilih rider..."
            style={{ flex: 1.4 }}
            options={riders.map((r) => ({
              value: r.id,
              label: `${r.name} · Gerobak ${r.gerobak}`,
            }))}
          />
          <Field
            label="Nomor Gerobak"
            value={rider?.gerobak || '-'}
            editable={false}
            style={{ flex: 1 }}
          />
          <DatePicker
            label="Tanggal Distribusi"
            value={date}
            onChange={setDate}
            placeholder="Pilih tanggal"
            style={{ flex: 1 }}
          />
        </View>
      </Card>

      <Card
        title="Menu & Jumlah Porsi yang Dibawa"
        subtitle="Sistem akan memeriksa ketersediaan stok fisik gudang secara otomatis."
      >
        {!!err && <Alert tone="red" title={err} style={{ marginBottom: 14 }} />}
        <ItemRows items={items} onChange={setItems} stockHint />
      </Card>

      {/* Action Button: Hanya Simpan (Tombol Kembali cukup 1 di pojok kiri atas) */}
      <View style={s.formActionsRow}>
        <Button label="Simpan & Alokasikan" onPress={save} />
      </View>
    </View>
  );
}

export const StockOutDetail = StockOutForm;

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
  codeText: {
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.maroon,
    fontSize: 12,
  },
  regularText: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: 12.5,
  },
  formFieldsRow: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
  },
  formActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 6,
  },
});
