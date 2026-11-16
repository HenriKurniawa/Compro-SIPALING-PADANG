import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { korlapApi } from '../api';
import type { Rider } from '../types';
import { RidersContext } from './riders';

/** Memuat daftar rider wilayah Korlap dan menerapkan pembaruan GPS real-time. */
export const RidersProvider = ({ children }: { children: ReactNode }) => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    korlapApi
      .getRiders()
      .then((data) => !cancelled && setRiders(data))
      .catch((e: Error) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));

    const unsubscribe = korlapApi.subscribeRiderUpdates((updated) => {
      setRiders((prev) => {
        const exists = prev.some((r) => r.id === updated.id);
        return exists ? prev.map((r) => (r.id === updated.id ? updated : r)) : [...prev, updated];
      });
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({ riders, loading, error }), [riders, loading, error]);
  return <RidersContext.Provider value={value}>{children}</RidersContext.Provider>;
};
