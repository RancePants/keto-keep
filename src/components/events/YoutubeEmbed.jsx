import { useEffect, useRef, useState } from 'react';
import { getYoutubeEmbedSrc } from '../../lib/eventHelpers.js';

export default function YoutubeEmbed({ url, title = 'Past livestream' }) {
  const embedSrc = getYoutubeEmbedSrc(url);
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!embedSrc) return undefined;
    const node = containerRef.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      const t = setTimeout(() => setInView(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: '200px 0px' }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [embedSrc]);

  if (!embedSrc) {
    return (
      <div className="youtube-embed youtube-embed-fallback" ref={containerRef}>
        <p>Recording unavailable.</p>
      </div>
    );
  }

  return (
    <div className="youtube-embed" ref={containerRef}>
      {inView ? (
        <iframe
          src={embedSrc}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <div className="youtube-embed-placeholder" aria-hidden="true" />
      )}
    </div>
  );
}
