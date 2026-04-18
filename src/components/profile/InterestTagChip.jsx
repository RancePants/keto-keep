// Selectable chip used on the profile editor. When used read-only (on
// a profile view), pass `readOnly` — renders as a static pill.
export default function InterestTagChip({
  tag,
  selected = false,
  disabled = false,
  readOnly = false,
  onToggle,
}) {
  if (!tag) return null;
  if (readOnly) {
    return <span className="interest-chip interest-chip-static">{tag.name}</span>;
  }
  const cls = [
    'interest-chip',
    selected ? 'interest-chip-on' : 'interest-chip-off',
    disabled ? 'interest-chip-disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button
      type="button"
      className={cls}
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onToggle?.(tag)}
    >
      {tag.name}
    </button>
  );
}
