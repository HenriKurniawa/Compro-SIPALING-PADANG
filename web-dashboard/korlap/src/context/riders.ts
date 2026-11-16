import { createContext, useContext, useEffect, useState } from 'react';
import type { Rider } from '../types';

export interface RidersContextValue {
  riders: Rider[];
  loading: boolean;
  error: string | null;
}

export const RidersContext = createContext<RidersContextValue | null>(null);

export const useRiders = () => {
  const ctx = useContext(RidersContext);
  if (!ctx) throw new Error('useRiders harus dipakai di dalam <RidersProvider>');
  return ctx;
};

/** Timestamp yang ikut berdetak, untuk label "x dtk lalu" */
export const useNow = (intervalMs = 1000) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
};
