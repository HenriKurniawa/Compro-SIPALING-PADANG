import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useApp } from '../context/AppContext';
import { Button, Field, Alert } from '../components/ui';
import { colors, fonts, radius, shadows } from '../theme';

function Shell({ tagline, children }) {
  return (
    <View style={s.root}>
      {/* Brand Hero Column */}
      <View style={s.leftCol}>
        <View style={s.heroContent}>
          <View style={s.brandBadgeRow}>
            <View style={s.logoCircle}>
              <Text style={s.logoText}>SP</Text>
            </View>
            <View>
              <Text style={s.brandTitle}>SIPALING</Text>
              <Text style={s.brandSub}>Nasi Pulut · Padang Kuliling</Text>
            </View>
          </View>

          <Text style={s.heroTagline}>{tagline}</Text>

          <View style={s.accessPill}>
            <View style={s.accessDot} />
            <View>
              <Text style={s.accessLabel}>SISTEM OPERASIONAL WAREHOUSE</Text>
              <Text style={s.accessWarehouse}>Gudang Kertajaya & Gudang Darmo</Text>
            </View>
          </View>
        </View>

        <Text style={s.copyrightText}>© 2026 SIPALING Warehouse Management System</Text>
      </View>

      {/* Form Content Column */}
      <View style={s.rightCol}>
        <View style={[s.formCard, shadows.md]}>
          {children}
        </View>
      </View>
    </View>
  );
}

export function LoginScreen() {
  const { login, navigate } = useApp();
  const [u, setU] = useState('admin');
  const [p, setP] = useState('password');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');

  const submit = () => {
    if (!login(u.trim(), p)) {
      setErr('Username atau password salah. Pastikan akun telah diaktivasi.');
    }
  };

  return (
    <Shell tagline={'Dari gudang,\nuntuk setiap\nperjalanan rasa.'}>
      <Text style={s.formH1}>Masuk Warehouse</Text>
      <Text style={s.formSub}>Gunakan kredensial akun Gudang Kertajaya atau Darmo.</Text>

      {!!err && <Alert tone="red" title={err} style={{ marginBottom: 16 }} />}

      <Field
        label="Username"
        value={u}
        onChangeText={setU}
        placeholder="Masukkan username"
        autoCapitalize="none"
      />

      <Field
        label="Password"
        value={p}
        onChangeText={setP}
        placeholder="Masukkan password"
        secureTextEntry={!show}
      />

      <TouchableOpacity
        onPress={() => setShow(!show)}
        activeOpacity={0.7}
        style={[s.togglePassRow, Platform.OS === 'web' && { cursor: 'pointer' }]}
      >
        <Text style={s.togglePassText}>{show ? 'Sembunyikan password' : 'Tampilkan password'}</Text>
      </TouchableOpacity>

      <Button
        variant="orange"
        label="Masuk ke Sistem Gudang"
        onPress={submit}
        style={{ marginTop: 4 }}
      />

      {/* Quick Demo Hint */}
      <View style={s.demoBox}>
        <Text style={s.demoBoxTitle}>Akun Demo Tersedia:</Text>
        <Text style={s.demoBoxText}>
          Username: <Text style={{ fontFamily: fonts.bold }}>admin</Text> · Password: <Text style={{ fontFamily: fonts.bold }}>password</Text>
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => navigate('activate')}
        activeOpacity={0.7}
        style={[s.footerLinkWrap, Platform.OS === 'web' && { cursor: 'pointer' }]}
      >
        <Text style={s.footerLinkNormal}>
          Belum aktivasi akun?{' '}
          <Text style={s.footerLinkHighlight}>Aktivasi admin gudang di sini</Text>
        </Text>
      </TouchableOpacity>
    </Shell>
  );
}

// Registrasi hanya untuk 2 admin: Kertajaya & Darmo
export function ActivateScreen() {
  const { accounts, activate, navigate } = useApp();
  const [adminId, setAdminId] = useState(null);
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [p2, setP2] = useState('');
  const [err, setErr] = useState('');

  const submit = () => {
    if (!adminId) return setErr('Pilih akun admin gudang terlebih dahulu.');
    if (u.length < 4) return setErr('Username minimal 4 karakter.');
    if (p.length < 8) return setErr('Password minimal 8 karakter.');
    if (p !== p2) return setErr('Konfirmasi password tidak sama.');
    activate({ adminId, username: u.trim(), password: p });
    navigate('login');
  };

  return (
    <Shell tagline={'Dua gudang.\nDua admin.\nSatu alur rapi.'}>
      <Text style={s.formH1}>Aktivasi Admin Gudang</Text>
      <Text style={s.formSub}>
        Pilih salah satu gudang yang tersedia untuk membuat username dan password baru.
      </Text>

      {/* Account Selector Cards */}
      <View style={s.accountChoicesRow}>
        {accounts.map((a) => (
          <TouchableOpacity
            key={a.id}
            disabled={a.activated}
            onPress={() => setAdminId(a.id)}
            style={[
              s.accountChoiceCard,
              adminId === a.id && s.accountChoiceCardActive,
              a.activated && s.accountChoiceCardDisabled,
              Platform.OS === 'web' && { cursor: a.activated ? 'not-allowed' : 'pointer' },
            ]}
          >
            <Text style={s.accountChoiceName}>{a.name}</Text>
            <Text style={s.accountChoiceStatus}>
              {a.activated ? 'Sudah aktif' : 'Siap diaktivasi'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {!!err && <Alert tone="red" title={err} style={{ marginBottom: 14 }} />}

      <Field
        label="Username Baru"
        value={u}
        onChangeText={setU}
        placeholder="Minimal 4 karakter"
        autoCapitalize="none"
      />

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Field
          label="Password Baru"
          value={p}
          onChangeText={setP}
          placeholder="Min. 8 karakter"
          secureTextEntry
          style={{ flex: 1 }}
        />
        <Field
          label="Konfirmasi"
          value={p2}
          onChangeText={setP2}
          placeholder="Ulangi"
          secureTextEntry
          style={{ flex: 1 }}
        />
      </View>

      <View style={s.activateBtnRow}>
        <Button variant="ghost" label="Batal" onPress={() => navigate('login')} />
        <Button label="Aktifkan Akun Gudang" onPress={submit} style={{ flex: 1 }} />
      </View>
    </Shell>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.cream,
    minHeight: '100%',
  },
  leftCol: {
    flex: 1,
    backgroundColor: colors.maroonDark,
    padding: 48,
    justifyContent: 'space-between',
  },
  heroContent: {
    justifyContent: 'center',
    flex: 1,
  },
  brandBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    ...shadows.sm,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: fonts.extraBold,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  brandSub: {
    color: '#F4D4CE',
    fontSize: 12,
    fontFamily: fonts.medium,
    fontWeight: '500',
    marginTop: 2,
  },
  heroTagline: {
    color: '#FFFFFF',
    fontSize: 34,
    fontFamily: fonts.extraBold,
    fontWeight: '800',
    lineHeight: 44,
    letterSpacing: -0.5,
    marginBottom: 36,
  },
  accessPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    alignSelf: 'flex-start',
  },
  accessDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
    marginRight: 12,
  },
  accessLabel: {
    color: '#D8AEA7',
    fontSize: 10,
    fontFamily: fonts.bold,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  accessWarehouse: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    marginTop: 2,
  },
  copyrightText: {
    color: '#F0CFC8',
    fontSize: 11,
    fontFamily: fonts.regular,
    opacity: 0.7,
  },

  // Right Column
  rightCol: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  formCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formH1: {
    fontSize: 22,
    fontFamily: fonts.extraBold,
    fontWeight: '800',
    color: colors.maroonDark,
    letterSpacing: -0.3,
  },
  formSub: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.muted,
    marginTop: 4,
    marginBottom: 20,
  },
  togglePassRow: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  togglePassText: {
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.maroon,
    fontSize: 12,
  },
  demoBox: {
    backgroundColor: colors.cream,
    borderRadius: radius.sm,
    padding: 10,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoBoxTitle: {
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  demoBoxText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.text,
  },
  footerLinkWrap: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerLinkNormal: {
    fontFamily: fonts.regular,
    fontSize: 12.5,
    color: colors.muted,
  },
  footerLinkHighlight: {
    fontFamily: fonts.semiBold,
    fontWeight: '600',
    color: colors.maroon,
  },

  // Account Choices in Activate
  accountChoicesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  accountChoiceCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  accountChoiceCardActive: {
    borderColor: colors.maroon,
    borderWidth: 2,
    backgroundColor: '#FAF3E6',
  },
  accountChoiceCardDisabled: {
    opacity: 0.55,
    backgroundColor: '#F6F0E4',
  },
  accountChoiceName: {
    fontFamily: fonts.bold,
    fontWeight: '700',
    fontSize: 12.5,
    color: colors.text,
  },
  accountChoiceStatus: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    marginTop: 3,
  },
  activateBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
});
