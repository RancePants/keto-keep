import { useAuth } from '../../contexts/useAuth.js';
import { useGuide } from './useGuide.js';

// Canonical pose names map 1:1 to the filenames in public/guide/.
const VALID_POSES = new Set([
  'welcome',
  'pointing',
  'celebrating',
  'thinking',
  'thumbsup',
]);

export default function GuideTooltip({
  tipId,
  pose = 'thinking',
  variant = 'inline', // 'inline' | 'floating'
  position = 'bottom-right', // used by 'floating' variant
  onDismiss,
  children,
  message,
}) {
  const { profile, dismissTip } = useAuth();
  const { isTipReopened, clearReopenedTip } = useGuide();

  if (!profile) return null;
  if ((profile.guide_character || 'lady') === 'none') return null;

  const dismissed = Array.isArray(profile.dismissed_tips)
    ? profile.dismissed_tips
    : [];
  const alreadyDismissed = dismissed.includes(tipId);
  const reopened = isTipReopened(tipId);
  if (alreadyDismissed && !reopened) return null;

  const safePose = VALID_POSES.has(pose) ? pose : 'thinking';
  const src = `/guide/guide-lady-${safePose}.png`;
  const characterName = 'Lady Elara';

  const handleDismiss = () => {
    if (reopened) {
      clearReopenedTip(tipId);
    }
    if (!alreadyDismissed) {
      dismissTip(tipId);
    }
    if (onDismiss) onDismiss();
  };

  const containerClass =
    variant === 'floating'
      ? `guide-tooltip guide-tooltip-floating guide-tooltip-pos-${position}`
      : 'guide-tooltip guide-tooltip-inline';

  return (
    <div className={containerClass} role="dialog" aria-label={`${characterName} tip`}>
      <div className="guide-tooltip-bubble">
        <img
          src={src}
          alt={characterName}
          className="guide-tooltip-character"
          loading="lazy"
        />
        <div className="guide-tooltip-body">
          <div className="guide-tooltip-name">{characterName}</div>
          <div className="guide-tooltip-message">{message || children}</div>
          <div className="guide-tooltip-actions">
            <button
              type="button"
              className="btn btn-primary guide-tooltip-dismiss"
              onClick={handleDismiss}
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
