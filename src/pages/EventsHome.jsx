import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../contexts/useAuth.js';
import EventCard from '../components/events/EventCard.jsx';
import EventFormModal from '../components/events/EventFormModal.jsx';
import YoutubeEmbed from '../components/events/YoutubeEmbed.jsx';
import EventTypeBadge from '../components/events/EventTypeBadge.jsx';
import { formatEventDate } from '../lib/eventHelpers.js';
import usePageTitle from '../lib/usePageTitle.js';
import GuideTooltip from '../components/guide/GuideTooltip.jsx';

export default function EventsHome() {
  usePageTitle('Events');
  const { user, isAdmin } = useAuth();

  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [rsvpsByEvent, setRsvpsByEvent] = useState({});
  const [myRsvps, setMyRsvps] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    const [upcomingRes, pastRes] = await Promise.all([
      supabase
        .from('events')
        .select('*')
        .in('status', ['scheduled', 'live'])
        .order('start_time', { ascending: true }),
      supabase
        .from('events')
        .select('*')
        .eq('status', 'completed')
        .not('youtube_embed_url', 'is', null)
        .order('start_time', { ascending: false })
        .limit(12),
    ]);

    if (upcomingRes.error) {
      setError(upcomingRes.error.message);
      return;
    }
    if (pastRes.error) {
      setError(pastRes.error.message);
      return;
    }

    const upcomingRows = upcomingRes.data || [];
    const pastRows = pastRes.data || [];
    const allIds = [...upcomingRows, ...pastRows].map((e) => e.id);

    setUpcoming(upcomingRows);
    setPast(pastRows);
    setError(null);

    if (allIds.length > 0) {
      const { data: rsvpRows, error: rsvpErr } = await supabase
        .from('event_rsvps')
        .select('event_id, user_id, rsvp_status')
        .in('event_id', allIds);
      if (rsvpErr) {
        setError(rsvpErr.message);
        return;
      }

      const grouped = {};
      const mine = {};
      for (const row of rsvpRows || []) {
        if (!grouped[row.event_id]) grouped[row.event_id] = [];
        grouped[row.event_id].push(row);
        if (row.user_id === user?.id) mine[row.event_id] = row;
      }
      setRsvpsByEvent(grouped);
      setMyRsvps(mine);
    } else {
      setRsvpsByEvent({});
      setMyRsvps({});
    }
  }, [user]);

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

  const onRsvpChange = async (eventId, status) => {
    // Optimistic local update, then re-sync by refetching RSVPs for this event
    const existingList = rsvpsByEvent[eventId] || [];
    const withoutMine = existingList.filter((r) => r.user_id !== user?.id);
    const newList = status
      ? [...withoutMine, { event_id: eventId, user_id: user.id, rsvp_status: status }]
      : withoutMine;
    setRsvpsByEvent((prev) => ({ ...prev, [eventId]: newList }));
    setMyRsvps((prev) => {
      const next = { ...prev };
      if (status) {
        next[eventId] = { event_id: eventId, user_id: user.id, rsvp_status: status };
      } else {
        delete next[eventId];
      }
      return next;
    });
  };

  const onAdminEdit = (ev) => {
    setEditing(ev);
    setFormOpen(true);
  };

  const onAdminCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const onSaved = async () => {
    await load();
  };

  const onDeleted = async () => {
    await load();
  };

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="events-page">
      <header className="page-header events-page-header">
        <div>
          <h1 className="page-title">Events</h1>
          <p className="page-sub">Live calls, workshops, and past recordings.</p>
        </div>
        {isAdmin && (
          <button type="button" className="btn btn-primary" onClick={onAdminCreate}>
            + New event
          </button>
        )}
      </header>

      <GuideTooltip tipId="discover-events" pose="pointing">
        This is the Events Hall. Live sessions, Q&amp;As, and workshops happen here. RSVP to save your spot, and check back for recordings of past sessions.
      </GuideTooltip>

      {error && <div className="form-error">{error}</div>}

      <section className="events-section">
        <h2 className="events-section-title">Coming up</h2>
        {upcoming.length === 0 ? (
          <div className="feed-empty">
            No upcoming events yet.
            {isAdmin && ' Tap "New event" to schedule one.'}
          </div>
        ) : (
          <div className="events-list">
            {upcoming.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                rsvps={rsvpsByEvent[ev.id] || []}
                myRsvp={myRsvps[ev.id]}
                onRsvpChange={onRsvpChange}
                onAdminEdit={onAdminEdit}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </section>

      <section className="events-section">
        <h2 className="events-section-title">Past sessions</h2>
        {past.length === 0 ? (
          <div className="feed-empty">No recordings posted yet.</div>
        ) : (
          <div className="past-events-grid">
            {past.map((ev) => (
              <article key={ev.id} className="past-event-card">
                <YoutubeEmbed url={ev.youtube_embed_url} title={ev.title} />
                <div className="past-event-body">
                  <div className="past-event-meta">
                    <EventTypeBadge type={ev.event_type} />
                    <span className="past-event-date">{formatEventDate(ev.start_time)}</span>
                  </div>
                  <h3 className="past-event-title">
                    <Link to={`/events/${ev.id}`}>{ev.title}</Link>
                  </h3>
                  {isAdmin && (
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => onAdminEdit(ev)}
                    >
                      ✎ Edit
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <EventFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        event={editing}
        onSaved={onSaved}
        onDeleted={onDeleted}
      />
    </div>
  );
}
