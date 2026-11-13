import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { ErrorBox, Pill, Txt } from '../components/ui';
import { api, errMsg } from '../api';
import { cartName, dateTime, itemsSummary, rupiah } from '../utils/format';
import { colors, radius } from '../theme';
import type { Order } from '../types';

export default function HistoryScreen() {
  const [list, setList] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      setList(await api.getHistory());
    } catch (e) {
      setError(errMsg(e));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScreenHeader title="Riwayat" subtitle="Pesanan yang sudah selesai" back={false} />
      {error ? <ErrorBox message={error} style={{ margin: 16 }} /> : null}
      {!list && !error ? <ActivityIndicator color={colors.maroon} style={{ marginTop: 40 }} /> : null}
      {list ? (
        <FlatList
          data={list}
          keyExtractor={(o) => o.id}
          contentContainerStyle={{ padding: 16, gap: 12, flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor={colors.maroon}
              onRefresh={async () => {
                setRefreshing(true);
                await load();
                setRefreshing(false);
              }}
            />
          }
          ListEmptyComponent={<Empty />}
          renderItem={({ item }) => <HistoryCard order={item} />}
        />
      ) : null}
    </View>
  );
}

function HistoryCard({ order }: { order: Order }) {
  const rejected = order.status === 'ditolak';
  return (
    <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.cream2, padding: 14, flexDirection: 'row', gap: 12 }}>
      <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: rejected ? colors.redBg : colors.cream2, alignItems: 'center', justifyContent: 'center' }}>
        <Feather name="shopping-cart" size={20} color={rejected ? colors.redFg : colors.maroon} />
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <Txt weight="extrabold" size={16} color={colors.textDark}>
            {cartName(order.cartId)}
          </Txt>
          <Pill label={rejected ? 'Ditolak' : 'Selesai'} tone={rejected ? 'maroon' : 'green'} />
        </View>
        <Txt size={14} color={colors.text} numberOfLines={2}>
          {itemsSummary(order.items)}
        </Txt>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
          <Txt size={13} color={colors.textMuted}>
            {dateTime(order.createdAt)} · {order.type === 'antar' ? 'Diantar' : 'Pick Up'}
          </Txt>
          <Txt weight="extrabold" size={14} color={colors.maroonDark}>
            {rupiah(order.total)}
          </Txt>
        </View>
        {rejected && order.rejectReason ? (
          <Txt size={13} color={colors.redFg}>
            Alasan: {order.rejectReason}
          </Txt>
        ) : null}
      </View>
    </View>
  );
}

function Empty() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24 }}>
      <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.cream2, alignItems: 'center', justifyContent: 'center' }}>
        <Feather name="shopping-bag" size={42} color={colors.maroon} />
      </View>
      <Txt weight="extrabold" size={18} color={colors.maroonDark}>
        Belum ada pesanan
      </Txt>
      <Txt size={14} color={colors.textMuted} style={{ textAlign: 'center' }}>
        Pesanan yang sudah selesai akan muncul di sini.
      </Txt>
    </View>
  );
}
