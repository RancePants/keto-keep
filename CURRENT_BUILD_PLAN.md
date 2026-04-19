# Build Plan — v0.11.10: Custom Frame PNGs + ProfileFrame Simplification

## Pre-Build
- [ ] Read this file first. Re-read after ANY compaction.

## 1. Replace Frame PNGs
Copy the 9 new frame PNGs from `D:\The Keto Keep\Frames\` to `public\frames\`, overwriting the originals:

```powershell
Copy-Item "D:\The Keto Keep\Frames\*.png" "D:\The Keto Keep\public\frames\" -Force
```

Files (9):
- frame-hewn-stone.png
- frame-iron-band.png
- frame-wooden.png
- frame-ivy-wreath.png
- frame-gold-filigree.png
- frame-fire-ring.png
- frame-dragon-scale.png
- frame-royal-crown.png
- frame-coach-seal.png

Also delete any backing PNGs that may exist from previous attempts:
```powershell
Remove-Item "D:\The Keto Keep\public\frames\*-backing.png" -ErrorAction SilentlyContinue
```

## 2. Simplify ProfileFrame.jsx
**File:** `src/components/ui/ProfileFrame.jsx`

The new frame PNGs have charcoal baked in with a transparent center cutout. This means ProfileFrame only needs TWO layers:

1. **Avatar** (children)
2. **Frame PNG overlay** on top

Remove ALL of the following:
- The frame-backing `<span>` (charcoal rectangle with clip-path and/or masks)
- Any behind-avatar backer `<span>`
- All mask-image, WebkitMaskImage, maskSize, maskRepeat, maskComposite properties
- All clipPath properties
- All zIndex properties
- Any `position: relative` added to the avatar span for z-index stacking

The component should simplify to roughly:

```jsx
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

      {/* Frame overlay — new PNGs have charcoal baked in with transparent center */}
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
            maxWidth: 'none',
            pointerEvents: 'none',
          }}
        />
      )}
    </span>
  );
}
```

Keep the constants (SIZE_TOKENS, FRAME_SLUG, FRAME_SCALE, FRAME_OFFSET_RATIO) and the component header comment unchanged.

## 3. Version Bump
**File:** `package.json`
- Bump version `0.11.9` → `0.11.10`

## 4. Verify
- [ ] New frame PNGs in `public/frames/` (9 files, no backing PNGs)
- [ ] `npm run lint` — zero errors
- [ ] `npm run build` — clean
- [ ] Commit with message: `v0.11.10: custom frame PNGs with baked-in backing, simplify ProfileFrame`
- [ ] Push to main
- [ ] Verify Cloudflare deploy
