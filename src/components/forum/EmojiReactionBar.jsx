import { useEffect, useRef, useState } from 'react';
import { REACTION_EMOJIS, groupReactions } from '../../lib/forumHelpers.js';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../contexts/useAuth.js';

export default function EmojiReactionBar({ target, reactions, onChange, onReactionAdded }) {
  const { user } = useAuth();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const wrapRef = useRef(null);

  const grouped = groupReactions(reactions || [], user?.id);

  useEffect(() => {
    if (!pickerOpen) return undefined;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [pickerOpen]);

  const targetFilter = target.kind === 'post'
    ? { post_id: target.id }
    : { reply_id: target.id };

  const toggle = async (emoji) => {
    if (!user?.id || pending) return;
    setPending(true);
    setPickerOpen(false);
    try {
      const mine = (reactions || []).find(
        (r) => r.emoji === emoji && r.user_id === user.id
      );
      if (mine) {
        const { error } = await supabase
          .from('forum_reactions')
          .delete()
          .eq('user_id', user.id)
          .eq('emoji', emoji)
          .match(targetFilter);
        if (error) console.error('Remove reaction failed:', error.message);
      } else {
        const { error } = await supabase.from('forum_reactions').insert({
          user_id: user.id,
          emoji,
          ...targetFilter,
        });
        if (error) {
          console.error('Add reaction failed:', error.message);
        } else if (onReactionAdded) {
          onReactionAdded(emoji);
        }
      }
      if (onChange) await onChange();
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="reaction-bar">
      {grouped.map((g) => (
        <button
          key={g.emoji}
          type="button"
          className={`reaction-chip ${g.mine ? 'mine' : ''}`}
          onClick={() => toggle(g.emoji)}
          disabled={pending}
          aria-label={`${g.emoji} ${g.count} ${g.mine ? '(you reacted)' : ''}`}
        >
          <span className="reaction-chip-emoji">{g.emoji}</span>
          <span>{g.count}</span>
        </button>
      ))}
      <div className="reaction-wrap" ref={wrapRef}>
        <button
          type="button"
          className="reaction-chip reaction-add"
          onClick={() => setPickerOpen((v) => !v)}
          aria-expanded={pickerOpen}
          aria-label="Add reaction"
          disabled={pending}
        >
          <span>➕</span>
        </button>
        {pickerOpen && (
          <div className="emoji-picker" role="menu">
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => toggle(emoji)}
                aria-label={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
