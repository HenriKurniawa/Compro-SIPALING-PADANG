import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp, today } from '../context/AppContext';
import { Card, PageHeader, StatCard, Table, Button, Field, DatePicker, LinkText, ConfirmModal, Alert, Badge, DetailModal, MenuPills } from '../components/ui';
import ItemRows from '../components/ItemRows';
import { colors, fonts, radius } from '../theme';

const total = (r) => r.items.reduce((t, i) => t + Number(i.qty || 0), 0);

export function StockInList() {
  const { stockIns, stockInApi, warehouseStock, navigate } = useApp();
  const [q, setQ] = useState('');
  const [del, setDel] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const rows = stockIns.filter((r) =>
    (r.id + r.items.map((i) => i.menu).join(' ')).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <View style={{ gap: 20 }}>
      <PageHeader
        title="Penerimaan Stok Masuk"
        subtitle="Catat penerimaan kiriman porsi dari dapur pusat dan pantau persediaan gudang."
        action={
          <Button
            variant="orange"
            label="+ Catat Stok Masuk"
            onPress={() => navigate('stockInForm')}
          />
        }
      />

      {/* Stock Cards Row */}
      <View style={s.statsRow}>
        {Object.entries(warehouseStock).map(([m, v]) => (
          <StatCard key={m} label={m} value={`${v} porsi`} note="Stok fisik tersedia" />
        ))}
      </View>

      {/* Records Table Card */}
      <Card
        title="Daftar Transaksi Stok Masuk"
        subtitle="Riwayat penerimaan barang masuk ke gudang."
      >
        <Field
          value={q}
          onChangeText={setQ}
          placeholder="Cari menu atau kode transaksi..."
          style={{ marginBottom: 16 }}
        />

        <Table
          rows={rows}
          columns={[
            {
              key: 'id',
              title: 'Kode Transaksi',
              flex: 1.4,
              render: (r) => <Text style={s.codeText}>{r.id}</Text>,
            },
            {
              key: 'date',
              title: 'Tanggal & Jam',
              render: (r) => (
                <View>
                  <Text style={s.boldText}>{r.date}</Text>
                  <Text style={s.subText}>{r.time || 'Pagi'}</Text>
                </View>
              ),
            },
            {
              key: 'menu',
              title: 'Menu yang Diterima',
              flex: 2.2,
              render: (r) => <MenuPills items={r.items} />,
            },
            {
              key: 't',
              title: 'Total Porsi',
              render: (r) => (
                <Text style={[s.boldText, { color: colors.maroonDark }]}>
                  +{total(r)} porsi
                </Text>
              ),
            },
            {
              key: 'by',
              title: 'Penerima',
              render: (r) => <Text style={s.subText}>{r.by || 'Admin'}</Text>,
            },
            {
              key: 'a',
              title: 'Aksi',
              flex: 1.4,
              render: (r) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <LinkText label="Lihat" onPress={() => setViewItem(r)} />
                  <LinkText label="Ubah" onPress={() => navigate('stockInDetail', { id: r.id })} />
                  <LinkText danger label="Hapus" onPress={() => setDel(r)} />
                </View>
              ),
            },
          ]}
        />
      </Card>

      {/* Detail Modal: Tabel Menu yang Diterima */}
      <DetailModal
        visible={!!viewItem}
        title={`Rincian Stok Masuk (${viewItem?.id || ''})`}
        subtitle="Daftar menu dan jumlah porsi yang diterima gudang pada transaksi ini."
        infoList={viewItem ? [
          { label: 'Tanggal', value: viewItem.date },
          { label: 'Waktu Penerimaan', value: viewItem.time || 'Pagi' },
          { label: 'Petugas Gudang', value: viewItem.by || 'Admin' },
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
          {
            key: 'note',
            title: 'Catatan',
            flex: 1.8,
            render: (i) => (
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.muted }}>
                {i.note || '-'}
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
        title="Konfirmasi Hapus Catatan Stok Masuk"
        confirmLabel={`Hapus & Kurangi Stok`}
        text={
          del &&
          `Transaksi ${del.id} (${total(del)} porsi) akan dihapus. Stok fisik gudang akan dikurangi secara otomatis.`
        }
        onCancel={() => setDel(null)}
        onConfirm={() => {
          stockInApi.remove(del.id);
          setDel(null);
        }}
      />
    </View>
  );
}

// Dipakai untuk tambah (tanpa id) dan ubah (dengan id)
export function StockInForm({ id }) {
  const { stockIns, stockInApi, user, navigate } = useApp();
  const existing = stockIns.find((r) => r.id === id);

  const [date, setDate] = useState(existing?.date || today());
  const [time, setTime] = useState(existing?.time || new Date().toTimeString().slice(0, 5));
  const [items, setItems] = useState(existing?.items || [{ menu: '', qty: '', note: '' }]);
  const [err, setErr] = useState('');

  const save = () => {
    const clean = items.filter((i) => i.menu && Number(i.qty) > 0);
    if (!clean.length) {
      return setErr('Harap pilih minimal satu menu dengan jumlah lebih dari 0 porsi.');
    }
    const rec = { date, time, items: clean, by: user.name };
    existing ? stockInApi.update(id, rec) : stockInApi.add(rec);
    navigate('stockIn');
  };

  return (
    <View style={{ gap: 20 }}>
      <PageHeader
        back="Stok Masuk"
        onBack={() => navigate('stockIn')}
        title={existing ? 'Ubah Rincian Stok Masuk' : 'Tambah Penerimaan Stok Masuk'}
        subtitle={
          existing
            ? `Nomor Transaksi: ${existing.id} · Diinput oleh ${existing.by}`
            : 'Masukkan rincian penerimaan menu. Stok gudang akan otomatis bertambah setelah disimpan.'
        }
        action={existing && <Badge text="Tercatat di Gudang" tone="green" />}
      />

      <Card title="Informasi Waktu & Gudang Penerima">
        <View style={s.formFieldsRow}>
          <DatePicker
            label="Tanggal Penerimaan"
            value={date}
            onChange={setDate}
            placeholder="Pilih tanggal"
            style={{ flex: 1 }}
          />
          <Field
            label="Waktu Penerimaan"
            value={time}
            onChangeText={setTime}
            placeholder="HH:MM"
            style={{ flex: 1 }}
          />
          <Field
            label="Gudang Penerima"
            value={`Gudang ${user.warehouse}`}
            editable={false}
            style={{ flex: 1 }}
          />
        </View>
      </Card>

      <Card
        title="Daftar Menu & Jumlah Porsi Diterima"
        subtitle="Pilih menu nasi pulut dan isi jumlah porsi yang tiba dari dapur pusat."
      >
        {!!err && <Alert tone="red" title={err} style={{ marginBottom: 14 }} />}
        <ItemRows items={items} onChange={setItems} withNote />
      </Card>

      {/* Action Button: Hanya Simpan (Tombol Kembali cukup 1 di pojok kiri atas) */}
      <View style={s.formActionsRow}>
        <Button label="Simpan Stok Masuk" onPress={save} />
      </View>
    </View>
  );
}

export const StockInDetail = StockInForm;

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
