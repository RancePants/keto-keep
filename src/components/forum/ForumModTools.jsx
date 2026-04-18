import { useEffect, useRef, useState } from 'react';

export default function ForumModTools({ isAdmin, isAuthor, isPinned, onTogglePin, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (!isAdmin && !isAuthor) return null;

  const call = (fn) => () => {
    setOpen(false);
    fn?.();
  };

  return (
    <div className="post-mod-tools" ref={wrapRef}>
      <button
        type="button"
        className="kebab-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Post options"
        aria-expanded={open}
      >
        ⋯
      </button>
      {open && (
        <div className="kebab-menu" role="menu">
          {isAdmin && onTogglePin && (
            <button type="button" onClick={call(onTogglePin)}>
              {isPinned ? 'Unpin post' : 'Pin post'}
            </button>
          )}
          {onEdit && (
            <button type="button" onClick={call(onEdit)}>
              Edit post
            </button>
          )}
          {onDelete && (
            <button type="button" className="danger" onClick={call(onDelete)}>
              Delete post
            </button>
          )}
        </div>
      )}
    </div>
  );
}
