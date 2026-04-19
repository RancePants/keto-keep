// ProfileFrame — wraps a circular avatar in a decorative ring.
// 10 frame styles keyed on `profile_frame_type` in Supabase.
//
// All frames render an 100×100 viewBox with the avatar clipped to a centered
// circle inside. The wrapper <svg> scales to the requested size via `width`
// on the root element; the children (avatar image or initial fallback) are
// projected into the clip area.
//
// Design philosophy:
// - Small file weight; no external assets.
// - Limited gradient/filter use so 40+ avatars per page stay cheap to paint.
// - Colors as literal hex in the SVG (not CSS vars) so the frame looks
//   identical in light and dark mode.
// - The clipped avatar always occupies the center 64×64 — frames decorate
//   the surrounding ring.
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

const AVATAR_INSET = 18; // distance from viewBox edge (0..100) to avatar circle edge
const AVATAR_RADIUS = 50 - AVATAR_INSET; // i.e. 32 — avatar circle radius in viewBox coords

export default function ProfileFrame({
  frameType = 'none',
  size = 'sm',
  children,
  className,
  ariaLabel,
}) {
  const px = typeof size === 'number' ? size : SIZE_TOKENS[size] || SIZE_TOKENS.sm;

  const frameContent = renderFrameContent(frameType);

  return (
    <span
      className={`profile-frame profile-frame-${frameType}${className ? ' ' + className : ''}`}
      style={{ width: px, height: px, display: 'inline-block', position: 'relative' }}
      aria-label={ariaLabel}
    >
      <svg
        className="profile-frame-svg"
        viewBox="0 0 100 100"
        width={px}
        height={px}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        {/* Decorative frame layer — sits behind/around the avatar */}
        {frameContent}
      </svg>
      {/* Avatar layer — CSS-clipped to the same circle the SVG uses */}
      <span
        className="profile-frame-avatar"
        style={{
          position: 'absolute',
          // Inset matches AVATAR_INSET as a percentage: 18/100 = 18%
          top: `${AVATAR_INSET}%`,
          left: `${AVATAR_INSET}%`,
          width: `${100 - AVATAR_INSET * 2}%`,
          height: `${100 - AVATAR_INSET * 2}%`,
          borderRadius: '50%',
          overflow: 'hidden',
        }}
      >
        {children}
      </span>
    </span>
  );
}

// ---------------- Frame renderers ----------------

function renderFrameContent(type) {
  switch (type) {
    case 'stone':         return <FrameStone />;
    case 'iron_band':     return <FrameIronBand />;
    case 'wooden':        return <FrameWooden />;
    case 'ivy_wreath':    return <FrameIvyWreath />;
    case 'gold_filigree': return <FrameGoldFiligree />;
    case 'fire_ring':     return <FrameFireRing />;
    case 'dragon_scale':  return <FrameDragonScale />;
    case 'royal_crown':   return <FrameRoyalCrown />;
    case 'coach_seal':    return <FrameCoachSeal />;
    case 'none':
    default:
      return null;
  }
}

// Hewn stone — rough grey ring with subtle mottling.
function FrameStone() {
  return (
    <g>
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 8} fill="#8a8a8a" />
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 7} fill="#b0b0b0" />
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 5} fill="#6e6e6e" />
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 3} fill="#888888" />
      {/* mottled stone specks around the ring */}
      <circle cx="26" cy="30" r="1.6" fill="#5a5a5a" />
      <circle cx="78" cy="22" r="1.2" fill="#5a5a5a" />
      <circle cx="84" cy="58" r="1.8" fill="#4a4a4a" />
      <circle cx="72" cy="84" r="1.4" fill="#5a5a5a" />
      <circle cx="18" cy="62" r="1.2" fill="#4a4a4a" />
      <circle cx="30" cy="82" r="1.6" fill="#5a5a5a" />
      {/* subtle highlights */}
      <path d="M 20 42 A 30 30 0 0 1 40 20" stroke="#c8c8c8" strokeWidth="1.4" fill="none" opacity="0.7" />
    </g>
  );
}

// Iron band — dark gunmetal ring with six evenly spaced rivets.
function FrameIronBand() {
  const rivets = [];
  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const r = AVATAR_RADIUS + 5;
    const cx = 50 + Math.cos(angle) * r;
    const cy = 50 + Math.sin(angle) * r;
    rivets.push(<circle key={i} cx={cx} cy={cy} r="1.6" fill="#1e1e1e" stroke="#6a6a6a" strokeWidth="0.4" />);
  }
  return (
    <g>
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 8} fill="#2a2a2a" />
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 7} fill="#4a4a4a" />
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 4} fill="#333333" />
      {/* subtle top highlight */}
      <path d="M 22 42 A 30 30 0 0 1 46 20" stroke="#6e6e6e" strokeWidth="1" fill="none" opacity="0.8" />
      {rivets}
    </g>
  );
}

// Wooden — warm brown ring with grain lines.
function FrameWooden() {
  return (
    <g>
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 8} fill="#5a3a10" />
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 7} fill="#8b6914" />
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 4} fill="#6d4e0f" />
      {/* grain lines — arcs along the ring */}
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 6.5} fill="none" stroke="#4a2f0a" strokeWidth="0.4" opacity="0.8" />
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 5.5} fill="none" stroke="#4a2f0a" strokeWidth="0.3" opacity="0.5" strokeDasharray="2 3" />
      <path d="M 50 20 Q 55 30 52 40" stroke="#3a2408" strokeWidth="0.6" fill="none" opacity="0.6" />
      <path d="M 80 50 Q 70 55 60 52" stroke="#3a2408" strokeWidth="0.5" fill="none" opacity="0.5" />
      <path d="M 50 80 Q 45 70 48 60" stroke="#3a2408" strokeWidth="0.6" fill="none" opacity="0.5" />
    </g>
  );
}

// Ivy wreath — green ring with leaf clusters.
function FrameIvyWreath() {
  const leaves = [];
  const count = 14;
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const r = AVATAR_RADIUS + 6;
    const cx = 50 + Math.cos(angle) * r;
    const cy = 50 + Math.sin(angle) * r;
    const rot = (angle * 180) / Math.PI + 90;
    // alternate leaf size/color for a less mechanical feel
    const fill = i % 2 === 0 ? '#2d7a3a' : '#4a9a55';
    const stroke = '#1e5c2a';
    leaves.push(
      <g key={i} transform={`translate(${cx} ${cy}) rotate(${rot})`}>
        {/* leaf shape — pointed oval */}
        <path d="M 0 -4 Q 2.4 -1 0 4 Q -2.4 -1 0 -4 Z" fill={fill} stroke={stroke} strokeWidth="0.3" />
        <line x1="0" y1="-4" x2="0" y2="4" stroke={stroke} strokeWidth="0.3" opacity="0.7" />
      </g>
    );
  }
  return (
    <g>
      {/* inner vine ring */}
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 3} fill="none" stroke="#1e5c2a" strokeWidth="2" />
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 3} fill="none" stroke="#2d7a3a" strokeWidth="0.6" opacity="0.8" />
      {leaves}
    </g>
  );
}

// Gold filigree — ornate gold ring with scrollwork flourishes at cardinal
// points.
function FrameGoldFiligree() {
  const flourishes = [0, 90, 180, 270].map((deg) => (
    <g key={deg} transform={`rotate(${deg} 50 50)`}>
      {/* small curlicue at top (12 o'clock of rotated frame) */}
      <path
        d="M 50 14 Q 44 10 40 14 Q 42 18 46 16 M 50 14 Q 56 10 60 14 Q 58 18 54 16"
        stroke="#8a6508"
        strokeWidth="1"
        fill="#daa520"
      />
      <circle cx="50" cy="14" r="1.6" fill="#fff2a8" stroke="#8a6508" strokeWidth="0.4" />
    </g>
  ));
  return (
    <g>
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 8} fill="#8a6508" />
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 7} fill="#daa520" />
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 5} fill="#b8860b" />
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 3} fill="#daa520" />
      {/* inner bevel highlight */}
      <path d="M 24 40 A 30 30 0 0 1 44 20" stroke="#fff2a8" strokeWidth="1" fill="none" opacity="0.8" />
      {flourishes}
    </g>
  );
}

// Fire ring — amber flames licking around the edge.
function FrameFireRing() {
  const flames = [];
  const count = 12;
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const r = AVATAR_RADIUS + 5;
    const cx = 50 + Math.cos(angle) * r;
    const cy = 50 + Math.sin(angle) * r;
    const rot = (angle * 180) / Math.PI + 90;
    flames.push(
      <g key={i} transform={`translate(${cx} ${cy}) rotate(${rot})`}>
        {/* flame tongue pointing outward */}
        <path d="M 0 -6 Q 2 -2 0 3 Q -2 -2 0 -6 Z" fill="#e87c1e" />
        <path d="M 0 -4 Q 1.2 -1 0 2 Q -1.2 -1 0 -4 Z" fill="#ffd08a" />
      </g>
    );
  }
  return (
    <g>
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 2} fill="none" stroke="#c96415" strokeWidth="2.4" />
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 2} fill="none" stroke="#f4a14a" strokeWidth="0.8" opacity="0.9" />
      {flames}
    </g>
  );
}

// Dragon scale — overlapping scales in green-to-gold gradient.
function FrameDragonScale() {
  const scales = [];
  const count = 18;
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const r = AVATAR_RADIUS + 5;
    const cx = 50 + Math.cos(angle) * r;
    const cy = 50 + Math.sin(angle) * r;
    const rot = (angle * 180) / Math.PI + 90;
    // color drifts from deep green (top) to gold (bottom) via angle
    const t = (Math.sin(angle) + 1) / 2;
    const r1 = Math.round(0x4a + (0xda - 0x4a) * t);
    const g1 = Math.round(0x7c + (0xa5 - 0x7c) * t);
    const b1 = Math.round(0x3f + (0x20 - 0x3f) * t);
    const fill = `rgb(${r1},${g1},${b1})`;
    scales.push(
      <g key={i} transform={`translate(${cx} ${cy}) rotate(${rot})`}>
        <path d="M -3.2 0 Q 0 -4.5 3.2 0 Q 0 1.8 -3.2 0 Z" fill={fill} stroke="#2f4a24" strokeWidth="0.3" />
        <path d="M -1.5 -1 Q 0 -3.2 1.5 -1 Q 0 -0.4 -1.5 -1 Z" fill="#ffffff" opacity="0.18" />
      </g>
    );
  }
  return (
    <g>
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 3} fill="none" stroke="#2f4a24" strokeWidth="2" />
      {scales}
    </g>
  );
}

// Royal crown — gold ring with a crown element sitting at 12 o'clock.
function FrameRoyalCrown() {
  return (
    <g>
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 5} fill="#8a6508" />
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 4} fill="#daa520" />
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 2} fill="#b8860b" />
      {/* inner highlight */}
      <path d="M 24 40 A 30 30 0 0 1 44 20" stroke="#fff2a8" strokeWidth="0.8" fill="none" opacity="0.7" />
      {/* crown at top */}
      <g>
        <rect x="38" y="13" width="24" height="5" rx="0.8" fill="#daa520" stroke="#8a6508" strokeWidth="0.6" />
        <path
          d="M 38 13 L 42 4 L 46 10 L 50 2 L 54 10 L 58 4 L 62 13 Z"
          fill="#daa520"
          stroke="#8a6508"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        {/* jewels */}
        <circle cx="42" cy="4" r="1.1" fill="#e74c3c" stroke="#8a6508" strokeWidth="0.3" />
        <circle cx="50" cy="2.3" r="1.4" fill="#3498db" stroke="#8a6508" strokeWidth="0.3" />
        <circle cx="58" cy="4" r="1.1" fill="#2ecc71" stroke="#8a6508" strokeWidth="0.3" />
        <circle cx="50" cy="15.5" r="0.9" fill="#e74c3c" stroke="#8a6508" strokeWidth="0.2" />
      </g>
    </g>
  );
}

// Coach's seal — deep green ring with gold rim and a small shield crest
// centered at 12 o'clock.
function FrameCoachSeal() {
  return (
    <g>
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 8} fill="#daa520" />
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 6.5} fill="#1b5e20" />
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 4} fill="#daa520" />
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 3} fill="#1b5e20" />
      {/* rope-like dash ring on the green band */}
      <circle cx="50" cy="50" r={AVATAR_RADIUS + 5.2} fill="none" stroke="#daa520" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.9" />
      {/* small shield crest at top */}
      <g>
        <path
          d="M 50 4 L 56 6 L 56 11 C 56 14 53 16 50 17 C 47 16 44 14 44 11 L 44 6 Z"
          fill="#daa520"
          stroke="#1b5e20"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        {/* leaf inside shield — coach motif */}
        <path d="M 50 8 Q 52 11 50 14 Q 48 11 50 8 Z" fill="#1b5e20" />
      </g>
    </g>
  );
}
