import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, fonts, radius } from '../theme';

/* ---------- Teks ---------- */
type Weight = keyof typeof fonts;
export function Txt({
  weight = 'regular',
  size = 14,
  color = colors.text,
  style,
  ...rest
}: TextProps & { weight?: Weight; size?: number; color?: string }) {
  return <Text {...rest} style={[{ fontFamily: fonts[weight], fontSize: size, color }, style]} />;
}

/* ---------- Tombol ---------- */
type Variant = 'primary' | 'secondary' | 'dark' | 'danger' | 'ghost';
export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  icon,
  style,
  size = 'md',
}: {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ComponentProps<typeof Feather>['name'];
  style?: StyleProp<ViewStyle>;
  size?: 'md' | 'lg';
}) {
  const off = disabled || loading;
  const v = off ? btn.disabled : btn[variant];
  const fg = off ? colors.disabledFg : FG[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!off }}
      onPress={off ? undefined : onPress}
      style={({ pressed }) => [
        btn.base,
        size === 'lg' && btn.lg,
        v,
        pressed && !off && { opacity: 0.85, transform: [{ translateY: 1 }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon ? <Feather name={icon} size={size === 'lg' ? 20 : 18} color={fg} /> : null}
          <Txt weight="extrabold" size={size === 'lg' ? 17 : 15} color={fg}>
            {title}
          </Txt>
        </>
      )}
    </Pressable>
  );
}
const FG: Record<Variant, string> = {
  primary: colors.onOrange,
  secondary: colors.maroon,
  dark: colors.cream,
  danger: colors.danger,
  ghost: colors.maroon,
};
const btn = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  lg: { minHeight: 56 },
  primary: {
    backgroundColor: colors.orange,
    borderBottomWidth: 4,
    borderBottomColor: colors.orangeShadow,
  },
  secondary: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.maroon },
  dark: { backgroundColor: colors.maroon },
  danger: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.danger },
  ghost: { backgroundColor: 'transparent' },
  disabled: { backgroundColor: colors.disabledBg },
});

/* ---------- Label kecil (badge) ---------- */
export type Tone = 'green' | 'grey' | 'orange' | 'maroon' | 'cream';
const TONES: Record<Tone, [string, string]> = {
  green: [colors.greenBg, colors.greenFg],
  grey: [colors.greyBg, colors.greyFg],
  orange: [colors.orangeSoft, colors.orangeSoftFg],
  maroon: [colors.maroonSoft, colors.maroonSoftFg],
  cream: [colors.cream2, colors.text],
};
export function Pill({ label, tone = 'cream', style }: { label: string; tone?: Tone; style?: StyleProp<ViewStyle> }) {
  const [bg, fg] = TONES[tone];
  return (
    <View style={[{ backgroundColor: bg, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3, alignSelf: 'flex-start' }, style]}>
      <Txt weight="bold" size={11} color={fg}>
        {label}
      </Txt>
    </View>
  );
}

/* ---------- Tab bersegmen ---------- */
export function Segmented<K extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: K; label: string; count?: number }[];
  value: K;
  onChange: (k: K) => void;
}) {
  return (
    <View style={seg.wrap} accessibilityRole="tablist">
      {options.map((o) => {
        const on = o.key === value;
        return (
          <Pressable
            key={o.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o.key)}
            style={[seg.item, on && seg.on]}
          >
            <Txt weight="extrabold" size={14} color={on ? colors.maroonDark : colors.textMuted}>
              {o.label}
            </Txt>
            {o.count !== undefined ? (
              <View style={[seg.count, { backgroundColor: on ? colors.maroon : colors.border }]}>
                <Txt weight="bold" size={12} color={on ? colors.cream : colors.text}>
                  {o.count}
                </Txt>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
const seg = StyleSheet.create({
  wrap: { flexDirection: 'row', backgroundColor: colors.cream2, borderRadius: radius.md, padding: 5, gap: 6 },
  item: {
    flex: 1,
    minHeight: 40,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  on: { backgroundColor: colors.white, elevation: 1, shadowColor: '#3C140A', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  count: { minWidth: 20, paddingHorizontal: 6, borderRadius: 999, alignItems: 'center' },
});

/* ---------- Chip filter ---------- */
export function Chip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      onPress={onPress}
      style={{
        minHeight: 40,
        paddingHorizontal: 14,
        borderRadius: 999,
        borderWidth: 1.5,
        borderColor: on ? colors.maroon : colors.border,
        backgroundColor: on ? colors.maroon : colors.white,
        justifyContent: 'center',
      }}
    >
      <Txt weight="bold" size={14} color={on ? colors.cream : colors.text}>
        {label}
      </Txt>
    </Pressable>
  );
}

/* ---------- Toast ---------- */
export function useToast(duration = 3000) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = useCallback(
    (m: string) => {
      if (timer.current) clearTimeout(timer.current);
      setMessage(m);
      timer.current = setTimeout(() => setMessage(null), duration);
    },
    [duration],
  );
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  return { message, show, hide: () => setMessage(null) };
}

export function Toast({ message, bottom = 20, right }: { message: string | null; bottom?: number; right?: string }) {
  if (!message) return null;
  return (
    <View accessibilityLiveRegion="polite" style={[toast.box, { bottom }]} pointerEvents="none">
      <Feather name="check" size={18} color="#8FD07F" />
      <Txt weight="semibold" size={14} color={colors.cream} style={{ flex: 1 }}>
        {message}
      </Txt>
      {right ? (
        <Txt weight="extrabold" size={13} color={colors.orange}>
          {right}
        </Txt>
      ) : null}
    </View>
  );
}
const toast = StyleSheet.create({
  box: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: colors.toast,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 6,
  },
});

/* ---------- Modal bawah (bottom sheet) & tengah ---------- */
export function Sheet({
  visible,
  onClose,
  children,
  center,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <Modal visible={visible} transparent animationType={center ? 'fade' : 'slide'} onRequestClose={onClose} statusBarTranslucent>
      <View style={[sheet.overlay, center ? sheet.center : sheet.bottom]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Tutup" />
        <View style={center ? sheet.cardCenter : sheet.cardBottom}>{children}</View>
      </View>
    </Modal>
  );
}
const sheet = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay },
  bottom: { justifyContent: 'flex-end' },
  center: { justifyContent: 'center', padding: 20 },
  cardBottom: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    backgroundColor: colors.cream,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: 20,
    paddingBottom: 28,
    gap: 14,
  },
  cardCenter: { width: '100%', maxWidth: 440, alignSelf: 'center', backgroundColor: colors.cream, borderRadius: 22, padding: 20, gap: 14 },
});

export function SheetTitle({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <Txt weight="extrabold" size={21} color={colors.maroonDark} style={{ flex: 1 }}>
        {title}
      </Txt>
      <IconButton icon="x" label="Tutup" onPress={onClose} />
    </View>
  );
}

export function IconButton({
  icon,
  label,
  onPress,
  dark,
  style,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  onPress?: () => void;
  dark?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={6}
      style={[
        {
          width: 44,
          height: 44,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: dark ? 'rgba(255,248,236,0.14)' : colors.cream2,
        },
        style,
      ]}
    >
      <Feather name={icon} size={20} color={dark ? colors.cream : colors.maroonDark} />
    </Pressable>
  );
}

/* ---------- Dialog konfirmasi ---------- */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Batal',
  danger,
  loading,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Sheet visible={visible} onClose={onCancel} center>
      <Txt weight="extrabold" size={21} color={colors.maroonDark}>
        {title}
      </Txt>
      <Txt size={15} color={colors.textMuted} style={{ lineHeight: 22 }}>
        {message}
      </Txt>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
        <Button title={cancelLabel} variant="secondary" onPress={onCancel} style={{ flex: 1, borderColor: colors.border }} />
        <Button
          title={confirmLabel}
          variant="dark"
          loading={loading}
          onPress={onConfirm}
          style={[{ flex: 1 }, danger && { backgroundColor: colors.danger }]}
        />
      </View>
    </Sheet>
  );
}

/* ---------- Kartu ---------- */
export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View
      style={[
        { backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.cream2, padding: 16, gap: 12 },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function ErrorBox({ message, style }: { message: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View accessibilityRole="alert" style={[{ backgroundColor: colors.redBg, borderRadius: 12, padding: 12 }, style]}>
      <Txt weight="semibold" size={14} color={colors.redFg}>
        {message}
      </Txt>
    </View>
  );
}

export const inputStyle: TextStyle = {
  fontFamily: fonts.regular,
  fontSize: 16,
  color: colors.text,
  backgroundColor: colors.white,
  borderWidth: 1.5,
  borderColor: colors.border,
  borderRadius: radius.md,
  paddingHorizontal: 14,
  minHeight: 52,
};
