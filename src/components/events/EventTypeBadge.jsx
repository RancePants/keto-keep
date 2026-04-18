import { EVENT_TYPE_LABELS } from '../../lib/eventHelpers.js';

export default function EventTypeBadge({ type, size = 'sm' }) {
  const label = EVENT_TYPE_LABELS[type] || 'Event';
  const cls = `event-type-badge event-type-${type || 'other'}${size === 'lg' ? ' event-type-lg' : ''}`;
  return <span className={cls}>{label}</span>;
}
