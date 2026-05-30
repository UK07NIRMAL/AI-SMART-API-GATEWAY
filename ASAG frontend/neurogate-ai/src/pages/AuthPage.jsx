/**
 * pages/AuthPage.jsx
 * Login / Sign-up split-panel page.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TopNav from '../components/TopNav';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') === 'register' ? 'register' : 'login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email: loginEmail, password: loginPassword });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Import authService directly for register (login() wraps login only)
      const { authService } = await import('../services/api');
      await authService.register({ name: regName, email: regEmail, password: regPassword });
      // Auto-login after registration
      await login({ email: regEmail, password: regPassword });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body neural-grid min-h-screen flex flex-col">
      <TopNav />

      <main className="flex-grow flex items-center justify-center px-4 py-20 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -z-10" />

        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-0 rounded-xl overflow-hidden bg-surface-container-low/40 backdrop-blur-2xl border border-outline-variant/10 shadow-2xl fade-in">

          {/* ── Left: Info panel ── */}
          <div className="hidden md:flex flex-1 flex-col justify-between p-12 bg-surface-container-low/60 border-r border-outline-variant/10 relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="font-headline font-extrabold text-4xl tracking-tighter text-on-surface mb-4 leading-tight">
                Engineering the <br />
                <span className="text-primary">Neural Frontier</span>
              </h1>
              <p className="text-on-surface-variant font-body text-sm leading-relaxed max-w-xs">
                Access high-precision instruments for modern machine learning architecture.
                Designed for researchers, built for developers.
              </p>
            </div>

            <div className="space-y-6 relative z-10">
              {[
                { icon: 'electric_bolt', color: 'text-primary', border: 'border-primary/20', title: 'Instant API Key Generation', sub: 'Deploy to production in milliseconds.' },
                { icon: 'hub',           color: 'text-secondary', border: 'border-secondary/20', title: 'Neural Fabric Integration', sub: 'Global low-latency inference nodes.' },
                { icon: 'shield',        color: 'text-tertiary',  border: 'border-tertiary/20',  title: 'Adaptive Threat Detection', sub: 'ML-powered anomaly detection.' },
              ].map(({ icon, color, border, title, sub }) => (
                <div key={title} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center ${color} border ${border}`}>
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-label uppercase tracking-widest text-on-surface">{title}</p>
                    <p className="text-xs text-on-surface-variant">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative neural bg */}
            <div className="absolute inset-0 opacity-10 pointer-events-none neural-grid" />
          </div>

          {/* ── Right: Auth Form ── */}
          <div className="flex-1 p-8 md:p-12">
            {/* Tabs */}
            <div className="flex gap-8 mb-8 border-b border-outline-variant/10">
              {['login', 'register'].map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(''); }}
                  className={`pb-4 font-headline font-bold text-lg tracking-tight capitalize transition-colors border-b-2 ${
                    tab === t
                      ? 'text-primary border-primary'
                      : 'text-on-surface-variant border-transparent hover:text-on-surface'
                  }`}
                >
                  {t === 'login' ? 'Login' : 'Sign Up'}
                </button>
              ))}
            </div>

            <p className="text-on-surface-variant text-sm mb-8">
              {tab === 'login'
                ? 'Welcome back. Enter your credentials to access the gateway.'
                : 'Create your account and start building instantly.'}
            </p>

            {/* Error */}
            {error && (
              <div className="mb-6 px-4 py-3 rounded-lg bg-error-container/10 border border-error/20 text-error text-xs font-label flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error_outline</span>
                {error}
              </div>
            )}

            {/* ── Login Form ── */}
            {tab === 'login' && (
              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    placeholder="engineer@neurogate.ai"
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant block">
                      Password
                    </label>
                    <a href="#" className="text-[10px] uppercase tracking-wider text-primary hover:underline">
                      Forgot?
                    </a>
                  </div>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-on-primary font-headline font-bold uppercase tracking-widest text-xs py-4 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />}
                  {loading ? 'Authorizing…' : 'Authorize Gateway'}
                </button>
              </form>
            )}

            {/* ── Register Form ── */}
            {tab === 'register' && (
              <form className="space-y-6" onSubmit={handleRegister}>
                <div className="space-y-2">
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant block">Full Name</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    placeholder="Ada Lovelace"
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant block">Email Address</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    placeholder="engineer@neurogate.ai"
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant block">Password</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    placeholder="Min. 8 characters"
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-on-primary font-headline font-bold uppercase tracking-widest text-xs py-4 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />}
                  {loading ? 'Creating Account…' : 'Create Account'}
                </button>
              </form>
            )}

            {/* Social login */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-surface-container-low/0 px-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: 'code', label: 'GitHub' },
                { icon: 'api',  label: 'Google' },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-surface-container-highest border border-outline-variant/10 hover:border-primary/30 transition-all group"
                >
                  <span className="material-symbols-outlined text-sm group-hover:text-primary transition-colors">{icon}</span>
                  <span className="text-xs font-label uppercase tracking-tight text-on-surface">{label}</span>
                </button>
              ))}
            </div>

            <p className="mt-8 text-center text-[11px] text-on-surface-variant">
              By authenticating, you agree to the{' '}
              <a href="#" className="text-tertiary-dim hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-tertiary-dim hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
