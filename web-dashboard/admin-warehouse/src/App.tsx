import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WarehouseProvider, useWarehouse } from './context/WarehouseContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import {
  LoginPage,
  ActivatePage,
  DashboardPage,
  StockInPage,
  StockInFormPage,
  StockInDetailPage,
  StockOutPage,
  StockOutFormPage,
  StockOutDetailPage,
  ReportsPage,
  RidersPage,
  ProfilePage,
} from './pages';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useWarehouse();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <DashboardLayout>{children}</DashboardLayout>;
};

// Auth Route Wrapper (redirects to home if already logged in)
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useWarehouse();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <WarehouseProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route
            path="/login"
            element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            }
          />
          <Route
            path="/activate"
            element={
              <AuthRoute>
                <ActivatePage />
              </AuthRoute>
            }
          />

          {/* Protected Dashboard Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock-in"
            element={
              <ProtectedRoute>
                <StockInPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock-in/new"
            element={
              <ProtectedRoute>
                <StockInFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock-in/:id"
            element={
              <ProtectedRoute>
                <StockInDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock-out"
            element={
              <ProtectedRoute>
                <StockOutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock-out/new"
            element={
              <ProtectedRoute>
                <StockOutFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock-out/:id"
            element={
              <ProtectedRoute>
                <StockOutDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/riders"
            element={
              <ProtectedRoute>
                <RidersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WarehouseProvider>
  );
};

export default App;
