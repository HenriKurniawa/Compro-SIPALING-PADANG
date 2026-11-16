import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Field, Select, Button } from './ui';
import { useApp } from '../context/AppContext';
import { colors, fonts, radius } from '../theme';

// Baris dinamis menu + jumlah (+ catatan). Dipakai di Stok Masuk & Alokasi Stok Keluar.
export default function ItemRows({ items = [], onChange, withNote, stockHint }) {
  const { menus, warehouseStock } = useApp();
  const opts = menus.map((m) => ({ value: m.name, label: m.name }));

  const set = (i, patch) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const totalQty = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  return (
    <View>
      {items.map((it, i) => {
        const available = it.menu ? warehouseStock[it.menu] ?? 0 : null;
        const isOverStock = stockHint && it.menu && Number(it.qty) > available;

        return (
          <View key={i} style={s.rowWrap}>
            {/* Menu Dropdown */}
            <Select
              label={i === 0 ? 'Pilihan Menu' : undefined}
              value={it.menu}
              options={opts}
              onChange={(v) => set(i, { menu: v })}
              placeholder="Pilih menu Padang"
              style={{ flex: 2.2 }}
            />

            {/* Qty Input */}
            <View style={{ flex: 1.2 }}>
              <Field
                label={i === 0 ? 'Jumlah (porsi)' : undefined}
                keyboardType="numeric"
                value={String(it.qty ?? '')}
                onChangeText={(v) => set(i, { qty: v.replace(/[^0-9]/g, '') })}
                placeholder="0"
                hint={
                  stockHint && it.menu
                    ? isOverStock
                      ? `Melebihi stok! (Tersisa: ${available} porsi)`
                      : `Tersedia: ${available} porsi`
                    : undefined
                }
              />
            </View>

            {/* Optional Note */}
            {withNote && (
              <Field
                label={i === 0 ? 'Catatan Khusus' : undefined}
                value={it.note}
                onChangeText={(v) => set(i, { note: v })}
                placeholder="Contoh: batch pagi / pedas"
                style={{ flex: 2 }}
              />
            )}

            {/* Delete Row Button */}
            <TouchableOpacity
              onPress={() => onChange(items.filter((_, idx) => idx !== i))}
              disabled={items.length === 1}
              style={[
                s.deleteBtn,
                { marginTop: i === 0 ? 25 : 4 },
                items.length === 1 && { opacity: 0.3 },
                Platform.OS === 'web' && { cursor: items.length === 1 ? 'not-allowed' : 'pointer' },
              ]}
              title="Hapus baris"
            >
              <Text style={s.deleteBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      {/* Footer: Add row button and live counter summary */}
      <View style={s.footerRow}>
        <Button
          small
          variant="ghost"
          label="+ Tambah Menu Lain"
          onPress={() => onChange([...items, { menu: '', qty: '', note: '' }])}
        />

        {totalQty > 0 && (
          <View style={s.summaryPill}>
            <Text style={s.summaryText}>
              Total alokasi:{' '}
              <Text style={{ fontFamily: fonts.bold, fontWeight: '700', color: colors.maroonDark }}>
                {totalQty} porsi
              </Text>
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 4,
  },
  deleteBtn: {
    width: 38,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dangerBorder,
  },
  deleteBtnText: {
    color: colors.danger,
    fontSize: 14,
    fontFamily: fonts.bold,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  summaryPill: {
    backgroundColor: colors.cream,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
});
