import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import Layout from './src/components/Layout';
import { LoginScreen, ActivateScreen } from './src/screens/AuthScreens';
import Dashboard from './src/screens/Dashboard';
import { StockInList, StockInForm, StockInDetail } from './src/screens/StockIn';
import { StockOutList, StockOutForm, StockOutDetail } from './src/screens/StockOut';
import History from './src/screens/History';
import { ReportList, ReportDetail } from './src/screens/Reports';
import Riders from './src/screens/Riders';
import Profile from './src/screens/Profile';
import './src/theme'; // Mengaktifkan Plus Jakarta Sans & konfigurasi desain

// Peta nama route -> komponen. Tambah halaman baru cukup di sini.
const ROUTES = {
  dashboard: Dashboard,
  stockIn: StockInList,
  stockInForm: StockInForm,
  stockInDetail: StockInDetail,
  stockOut: StockOutList,
  stockOutForm: StockOutForm,
  stockOutDetail: StockOutDetail,
  history: History,
  reports: ReportList,
  reportDetail: ReportDetail,
  riders: Riders,
  profile: Profile,
};

function Root() {
  const { user, route } = useApp();
  if (!user) return route.name === 'activate' ? <ActivateScreen /> : <LoginScreen />;
  const Screen = ROUTES[route.name] || Dashboard;
  return (
    <Layout>
      <Screen {...route.params} />
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Root />
    </AppProvider>
  );
}
