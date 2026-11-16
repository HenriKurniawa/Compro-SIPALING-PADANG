import React, { createContext, useContext, useMemo, useState } from 'react';
import { ADMINS, RIDERS, STOCK_IN, STOCK_OUT, PURCHASES, MENUS } from '../data/mock';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);
const uid = (p) => `${p}-${Date.now().toString().slice(-6)}`;
export const rupiah = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
export const today = () => new Date().toISOString().slice(0, 10);

export function AppProvider({ children }) {
  const [accounts, setAccounts] = useState(ADMINS);
  // Default masuk ke akun admin yang aktif agar langsung bisa review dashboard & operasional
  const [user, setUser] = useState(ADMINS[0] || null);
  const [route, setRoute] = useState({ name: 'dashboard', params: {} });
  const [stockIns, setStockIns] = useState(STOCK_IN);
  const [stockOuts, setStockOuts] = useState(STOCK_OUT);
  const [riders, setRiders] = useState(RIDERS);
  const [purchases] = useState(PURCHASES);

  const navigate = (name, params = {}) => setRoute({ name, params });

  // ---- Auth: hanya 2 akun admin (Kertajaya & Darmo) yang bisa diaktivasi ----
  const activate = ({ adminId, username, password }) => {
    setAccounts((a) =>
      a.map((x) => (x.id === adminId ? { ...x, activated: true, username, password } : x))
    );
  };

  const login = (username, password) => {
    const acc = accounts.find((a) => a.activated && a.username === username && a.password === password);
    if (!acc) return false;
    setUser(acc);
    navigate('dashboard');
    return true;
  };

  const logout = () => {
    setUser(null);
    navigate('login');
  };

  // ---- CRUD generik ----
  const crud = (setter, prefix) => ({
    add: (rec) => setter((l) => [{ ...rec, id: uid(prefix) }, ...l]),
    update: (id, rec) => setter((l) => l.map((x) => (x.id === id ? { ...x, ...rec } : x))),
    remove: (id) => setter((l) => l.filter((x) => x.id !== id)),
  });

  const stockInApi = useMemo(() => crud(setStockIns, 'IN'), []);
  const stockOutApi = useMemo(() => crud(setStockOuts, 'OUT'), []);
  const riderApi = useMemo(() => crud(setRiders, 'R'), []);

  // Stok gudang = total masuk - total dialokasikan
  const warehouseStock = useMemo(() => {
    const s = Object.fromEntries(MENUS.map((m) => [m.name, 0]));
    stockIns.forEach((r) => {
      r.items.forEach((i) => {
        s[i.menu] = (s[i.menu] || 0) + Number(i.qty || 0);
      });
    });
    stockOuts.forEach((r) => {
      r.items.forEach((i) => {
        s[i.menu] = (s[i.menu] || 0) - Number(i.qty || 0);
      });
    });
    return s;
  }, [stockIns, stockOuts]);

  const value = {
    accounts,
    user,
    route,
    navigate,
    activate,
    login,
    logout,
    stockIns,
    stockInApi,
    stockOuts,
    stockOutApi,
    riders,
    riderApi,
    purchases,
    warehouseStock,
    menus: MENUS,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
