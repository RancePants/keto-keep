// Fire-and-forget notification inserts. Each helper is a thin wrapper around a
// supabase.from('notifications').insert(...) call. They:
//   - Skip when actorId === recipientId (no self-notifications).
//   - Catch + console.error on failure so a missing notification never blocks
//     the user's primary action.
//
// `link` is a relative path the bell dropdown uses to navigate when clicked.

async function safeInsert(supabase, payload) {
  try {
    const { error } = await supabase.from('notifications').insert(payload);
    if (error) {
      console.error('Notification insert failed:', error.message);
    }
  } catch (err) {
    console.error('Notification insert threw:', err?.message || err);
  }
}

export async function notifyReplyToPost(supabase, postAuthorId, actorId, postTitle, link) {
  if (!postAuthorId || !actorId || actorId === postAuthorId) return;
  const trimmed = (postTitle || '').trim();
  const titleSnippet = trimmed.length > 80 ? `${trimmed.slice(0, 77)}…` : trimmed;
  await safeInsert(supabase, {
    user_id: postAuthorId,
    actor_id: actorId,
    type: 'reply_to_post',
    title: titleSnippet ? `New reply on "${titleSnippet}"` : 'New reply on your post',
    link: link || null,
  });
}

export async function notifyReplyToComment(supabase, commentAuthorId, actorId, link) {
  if (!commentAuthorId || !actorId || actorId === commentAuthorId) return;
  await safeInsert(supabase, {
    user_id: commentAuthorId,
    actor_id: actorId,
    type: 'reply_to_comment',
    title: 'Someone replied to your comment',
    link: link || null,
  });
}

export async function notifyReaction(supabase, contentAuthorId, actorId, emoji, link) {
  if (!contentAuthorId || !actorId || actorId === contentAuthorId) return;
  await safeInsert(supabase, {
    user_id: contentAuthorId,
    actor_id: actorId,
    type: 'reaction',
    title: emoji ? `Someone reacted ${emoji}` : 'Someone reacted to your post',
    body: emoji || null,
    link: link || null,
  });
}

export async function notifyBadgeAwarded(supabase, recipientId, badgeName, actorId, link) {
  if (!recipientId) return;
  if (actorId && actorId === recipientId) return;
  await safeInsert(supabase, {
    user_id: recipientId,
    actor_id: actorId || null,
    type: 'badge_awarded',
    title: badgeName ? `You earned the "${badgeName}" badge` : 'You earned a new badge',
    link: link || null,
  });
}

export async function notifyStatusChange(supabase, targetUserId, newStatus, actorId) {
  if (!targetUserId) return;
  if (actorId && actorId === targetUserId) return;
  const map = {
    active: 'Your account is active again',
    suspended: 'Your account has been suspended',
    banned: 'Your account has been banned',
  };
  await safeInsert(supabase, {
    user_id: targetUserId,
    actor_id: actorId || null,
    type: 'status_change',
    title: map[newStatus] || 'Your account status changed',
    body: newStatus ? `New status: ${newStatus}` : null,
    link: null,
  });
}

// Sends to every active member except the caller via the SECURITY DEFINER RPC.
// Pass null for postId when the broadcast is not tied to a forum post.
export async function notifyNewEvent(supabase, eventTitle, eventLink) {
  try {
    const { error } = await supabase.rpc('broadcast_notification', {
      p_post_id: null,
      p_title: eventTitle ? `New event: ${eventTitle}` : 'New event scheduled',
      p_body: null,
      p_link: eventLink || null,
      p_type: 'new_event',
    });
    if (error) {
      console.error('notifyNewEvent failed:', error.message);
    }
  } catch (err) {
    console.error('notifyNewEvent threw:', err?.message || err);
  }
}

// Helpers ------------------------------------------------------------------

export const NOTIFICATION_ICONS = {
  reply_to_post: '💬',
  reply_to_comment: '💬',
  reaction: '❤️',
  badge_awarded: '🏅',
  new_event: '📅',
  status_change: '⚠️',
  admin_broadcast: '📢',
};

export function notificationIcon(notification) {
  if (notification?.type === 'reaction' && notification.body) {
    return notification.body;
  }
  return NOTIFICATION_ICONS[notification?.type] || '🔔';
}
