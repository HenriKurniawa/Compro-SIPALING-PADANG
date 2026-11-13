import React from 'react';
import { ScrollView, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { Txt } from '../components/ui';
import { useOrder } from '../context/OrderContext';
import { colors, radius } from '../theme';

export default function PointsScreen() {
  const { loyalty } = useOrder();
  const points = loyalty?.points ?? 0;
  const target = loyalty?.target ?? 10;
  const rewards = loyalty?.rewards ?? 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScreenHeader title="Cek Poin" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View style={{ backgroundColor: colors.maroon, borderRadius: radius.lg, padding: 18, gap: 6 }}>
          <Txt size={14} color={colors.cream} style={{ opacity: 0.85 }}>
            Poin kamu sekarang
          </Txt>
          <Txt weight="extrabold" size={36} color={colors.cream}>
            {points} poin
          </Txt>
          <Txt size={14} color={colors.cream} style={{ opacity: 0.85 }}>
            {target - points} transaksi lagi untuk gratis 1 paket nasi + lauk.
          </Txt>
        </View>

        {rewards > 0 ? (
          <View style={{ backgroundColor: colors.greenBg, borderRadius: radius.lg, padding: 14, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Feather name="gift" size={24} color={colors.greenFg} />
            <Txt weight="bold" size={14} color={colors.greenFg} style={{ flex: 1 }}>
              Kamu punya {rewards} paket gratis! Tunjukkan halaman ini ke rider saat memesan.
            </Txt>
          </View>
        ) : null}

        <Txt weight="extrabold" size={17} color={colors.maroonDark}>
          Kartu stempel
        </Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 }} accessibilityLabel={`${points} dari ${target} stempel`}>
          {Array.from({ length: target }, (_, i) => {
            const last = i === target - 1;
            const filled = i < points;
            return (
              <View
                key={i}
                style={{
                  width: '18%',
                  aspectRatio: 1,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderStyle: filled ? 'solid' : 'dashed',
                  borderColor: last ? '#E9B44C' : filled ? colors.maroon : colors.border,
                  backgroundColor: last ? '#FFF1D6' : filled ? colors.maroon : colors.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 4,
                }}
              >
                {last ? (
                  <>
                    <Feather name="gift" size={16} color={colors.maroon} />
                    <Txt weight="extrabold" size={9} color={colors.maroon} style={{ textAlign: 'center' }}>
                      Nasi + lauk Gratis
                    </Txt>
                  </>
                ) : filled ? (
                  <Feather name="check" size={22} color={colors.cream} />
                ) : (
                  <Txt weight="bold" size={14} color={colors.border}>
                    {i + 1}
                  </Txt>
                )}
              </View>
            );
          })}
        </View>

        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.cream2, padding: 14, gap: 10 }}>
          <Txt weight="extrabold" size={15} color={colors.textDark}>
            Cara dapat poin
          </Txt>
          <Tip text="Setiap pesanan yang selesai = 1 poin." />
          <Tip text="Beli langsung di gerobak? Sebutkan nomor WhatsApp-mu ke rider supaya tetap dapat poin." />
          <Tip text={`Kumpulkan ${target} poin, tukar dengan 1 paket nasi + lauk gratis.`} />
        </View>
      </ScrollView>
    </View>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Feather name="check-circle" size={16} color={colors.greenDot} style={{ marginTop: 2 }} />
      <Txt size={14} color={colors.text} style={{ flex: 1, lineHeight: 20 }}>
        {text}
      </Txt>
    </View>
  );
}
