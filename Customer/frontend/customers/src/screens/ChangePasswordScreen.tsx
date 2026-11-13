import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { Field } from '../components/Field';
import { Button, ErrorBox } from '../components/ui';
import { api, errMsg } from '../api';
import { colors } from '../theme';
import type { ScreenProps } from '../navigation';

export default function ChangePasswordScreen({ navigation }: ScreenProps<'ChangePassword'>) {
  const [oldPw, setOldPw] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      await api.changePassword(oldPw, pw);
      navigation.goBack();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScreenHeader title="Ubah password" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {error ? <ErrorBox message={error} /> : null}
        <Field label="Password lama" secure value={oldPw} onChangeText={setOldPw} />
        <Field label="Password baru" secure value={pw} onChangeText={setPw} hint="Minimal 8 karakter" />
        <Field label="Ulangi password baru" secure value={pw2} onChangeText={setPw2} error={pw2 && pw !== pw2 ? 'Password tidak sama.' : undefined} />
        <Button title="Simpan" variant="dark" size="lg" loading={busy} disabled={!oldPw || pw.length < 8 || pw !== pw2} onPress={save} />
      </ScrollView>
    </View>
  );
}
