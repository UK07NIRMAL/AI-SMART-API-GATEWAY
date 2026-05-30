/**
 * components/StatCard.jsx
 * Glassmorphic metric card used in the Dashboard.
 */

export default function StatCard({ label, value, icon, trend, trendLabel, accentColor = 'primary', children }) {
  const colorMap = {
    primary:   { icon: 'text-primary/50 group-hover:text-primary',   border: 'hover:border-primary/20' },
    secondary: { icon: 'text-secondary/50 group-hover:text-secondary', border: 'hover:border-secondary/20' },
    tertiary:  { icon: 'text-tertiary/50 group-hover:text-tertiary',  border: 'hover:border-tertiary/20' },
  };
  const c = colorMap[accentColor] || colorMap.primary;

  return (
    <div className={`glass-card p-6 rounded-xl border border-outline-variant/10 group transition-all ${c.border}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-on-surface-variant text-[10px] uppercase tracking-widest font-label font-medium">
          {label}
        </span>
        <span className={`material-symbols-outlined transition-colors ${c.icon}`}>{icon}</span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-headline font-bold text-on-surface">{value}</div>
          {trend && (
            <div className={`text-xs mt-1 flex items-center gap-1 font-medium text-${accentColor}`}>
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              {trendLabel}
            </div>
          )}
          {!trend && trendLabel && (
            <div className="text-xs text-on-surface-variant mt-1 font-medium">{trendLabel}</div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
