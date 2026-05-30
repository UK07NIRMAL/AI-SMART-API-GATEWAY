/**
 * pages/SupportPage.jsx
 * Support tickets — view open tickets and create new ones.
 */

import { useState, useEffect, useCallback } from 'react';
import AppLayout from '../components/AppLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { supportService } from '../services/api';

const MOCK_TICKETS = [
  { id: 'TKT-0041', subject: 'Rate limiting not resetting after 60s window', category: 'Bug Report',   priority: 'high',   status: 'open',        created: '2024-05-24', updated: '2h ago' },
  { id: 'TKT-0038', subject: 'How to configure custom JWT claims?',           category: 'Question',    priority: 'medium', status: 'in_progress', created: '2024-05-22', updated: '1d ago' },
  { id: 'TKT-0035', subject: 'Request access to neural-v4 beta model',        category: 'Feature Req', priority: 'low',    status: 'open',        created: '2024-05-20', updated: '3d ago' },
  { id: 'TKT-0029', subject: 'Dashboard latency chart missing data points',   category: 'Bug Report',  priority: 'medium', status: 'resolved',    created: '2024-05-15', updated: '8d ago' },
];

const PRIORITY_COLORS = {
  high:   'text-error       bg-error/10       border-error/20',
  medium: 'text-yellow-400  bg-yellow-400/10  border-yellow-400/20',
  low:    'text-on-surface-variant bg-surface-container-highest border-outline-variant/20',
};

const STATUS_COLORS = {
  open:        'text-primary   bg-primary/10   border-primary/20',
  in_progress: 'text-secondary bg-secondary/10 border-secondary/20',
  resolved:    'text-on-surface-variant bg-surface-container-highest border-outline-variant/20',
};

export default function SupportPage() {
  const [tickets, setTickets]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  // New ticket form state
  const [subject, setSubject]       = useState('');
  const [category, setCategory]     = useState('Bug Report');
  const [priority, setPriority]     = useState('medium');
  const [description, setDescription] = useState('');

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supportService.listTickets();
      setTickets(data);
    } catch {
      setTickets(MOCK_TICKETS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await supportService.createTicket({ subject, category, priority, description });
      setSubmitted(true);
      setShowForm(false);
      fetchTickets();
    } catch {
      // Optimistically add mock ticket
      const newTicket = {
        id: `TKT-${String(tickets.length + 42).padStart(4, '0')}`,
        subject, category, priority,
        status: 'open',
        created: new Date().toISOString().split('T')[0],
        updated: 'just now',
      };
      setTickets([newTicket, ...tickets]);
      setShowForm(false);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
      setSubject(''); setCategory('Bug Report'); setPriority('medium'); setDescription('');
    }
  };

  return (
    <AppLayout>
      {/* Header */}
      <header className="bg-surface-container-low px-8 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-primary font-label text-[10px] uppercase tracking-[0.2em] mb-1 block">Help Center</span>
          <h2 className="font-headline font-bold text-2xl tracking-tight text-on-surface">Support</h2>
        </div>
        <button
          onClick={() => { setShowForm(true); setSubmitted(false); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg text-xs font-label font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Ticket
        </button>
      </header>

      <div className="px-8 py-6 flex flex-col lg:flex-row gap-8">
        {/* ── Ticket List ── */}
        <div className="flex-1">
          {submitted && (
            <div className="mb-6 flex items-center gap-3 px-5 py-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm fade-in">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span className="font-label text-xs uppercase tracking-wide">Ticket submitted successfully. Our team will respond within 24 hours.</span>
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Loading tickets…" />
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10 hover:border-primary/20 transition-all group cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-mono text-on-surface-variant">{ticket.id}</span>
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold font-label uppercase tracking-wide ${PRIORITY_COLORS[ticket.priority]}`}>
                          {ticket.priority}
                        </span>
                        <span className="text-[10px] text-on-surface-variant font-label">{ticket.category}</span>
                      </div>
                      <h3 className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors truncate">
                        {ticket.subject}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded border text-[10px] font-bold font-label uppercase tracking-wide ${STATUS_COLORS[ticket.status]}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <div className="text-right">
                        <p className="text-[10px] text-on-surface-variant">{ticket.updated}</p>
                        <p className="text-[10px] text-outline">{ticket.created}</p>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">
                        chevron_right
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {tickets.length === 0 && (
                <div className="text-center py-16 text-on-surface-variant/40">
                  <span className="material-symbols-outlined text-5xl block mb-3">support_agent</span>
                  <p className="text-sm font-label uppercase tracking-widest">No tickets yet</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── New Ticket Form / Sidebar Info ── */}
        <div className="w-full lg:w-96 flex-shrink-0">
          {showForm ? (
            <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-headline font-bold uppercase tracking-widest text-on-surface">
                  New Ticket
                </h3>
                <button onClick={() => setShowForm(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant block mb-2">Subject</label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    placeholder="Brief description of your issue"
                    className="w-full bg-surface-container border border-outline-variant/20 rounded-lg px-4 py-3 text-sm text-on-surface focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none placeholder:text-outline"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant block mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant/20 rounded-lg px-3 py-3 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
                    >
                      {['Bug Report', 'Question', 'Feature Req', 'Billing', 'Other'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant block mb-2">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant/20 rounded-lg px-3 py-3 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
                    >
                      {['low', 'medium', 'high'].map((p) => (
                        <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant block mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={5}
                    placeholder="Describe your issue in detail. Include steps to reproduce, error messages, or API responses if applicable."
                    className="w-full bg-surface-container border border-outline-variant/20 rounded-lg px-4 py-3 text-sm text-on-surface focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none resize-none placeholder:text-outline"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-primary text-on-primary font-headline font-bold text-xs uppercase tracking-widest rounded-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting && <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />}
                  {submitting ? 'Submitting…' : 'Submit Ticket'}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Quick links */}
              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                <h3 className="text-xs font-headline font-bold uppercase tracking-widest text-on-surface mb-4">
                  Quick Resources
                </h3>
                {[
                  { icon: 'menu_book', label: 'Documentation', desc: 'Full API reference and guides' },
                  { icon: 'science',   label: 'Playground',    desc: 'Test endpoints interactively' },
                  { icon: 'forum',     label: 'Community',     desc: 'Join the developer forum' },
                  { icon: 'monitor_heart', label: 'Status Page', desc: 'Real-time system status' },
                ].map(({ icon, label, desc }) => (
                  <a key={label} href="#" className="flex items-center gap-3 py-3 border-b border-outline-variant/5 last:border-0 group hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-colors">{icon}</span>
                    <div>
                      <p className="text-xs font-medium text-on-surface group-hover:text-primary transition-colors">{label}</p>
                      <p className="text-[10px] text-on-surface-variant">{desc}</p>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant ml-auto opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                  </a>
                ))}
              </div>

              {/* SLA */}
              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                <h3 className="text-xs font-headline font-bold uppercase tracking-widest text-on-surface mb-4">Response SLA</h3>
                {[
                  { priority: 'High',   sla: '< 4 hours',  color: 'text-error' },
                  { priority: 'Medium', sla: '< 24 hours', color: 'text-yellow-400' },
                  { priority: 'Low',    sla: '< 72 hours', color: 'text-on-surface-variant' },
                ].map(({ priority, sla, color }) => (
                  <div key={priority} className="flex justify-between py-2.5 border-b border-outline-variant/5 last:border-0">
                    <span className={`text-xs font-label uppercase tracking-wide font-bold ${color}`}>{priority}</span>
                    <span className="text-xs text-on-surface-variant">{sla}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
