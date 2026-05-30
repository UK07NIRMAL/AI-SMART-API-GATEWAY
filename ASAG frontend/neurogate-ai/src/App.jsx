/**
 * App.jsx
 *
 * Root application component.
 * Sets up routing and wraps everything in the AuthProvider.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage    from './pages/LandingPage';
import AuthPage       from './pages/AuthPage';
import DashboardPage  from './pages/DashboardPage';
import PlaygroundPage from './pages/PlaygroundPage';
import ActivityLogs   from './pages/ActivityLogs';
import AdminPanel     from './pages/AdminPanel';
import SupportPage    from './pages/SupportPage';

// ─── Route Guard ──────────────────────────────────────────────────────────────

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant text-xs font-label uppercase tracking-widest">
            Initializing Gateway…
          </p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

// ─── App ──────────────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"      element={<LandingPage />} />
      <Route path="/auth"  element={<AuthPage />} />

      {/* Protected */}
      <Route path="/dashboard"  element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/playground" element={<PrivateRoute><PlaygroundPage /></PrivateRoute>} />
      <Route path="/logs"       element={<PrivateRoute><ActivityLogs /></PrivateRoute>} />
      <Route path="/admin"      element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
      <Route path="/support"    element={<PrivateRoute><SupportPage /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
