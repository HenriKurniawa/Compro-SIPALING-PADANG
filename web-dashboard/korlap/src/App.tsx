import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { RidersProvider } from './context/RidersProvider';
import { useAuth } from './context/auth';
import { LoginPage } from './pages/LoginPage';
import { PetaRiderPage } from './pages/PetaRiderPage';
import { ProfilePage } from './pages/ProfilePage';

/** Hanya Korlap yang sudah login; data rider dimuat sekali untuk semua halaman terlindungi */
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <RidersProvider>{children}</RidersProvider>;
};

const GuestRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/" element={<ProtectedRoute><PetaRiderPage /></ProtectedRoute>} />
        <Route path="/profil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
