export default function ErrorState({ title = 'Something went wrong', message, onRetry, retryLabel = 'Try again' }) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <h3 className="error-state-title">{title}</h3>
      {message && <p className="error-state-msg">{message}</p>}
      {onRetry && (
        <button type="button" className="btn btn-ghost" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  );
}
