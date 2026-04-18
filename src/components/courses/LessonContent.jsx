import { useMemo } from 'react';
import DOMPurify from 'dompurify';

// Admin-authored HTML lives in lessons.content_html. We sanitize as a safety habit,
// allowing iframes so YouTube embeds survive.
const SANITIZE_CONFIG = {
  ADD_TAGS: ['iframe'],
  ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'referrerpolicy'],
};

export default function LessonContent({ html }) {
  const safe = useMemo(() => {
    if (!html) return '';
    return DOMPurify.sanitize(html, SANITIZE_CONFIG);
  }, [html]);

  if (!safe) {
    return <div className="lesson-content-empty">This lesson has no content yet.</div>;
  }

  return (
    <div
      className="lesson-content"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
