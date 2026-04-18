import { Link } from 'react-router-dom';
import { usePrivateImage } from './usePrivateImage.js';

export default function UserAvatar({ author, size = 'sm', linkToProfile = true }) {
  const path = author?.avatar_url || null;
  const url = usePrivateImage('avatars', path);
  const initial = (author?.display_name || '?').trim().charAt(0).toUpperCase() || '?';
  const label = author?.display_name || 'Member';

  const imgClass = size === 'xs' ? 'avatar-xs' : 'avatar-sm';
  const fbClass = size === 'xs' ? 'avatar-xs-fallback' : 'avatar-sm-fallback';

  const content = url ? (
    <img src={url} alt={label} className={imgClass} />
  ) : (
    <div className={fbClass} aria-label={label}>
      <span>{initial}</span>
    </div>
  );

  if (linkToProfile && author?.id) {
    return (
      <Link to={`/profile/${author.id}`} className="post-avatar" aria-label={`${label}'s profile`}>
        {content}
      </Link>
    );
  }
  return <span className="post-avatar">{content}</span>;
}
