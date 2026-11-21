import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken } from '../api';
import type { Rider } from '../types';

type Session = {
  rider: Rider | null;
  working: boolean;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setWorking: (working: boolean) => Promise<void>;
};

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [rider, setRider] = useState<Rider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@session_rider');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.token && parsed?.rider) {
            setAuthToken(parsed.token);
            const isWorking = parsed.working !== undefined ? parsed.working : !!parsed.rider.isWorking;
            setRider({ ...parsed.rider, isWorking });
          }
        }
      } catch (err) {
        console.error('Gagal memulihkan sesi rider:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const res = await api.login(identifier, password);
    setAuthToken(res.token);
    setRider(res.rider);
    await AsyncStorage.setItem(
      '@session_rider',
      JSON.stringify({
        token: res.token,
        rider: res.rider,
        working: !!res.rider?.isWorking,
      }),
    );
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      await AsyncStorage.removeItem('@session_rider');
      setAuthToken(null);
      setRider(null);
    }
  }, []);

  const setWorking = useCallback(async (working: boolean) => {
    const updated = await api.setWorking(working);
    setRider(updated);
    try {
      const raw = await AsyncStorage.getItem('@session_rider');
      const current = raw ? JSON.parse(raw) : {};
      await AsyncStorage.setItem(
        '@session_rider',
        JSON.stringify({
          ...current,
          rider: updated,
          working: !!updated?.isWorking,
        }),
      );
    } catch (err) {
      console.error('Gagal memperbarui status kerja di storage:', err);
    }
  }, []);

  const value = useMemo(
    () => ({ rider, working: !!rider?.isWorking, loading, login, logout, setWorking }),
    [rider, loading, login, logout, setWorking],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession harus dipakai di dalam SessionProvider');
  return ctx;
}
