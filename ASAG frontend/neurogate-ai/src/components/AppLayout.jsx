/**
 * components/AppLayout.jsx
 * Wraps all authenticated pages with the sidebar + mobile top bar.
 */

import { useState } from 'react';
import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body antialiased">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-surface-container-low/90 backdrop-blur-xl md:hidden border-b border-outline-variant/10">
        <span className="text-primary font-headline font-bold text-base tracking-tight">
          NeuroGate AI
        </span>
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-on-surface-variant hover:text-on-surface transition-colors p-1"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen pt-12 md:pt-0">
        {children}
      </main>
    </div>
  );
}
