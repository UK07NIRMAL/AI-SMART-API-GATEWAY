/**
 * components/TopNav.jsx
 * Public-facing navigation bar (Landing page, Auth page).
 */

import { Link, useNavigate } from 'react-router-dom';

export default function TopNav() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1920px] mx-auto">
        <Link to="/" className="text-xl font-black tracking-tighter text-primary uppercase font-headline">
          NeuroGate AI
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {['Platform', 'Playground', 'Activity', 'Docs'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-on-surface-variant hover:text-on-surface transition-colors font-body text-sm"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/auth')}
            className="text-on-surface-variant hover:text-on-surface transition-colors font-body text-sm px-4 py-2"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/auth?tab=register')}
            className="bg-primary text-on-primary font-headline font-bold tracking-tight text-sm px-5 py-2 rounded-lg hover:brightness-110 active:scale-95 transition-all"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
