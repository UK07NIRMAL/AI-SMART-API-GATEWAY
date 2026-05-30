/**
 * pages/ActivityLogs.jsx
 * Full paginated log table with method/status/search filters.
 */

import { useState, useEffect, useCallback } from 'react';
import AppLayout from '../components/AppLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { logsService } from '../services/api';

// ─── Mock data ───────────────────────────────────────────────────────────────
const MOCK_LOGS = [
  { id: '1', timestamp: '2024-05-24 14:22:01.042', method: 'POST', endpoint: '/v1/neural/inference/predict', status: 200, latency: '142ms', ip: '192.168.1.144' },
  { id: '2', timestamp: '2024-05-24 14:21:58.911', method: 'GET',  endpoint: '/v1/user/profile/settings',   status: 200, latency: '45ms',  ip: '45.22.190.12' },
  { id: '3', timestamp: '2024-05-24 14:21:55.201', method: 'POST', endpoint: '/v1/neural/model/train/init', status: 201, latency: '12ms',  ip: '88.204.1.32' },
  { id: '4', timestamp: '2024-05-24 14:21:50.003', method: 'PUT',  endpoint: '/v1/system/config/sync',      status: 500, latency: '890ms', ip: '12.0.0.1' },
  { id: '5', timestamp: '2024-05-24 14:21:45.662', method: 'GET',  endpoint: '/v1/keys/list',               status: 200, latency: '22ms',  ip: '10.0.0.5' },
  { id: '6', timestamp: '2024-05-24 14:21:40.119', method: 'DELETE', endpoint: '/v1/keys/revoke/ng_test_9921', status: 200, latency: '18ms', ip: '192.168.1.144' },
  { id: '7', timestamp: '2024-05-24 14:21:35.007', method: 'POST', endpoint: '/v1/auth/login',              status: 401, latency: '8ms',   ip: '77.88.99.1' },
  { id: '8', timestamp: '2024-05-24 14:21:30.552', method: 'GET',  endpoint: '/v1/logs/stream',             status: 200, latency: '310ms', ip: '45.22.190.12' },
  { id: '9', timestamp: '2024-05-24 14:21:25.331', method: 'POST', endpoint: '/v1/neural/gate/status',      status: 200, latency: '55ms',  ip: '88.204.1.32' },
  { id: '10',timestamp: '2024-05-24 14:21:20.001', method: 'PATCH',endpoint: '/v1/admin/users/update',      status: 403, latency: '34ms',  ip: '192.168.1.200' },
];

const METHOD_COLORS = {
  GET:    'text-primary    bg-primary/10    border-primary/20',
  POST:   'text-secondary  bg-secondary/10  border-secondary/20',
  PUT:    'text-tertiary   bg-tertiary/10   border-tertiary/20',
  PATCH:  'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  DELETE: 'text-error      bg-error/10      border-error/20',
};

function getStatusClass(status) {
  if (status >= 200 && status < 300) return 'text-primary   bg-primary/10   border-primary/20';
  if (status >= 400 && status < 500) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
  return 'text-error bg-error/10 border-error/20';
}

export default function ActivityLogs() {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [search, setSearch]   = useState('');
  const [method, setMethod]   = useState('');
  const [status, setStatus]   = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await logsService.getLogs({ search, method, status });
      setLogs(data.items || data);
    } catch {
      setLogs(MOCK_LOGS);
    } finally {
      setLoading(false);
    }
  }, [search, method, status]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // Client-side filter (works with mock data too)
  const filtered = logs.filter((log) => {
    const q = search.toLowerCase();
    const matchSearch = !q || log.endpoint.toLowerCase().includes(q) || log.ip.includes(q);
    const matchMethod = !method || log.method === method;
    const matchStatus = !status || String(log.status).startsWith(status[0]);
    return matchSearch && matchMethod && matchStatus;
  });

  const exportLogs = async () => {
    try {
      const { data } = await logsService.exportLogs({ method, status, search });
      const url = URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'neurogate_logs.csv';
      a.click();
    } catch {
      alert('Export failed — backend not connected yet.');
    }
  };

  return (
    <AppLayout>
      {/* Header */}
      <header className="bg-surface-container-low px-8 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-primary font-label text-[10px] uppercase tracking-[0.2em] mb-1 block">Observability</span>
          <h2 className="font-headline font-bold text-2xl tracking-tight text-on-surface">Activity Logs</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by IP or Endpoint…"
              className="bg-surface-container-highest border-none text-sm text-on-surface placeholder:text-outline pl-10 pr-4 py-2 rounded-lg focus:ring-1 focus:ring-primary w-64 outline-none"
            />
          </div>

          {/* Method filter */}
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="bg-surface-container-highest text-primary text-sm font-medium px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-primary border-none cursor-pointer"
          >
            <option value="">All Methods</option>
            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-surface-container-highest text-primary text-sm font-medium px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-primary border-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="2xx">2xx Success</option>
            <option value="4xx">4xx Client Error</option>
            <option value="5xx">5xx Server Error</option>
          </select>

          {/* Export */}
          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest text-on-surface-variant hover:text-primary border border-outline-variant/10 hover:border-primary/30 rounded-lg text-xs font-label uppercase tracking-widest transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>
      </header>

      {loading && <LoadingSpinner message="Fetching logs…" />}

      {!loading && error && (
        <div className="px-8 pt-6">
          <ErrorBanner message={error} onRetry={fetchLogs} />
        </div>
      )}

      {!loading && (
        <div className="flex-1 overflow-auto px-8 py-6">
          <div className="rounded-xl border border-outline-variant/10 overflow-hidden">
            <table className="w-full text-left min-w-[800px]">
              <thead className="sticky top-0 bg-surface-container-high z-10">
                <tr>
                  {['Timestamp', 'Method', 'Endpoint', 'Status', 'Latency', 'IP Address', 'Action'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 font-label text-[10px] uppercase tracking-widest text-outline border-b border-outline-variant/10 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container-highest/30 transition-colors group border-b border-outline-variant/5 last:border-0">
                    <td className="px-6 py-3 font-body text-xs text-on-surface-variant whitespace-nowrap font-mono">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded border text-[10px] font-bold font-label uppercase tracking-wide ${METHOD_COLORS[log.method] || 'text-on-surface-variant'}`}>
                        {log.method}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-mono text-xs text-tertiary-fixed-dim max-w-[220px] truncate">
                      {log.endpoint}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded border text-[10px] font-bold font-label ${getStatusClass(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-body text-xs text-on-surface-variant">{log.latency}</td>
                    <td className="px-6 py-3 font-body text-xs text-on-surface-variant font-mono tracking-tight">
                      {log.ip}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant hover:text-primary">
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl block mb-3 opacity-30">manage_search</span>
                      <p className="text-sm font-label uppercase tracking-widest">No logs match your filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 text-xs text-on-surface-variant font-label uppercase tracking-widest">
            <span>Showing {filtered.length} of {logs.length} entries</span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded bg-surface-container-highest border border-outline-variant/10 hover:border-primary/30 transition-all">
                ← Prev
              </button>
              <button className="px-3 py-1.5 rounded bg-surface-container-highest border border-outline-variant/10 hover:border-primary/30 transition-all">
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
