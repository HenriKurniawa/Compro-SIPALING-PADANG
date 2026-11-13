import React, { useState } from 'react';
import { Pressable, TextInput, TextInputProps, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Txt, inputStyle } from './ui';
import { colors, fonts } from '../theme';

/** Kolom isian berlabel. `prefix` untuk +62, `secure` untuk password dengan tombol mata. */
export function Field({
  label,
  prefix,
  secure,
  hint,
  error,
  right,
  ...rest
}: TextInputProps & { label: string; prefix?: string; secure?: boolean; hint?: string; error?: string; right?: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <Txt weight="bold" size={14} color={colors.textDark}>
        {label}
      </Txt>
      <View
        style={[
          inputStyle,
          { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 0, overflow: 'hidden' },
          focus && { borderColor: colors.maroon },
          !!error && { borderColor: colors.danger },
        ]}
      >
        {prefix ? (
          <View style={{ alignSelf: 'stretch', justifyContent: 'center', paddingHorizontal: 12, backgroundColor: colors.cream2, borderRightWidth: 1.5, borderRightColor: colors.border }}>
            <Txt weight="bold" size={16} color={colors.text}>
              {prefix}
            </Txt>
          </View>
        ) : null}
        <TextInput
          placeholderTextColor="#A88B7E"
          secureTextEntry={secure && !show}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          accessibilityLabel={label}
          {...rest}
          style={{ flex: 1, minHeight: 50, paddingHorizontal: 14, fontFamily: fonts.regular, fontSize: 16, color: colors.text, outlineStyle: 'none' } as never}
        />
        {secure ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={show ? 'Sembunyikan password' : 'Tampilkan password'}
            onPress={() => setShow((v) => !v)}
            hitSlop={8}
            style={{ paddingHorizontal: 14, alignSelf: 'stretch', justifyContent: 'center' }}
          >
            <Feather name={show ? 'eye-off' : 'eye'} size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
        {right}
      </View>
      {error ? (
        <Txt size={13} weight="semibold" color={colors.danger}>
          {error}
        </Txt>
      ) : hint ? (
        <Txt size={13} color={colors.textMuted}>
          {hint}
        </Txt>
      ) : null}
    </View>
  );
}

/** Kotak centang sederhana. */
export function Checkbox({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 40 }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: colors.maroon,
          backgroundColor: value ? colors.maroon : colors.white,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {value ? <Feather name="check" size={14} color={colors.white} /> : null}
      </View>
      <Txt size={14} color={colors.text}>
        {label}
      </Txt>
    </Pressable>
  );
}

/** "0812…" / "812…" / "62812…" -> "62812…" */
export function toPhone62(input: string) {
  const d = input.replace(/\D/g, '');
  if (d.startsWith('62')) return d;
  if (d.startsWith('0')) return '62' + d.slice(1);
  return '62' + d;
}
export const isValidPhone = (input: string) => /^628\d{7,11}$/.test(toPhone62(input));
