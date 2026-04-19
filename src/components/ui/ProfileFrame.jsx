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
      {/* Avatar layer fills the container */}
      <span
        className="profile-frame-avatar"
        style={{ display: 'block', width: '100%', height: '100%' }}
      >
        {children}
      </span>
      {slug && (
        <>
          {/* Charcoal backing — masked by the frame PNG so it only fills where
              the frame has pixels, preventing background bleed through gaps */}
          <span
            aria-hidden="true"
            className="frame-backing"
            style={{
              position: 'absolute',
              top: overlayOffset,
              left: overlayOffset,
              width: overlaySize,
              height: overlaySize,
              maxWidth: 'none',
              background: 'var(--frame-backing-color, var(--color-surface))',
              clipPath: 'polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 16.67% 16.67%, 83.33% 16.67%, 83.33% 83.33%, 16.67% 83.33%, 16.67% 16.67%)',
              borderRadius: '6px',
              pointerEvents: 'none',
            }}
          />
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
            }}
          />
        </>
      )}
    </span>
  );
}
