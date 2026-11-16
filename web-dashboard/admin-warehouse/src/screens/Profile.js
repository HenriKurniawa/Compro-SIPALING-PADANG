import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Card, PageHeader, Field, Button, Alert, ConfirmModal, Badge } from '../components/ui';
import { colors, fonts, radius } from '../theme';

export default function Profile() {
  const { user, logout } = useApp();
  const [cur, setCur] = useState('');
  const [n1, setN1] = useState('');
  const [n2, setN2] = useState('');
  const [msg, setMsg] = useState(null);
  const [ask, setAsk] = useState(false);

  const change = () => {
    if (n1.length < 8) {
      return setMsg({ t: 'red', m: 'Password baru harus minimal 8 karakter.' });
    }
    if (n1 !== n2) {
      return setMsg({ t: 'red', m: 'Konfirmasi password baru tidak cocok.' });
    }
    setMsg({ t: 'green', m: 'Password akun berhasil diperbarui!' });
    setCur('');
    setN1('');
    setN2('');
  };

  const userInitials = (user?.name || 'Admin')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={{ gap: 20 }}>
      <PageHeader
        title="Profil & Keamanan Akun"
        subtitle="Informasi akun petugas gudang dan pengaturan kata sandi."
      />

      <View style={s.layoutRow}>
        {/* Left Column: User Profile Summary Card */}
        <Card
          title="Identitas Akun"
          subtitle="Akses resmi tim operasional gudang SIPALING."
          style={{ flex: 1 }}
        >
          <View style={s.avatarLarge}>
            <Text style={s.avatarLargeText}>{userInitials}</Text>
          </View>

          <Text style={s.profileName}>{user.name}</Text>
          <Text style={s.profileUsername}>@{user.username || 'admin'}</Text>

          <View style={{ marginVertical: 12 }}>
            <Badge text={`Bertugas di Gudang ${user.warehouse}`} tone="green" />
          </View>

          <Button
            variant="ghost"
            label="Keluar dari Akun"
            onPress={() => setAsk(true)}
            style={{ marginTop: 10 }}
          />
        </Card>

        {/* Right Column: Account Details & Password Form */}
        <View style={{ flex: 2, gap: 16 }}>
          <Card title="Detail Penugasan Gudang">
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Field
                label="Nama Lengkap Petugas"
                value={user.name}
                editable={false}
                style={{ flex: 1 }}
              />
              <Field
                label="Username Login"
                value={user.username || '-'}
                editable={false}
                style={{ flex: 1 }}
              />
            </View>
            <Field
              label="Wilayah Penugasan Gudang"
              value={`Gudang ${user.warehouse} (Surabaya)`}
              editable={false}
            />
          </Card>

          <Card
            title="Perbarui Kata Sandi"
            subtitle="Gunakan kombinasi minimal 8 karakter untuk keamanan akun gudang."
          >
            {msg && <Alert tone={msg.t} title={msg.m} style={{ marginBottom: 12 }} />}

            <Field
              label="Password Saat Ini"
              value={cur}
              onChangeText={setCur}
              secureTextEntry
              placeholder="Masukkan password saat ini"
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Field
                label="Password Baru"
                value={n1}
                onChangeText={setN1}
                secureTextEntry
                placeholder="Minimal 8 karakter"
                style={{ flex: 1 }}
              />
              <Field
                label="Konfirmasi Password Baru"
                value={n2}
                onChangeText={setN2}
                secureTextEntry
                placeholder="Ulangi password baru"
                style={{ flex: 1 }}
              />
            </View>

            <Button
              label="Simpan Password Baru"
              onPress={change}
              style={{ alignSelf: 'flex-start', marginTop: 6 }}
            />
          </Card>
        </View>
      </View>

      <ConfirmModal
        visible={ask}
        title="Konfirmasi Keluar Akun"
        text="Anda akan keluar dari sesi sistem gudang dan diarahkan kembali ke layar masuk."
        confirmLabel="Ya, Keluar Akun"
        onCancel={() => setAsk(false)}
        onConfirm={logout}
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
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5DEB3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: colors.border,
  },
  avatarLargeText: {
    color: colors.maroonDark,
    fontFamily: fonts.bold,
    fontWeight: '700',
    fontSize: 22,
  },
  profileName: {
    fontFamily: fonts.bold,
    fontWeight: '700',
    fontSize: 16,
    color: colors.text,
  },
  profileUsername: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
});
