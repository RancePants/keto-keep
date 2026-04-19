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

// The PNG frames are designed with ~15% decorative border on each side.
// The overlay is rendered 130% of the avatar size, offset -15% top/left.
const FRAME_SCALE = 1.30;
const FRAME_OFFSET_RATIO = 0.15;

// Percentage inset from each overlay edge where the transparent avatar hole begins.
// Used to cut out the center of the black backing so only the frame border is backed.
const INSET_PCT = (FRAME_OFFSET_RATIO / FRAME_SCALE) * 100; // ≈ 11.54

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
      {/* PNG frame overlay — slightly larger than avatar so border extends beyond */}
      {slug && (
        <>
          {/* Black backing prevents background bleed through semi-transparent frame pixels */}
          <span
            aria-hidden="true"
            className="frame-backing"
            style={{
              position: 'absolute',
              top: overlayOffset,
              left: overlayOffset,
              width: overlaySize,
              height: overlaySize,
              background: '#000',
              clipPath: `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, ${INSET_PCT}% ${INSET_PCT}%, ${100 - INSET_PCT}% ${INSET_PCT}%, ${100 - INSET_PCT}% ${100 - INSET_PCT}%, ${INSET_PCT}% ${100 - INSET_PCT}%)`,
              WebkitClipPath: `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, ${INSET_PCT}% ${INSET_PCT}%, ${100 - INSET_PCT}% ${INSET_PCT}%, ${100 - INSET_PCT}% ${100 - INSET_PCT}%, ${INSET_PCT}% ${100 - INSET_PCT}%)`,
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
              pointerEvents: 'none',
            }}
          />
        </>
      )}
    </span>
  );
}
