/**
 * pages/LandingPage.jsx
 * Public marketing / hero page.
 */

import { useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';

const FEATURES = [
  {
    icon: 'key',
    title: 'JWT Authentication',
    desc: 'Stateless security at scale. Implement secure JSON Web Token authentication with custom claims and instant revocation.',
    span: 'md:col-span-8',
    accent: 'primary',
  },
  {
    icon: 'vpn_key',
    title: 'Key Management',
    desc: 'Complete lifecycle management for API credentials. Rotation, scoped permissions, and usage quotas.',
    span: 'md:col-span-4',
    accent: 'primary',
  },
  {
    icon: 'analytics',
    title: 'Activity Tracking',
    desc: 'Real-time observability into every request. Visualize neural data flows and detect anomalies before they scale.',
    span: 'md:col-span-4',
    accent: 'secondary',
  },
  {
    icon: 'admin_panel_settings',
    title: 'Granular RBAC',
    desc: 'Role-Based Access Control that adapts to your organizational structure. Define permissions with surgical precision.',
    span: 'md:col-span-8',
    accent: 'primary',
  },
];

const TECH_STACK = [
  { icon: 'terminal',  label: 'FastAPI',     color: 'text-primary' },
  { icon: 'database',  label: 'PostgreSQL',  color: 'text-primary' },
  { icon: 'memory',    label: 'Redis',       color: 'text-primary' },
  { icon: 'psychology',label: 'Python ML',   color: 'text-secondary' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary/30">
      <TopNav />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-24">
        {/* Background effects */}
        <div className="neural-grid absolute inset-0 -z-10 opacity-40" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-20" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/8 blur-[100px] rounded-full -z-20" />

        <div className="max-w-4xl mx-auto fade-in">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-highest/50 border border-outline-variant/15 rounded-full mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-[10px] font-label uppercase tracking-widest text-secondary-fixed">
              V2.0 Neural Engine Live
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-headline font-bold tracking-tight mb-8 leading-[1.1]">
            The <span className="text-primary italic">Neural</span> Layer<br />
            <span className="text-on-surface-variant">Between You &amp; Your APIs</span>
          </h1>

          <p className="text-on-surface-variant max-w-2xl mx-auto text-lg md:text-xl font-body mb-10 leading-relaxed">
            NeuroGate AI is a high-precision API gateway engineered for machine learning
            infrastructure. Zero-latency routing, intelligent threat detection, and
            comprehensive observability — all in one platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/auth?tab=register')}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary font-headline font-bold rounded-lg hover:shadow-[0_0_20px_rgba(143,245,255,0.3)] transition-all active:scale-95"
            >
              Start Building Free
            </button>
            <button
              onClick={() => navigate('/playground')}
              className="w-full sm:w-auto px-8 py-4 bg-surface-container-highest text-primary font-headline font-bold rounded-lg hover:bg-surface-variant transition-all active:scale-95"
            >
              Explore Playground
            </button>
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="mt-20 w-full max-w-6xl relative">
          <div className="aspect-video bg-surface-container-low rounded-xl border border-outline-variant/15 p-2 shadow-2xl overflow-hidden">
            <div className="w-full h-full bg-black rounded-lg relative overflow-hidden flex items-center justify-center">
              {/* Simulated dashboard preview */}
              <div className="absolute inset-0 neural-grid opacity-30" />
              <div className="relative z-10 grid grid-cols-4 gap-4 p-8 w-full">
                {['1.28M Requests', '99.98% Uptime', '42ms Latency', '8 Active Keys'].map((s, i) => (
                  <div key={i} className="glass-card rounded-lg p-4 border border-outline-variant/10">
                    <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest mb-1">
                      {s.split(' ').slice(1).join(' ')}
                    </p>
                    <p className="text-xl font-headline font-bold text-on-surface">
                      {s.split(' ')[0]}
                    </p>
                    <div className="mt-2 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${70 + i * 8}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Tech stack logos ── */}
      <section className="py-20 bg-surface-container-low/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-12">
            Engineered with Industry Standards
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 hover:opacity-100 transition-all duration-500">
            {TECH_STACK.map(({ icon, label, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-4xl ${color}`}>{icon}</span>
                <span className="font-headline font-bold text-xl tracking-tighter text-on-surface">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <p className="text-primary font-label text-[10px] uppercase tracking-[0.2em] mb-4">
              Core Architecture
            </p>
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 tracking-tight">
              Technical Architecture
            </h2>
            <p className="text-on-surface-variant font-body max-w-xl text-lg">
              A suite of precision tools designed to secure and optimize your API
              ecosystem through automated intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {FEATURES.map(({ icon, title, desc, span, accent }) => (
              <div
                key={title}
                className={`${span} bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 group hover:border-${accent}/20 transition-all`}
              >
                <span className={`material-symbols-outlined text-4xl text-${accent} mb-6 block`}>
                  {icon}
                </span>
                <h3 className="text-2xl font-headline font-bold mb-4">{title}</h3>
                <p className="text-on-surface-variant font-body">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tight mb-6">
            Ready to Engineer the<br />
            <span className="text-primary">Neural Frontier?</span>
          </h2>
          <p className="text-on-surface-variant text-lg mb-10 font-body">
            Join thousands of developers building the next generation of AI-powered applications.
          </p>
          <button
            onClick={() => navigate('/auth?tab=register')}
            className="px-10 py-5 bg-primary text-on-primary font-headline font-bold text-lg rounded-lg hover:shadow-[0_0_30px_rgba(143,245,255,0.4)] transition-all active:scale-95"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-outline-variant/10 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-primary font-headline font-bold tracking-tight">NeuroGate AI</span>
          <p className="text-on-surface-variant text-xs font-label uppercase tracking-widest">
            © 2024 NeuroGate AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Terms', 'Privacy', 'Docs', 'Status'].map((l) => (
              <a key={l} href="#" className="text-on-surface-variant hover:text-on-surface text-xs font-label uppercase tracking-widest transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
