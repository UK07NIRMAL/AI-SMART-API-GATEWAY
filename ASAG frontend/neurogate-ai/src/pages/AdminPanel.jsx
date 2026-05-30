/**
 * pages/AdminPanel.jsx
 * User management, model management, and system health dashboard.
 */

import { useState, useEffect, useCallback } from 'react';
import AppLayout from '../components/AppLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { adminService } from '../services/api';

// ─── Mock data ───────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id: '1', name: 'Ada Lovelace',   email: 'ada@neurogate.ai',    role: 'admin',     plan: 'Enterprise', status: 'active',   joined: '2024-01-12' },
  { id: '2', name: 'Alan Turing',    email: 'alan@research.ai',    role: 'developer', plan: 'Pro',        status: 'active',   joined: '2024-02-08' },
  { id: '3', name: 'Grace Hopper',   email: 'grace@compiler.dev',  role: 'developer', plan: 'Pro',        status: 'active',   joined: '2024-03-15' },
  { id: '4', name: 'Claude Shannon', email: 'claude@entropy.net',  role: 'viewer',    plan: 'Free',       status: 'inactive', joined: '2024-04-01' },
  { id: '5', name: 'Marvin Minsky',  email: 'marvin@mit.edu',      role: 'developer', plan: 'Enterprise', status: 'active',   joined: '2024-04-22' },
];

const MOCK_MODELS = [
  { id: '1', name: 'neural-v4',         version: '4.2.1', status: 'active',      requests: '892,341', accuracy: 98.2 },
  { id: '2', name: 'neural-v3-legacy',  version: '3.8.0', status: 'deprecated',  requests: '12,004',  accuracy: 94.1 },
  { id: '3', name: 'vision-gate-v2',    version: '2.1.4', status: 'active',      requests: '340,112', accuracy: 97.6 },
  { id: '4', name: 'lang-bridge-alpha', version: '0.9.2', status: 'beta',        requests: '5,400',   accuracy: 91.0 },
];

const MOCK_HEALTH = {
  cpu_percent: 34,
  memory_percent: 58,
  disk_percent: 22,
  uptime_days: 47,
  requests_per_second: 284,
};

const ROLE_COLORS = {
  admin:     'text-primary bg-primary/10 border-primary/20',
  developer: 'text-secondary bg-secondary/10 border-secondary/20',
  viewer:    'text-on-surface-variant bg-surface-container-highest border-outline-variant/20',
};

const PLAN_COLORS = {
  Enterprise: 'text-primary',
  Pro:        'text-secondary',
  Free:       'text-on-surface-variant',
};

export default function AdminPanel() {
  const [tab, setTab]         = useState('users');
  const [users, setUsers]     = useState([]);
  const [models, setModels]   = useState([]);
  const [health, setHealth]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [searchUser, setSearchUser] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, modelsRes, healthRes] = await Promise.all([
        adminService.listUsers(),
        adminService.listModels(),
        adminService.getSystemHealth(),
      ]);
      setUsers(usersRes.data.items || usersRes.data);
      setModels(modelsRes.data);
      setHealth(healthRes.data);
    } catch {
      setUsers(MOCK_USERS);
      setModels(MOCK_MODELS);
      setHealth(MOCK_HEALTH);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredUsers = users.filter((u) => {
    const q = searchUser.toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <AppLayout>
      {/* Header */}
      <header className="bg-surface-container-low px-8 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-primary font-label text-[10px] uppercase tracking-[0.2em] mb-1 block">Control Plane</span>
          <h2 className="font-headline font-bold text-2xl tracking-tight text-on-surface">Admin Panel</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface-container-highest rounded-lg p-1">
          {[
            { id: 'users',  label: 'Users',    icon: 'people' },
            { id: 'models', label: 'Models',   icon: 'psychology' },
            { id: 'health', label: 'Health',   icon: 'monitor_heart' },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-label uppercase tracking-widest transition-all ${
                tab === id
                  ? 'bg-surface-container text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </header>

      {loading && <LoadingSpinner message="Loading admin data…" />}

      {!loading && error && (
        <div className="px-8 pt-4">
          <ErrorBanner message={error} onRetry={fetchData} />
        </div>
      )}

      {!loading && (
        <div className="px-8 py-6">
          {/* ── Users Tab ── */}
          {tab === 'users' && (
            <div className="fade-in">
              <div className="flex justify-between items-center mb-6">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
                  <input
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    placeholder="Search users…"
                    className="bg-surface-container-highest pl-10 pr-4 py-2 rounded-lg text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary placeholder:text-outline w-64"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-label font-bold uppercase tracking-widest hover:brightness-110 transition-all">
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  Invite User
                </button>
              </div>

              <div className="rounded-xl border border-outline-variant/10 overflow-hidden">
                <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-surface-container-high">
                    <tr>
                      {['User', 'Role', 'Plan', 'Status', 'Joined', 'Actions'].map((h) => (
                        <th key={h} className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-outline border-b border-outline-variant/10">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-surface-container-highest/30 transition-colors border-b border-outline-variant/5 last:border-0 group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-primary text-xs font-bold font-headline">
                                {u.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-on-surface">{u.name}</p>
                              <p className="text-xs text-on-surface-variant font-mono">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded border text-[10px] font-bold font-label uppercase tracking-wide capitalize ${ROLE_COLORS[u.role]}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-medium ${PLAN_COLORS[u.plan]}`}>{u.plan}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-1.5 text-[10px] font-label uppercase tracking-wide ${
                            u.status === 'active' ? 'text-primary' : 'text-on-surface-variant'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-primary' : 'bg-outline'}`} />
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-on-surface-variant">{u.joined}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors">
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button className="p-1.5 text-on-surface-variant hover:text-error transition-colors">
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Models Tab ── */}
          {tab === 'models' && (
            <div className="fade-in grid grid-cols-1 md:grid-cols-2 gap-4">
              {models.map((model) => (
                <div key={model.id} className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 hover:border-primary/20 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-mono text-sm font-bold text-on-surface">{model.name}</h3>
                      <p className="text-[10px] text-on-surface-variant mt-1 font-label uppercase tracking-widest">
                        v{model.version}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded border text-[10px] font-bold font-label uppercase tracking-wide ${
                      model.status === 'active' ? 'text-primary bg-primary/10 border-primary/20' :
                      model.status === 'beta'   ? 'text-secondary bg-secondary/10 border-secondary/20' :
                      'text-on-surface-variant bg-surface-container-highest border-outline-variant/20'
                    }`}>{model.status}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest mb-1">Requests</p>
                      <p className="text-lg font-headline font-bold text-on-surface">{model.requests}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest mb-1">Accuracy</p>
                      <p className="text-lg font-headline font-bold text-on-surface">{model.accuracy}%</p>
                    </div>
                  </div>

                  {/* Accuracy bar */}
                  <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      style={{ width: `${model.accuracy}%` }}
                    />
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="flex-1 py-2 text-[10px] font-label uppercase tracking-widest bg-surface-container-highest border border-outline-variant/10 hover:border-primary/30 rounded text-on-surface-variant hover:text-primary transition-all">
                      Configure
                    </button>
                    <button className="flex-1 py-2 text-[10px] font-label uppercase tracking-widest bg-surface-container-highest border border-outline-variant/10 hover:border-error/30 rounded text-on-surface-variant hover:text-error transition-all">
                      Deprecate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Health Tab ── */}
          {tab === 'health' && health && (
            <div className="fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { label: 'CPU Usage',    value: health.cpu_percent,    unit: '%', icon: 'developer_board', warn: 80 },
                  { label: 'Memory Usage', value: health.memory_percent, unit: '%', icon: 'memory',          warn: 85 },
                  { label: 'Disk Usage',   value: health.disk_percent,   unit: '%', icon: 'storage',         warn: 90 },
                ].map(({ label, value, unit, icon, warn }) => (
                  <div key={label} className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">{label}</span>
                      <span className={`material-symbols-outlined text-[20px] ${value >= warn ? 'text-error' : 'text-primary'}`}>{icon}</span>
                    </div>
                    <div className="text-3xl font-headline font-bold text-on-surface mb-3">
                      {value}{unit}
                    </div>
                    <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${value >= warn ? 'bg-error' : 'bg-gradient-to-r from-primary to-secondary'}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                  <h3 className="text-sm font-headline font-bold uppercase tracking-widest mb-4">System Metrics</h3>
                  {[
                    { label: 'Uptime',             value: `${health.uptime_days} days` },
                    { label: 'Requests / Second',  value: health.requests_per_second },
                    { label: 'Gateway Version',    value: 'v2.4.1' },
                    { label: 'Node Region',        value: 'EU-WEST-2A' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-3 border-b border-outline-variant/5 last:border-0">
                      <span className="text-xs text-on-surface-variant font-label">{label}</span>
                      <span className="text-xs text-primary font-mono font-bold">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                  <h3 className="text-sm font-headline font-bold uppercase tracking-widest mb-4">Service Status</h3>
                  {[
                    { label: 'API Gateway',    status: 'Operational', ok: true },
                    { label: 'Neural Engine',  status: 'Operational', ok: true },
                    { label: 'Auth Service',   status: 'Operational', ok: true },
                    { label: 'Log Pipeline',   status: 'Degraded',    ok: false },
                    { label: 'Cache (Redis)',  status: 'Operational', ok: true },
                  ].map(({ label, status, ok }) => (
                    <div key={label} className="flex justify-between items-center py-3 border-b border-outline-variant/5 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${ok ? 'bg-primary' : 'bg-yellow-400'}`} />
                        <span className="text-xs text-on-surface-variant font-label">{label}</span>
                      </div>
                      <span className={`text-[10px] font-bold font-label uppercase tracking-wide ${ok ? 'text-primary' : 'text-yellow-400'}`}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
