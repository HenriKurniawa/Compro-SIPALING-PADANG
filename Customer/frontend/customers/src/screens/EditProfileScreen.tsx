import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { Field } from '../components/Field';
import { Button, ErrorBox } from '../components/ui';
import { useSession } from '../context/SessionContext';
import { api, errMsg } from '../api';
import { colors } from '../theme';
import type { ScreenProps } from '../navigation';

export default function EditProfileScreen({ navigation }: ScreenProps<'EditProfile'>) {
  const { customer, setCustomer } = useSession();
  const [name, setName] = useState(customer?.name ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!customer) return null;

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      setCustomer(await api.updateProfile({ name: name.trim() }));
      navigation.goBack();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScreenHeader title="Ubah profil" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {error ? <ErrorBox message={error} /> : null}
        <Field label="Nama" value={name} onChangeText={setName} placeholder="Nama panggilanmu" />
        <Field
          label="Nomor Handphone"
          prefix="+62"
          value={customer.phone.replace(/^62/, '')}
          editable={false}
          hint="Untuk ganti nomor, hubungi Customer Service (perlu verifikasi OTP)."
        />
        <Button title="Simpan" variant="dark" size="lg" loading={busy} disabled={!name.trim() || name.trim() === customer.name} onPress={save} />
      </ScrollView>
    </View>
  );
}
