import { Link } from 'react-router-dom';
import { usePrivateImage } from './usePrivateImage.js';
import ProfileFrame from '../ui/ProfileFrame.jsx';

// Pixel size the ProfileFrame wrapper should be at each size variant.
// Matches the avatar-xs / avatar-sm CSS sizes so the frame sits flush.
const FRAME_PX = { xs: 28, sm: 40 };

export default function UserAvatar({ author, size = 'sm', linkToProfile = true }) {
  const path = author?.avatar_url || null;
  const url = usePrivateImage('avatars', path);
  const initial = (author?.display_name || '?').trim().charAt(0).toUpperCase() || '?';
  const label = author?.display_name || 'Member';
  const frameType = author?.selected_frame || 'none';

  const imgClass = size === 'xs' ? 'avatar-xs' : 'avatar-sm';
  const fbClass = size === 'xs' ? 'avatar-xs-fallback' : 'avatar-sm-fallback';

  const inner = url ? (
    <img src={url} alt={label} className={imgClass} />
  ) : (
    <div className={fbClass} aria-label={label}>
      <span>{initial}</span>
    </div>
  );

  const framedContent = frameType === 'none' ? (
    inner
  ) : (
    <ProfileFrame frameType={frameType} size={FRAME_PX[size] || FRAME_PX.sm}>
      {inner}
    </ProfileFrame>
  );

  if (linkToProfile && author?.id) {
    return (
      <Link to={`/profile/${author.id}`} className="post-avatar" aria-label={`${label}'s profile`}>
        {framedContent}
      </Link>
    );
  }
  return <span className="post-avatar">{framedContent}</span>;
}
