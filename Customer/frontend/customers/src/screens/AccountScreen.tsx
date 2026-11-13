import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { Field } from '../components/Field';
import { Button, ConfirmDialog, ErrorBox, Sheet, SheetTitle, Txt } from '../components/ui';
import { useSession } from '../context/SessionContext';
import { useOrder } from '../context/OrderContext';
import { api, errMsg, setAuthToken } from '../api';
import { initials } from '../utils/format';
import { colors, radius } from '../theme';
import type { RootStackParamList } from '../navigation';

const CS_WHATSAPP = 'https://wa.me/6281100000000?text=Halo%20CS%20Sipaling';

export default function AccountScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { customer, logout, setCustomer } = useSession();
  const { loyalty } = useOrder();
  const [askLogout, setAskLogout] = useState(false);
  const [askDelete, setAskDelete] = useState(false);
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!customer) return null;

  const doLogout = async () => {
    setBusy(true);
    await logout();
    setBusy(false);
  };
  const doDelete = async () => {
    setBusy(true);
    setError(null);
    try {
      await api.deleteAccount(pw);
      setAuthToken(null);
      setCustomer(null);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScreenHeader title="Akun" back={false} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        <View style={{ backgroundColor: colors.maroon, borderRadius: radius.lg, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center' }}>
            <Txt weight="extrabold" size={20} color={colors.maroon}>
              {initials(customer.name)}
            </Txt>
          </View>
          <View style={{ flex: 1 }}>
            <Txt weight="extrabold" size={19} color={colors.cream}>
              {customer.name}
            </Txt>
            <Txt size={14} color={colors.cream} style={{ opacity: 0.85 }}>
              +{customer.phone}
            </Txt>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ubah profil"
            onPress={() => nav.navigate('EditProfile')}
            style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,248,236,0.14)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Feather name="edit-2" size={19} color={colors.cream} />
          </Pressable>
        </View>

        <Group>
          <Item icon="award" label="Cek Poin" value={`${loyalty?.points ?? 0} poin`} onPress={() => nav.navigate('Points')} />
          <Item icon="lock" label="Password" value="Ubah" onPress={() => nav.navigate('ChangePassword')} />
        </Group>

        <Txt weight="extrabold" size={15} color={colors.textMuted} style={{ marginTop: 4 }}>
          Lainnya
        </Txt>
        <Group>
          <Item icon="headphones" label="Hubungi Customer Service" onPress={() => Linking.openURL(CS_WHATSAPP)} />
          <Item icon="trash-2" label="Hapus akun" danger onPress={() => setAskDelete(true)} />
          <Item icon="log-out" label="Keluar" danger onPress={() => setAskLogout(true)} />
        </Group>
        <Txt size={12} color={colors.textMuted} style={{ textAlign: 'center' }}>
          Sipaling NasPad · versi 1.0.0
        </Txt>
      </ScrollView>

      <ConfirmDialog
        visible={askLogout}
        title="Keluar dari akun?"
        message="Kamu perlu masuk lagi dengan nomor WhatsApp dan password untuk memesan."
        confirmLabel="Keluar"
        danger
        loading={busy}
        onConfirm={doLogout}
        onCancel={() => setAskLogout(false)}
      />
      <Sheet visible={askDelete} onClose={() => setAskDelete(false)}>
        <SheetTitle title="Hapus akun?" onClose={() => setAskDelete(false)} />
        <Txt size={15} color={colors.textMuted} style={{ lineHeight: 22 }}>
          Akun, riwayat, dan poinmu akan dihapus permanen. Masukkan password untuk melanjutkan.
        </Txt>
        {error ? <ErrorBox message={error} /> : null}
        <Field label="Password" secure value={pw} onChangeText={setPw} placeholder="Password akunmu" />
        <Button title="Hapus akun permanen" variant="danger" loading={busy} disabled={!pw} onPress={doDelete} />
      </Sheet>
    </View>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.cream2, overflow: 'hidden' }}>{children}</View>;
}

function Item({
  icon,
  label,
  value,
  danger,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value?: string;
  danger?: boolean;
  onPress: () => void;
}) {
  const fg = danger ? colors.danger : colors.textDark;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        minHeight: 56,
        borderBottomWidth: 1,
        borderBottomColor: colors.cream2,
        backgroundColor: pressed ? colors.cream : colors.white,
      })}
    >
      <Feather name={icon} size={20} color={danger ? colors.danger : colors.maroon} />
      <Txt weight="semibold" size={15} color={fg} style={{ flex: 1 }}>
        {label}
      </Txt>
      {value ? (
        <Txt size={14} color={colors.textMuted}>
          {value}
        </Txt>
      ) : null}
      <Feather name="chevron-right" size={18} color={colors.textMuted} />
    </Pressable>
  );
}
