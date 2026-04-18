// Member status labels and admin tag color palette.

export const MEMBER_STATUSES = [
  { value: 'active',    label: 'Active',    tone: 'green' },
  { value: 'suspended', label: 'Suspended', tone: 'amber' },
  { value: 'banned',    label: 'Banned',    tone: 'red'   },
];

const STATUS_LOOKUP = Object.fromEntries(MEMBER_STATUSES.map((s) => [s.value, s]));

export function statusLabel(value) {
  return STATUS_LOOKUP[value]?.label || 'Active';
}

export function statusColorClass(value) {
  const tone = STATUS_LOOKUP[value]?.tone || 'green';
  return `status-pill-${tone}`;
}

// Predefined palette for creating new admin tags. Chosen to cover the
// common meaning spectrum (urgent / positive / neutral / caution / cool).
export const ADMIN_TAG_COLORS = [
  '#ef4444', // red
  '#f59e0b', // amber
  '#eab308', // yellow
  '#10b981', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#6b7280', // gray
];

export function safeTagColor(color) {
  if (typeof color !== 'string') return '#6b7280';
  const m = color.trim().match(/^#([0-9a-f]{6}|[0-9a-f]{3})$/i);
  return m ? color.trim() : '#6b7280';
}
