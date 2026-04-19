import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../contexts/useAuth.js';
import EventTypeBadge from '../components/events/EventTypeBadge.jsx';
import RsvpControls from '../components/events/RsvpControls.jsx';
import AttendeeList from '../components/events/AttendeeList.jsx';
import YoutubeEmbed from '../components/events/YoutubeEmbed.jsx';
import EventFormModal from '../components/events/EventFormModal.jsx';
import {
  formatEventDate,
  formatEventRange,
  formatEventTime,
} from '../lib/eventHelpers.js';
import usePageTitle from '../lib/usePageTitle.js';

export default function EventDetail() {
  usePageTitle('Event');
  const { id } = useParams();
  const { user, isAdmin } = useAuth();

  const [event, setEvent] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [myRsvp, setMyRsvp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);

  const load = useCallback(async () => {
    const { data: evRow, error: evErr } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (evErr) {
      setError(evErr.message);
      return;
    }
    if (!evRow) {
      setError('Event not found.');
      setEvent(null);
      return;
    }
    setEvent(evRow);
    setError(null);

    const { data: rsvpRows, error: rsvpErr } = await supabase
      .from('event_rsvps')
      .select('event_id, user_id, rsvp_status, created_at')
      .eq('event_id', id);
    if (rsvpErr) {
      setError(rsvpErr.message);
      return;
    }

    const rows = rsvpRows || [];
    setRsvps(rows);
    setMyRsvp(rows.find((r) => r.user_id === user?.id) || null);

    const userIds = Array.from(new Set(rows.map((r) => r.user_id)));
    if (userIds.length > 0) {
      const [profRes, badgeRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, display_name, avatar_url, role, dietary_approach')
          .in('id', userIds),
        supabase
          .from('member_badges')
          .select('user_id, badges!inner(badge_type, name)')
          .in('user_id', userIds),
      ]);
      const badgeMap = {};
      for (const row of badgeRes.data || []) {
        if (!badgeMap[row.user_id]) badgeMap[row.user_id] = [];
        badgeMap[row.user_id].push({
          badge_type: row.badges?.badge_type,
          name: row.badges?.name,
        });
      }
      const byId = {};
      for (const p of profRes.data || []) {
        byId[p.id] = { ...p, badges: badgeMap[p.id] || [] };
      }
      setProfiles(byId);
    } else {
      setProfiles({});
    }
  }, [id, user]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setLoading(true);
      await load();
      if (cancelled) return;
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const onRsvpChange = (_eventId, status) => {
    const withoutMine = rsvps.filter((r) => r.user_id !== user?.id);
    if (status) {
      const next = { event_id: id, user_id: user.id, rsvp_status: status };
      setRsvps([...withoutMine, next]);
      setMyRsvp(next);
    } else {
      setRsvps(withoutMine);
      setMyRsvp(null);
    }
  };

  const onSaved = async () => {
    await load();
  };

  const onDeleted = () => {
    setEvent(null);
    setError('This event was deleted.');
  };

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="feed">
        <header className="feed-header">
          <div className="feed-breadcrumbs">
            <Link to="/events">Events</Link>
          </div>
          <h1 className="feed-title">Not found</h1>
          <p className="feed-desc">{error || 'Event not found.'}</p>
        </header>
      </div>
    );
  }

  const isCompleted = event.status === 'completed';
  const isCancelled = event.status === 'cancelled';
  const hasRecording = isCompleted && event.youtube_embed_url;

  return (
    <div className="event-detail">
      <header className="feed-header">
        <div className="feed-breadcrumbs">
          <Link to="/events">Events</Link> → {event.title}
        </div>
      </header>

      <article className={`event-detail-card event-detail-${event.status}`}>
        {hasRecording && (
          <div className="event-detail-video">
            <YoutubeEmbed url={event.youtube_embed_url} title={event.title} />
          </div>
        )}

        <div className="event-detail-head">
          <div className="event-detail-badges">
            <EventTypeBadge type={event.event_type} size="lg" />
            {event.status === 'live' && (
              <span className="event-status-badge event-status-live">● Live now</span>
            )}
            {isCancelled && (
              <span className="event-status-badge event-status-cancelled">Cancelled</span>
            )}
            {isCompleted && !hasRecording && (
              <span className="event-status-badge event-status-completed">Completed</span>
            )}
          </div>
          <h1 className="event-detail-title">{event.title}</h1>
          <div className="event-detail-when">
            <div className="event-detail-date">{formatEventDate(event.start_time)}</div>
            <div className="event-detail-time">
              {event.end_time
                ? formatEventRange(event.start_time, event.end_time)
                : formatEventTime(event.start_time)}
            </div>
          </div>
          {isAdmin && (
            <button
              type="button"
              className="icon-btn event-detail-edit"
              onClick={() => setFormOpen(true)}
            >
              ✎ Edit event
            </button>
          )}
        </div>

        {event.description && (
          <div className="event-detail-desc">
            {event.description.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}

        {!isCompleted && !isCancelled && event.zoom_link && (
          <div className="event-detail-zoom">
            <div className="event-detail-zoom-label">Join link</div>
            <a
              href={event.zoom_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary event-detail-zoom-btn"
            >
              Open Zoom →
            </a>
            <p className="event-detail-zoom-hint">
              Visible to all logged-in members. Link opens in a new tab.
            </p>
          </div>
        )}

        {!isCompleted && !isCancelled && (
          <div className="event-detail-rsvp">
            <div className="event-detail-rsvp-label">Will you be there?</div>
            <RsvpControls
              eventId={event.id}
              currentStatus={myRsvp?.rsvp_status || null}
              onChange={(status) => onRsvpChange(event.id, status)}
              size="md"
            />
          </div>
        )}

        <div className="event-detail-attendees">
          <h2 className="event-detail-section-title">
            {isCompleted ? 'Who was there' : 'Who\u2019s coming'}
          </h2>
          <AttendeeList rsvps={rsvps} profiles={profiles} />
        </div>
      </article>

      <EventFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        event={event}
        onSaved={onSaved}
        onDeleted={onDeleted}
      />
    </div>
  );
}
