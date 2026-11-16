import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Admin, MenuItem, Rider, StockInBatch, StockOutBatch, PurchaseReport } from '../types';
import { ADMINS, MENUS, RIDERS, STOCK_IN, STOCK_OUT, PURCHASES } from '../data/mockData';

export const rupiah = (n: number) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

interface WarehouseContextType {
  user: Admin | null;
  accounts: Admin[];
  login: (u: string, p: string) => boolean;
  logout: () => void;
  activate: (data: { adminId: string; username: string; password: string }) => void;
  updatePassword: (oldPwd: string, newPwd: string) => { success: boolean; message?: string };
  stockIns: StockInBatch[];
  stockOuts: StockOutBatch[];
  riders: Rider[];
  menus: MenuItem[];
  purchases: PurchaseReport[];
  warehouseStock: Record<string, number>;
  addStockIn: (batch: Omit<StockInBatch, 'id'>) => StockInBatch;
  deleteStockIn: (id: string) => void;
  addStockOut: (batch: Omit<StockOutBatch, 'id'>) => StockOutBatch;
  deleteStockOut: (id: string) => void;
}

const WarehouseContext = createContext<WarehouseContextType | null>(null);

export const WarehouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Accounts
  const [accounts, setAccounts] = useState<Admin[]>(() => {
    try {
      const saved = localStorage.getItem('sipaling_warehouse_accounts');
      return saved ? JSON.parse(saved) : ADMINS;
    } catch {
      return ADMINS;
    }
  });

  // Current logged-in user
  const [user, setUser] = useState<Admin | null>(() => {
    try {
      const saved = localStorage.getItem('sipaling_admin');
      if (saved) {
        return JSON.parse(saved);
      }
      // Default to active admin (Kertajaya) for instant access
      return ADMINS[0];
    } catch {
      return ADMINS[0];
    }
  });

  // Stock In
  const [stockIns, setStockIns] = useState<StockInBatch[]>(() => {
    try {
      const saved = localStorage.getItem('sipaling_stock_ins');
      return saved ? JSON.parse(saved) : STOCK_IN;
    } catch {
      return STOCK_IN;
    }
  });

  // Stock Out
  const [stockOuts, setStockOuts] = useState<StockOutBatch[]>(() => {
    try {
      const saved = localStorage.getItem('sipaling_stock_outs');
      return saved ? JSON.parse(saved) : STOCK_OUT;
    } catch {
      return STOCK_OUT;
    }
  });

  const [riders] = useState<Rider[]>(RIDERS);
  const [menus] = useState<MenuItem[]>(MENUS);
  const [purchases] = useState<PurchaseReport[]>(PURCHASES);

  // Sync state changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('sipaling_admin', JSON.stringify(user));
    } else {
      localStorage.removeItem('sipaling_admin');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sipaling_warehouse_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('sipaling_stock_ins', JSON.stringify(stockIns));
  }, [stockIns]);

  useEffect(() => {
    localStorage.setItem('sipaling_stock_outs', JSON.stringify(stockOuts));
  }, [stockOuts]);

  // Auth actions
  const login = (u: string, p: string): boolean => {
    const acc = accounts.find(
      (a) => a.activated && a.username.toLowerCase() === u.trim().toLowerCase() && a.password === p
    );
    if (!acc) return false;
    setUser(acc);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const activate = ({ adminId, username, password }: { adminId: string; username: string; password: string }) => {
    const updated = accounts.map((a) => (a.id === adminId ? { ...a, activated: true, username, password } : a));
    setAccounts(updated);
    const target = updated.find((a) => a.id === adminId);
    if (target) {
      setUser(target);
    }
  };

  const updatePassword = (oldPwd: string, newPwd: string) => {
    if (!user) return { success: false, message: 'Tidak ada sesi aktif' };
    if (user.password && user.password !== oldPwd) {
      return { success: false, message: 'Password lama salah' };
    }
    const updatedUser = { ...user, password: newPwd };
    setUser(updatedUser);
    setAccounts((prev) => prev.map((a) => (a.id === user.id ? updatedUser : a)));
    return { success: true };
  };

  // Stock In Actions
  const addStockIn = (batch: Omit<StockInBatch, 'id'>): StockInBatch => {
    const newBatch: StockInBatch = {
      ...batch,
      id: `IN-${Date.now().toString().slice(-6)}`,
    };
    setStockIns((prev) => [newBatch, ...prev]);
    return newBatch;
  };

  const deleteStockIn = (id: string) => {
    setStockIns((prev) => prev.filter((b) => b.id !== id));
  };

  // Stock Out Actions
  const addStockOut = (batch: Omit<StockOutBatch, 'id'>): StockOutBatch => {
    const newBatch: StockOutBatch = {
      ...batch,
      id: `OUT-${Date.now().toString().slice(-6)}`,
    };
    setStockOuts((prev) => [newBatch, ...prev]);
    return newBatch;
  };

  const deleteStockOut = (id: string) => {
    setStockOuts((prev) => prev.filter((b) => b.id !== id));
  };

  // Remaining real stock in warehouse (total in - total out)
  const warehouseStock = useMemo(() => {
    const stock: Record<string, number> = {};
    menus.forEach((m) => {
      stock[m.name] = 0;
    });

    stockIns.forEach((batch) => {
      batch.items.forEach((item) => {
        stock[item.menu] = (stock[item.menu] || 0) + Number(item.qty || 0);
      });
    });

    stockOuts.forEach((batch) => {
      batch.items.forEach((item) => {
        stock[item.menu] = (stock[item.menu] || 0) - Number(item.qty || 0);
      });
    });

    return stock;
  }, [menus, stockIns, stockOuts]);

  return (
    <WarehouseContext.Provider
      value={{
        user,
        accounts,
        login,
        logout,
        activate,
        updatePassword,
        stockIns,
        stockOuts,
        riders,
        menus,
        purchases,
        warehouseStock,
        addStockIn,
        deleteStockIn,
        addStockOut,
        deleteStockOut,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};

export const useWarehouse = () => {
  const context = useContext(WarehouseContext);
  if (!context) {
    throw new Error('useWarehouse must be used within a WarehouseProvider');
  }
  return context;
};
