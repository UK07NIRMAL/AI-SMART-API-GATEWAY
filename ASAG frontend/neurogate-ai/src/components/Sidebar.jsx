/**
 * components/Sidebar.jsx
 *
 * Fixed left navigation sidebar used on all authenticated pages.
 * Highlights the active route and supports mobile toggle via `isOpen` prop.
 */

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard',  label: 'Dashboard',  icon: 'dashboard' },
  { to: '/playground', label: 'Playground', icon: 'science' },
  { to: '/logs',       label: 'Logs',       icon: 'database' },
  { to: '/admin',      label: 'Admin',      icon: 'admin_panel_settings' },
  { to: '/support',    label: 'Support',    icon: 'contact_support' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 h-screen w-64 bg-surface-container-low
          flex flex-col py-8 z-40 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="px-6 mb-12">
          <h1 className="text-lg font-bold text-primary font-headline tracking-tight">
            NeuroGate AI
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mt-1 font-label">
            Precision Gateway
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-4 text-xs font-label font-medium
                 uppercase tracking-widest transition-all duration-200
                 ${
                   isActive
                     ? 'bg-surface-container-highest text-primary border-l-2 border-primary power-rail-active'
                     : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/40 border-l-2 border-transparent'
                 }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + Settings Footer */}
        <div className="mt-auto border-t border-outline-variant/10 pt-4 flex flex-col gap-0.5">
          {/* Logged-in user pill */}
          {user && (
            <div className="mx-4 mb-2 flex items-center gap-3 px-3 py-3 rounded-lg bg-surface-container-highest/40">
              <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <span className="text-primary text-xs font-bold font-headline">
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-on-surface truncate font-medium">
                  {user.name || user.email}
                </p>
                <p className="text-[10px] text-on-surface-variant capitalize">
                  {user.role || 'developer'}
                </p>
              </div>
            </div>
          )}

          <NavLink
            to="/settings"
            className="flex items-center gap-3 px-6 py-3 text-xs font-label font-medium uppercase tracking-widest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/40 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            Settings
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-3 text-xs font-label font-medium uppercase tracking-widest text-on-surface-variant hover:text-error transition-all w-full text-left"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
