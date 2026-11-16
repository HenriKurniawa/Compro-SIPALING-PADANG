import { useWarehouse } from './WarehouseContext';

export const useAuth = () => {
  const { user, login, logout, activate, updatePassword, accounts } = useWarehouse();
  return {
    user,
    login,
    logout,
    activate,
    updatePassword,
    accounts,
  };
};

export { WarehouseProvider as AuthProvider } from './WarehouseContext';
