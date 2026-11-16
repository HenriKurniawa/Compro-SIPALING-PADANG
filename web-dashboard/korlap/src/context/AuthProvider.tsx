import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { korlapApi } from '../api';
import { TOKEN_KEY } from '../api/client';
import type { Korlap } from '../types';
import { AuthContext } from './auth';

const USER_KEY = 'sipaling_korlap_user';

const readStoredUser = (): Korlap | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw && localStorage.getItem(TOKEN_KEY) ? (JSON.parse(raw) as Korlap) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Korlap | null>(readStoredUser);

  const login = useCallback(async (username: string, password: string) => {
    const { user: loggedIn, token } = await korlapApi.login(username, password);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(loggedIn));
    setUser(loggedIn);
  }, []);

  const logout = useCallback(async () => {
    try {
      await korlapApi.logout();
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
    }
  }, []);

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      if (!user) throw new Error('Sesi berakhir, silakan masuk lagi.');
      await korlapApi.changePassword(user.username, oldPassword, newPassword);
    },
    [user],
  );

  const value = useMemo(() => ({ user, login, logout, changePassword }), [user, login, logout, changePassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
