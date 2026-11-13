import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { api, setAuthToken } from '../api';
import type { Rider } from '../types';

type Session = {
  rider: Rider | null;
  working: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setWorking: (working: boolean) => Promise<void>;
};

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [rider, setRider] = useState<Rider | null>(null);

  const login = useCallback(async (identifier: string, password: string) => {
    const res = await api.login(identifier, password);
    setAuthToken(res.token);
    setRider(res.rider);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setAuthToken(null);
      setRider(null);
    }
  }, []);

  const setWorking = useCallback(async (working: boolean) => {
    const updated = await api.setWorking(working);
    setRider(updated);
  }, []);

  const value = useMemo(
    () => ({ rider, working: !!rider?.isWorking, login, logout, setWorking }),
    [rider, login, logout, setWorking],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession harus dipakai di dalam SessionProvider');
  return ctx;
}
