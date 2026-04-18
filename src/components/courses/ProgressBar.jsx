export default function ProgressBar({ done = 0, total = 0, size = 'md', showLabel = true }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const complete = total > 0 && done >= total;
  return (
    <div className={`progress-bar progress-bar-${size}${complete ? ' progress-bar-complete' : ''}`}>
      <div className="progress-bar-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      {showLabel && (
        <div className="progress-bar-label">
          {total === 0 ? 'No lessons yet' : `${done} of ${total} complete`}
        </div>
      )}
    </div>
  );
}
