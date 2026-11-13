import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AuthLayout } from '../components/AuthLayout';
import { Field, isValidPhone, toPhone62 } from '../components/Field';
import { Button, ErrorBox, Txt } from '../components/ui';
import { useSession } from '../context/SessionContext';
import { USE_MOCK, api, errMsg } from '../api';
import { colors } from '../theme';
import type { ScreenProps } from '../navigation';

type Step = 'form' | 'otp' | 'password' | 'done';

export default function RegisterScreen({ navigation }: ScreenProps<'Register'>) {
  const { login } = useSession();
  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (fn: () => Promise<void>) => {
    setError(null);
    setLoading(true);
    try {
      await fn();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = () =>
    run(async () => {
      await api.requestRegisterOtp(name.trim(), toPhone62(phone));
      setCode('');
      setStep('otp');
    });
  const verify = () =>
    run(async () => {
      const r = await api.verifyRegisterOtp(toPhone62(phone), code);
      setToken(r.registrationToken);
      setStep('password');
    });
  const finish = () =>
    run(async () => {
      await api.completeRegistration(token, pw);
      setStep('done');
    });

  const pwError = pw2.length > 0 && pw !== pw2 ? 'Password tidak sama.' : undefined;
  const titles: Record<Step, [string, string]> = {
    form: ['Daftar akun', 'Gratis! Daftar sekarang dan dapatkan 1 poin pertamamu.'],
    otp: ['Masukkan kode OTP', `Kode 6 angka sudah dikirim lewat WhatsApp ke +${toPhone62(phone)}.`],
    password: ['Buat password', 'Minimal 8 karakter. Dipakai setiap kali kamu masuk.'],
    done: ['Akun berhasil dibuat', 'Selamat datang di Sipaling! 1 poin sudah masuk ke kartumu.'],
  };

  return (
    <AuthLayout title={titles[step][0]} subtitle={titles[step][1]}>
      <Steps step={step} />
      {error ? <ErrorBox message={error} /> : null}

      {step === 'form' ? (
        <>
          <Field label="Nama" placeholder="Nama panggilanmu" value={name} onChangeText={setName} autoComplete="name" />
          <Field label="Nomor WhatsApp" prefix="+62" placeholder="812 3456 7890" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          <Button title="Kirim kode OTP" variant="dark" size="lg" disabled={!name.trim() || !isValidPhone(phone)} loading={loading} onPress={sendOtp} />
        </>
      ) : null}

      {step === 'otp' ? (
        <>
          <Field
            label="Kode OTP"
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
            value={code}
            onChangeText={(t) => setCode(t.replace(/\D/g, ''))}
            hint={USE_MOCK ? 'Mode demo: kodenya 123456' : undefined}
            autoComplete="one-time-code"
          />
          <Button title="Verifikasi" variant="dark" size="lg" disabled={code.length !== 6} loading={loading} onPress={verify} />
          <Button title="Kirim ulang kode" variant="ghost" onPress={sendOtp} disabled={loading} />
        </>
      ) : null}

      {step === 'password' ? (
        <>
          <Field label="Password" placeholder="Minimal 8 karakter" secure value={pw} onChangeText={setPw} />
          <Field label="Ulangi password" placeholder="Ketik ulang password" secure value={pw2} onChangeText={setPw2} error={pwError} />
          <Button title="Buat akun" variant="dark" size="lg" disabled={pw.length < 8 || pw !== pw2} loading={loading} onPress={finish} />
        </>
      ) : null}

      {step === 'done' ? (
        <>
          <View style={{ alignItems: 'center', paddingVertical: 8 }}>
            <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: colors.greenBg, alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="check" size={40} color={colors.greenDot} />
            </View>
          </View>
          <Button title="Masuk sekarang" variant="dark" size="lg" loading={loading} onPress={() => run(() => login(phone, pw))} />
        </>
      ) : null}

      {step !== 'done' ? (
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
          <Txt size={14} color={colors.textMuted}>
            Sudah punya akun?
          </Txt>
          <Pressable accessibilityRole="link" onPress={() => navigation.goBack()} hitSlop={8}>
            <Txt weight="extrabold" size={14} color={colors.maroon}>
              Masuk
            </Txt>
          </Pressable>
        </View>
      ) : null}
    </AuthLayout>
  );
}

function Steps({ step }: { step: Step }) {
  const order: Step[] = ['form', 'otp', 'password', 'done'];
  const idx = order.indexOf(step);
  return (
    <View style={{ flexDirection: 'row', gap: 6 }} accessibilityLabel={`Langkah ${idx + 1} dari 4`}>
      {order.map((s, i) => (
        <View key={s} style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: i <= idx ? colors.maroon : colors.border }} />
      ))}
    </View>
  );
}
