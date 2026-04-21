import { useAuth } from '../contexts/useAuth.js';
import UpcomingEventsCard from '../components/events/UpcomingEventsCard.jsx';
import MyLearningCard from '../components/courses/MyLearningCard.jsx';
import DietaryApproachTag from '../components/profile/DietaryApproachTag.jsx';
import BadgesInline from '../components/profile/BadgesInline.jsx';
import StreakBadge from '../components/ui/StreakBadge.jsx';
import RecentActivityCard from '../components/dashboard/RecentActivityCard.jsx';
import { useMemberBadges } from '../components/profile/useMemberBadges.js';
import usePageTitle from '../lib/usePageTitle.js';
import OnboardingTour from '../components/guide/OnboardingTour.jsx';
import { hasActiveOnboardingTour } from '../components/guide/onboardingHelpers.js';
import GuideTooltip from '../components/guide/GuideTooltip.jsx';

export default function Dashboard() {
  usePageTitle('Dashboard');
  const { user, profile } = useAuth();
  const name = profile?.display_name || 'friend';
  const userIds = user?.id ? [user.id] : [];
  const badgeMap = useMemberBadges(userIds);
  const myBadges = user?.id ? badgeMap[user.id] || [] : [];

  const onboardingActive = hasActiveOnboardingTour(profile);
  const streak = profile?.current_streak || 0;

  return (
    <div className="page page-narrow">
      <OnboardingTour />
      <header className="page-header">
        <h1 className="page-title">Welcome back, {name}!</h1>
        <p className="page-sub">Good to see you in The Keep.</p>
        {(profile?.dietary_approach || myBadges.length > 0 || profile?.current_streak > 0) && (
          <div className="dashboard-meta">
            {profile?.dietary_approach && (
              <DietaryApproachTag value={profile.dietary_approach} size="md" />
            )}
            <BadgesInline badges={myBadges} limit={5} size={16} />
            {profile?.current_streak > 0 && (
              <StreakBadge streak={profile.current_streak} size="md" showCount />
            )}
          </div>
        )}
      </header>

      {!onboardingActive && myBadges.length >= 1 && (
        <GuideTooltip tipId="engage-first-honor" pose="celebrating">
          You've earned your first Honor! Check your profile to see it displayed in the Hall of Honors. There are many more to discover…
        </GuideTooltip>
      )}

      {!onboardingActive && streak >= 7 && (
        <GuideTooltip tipId="engage-streak-7" pose="celebrating">
          Seven days strong! Your dedication is building. Keep showing up — the rewards only get better from here.
        </GuideTooltip>
      )}

      {!onboardingActive && streak >= 7 && (
        <GuideTooltip tipId="hint-vacation" pose="thinking">
          Going on a trip? Vacation Mode freezes your streak for up to 30 days so you don't lose your progress. Find it on your profile page.
        </GuideTooltip>
      )}

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

      <RecentActivityCard />
    </div>
  );
}
