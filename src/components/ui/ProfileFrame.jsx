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
      {/* PNG frame overlay — stacked drop-shadows back semi-transparent pixels */}
      {slug && (
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
            filter: 'drop-shadow(0 0 0 #000) drop-shadow(0 0 0 #000) drop-shadow(0 0 0 #000)',
          }}
        />
      )}
    </span>
  );
}
