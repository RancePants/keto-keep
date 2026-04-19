export default function LoadingSpinner({ size = 'md', label = 'Loading' }) {
  const cls = `spinner spinner-${size}`;
  return (
    <span className={cls} role="status" aria-live="polite" aria-label={label}>
      <span className="spinner-ring" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
