import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { api, setAuthToken } from '../api';
import type { Customer } from '../types';

type Session = {
  customer: Customer | null;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setCustomer: (c: Customer | null) => void;
};

const Ctx = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);

  const login = useCallback(async (phone: string, password: string) => {
    const res = await api.login(phone, password);
    setAuthToken(res.token);
    setCustomer(res.customer);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setAuthToken(null);
      setCustomer(null);
    }
  }, []);

  const value = useMemo(() => ({ customer, login, logout, setCustomer }), [customer, login, logout]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useSession harus di dalam SessionProvider');
  return v;
}
