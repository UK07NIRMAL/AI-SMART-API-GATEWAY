export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl bg-error-container/10 border border-error/20 text-error text-sm">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-[20px]">error_outline</span>
        <span className="font-label text-xs uppercase tracking-wide">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-[10px] uppercase tracking-widest font-bold text-error hover:text-on-error transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
