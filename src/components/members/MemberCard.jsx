import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePrivateImage } from '../forum/usePrivateImage.js';
import DietaryApproachTag from '../profile/DietaryApproachTag.jsx';
import BadgesInline from '../profile/BadgesInline.jsx';
import InterestTagChip from '../profile/InterestTagChip.jsx';
import ProfileFrame from '../ui/ProfileFrame.jsx';
import StreakBadge from '../ui/StreakBadge.jsx';
import {
  formatLocation,
  journeyLabel,
} from '../../lib/profileHelpers.js';
import { safeTagColor, statusColorClass, statusLabel } from '../../lib/memberHelpers.js';

function Avatar({ path, displayName, frameType = 'none' }) {
  const url = usePrivateImage('avatars', path);
  const initial = (displayName || '?').trim().charAt(0).toUpperCase() || '?';

  const inner = path && url ? (
    <img src={url} alt={displayName || 'Avatar'} className="member-card-avatar" />
  ) : (
    <div className="member-card-avatar-fallback" aria-label={displayName || 'Avatar'}>
      <span>{initial}</span>
    </div>
  );

  if (!frameType || frameType === 'none') return inner;
  return (
    <ProfileFrame frameType={frameType} size={64}>
      {inner}
    </ProfileFrame>
  );
}

export default function MemberCard({
  profile,
  badges = [],
  interestTags = [],
  adminTags = [],
  isAdmin = false,
  onMenuAction,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = formatLocation({ city: profile.city, state: profile.state });
  const showInterests = interestTags.slice(0, 4);
  const hiddenInterests = interestTags.length - showInterests.length;

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen((v) => !v);
  };

  const handleMenuAction = (action) => {
    setMenuOpen(false);
    onMenuAction?.(action, profile);
  };

  return (
    <article className="member-card">
      <Link
        to={`/profile/${profile.id}`}
        className="member-card-link"
        aria-label={`View ${profile.display_name || 'member'}'s profile`}
      >
        <div className="member-card-header">
          <Avatar
            path={profile.avatar_url}
            displayName={profile.display_name}
            frameType={profile.selected_frame}
          />
          <div className="member-card-heading">
            <h3 className="member-card-name">
              {profile.display_name || 'Member'}
            </h3>
            <div className="member-card-meta-row">
              {profile.dietary_approach && (
                <DietaryApproachTag value={profile.dietary_approach} size="sm" />
              )}
              {isAdmin && profile.status && profile.status !== 'active' && (
                <span className={`status-pill ${statusColorClass(profile.status)}`}>
                  {statusLabel(profile.status)}
                </span>
              )}
              {profile.current_streak > 0 && (
                <StreakBadge streak={profile.current_streak} size="sm" showCount />
              )}
            </div>
            {profile.journey_duration && (
              <div className="member-card-sub">
                {journeyLabel(profile.journey_duration)}
              </div>
            )}
            {location && (
              <div className="member-card-sub">{location}</div>
            )}
          </div>
        </div>

        {profile.bio && (
          <p className="member-card-bio">{profile.bio}</p>
        )}

        {badges.length > 0 && (
          <div className="member-card-badges">
            <BadgesInline badges={badges} limit={4} size={16} />
          </div>
        )}

        {showInterests.length > 0 && (
          <div className="member-card-tags">
            {showInterests.map((t) => (
              <InterestTagChip key={t.id} tag={t} readOnly />
            ))}
            {hiddenInterests > 0 && (
              <span className="member-card-overflow">+{hiddenInterests}</span>
            )}
          </div>
        )}

        {isAdmin && adminTags.length > 0 && (
          <div className="member-card-admin-tags">
            {adminTags.map((t) => {
              const color = safeTagColor(t.color);
              return (
                <span
                  key={t.id}
                  className="admin-tag-badge"
                  style={{ background: color }}
                  title={t.description || t.name}
                >
                  {t.name}
                </span>
              );
            })}
          </div>
        )}
      </Link>

      {isAdmin && profile.role !== 'owner' && (
        <div className="member-card-menu-wrap">
          <button
            type="button"
            className="member-card-menu-btn"
            onClick={toggleMenu}
            aria-label="Admin actions"
            aria-expanded={menuOpen}
          >
            ⋯
          </button>
          {menuOpen && (
            <>
              <div
                className="member-card-menu-scrim"
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />
              <div className="member-card-menu" role="menu">
                <button
                  type="button"
                  className="member-card-menu-item"
                  onClick={() => handleMenuAction('tags')}
                  role="menuitem"
                >
                  Manage tags
                </button>
                <Link
                  to={`/profile/${profile.id}`}
                  className="member-card-menu-item"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  View profile
                </Link>
                <div className="member-card-menu-sep" />
                {profile.status === 'suspended' ? (
                  <button
                    type="button"
                    className="member-card-menu-item"
                    onClick={() => handleMenuAction('unsuspend')}
                    role="menuitem"
                  >
                    Unsuspend
                  </button>
                ) : profile.status !== 'banned' ? (
                  <button
                    type="button"
                    className="member-card-menu-item member-card-menu-warn"
                    onClick={() => handleMenuAction('suspend')}
                    role="menuitem"
                  >
                    Suspend
                  </button>
                ) : null}
                {profile.status === 'banned' ? (
                  <button
                    type="button"
                    className="member-card-menu-item"
                    onClick={() => handleMenuAction('unban')}
                    role="menuitem"
                  >
                    Unban
                  </button>
                ) : (
                  <button
                    type="button"
                    className="member-card-menu-item member-card-menu-danger"
                    onClick={() => handleMenuAction('ban')}
                    role="menuitem"
                  >
                    Ban
                  </button>
                )}
                <button
                  type="button"
                  className="member-card-menu-item member-card-menu-danger"
                  onClick={() => handleMenuAction('delete')}
                  role="menuitem"
                >
                  Delete…
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </article>
  );
}
