// ProfileFrame — wraps a square avatar with an optional decorative PNG frame.
//
// Frame PNGs live in /public/frames/ as 512×512 transparent images with a
// transparent center hole. The avatar shows through the hole; the decorative
// border extends slightly beyond the avatar edges.
//
// The `none` frame renders the avatar with no overlay — just the square image.
//
// Usage:
//   <ProfileFrame frameType="ivy_wreath" size={64}>
//     <img src={url} alt="" />
//   </ProfileFrame>

const SIZE_TOKENS = {
  xs: 28,
  sm: 40,
  md: 56,
  lg: 96,
  xl: 140,
};

// Maps frame_type values to PNG filenames in /public/frames/
const FRAME_SLUG = {
  stone:         'hewn-stone',
  iron_band:     'iron-band',
  wooden:        'wooden',
  ivy_wreath:    'ivy-wreath',
  gold_filigree: 'gold-filigree',
  fire_ring:     'fire-ring',
  dragon_scale:  'dragon-scale',
  royal_crown:   'royal-crown',
  coach_seal:    'coach-seal',
};

// Frame overlay is 150% of the avatar size so the center hole fully clears the
// avatar boundary. Offset is (FRAME_SCALE - 1) / 2 to keep the overlay centered.
const FRAME_SCALE = 1.50;
const FRAME_OFFSET_RATIO = 0.25;

export default function ProfileFrame({
  frameType = 'none',
  size = 'sm',
  children,
  className,
  ariaLabel,
}) {
  const px = typeof size === 'number' ? size : SIZE_TOKENS[size] || SIZE_TOKENS.sm;
  const slug = FRAME_SLUG[frameType];

  const overlaySize = Math.round(px * FRAME_SCALE);
  const overlayOffset = -Math.round(px * FRAME_OFFSET_RATIO);

  return (
    <span
      className={`profile-frame profile-frame-${frameType}${className ? ' ' + className : ''}`}
      style={{ width: px, height: px, display: 'inline-block', position: 'relative', flexShrink: 0 }}
      aria-label={ariaLabel}
    >
      {slug && (
        /* Layer 1: Charcoal square behind avatar — 5% bigger than avatar,
           centered. Fills rounded-corner gaps between photo and frame inner edge. */
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -Math.round(px * 0.025),
            left: -Math.round(px * 0.025),
            width: Math.round(px * 1.05),
            height: Math.round(px * 1.05),
            background: '#2a2a2a',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      {/* Layer 2: Avatar — above the behind-avatar backer */}
      <span
        className="profile-frame-avatar"
        style={{ display: 'block', width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
      >
        {children}
      </span>

      {slug && (
        <>
          {/* Layer 3: Backing PNG — frame-shaped charcoal silhouette.
              Clip-path cuts out the avatar area so photo shows through. */}
          <img
            src={`/frames/frame-${slug}-backing.png`}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: overlayOffset,
              left: overlayOffset,
              width: overlaySize,
              height: overlaySize,
              maxWidth: 'none',
              clipPath: 'polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 16.67% 16.67%, 83.33% 16.67%, 83.33% 83.33%, 16.67% 83.33%, 16.67% 16.67%)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* Layer 4: Frame PNG — decorative artwork on top */}
          <img
            src={`/frames/frame-${slug}.png`}
            alt=""
            aria-hidden="true"
            className="frame-overlay"
            style={{
              position: 'absolute',
              top: overlayOffset,
              left: overlayOffset,
              width: overlaySize,
              height: overlaySize,
              maxWidth: 'none',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />
        </>
      )}
    </span>
  );
}
