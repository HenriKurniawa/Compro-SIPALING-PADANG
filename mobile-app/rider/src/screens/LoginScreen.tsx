import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Button, ErrorBox, Sheet, SheetTitle, Txt, inputStyle } from '../components/ui';
import { GonjongCart, MotifBackground, GOLD } from '../components/Brand';
import { colors } from '../theme';
import { useSession } from '../context/SessionContext';
import { USE_MOCK } from '../api';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useSession();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [forgot, setForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = identifier.trim().length > 0 && password.length > 0;

  const submit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      await login(identifier.trim(), password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal masuk. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const border = error ? { borderColor: colors.danger, borderWidth: 2 } : null;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.maroon }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <MotifBackground />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={[s.top, { paddingTop: insets.top + 32 }]}>
          <GonjongCart width={170} />
          <Txt weight="extrabold" size={26} color={colors.cream} style={{ letterSpacing: 3 }}>
            SIPALING
          </Txt>
          <Txt weight="semibold" size={13} color={GOLD}>
            NasPad · Aplikasi Rider
          </Txt>
        </View>

        <View style={[s.card, { paddingBottom: insets.bottom + 24 }]}>
          <View>
            <Txt weight="extrabold" size={24} color={colors.maroonDark} accessibilityRole="header">
              Masuk sebagai riders
            </Txt>
            <Txt size={14} color={colors.textMuted} style={{ marginTop: 4 }}>
              Pakai akun yang dibuat oleh admin gudang.
            </Txt>
          </View>

          {USE_MOCK ? (
            <View style={{ backgroundColor: colors.cream2, borderRadius: 12, padding: 10 }}>
              <Txt size={13}>
                Mode demo · <Txt weight="bold" size={13}>081234567890</Txt> / <Txt weight="bold" size={13}>naspad2026</Txt>
              </Txt>
            </View>
          ) : null}
          {error ? <ErrorBox message={error} /> : null}

          <View style={{ gap: 6 }}>
            <Txt weight="bold" size={14} color={colors.textDark} nativeID="lbl-id">
              Nomor HP / Username
            </Txt>
            <TextInput
              accessibilityLabel="Nomor HP / Username"
              accessibilityLabelledBy="lbl-id"
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="Contoh: 081234567890"
              placeholderTextColor="#A08A80"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              returnKeyType="next"
              style={[inputStyle, border]}
            />
          </View>

          <View style={{ gap: 6 }}>
            <Txt weight="bold" size={14} color={colors.textDark} nativeID="lbl-pw">
              Password
            </Txt>
            <View style={[s.passWrap, border]}>
              <TextInput
                accessibilityLabel="Password"
                accessibilityLabelledBy="lbl-pw"
                value={password}
                onChangeText={setPassword}
                placeholder="Masukkan password"
                placeholderTextColor="#A08A80"
                secureTextEntry={!show}
                autoCapitalize="none"
                autoComplete="current-password"
                returnKeyType="go"
                onSubmitEditing={submit}
                style={[inputStyle, { flex: 1, borderWidth: 0, minHeight: 50 }]}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={show ? 'Sembunyikan password' : 'Tampilkan password'}
                onPress={() => setShow((v) => !v)}
                style={{ width: 52, alignItems: 'center', justifyContent: 'center' }}
              >
                <Feather name={show ? 'eye-off' : 'eye'} size={22} color={colors.textMuted} />
              </Pressable>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: remember }}
              onPress={() => setRemember((v) => !v)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 40 }}
            >
              <View style={[s.box, remember && { backgroundColor: colors.maroon }]}>
                {remember ? <Feather name="check" size={14} color={colors.white} /> : null}
              </View>
              <Txt size={14}>Ingat perangkat ini</Txt>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => setForgot(true)} hitSlop={8}>
              <Txt weight="bold" size={14} color={colors.maroon}>
                Lupa password?
              </Txt>
            </Pressable>
          </View>

          <View style={{ flex: 1, minHeight: 8 }} />
          <Button title="Masuk" variant="dark" size="lg" onPress={submit} loading={loading} disabled={!canSubmit} />
          <Txt size={13} color={colors.textMuted} style={{ textAlign: 'center' }}>
            Belum punya akun? Hubungi admin gudang Kertajaya / Darmo.
          </Txt>
        </View>
      </ScrollView>

      <Sheet visible={forgot} onClose={() => setForgot(false)}>
        <SheetTitle title="Lupa password?" onClose={() => setForgot(false)} />
        <Txt size={15} color={colors.textMuted} style={{ lineHeight: 22 }}>
          Akun rider dibuat dan diatur oleh admin gudang. Minta admin gudang Kertajaya / Darmo untuk mengatur ulang password-mu, lalu masuk lagi dengan password baru.
        </Txt>
        <Button title="Mengerti" variant="dark" onPress={() => setForgot(false)} />
      </Sheet>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  top: { alignItems: 'center', paddingBottom: 26, gap: 10 },
  card: {
    flex: 1,
    backgroundColor: colors.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 24,
    gap: 16,
  },
  passWrap: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    overflow: 'hidden',
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.maroon,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
