import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.js';
import UpcomingEventsCard from '../components/events/UpcomingEventsCard.jsx';
import MyLearningCard from '../components/courses/MyLearningCard.jsx';
import DietaryApproachTag from '../components/profile/DietaryApproachTag.jsx';
import BadgesInline from '../components/profile/BadgesInline.jsx';
import { useMemberBadges } from '../components/profile/useMemberBadges.js';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const name = profile?.display_name || 'friend';
  const isAdmin = profile?.role === 'admin';
  const userIds = user?.id ? [user.id] : [];
  const badgeMap = useMemberBadges(userIds);
  const myBadges = user?.id ? badgeMap[user.id] || [] : [];

  return (
    <div className="page page-narrow">
      <header className="page-header">
        <h1 className="page-title">Welcome back, {name}!</h1>
        <p className="page-sub">Good to see you in The Keep.</p>
        {(profile?.dietary_approach || myBadges.length > 0) && (
          <div className="dashboard-meta">
            {profile?.dietary_approach && (
              <DietaryApproachTag value={profile.dietary_approach} size="md" />
            )}
            <BadgesInline badges={myBadges} limit={5} size={16} />
          </div>
        )}
      </header>

      <section className="panel">
        <h2 className="panel-title">Community news</h2>
        <p>
          We're just getting started. This dashboard will soon surface the latest forum
          threads, upcoming events, and fresh course material. For now, say hello on your
          profile and invite a friend.
        </p>
      </section>

      <UpcomingEventsCard />

      <MyLearningCard />

      <section className="panel">
        <h2 className="panel-title">Quick links</h2>
        <ul className="quick-links">
          <li>
            <Link to="/profile">Your profile</Link>
            <span className="muted">Add a photo and a short bio.</span>
          </li>
          <li>
            <Link to="/forums">Forums</Link>
            <span className="muted">Posts, replies, and reactions.</span>
          </li>
          <li>
            <Link to="/events">Events</Link>
            <span className="muted">Live calls, workshops, recordings.</span>
          </li>
          <li>
            <Link to="/courses">Courses</Link>
            <span className="muted">Self-paced lessons and modules.</span>
          </li>
          {isAdmin && (
            <li>
              <Link to="/admin/tags">Admin · Interest tags</Link>
              <span className="muted">Curate the tags members can pick.</span>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
