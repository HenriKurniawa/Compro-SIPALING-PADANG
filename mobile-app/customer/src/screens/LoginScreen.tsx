import React, { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { AuthLayout } from '../components/AuthLayout';
import { Checkbox, Field, isValidPhone } from '../components/Field';
import { Button, ErrorBox, Sheet, SheetTitle, Txt } from '../components/ui';
import { useSession } from '../context/SessionContext';
import { USE_MOCK, errMsg } from '../api';
import { colors } from '../theme';
import type { ScreenProps } from '../navigation';

const CS_WHATSAPP = 'https://wa.me/6281100000000?text=Halo%20CS%20Sipaling%2C%20saya%20lupa%20password';

export default function LoginScreen({ navigation }: ScreenProps<'Login'>) {
  const { login } = useSession();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgot, setForgot] = useState(false);

  const ready = isValidPhone(phone) && password.length > 0;

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(phone, password);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Masuk sebagai pengguna" subtitle="Pakai nomor WhatsApp yang kamu daftarkan.">
      {USE_MOCK ? (
        <View style={{ backgroundColor: colors.cream2, borderRadius: 12, padding: 10 }}>
          <Txt size={13} color={colors.text}>
            Mode demo · Nomor <Txt weight="bold" size={13}>81234567890</Txt> · Password <Txt weight="bold" size={13}>naspad2026</Txt>
          </Txt>
        </View>
      ) : null}
      {error ? <ErrorBox message={error} /> : null}
      <Field
        label="Nomor WhatsApp"
        prefix="+62"
        placeholder="812 3456 7890"
        keyboardType="phone-pad"
        autoComplete="tel"
        value={phone}
        onChangeText={setPhone}
      />
      <Field label="Password" placeholder="Masukkan password" secure value={password} onChangeText={setPassword} onSubmitEditing={ready ? submit : undefined} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Checkbox label="Ingat perangkat ini" value={remember} onChange={setRemember} />
        <Pressable accessibilityRole="button" onPress={() => setForgot(true)} hitSlop={8}>
          <Txt weight="bold" size={14} color={colors.maroon}>
            Lupa password?
          </Txt>
        </Pressable>
      </View>
      <Button title="Masuk" variant="dark" size="lg" disabled={!ready} loading={loading} onPress={submit} />
      <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 4 }}>
        <Txt size={14} color={colors.textMuted}>
          Belum punya akun?
        </Txt>
        <Pressable accessibilityRole="link" onPress={() => navigation.navigate('Register')} hitSlop={8}>
          <Txt weight="extrabold" size={14} color={colors.maroon}>
            Daftar sekarang
          </Txt>
        </Pressable>
      </View>

      <Sheet visible={forgot} onClose={() => setForgot(false)}>
        <SheetTitle title="Lupa password?" onClose={() => setForgot(false)} />
        <Txt size={15} color={colors.textMuted} style={{ lineHeight: 22 }}>
          Hubungi Customer Service Sipaling lewat WhatsApp. Siapkan nomor yang kamu daftarkan, nanti CS bantu atur ulang password-mu.
        </Txt>
        <Button title="Chat CS via WhatsApp" icon="message-circle" variant="dark" onPress={() => Linking.openURL(CS_WHATSAPP)} />
      </Sheet>
    </AuthLayout>
  );
}
