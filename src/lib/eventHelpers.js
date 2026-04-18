export const EVENT_TYPES = [
  'live_call',
  'workshop',
  'q_and_a',
  'special_guest',
  'coaching_circle',
  'other',
];

export const EVENT_TYPE_LABELS = {
  live_call: 'Live Call',
  workshop: 'Workshop',
  q_and_a: 'Q & A',
  special_guest: 'Special Guest',
  coaching_circle: 'Coaching Circle',
  other: 'Other',
};

export const EVENT_STATUSES = ['scheduled', 'live', 'completed', 'cancelled'];

export const EVENT_STATUS_LABELS = {
  scheduled: 'Scheduled',
  live: 'Live now',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const RSVP_STATUSES = ['attending', 'maybe', 'declined'];

export const RSVP_LABELS = {
  attending: "I'm in",
  maybe: 'Maybe',
  declined: "Can't make it",
};

export const RSVP_EMOJI = {
  attending: '✅',
  maybe: '🤔',
  declined: '🙅',
};

function safeDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatEventDate(iso) {
  const d = safeDate(iso);
  if (!d) return '';
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  });
}

export function formatEventTime(iso) {
  const d = safeDate(iso);
  if (!d) return '';
  return d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatEventDateTime(iso) {
  const d = safeDate(iso);
  if (!d) return '';
  return `${formatEventDate(iso)} · ${formatEventTime(iso)}`;
}

export function formatEventRange(startIso, endIso) {
  const start = formatEventDateTime(startIso);
  if (!endIso) return start;
  const s = safeDate(startIso);
  const e = safeDate(endIso);
  if (!s || !e) return start;
  const sameDay =
    s.getFullYear() === e.getFullYear() &&
    s.getMonth() === e.getMonth() &&
    s.getDate() === e.getDate();
  if (sameDay) return `${start} – ${formatEventTime(endIso)}`;
  return `${start} – ${formatEventDateTime(endIso)}`;
}

// Parse a YouTube URL (watch, youtu.be, shorts, or embed form) into an embed URL.
// Returns null if not a recognizable YouTube URL.
export function getYoutubeEmbedSrc(input) {
  if (!input) return null;
  const url = input.trim();
  if (!url) return null;

  // If already an embed URL, pass through (with lite params).
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/);
  if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}?rel=0`;

  // youtu.be/<id>
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?rel=0`;

  // youtube.com/watch?v=<id>
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?rel=0`;

  // youtube.com/shorts/<id>
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}?rel=0`;

  return null;
}

// For <input type="datetime-local"> round-trip.
export function isoToLocalInput(iso) {
  const d = safeDate(iso);
  if (!d) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function localInputToIso(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export function isUpcoming(event) {
  if (!event) return false;
  if (event.status === 'cancelled' || event.status === 'completed') return false;
  return true;
}

export function isPastLivestream(event) {
  return event?.status === 'completed' && !!event?.youtube_embed_url;
}
