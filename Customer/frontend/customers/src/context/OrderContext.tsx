import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api';
import { useSession } from './SessionContext';
import type { Cart, Loyalty, MenuItem, Order } from '../types';

export type BasketLine = { item: MenuItem; qty: number };

type OrderState = {
  /** Keranjang: gerobak terpilih + menu yang ditambahkan. */
  cart: Cart | null;
  basket: Record<string, BasketLine>;
  pickCart: (c: Cart) => void;
  setQty: (item: MenuItem, qty: number) => void;
  clearBasket: () => void;
  basketTotal: number;
  basketCount: number;

  /** Pesanan yang sedang berjalan (dipantau tiap 4 detik). */
  active: Order | null;
  setActive: (o: Order | null) => void;
  refreshActive: () => Promise<void>;

  loyalty: Loyalty | null;
  refreshLoyalty: () => Promise<void>;
};

const Ctx = createContext<OrderState | null>(null);
const FINISHED = ['selesai', 'ditolak'];

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { customer } = useSession();
  const [cart, setCart] = useState<Cart | null>(null);
  const [basket, setBasket] = useState<Record<string, BasketLine>>({});
  const [active, setActive] = useState<Order | null>(null);
  const [loyalty, setLoyalty] = useState<Loyalty | null>(null);
  const activeRef = useRef<Order | null>(null);
  activeRef.current = active;

  const pickCart = useCallback((c: Cart) => {
    setCart((prev) => {
      if (prev?.id !== c.id) setBasket({}); // ganti gerobak = keranjang dikosongkan
      return c;
    });
  }, []);

  const setQty = useCallback((item: MenuItem, qty: number) => {
    setBasket((b) => {
      const next = { ...b };
      if (qty <= 0) delete next[item.id];
      else next[item.id] = { item, qty: Math.min(qty, item.stock) };
      return next;
    });
  }, []);

  const clearBasket = useCallback(() => setBasket({}), []);

  const refreshLoyalty = useCallback(async () => {
    try {
      setLoyalty(await api.getLoyalty());
    } catch {
      /* diamkan: kartu poin tetap memakai data lama */
    }
  }, []);

  const refreshActive = useCallback(async () => {
    const cur = activeRef.current;
    try {
      if (cur) {
        const o = await api.getOrder(cur.id);
        setActive(o);
        if (o.status === 'selesai' && cur.status !== 'selesai') refreshLoyalty();
      } else {
        setActive(await api.getActiveOrder());
      }
    } catch {
      /* jaringan putus sebentar: coba lagi di putaran berikutnya */
    }
  }, [refreshLoyalty]);

  // Saat login: ambil pesanan aktif & poin. Saat logout: kosongkan semuanya.
  useEffect(() => {
    if (customer) {
      refreshActive();
      refreshLoyalty();
    } else {
      setActive(null);
      setLoyalty(null);
      setBasket({});
      setCart(null);
    }
  }, [customer, refreshActive, refreshLoyalty]);

  // Pantau status pesanan aktif (nanti bisa diganti push FCM / WebSocket).
  const polling = !!active && !FINISHED.includes(active.status);
  useEffect(() => {
    if (!polling) return;
    const t = setInterval(refreshActive, 4000);
    return () => clearInterval(t);
  }, [polling, refreshActive]);

  const lines = Object.values(basket);
  const basketTotal = lines.reduce((s, l) => s + l.qty * l.item.price, 0);
  const basketCount = lines.reduce((s, l) => s + l.qty, 0);

  const value = useMemo(
    () => ({
      cart,
      basket,
      pickCart,
      setQty,
      clearBasket,
      basketTotal,
      basketCount,
      active,
      setActive,
      refreshActive,
      loyalty,
      refreshLoyalty,
    }),
    [cart, basket, pickCart, setQty, clearBasket, basketTotal, basketCount, active, refreshActive, loyalty, refreshLoyalty],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOrder() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useOrder harus di dalam OrderProvider');
  return v;
}

export const isFinished = (o: Order | null) => !o || FINISHED.includes(o.status);
