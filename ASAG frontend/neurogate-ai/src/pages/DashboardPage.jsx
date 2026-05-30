/**
 * pages/DashboardPage.jsx
 * Main developer workspace with stats, API key management, and recent operations.
 */

import { useState, useEffect, useCallback } from 'react';
import AppLayout from '../components/AppLayout';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { useAuth } from '../context/AuthContext';
import { dashboardService, apiKeyService } from '../services/api';

// ─── Mock fallback data (used when backend is not yet connected) ────────────
const MOCK_STATS = {
  total_requests: '1,284,092',
  success_rate: '99.98%',
  avg_latency_ms: '42ms',
  active_keys_count: 8,
};

const MOCK_KEYS = [
  { id: '1', name: 'Production Key', environment: 'production', key_prefix: 'ng_live_48293_0kx9823lksjd...', is_active: true },
  { id: '2', name: 'Sandbox Key',    environment: 'sandbox',    key_prefix: 'ng_test_9921_xksoiw99238sl...', is_active: true },
];

const MOCK_OPS = [
  { event: 'Inference Triggered',   model: 'model-v4-neural',  timestamp_label: '12ms ago',   color: 'bg-primary' },
  { event: 'Key Rotation Success',  model: 'key-mgr-service',  timestamp_label: '1m 4s ago',  color: 'bg-secondary' },
  { event: 'Rate Limit: Threshold', model: 'gateway-proxy',    timestamp_label: '3m 22s ago', color: 'bg-error-dim' },
  { event: 'Model Sync Complete',   model: 'sync-worker',      timestamp_label: '8m ago',     color: 'bg-tertiary' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats]       = useState(null);
  const [keys, setKeys]         = useState([]);
  const [ops, setOps]           = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [rotatingId, setRotatingId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, keysRes, opsRes] = await Promise.all([
        dashboardService.getStats(),
        apiKeyService.listKeys(),
        dashboardService.getRecentOperations(),
      ]);
      setStats(statsRes.data);
      setKeys(keysRes.data);
      setOps(opsRes.data);
    } catch {
      // Gracefully fall back to mock data while backend is being connected
      setStats(MOCK_STATS);
      setKeys(MOCK_KEYS);
      setOps(MOCK_OPS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const copyKey = async (key) => {
    await navigator.clipboard.writeText(key.key_prefix);
    setCopiedId(key.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const rotateKey = async (key) => {
    if (!confirm(`Rotate "${key.name}"? The current key will be immediately invalidated.`)) return;
    setRotatingId(key.id);
    try {
      await apiKeyService.rotateKey(key.id);
      await fetchData();
    } catch {
      setError('Failed to rotate key. Please try again.');
    } finally {
      setRotatingId(null);
    }
  };

  return (
    <AppLayout>
      {/* ── Page Header ── */}
      <header className="bg-surface-container-low px-8 py-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-primary font-label text-[10px] uppercase tracking-[0.2em] mb-2 block">
            Developer Workspace
          </span>
          <h2 className="text-4xl font-headline font-bold tracking-tight text-on-surface">
            System Architecture
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-highest rounded-lg border border-outline-variant/10 text-sm">
              <span className="w-2 h-2 rounded-full bg-primary pulse-glow" />
              <span className="text-on-surface text-xs font-mono">{user?.email || 'dev_user@neurogate.ai'}</span>
            </div>
            <span className="px-3 py-1.5 bg-secondary-container/20 text-secondary border border-secondary/20 rounded-lg text-[10px] uppercase tracking-wider font-bold font-label">
              {user?.role || 'Developer'} Role
            </span>
            <span className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] uppercase tracking-wider font-bold font-label">
              Enterprise Plan
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-highest text-primary font-semibold px-6 py-2.5 rounded-lg text-sm transition-all hover:bg-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">terminal</span>
            Documentation
          </button>
          <button className="bg-primary text-on-primary font-bold px-6 py-2.5 rounded-lg text-sm transition-transform active:scale-95 hover:brightness-110">
            Deploy Update
          </button>
        </div>
      </header>

      {loading && <LoadingSpinner message="Fetching system data…" />}

      {!loading && (
        <>
          {error && (
            <div className="px-8 pt-6">
              <ErrorBanner message={error} onRetry={fetchData} />
            </div>
          )}

          {/* ── Stats Grid ── */}
          <section className="px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              label="Total Requests"
              value={stats?.total_requests || '—'}
              icon="analytics"
              trend
              trendLabel="+12.4% vs last week"
              accentColor="primary"
            >
              {/* Sparkline */}
              <div className="h-8 w-20 flex items-end gap-1">
                {[3, 5, 4, 6, 8, 7].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-sm bg-primary"
                    style={{ height: `${h * 4}px`, opacity: 0.2 + i * 0.15 }}
                  />
                ))}
              </div>
            </StatCard>

            <StatCard
              label="Success Rate"
              value={stats?.success_rate || '—'}
              icon="check_circle"
              accentColor="secondary"
            >
              <div className="w-full absolute bottom-0 left-0 right-0 px-6 pb-6">
                <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: stats?.success_rate || '99%' }} />
                </div>
              </div>
            </StatCard>

            <StatCard
              label="Avg Latency"
              value={stats?.avg_latency_ms || '—'}
              icon="speed"
              trendLabel={`Target: ${stats?.latency_target || '50ms'}`}
              accentColor="tertiary"
            />

            <StatCard
              label="Active Keys"
              value={stats?.active_keys_count ?? '—'}
              icon="vpn_key"
              trendLabel="12 Limit Remaining"
              accentColor="primary"
            />
          </section>

          {/* ── API Keys + Recent Ops ── */}
          <section className="px-8 pb-12 flex flex-col lg:flex-row gap-8">
            {/* API Key Management */}
            <div className="flex-1 bg-surface-container-low rounded-xl p-8 border border-outline-variant/5">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-headline font-bold text-on-surface">API Authentication</h3>
                  <p className="text-on-surface-variant text-sm mt-1">
                    Manage production and sandbox environment keys.
                  </p>
                </div>
                <button className="bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border border-outline-variant/10 hover:border-primary/50 transition-all">
                  Create New Key
                </button>
              </div>

              <div className="space-y-4">
                {keys.map((key) => (
                  <div
                    key={key.id}
                    className={`flex flex-col md:flex-row items-start md:items-center gap-4 bg-surface-container p-5 rounded-lg border-l-4 ${
                      key.environment === 'production' ? 'border-primary' : 'border-secondary opacity-80 hover:opacity-100'
                    } transition-opacity`}
                  >
                    <div className="flex-1 w-full">
                      <label className="text-[10px] uppercase font-bold text-outline tracking-widest block mb-2 font-label">
                        {key.name}
                      </label>
                      <div className="bg-surface-container-lowest font-mono text-sm p-3 rounded border border-outline-variant/10 text-on-surface-variant flex justify-between items-center">
                        <span className="truncate pr-4 text-xs">{key.key_prefix}</span>
                        <button
                          onClick={() => copyKey(key)}
                          className={`transition-colors flex items-center gap-1 text-xs flex-shrink-0 ${
                            copiedId === key.id ? 'text-primary' : 'text-outline hover:text-primary'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {copiedId === key.id ? 'check' : 'content_copy'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto flex-shrink-0">
                      <button
                        onClick={() => rotateKey(key)}
                        disabled={rotatingId === key.id}
                        className="flex-1 md:flex-none px-4 py-2.5 bg-surface-container-highest text-xs font-bold uppercase tracking-wider text-error-dim rounded border border-error-dim/20 hover:bg-error-container/10 transition-colors disabled:opacity-50"
                      >
                        {rotatingId === key.id ? 'Rotating…' : 'Rotate Key'}
                      </button>
                      <button className="flex-1 md:flex-none px-4 py-2.5 bg-surface-container-highest text-xs font-bold uppercase tracking-wider text-on-surface-variant rounded border border-outline-variant/10 hover:text-on-surface transition-colors">
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </div>
                ))}

                {keys.length === 0 && !loading && (
                  <div className="text-center py-12 text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl block mb-3 opacity-30">vpn_key</span>
                    <p className="text-sm font-label uppercase tracking-widest">No API keys yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Operations */}
            <div className="w-full lg:w-96 flex flex-col gap-6">
              <div className="bg-surface-container-highest/40 border border-outline-variant/5 rounded-xl p-6">
                <h4 className="text-sm font-bold font-headline uppercase tracking-widest text-on-surface mb-6">
                  Recent Operations
                </h4>
                <div className="space-y-6">
                  {ops.map((op, i) => (
                    <div key={i} className="flex gap-4">
                      <div className={`w-1 ${op.color || 'bg-primary'} rounded-full flex-shrink-0`} />
                      <div>
                        <p className="text-xs font-bold text-on-surface">{op.event}</p>
                        <p className="text-[10px] text-on-surface-variant mt-1 font-mono">
                          {op.model} • {op.timestamp_label}
                        </p>
                      </div>
                    </div>
                  ))}

                  {ops.length === 0 && (
                    <p className="text-xs text-on-surface-variant text-center py-4">No recent operations</p>
                  )}
                </div>

                <button className="w-full mt-6 py-2.5 text-[10px] font-label uppercase tracking-widest text-on-surface-variant border border-outline-variant/10 rounded-lg hover:text-primary hover:border-primary/30 transition-all">
                  View All Activity
                </button>
              </div>

              {/* Quick status */}
              <div className="bg-surface-container-highest/40 border border-outline-variant/5 rounded-xl p-6">
                <h4 className="text-sm font-bold font-headline uppercase tracking-widest text-on-surface mb-4">
                  System Status
                </h4>
                {[
                  { label: 'API Gateway',   status: 'Operational', color: 'text-primary' },
                  { label: 'Neural Engine', status: 'Operational', color: 'text-primary' },
                  { label: 'Auth Service',  status: 'Operational', color: 'text-primary' },
                  { label: 'Log Pipeline',  status: 'Degraded',    color: 'text-yellow-400' },
                ].map(({ label, status, color }) => (
                  <div key={label} className="flex justify-between items-center py-2.5 border-b border-outline-variant/5 last:border-0">
                    <span className="text-xs text-on-surface-variant font-label">{label}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wide ${color}`}>{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </AppLayout>
  );
}
