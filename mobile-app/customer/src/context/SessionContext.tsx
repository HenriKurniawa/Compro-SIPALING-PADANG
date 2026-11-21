import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken } from '../api';
import type { Customer } from '../types';

type Session = {
  customer: Customer | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setCustomer: (c: Customer | null) => void;
};

const Ctx = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@session_customer');
        if (raw) {
          const res = JSON.parse(raw);
          if (res?.token && res?.customer) {
            setAuthToken(res.token);
            setCustomer(res.customer);
          }
        }
      } catch (err) {
        console.error('Gagal memulihkan sesi customer:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (phone: string, password: string) => {
    const res = await api.login(phone, password);
    setAuthToken(res.token);
    setCustomer(res.customer);
    await AsyncStorage.setItem('@session_customer', JSON.stringify({ token: res.token, customer: res.customer }));
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      await AsyncStorage.removeItem('@session_customer');
      setAuthToken(null);
      setCustomer(null);
    }
  }, []);

  const updateCustomer = useCallback((c: Customer | null) => {
    setCustomer(c);
    (async () => {
      try {
        if (c) {
          const raw = await AsyncStorage.getItem('@session_customer');
          const data = raw ? JSON.parse(raw) : {};
          await AsyncStorage.setItem('@session_customer', JSON.stringify({ ...data, customer: c }));
        } else {
          await AsyncStorage.removeItem('@session_customer');
        }
      } catch {}
    })();
  }, []);

  const value = useMemo(
    () => ({ customer, loading, login, logout, setCustomer: updateCustomer }),
    [customer, loading, login, logout, updateCustomer],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useSession harus di dalam SessionProvider');
  return v;
}
