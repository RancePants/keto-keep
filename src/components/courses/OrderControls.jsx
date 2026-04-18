export default function OrderControls({ onUp, onDown, isFirst, isLast, disabled, label = 'item' }) {
  return (
    <div className="order-controls" role="group" aria-label={`Reorder ${label}`}>
      <button
        type="button"
        className="order-btn"
        onClick={onUp}
        disabled={disabled || isFirst}
        aria-label={`Move ${label} up`}
        title="Move up"
      >
        ▲
      </button>
      <button
        type="button"
        className="order-btn"
        onClick={onDown}
        disabled={disabled || isLast}
        aria-label={`Move ${label} down`}
        title="Move down"
      >
        ▼
      </button>
    </div>
  );
}
