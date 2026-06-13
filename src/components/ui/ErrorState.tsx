interface ErrorStateProps {
  message: string;
  onReload?: () => void;
}

export function ErrorState({ message, onReload }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-surface)]">
      <div className="rounded-2xl shadow-sm border border-[var(--color-border)] bg-[var(--color-card)] p-8 max-w-md text-center mx-4">
        <div className="flex justify-center mb-4">
          <WarningIcon />
        </div>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          Unable to load data
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-6">{message}</p>
        {onReload && (
          <button
            onClick={onReload}
            className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white font-medium hover:opacity-90 transition-opacity"
          >
            Reload
          </button>
        )}
      </div>
    </div>
  );
}

function WarningIcon() {
  return (
    <svg className="w-12 h-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}