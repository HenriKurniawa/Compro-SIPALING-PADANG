import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Card, PageHeader, Table, Badge, Button, Field, LinkText, Alert, ConfirmModal } from '../components/ui';
import { colors, fonts, radius } from '../theme';

export default function Riders() {
  const { riders, riderApi } = useApp();
  const [q, setQ] = useState('');
  const [del, setDel] = useState(null);
  const [f, setF] = useState({ name: '', phone: '', id: '', gerobak: '' });
  const [err, setErr] = useState('');

  const set = (k) => (v) => setF({ ...f, [k]: v });

  const rows = riders.filter((r) =>
    (r.name + r.id + r.gerobak).toLowerCase().includes(q.toLowerCase())
  );

  const add = () => {
    if (!f.name || !f.id || !f.gerobak) {
      return setErr('Nama lengkap, ID rider, dan nomor gerobak wajib diisi.');
    }
    if (riders.some((r) => r.id === f.id)) {
      return setErr('ID rider sudah terdaftar di sistem.');
    }
    riderApi.add({ ...f, status: 'Aktif' });
    setF({ name: '', phone: '', id: '', gerobak: '' });
    setErr('');
  };

  return (
    <View style={{ gap: 20 }}>
      <PageHeader
        title="Daftar Rider & Gerobak"
        subtitle="Kelola data mitra rider penjualan dan penomoran unit gerobak aktif."
      />

      <Alert
        title="Status Registrasi Mitra Rider"
        text="Data gerobak dan rider tersinkronisasi dengan gudang operasional untuk alokasi distribusi porsi harian."
        tone="green"
      />

      <View style={s.layoutRow}>
        {/* Left: Riders List */}
        <Card
          title="Daftar Mitra Rider"
          subtitle="Pencarian nama rider, ID, atau kode unit gerobak."
          style={{ flex: 1.8 }}
        >
          <Field
            value={q}
            onChangeText={setQ}
            placeholder="Cari nama, ID rider, atau unit gerobak..."
            style={{ marginBottom: 14 }}
          />

          <Table
            rows={rows}
            columns={[
              {
                key: 'name',
                title: 'Nama & ID Mitra',
                flex: 1.8,
                render: (r) => (
                  <View>
                    <Text style={s.boldText}>{r.name}</Text>
                    <Text style={s.codeText}>{r.id}</Text>
                  </View>
                ),
              },
              {
                key: 'gerobak',
                title: 'Unit Gerobak',
                render: (r) => (
                  <Badge text={r.gerobak} tone="gray" />
                ),
              },
              {
                key: 'phone',
                title: 'No. WhatsApp / Telp',
                flex: 1.4,
                render: (r) => <Text style={s.regularText}>{r.phone || '-'}</Text>,
              },
              {
                key: 'status',
                title: 'Status',
                render: (r) => (
                  <Badge
                    text={r.status}
                    tone={r.status === 'Aktif' ? 'green' : 'warn'}
                  />
                ),
              },
              {
                key: 'a',
                title: 'Aksi',
                render: (r) => (
                  <LinkText danger label="Hapus" onPress={() => setDel(r)} />
                ),
              },
            ]}
          />
        </Card>

        {/* Right: Add Rider Form */}
        <Card
          title="Tambah Mitra Baru"
          subtitle="Registrasikan rider dan unit gerobak ke sistem."
          style={{ flex: 1.2 }}
        >
          {!!err && <Alert tone="red" title={err} style={{ marginBottom: 12 }} />}

          <Field
            label="Nama Lengkap Rider"
            value={f.name}
            onChangeText={set('name')}
            placeholder="Contoh: Budi Santoso"
          />

          <Field
            label="Nomor Telepon / WA"
            value={f.phone}
            onChangeText={set('phone')}
            placeholder="0812-xxxx-xxxx"
            keyboardType="phone-pad"
          />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Field
              label="ID Rider"
              value={f.id}
              onChangeText={set('id')}
              placeholder="R-025"
              autoCapitalize="characters"
              style={{ flex: 1 }}
            />

            <Field
              label="Kode Gerobak"
              value={f.gerobak}
              onChangeText={set('gerobak')}
              placeholder="G-025"
              autoCapitalize="characters"
              style={{ flex: 1 }}
            />
          </View>

          <Button
            label="+ Simpan Mitra Rider"
            onPress={add}
            style={{ marginTop: 6 }}
          />
        </Card>
      </View>

      <ConfirmModal
        visible={!!del}
        title="Konfirmasi Hapus Mitra Rider"
        text={del && `Mitra ${del.name} (${del.id}) dan gerobak ${del.gerobak} akan dihapus dari daftar operasional.`}
        confirmLabel="Hapus Rider"
        onCancel={() => setDel(null)}
        onConfirm={() => {
          riderApi.remove(del.id);
          setDel(null);
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  layoutRow: {
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
  codeText: {
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.maroon,
    fontSize: 11.5,
  },
  regularText: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: 12.5,
  },
});
