import { useId, type CSSProperties } from 'react';
import type { PersonaId } from '@/lib/personas';
import { PERSONAS } from '@/lib/personas';

export type AuraShape = 'avatar' | 'badge' | 'card' | 'reel' | 'scene-portrait';

type AuraProps = {
  persona: PersonaId | 'oshi';
  shape: AuraShape;
  /** px width (height follows the shape). Omitted: fills its container's width. */
  size?: number;
  ring?: 'none' | 'story' | 'live' | 'seen';
  ringSpin?: boolean;
  voiceprint?: boolean;
  monogram?: boolean;
  theme?: 'cream' | 'night';
  className?: string;
};

// Shape boxes in SVG user units (width 100); height gives the aspect ratio.
const BOX: Record<AuraShape, { h: number; radius: string }> = {
  avatar: { h: 100, radius: '50%' },
  badge: { h: 100, radius: '50%' },
  card: { h: 133, radius: '20px' },
  reel: { h: 178, radius: '20px' },
  'scene-portrait': { h: 133, radius: '0' },
};

// Partner orb colours (tokens only): teal-neon, pink-wash, gold-bright.
const ORBS = ['#7df4ff', '#ffe0eb', '#ffd166'] as const;

/** `a` mixed with `b` (both #rrggbb), `t` = share of `a`. */
function mixHex(a: string, b: string, t: number): string {
  const p = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  const c = [0, 1, 2].map((i) => Math.round(p(a, i) * t + p(b, i) * (1 - t)));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** Deterministic 0..1 values from a string (FNV-1a + xorshift). */
function seeded(key: string, n: number): number[] {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    out.push(((h >>> 0) % 1000) / 1000);
  }
  return out;
}

/**
 * Faceless メンカラ aura portrait (spec §4.7): an inline-SVG colour field with
 * soft partner orbs, a sheen band, 4% noise, an optional story/live/seen ring,
 * the monogram and (card/reel/scene) a per-persona 声紋 voiceprint. No photo,
 * no face; `CreatorImage` swaps in a licensed photo when one exists.
 * `persona="oshi"` follows the fan's chosen 推し色 (`--oshi`).
 */
export function Aura({ persona, shape, size, ring = 'none', ringSpin = false, voiceprint, monogram = true, theme = 'cream', className }: AuraProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const def = PERSONAS[persona === 'oshi' ? 'yuzu' : persona];
  const color = persona === 'oshi' ? 'var(--oshi)' : def.color;
  const edge = theme === 'night' ? '#0f1018' : '#fbf7f0';
  // The oshi colour is a runtime CSS var (color-mix); personas mix at build time.
  const tint = persona === 'oshi' ? `color-mix(in srgb, ${color} 70%, #fff)` : mixHex(def.color, '#ffffff', 0.7);
  const deep = persona === 'oshi' ? `color-mix(in srgb, ${color} 55%, ${edge})` : mixHex(def.color, edge, 0.55);
  const { h, radius } = BOX[shape];
  const showPrint = voiceprint ?? (shape === 'card' || shape === 'reel' || shape === 'scene-portrait');
  const r = seeded(`${def.id}:${def.voiceSeed}`, 30);
  const orbA = ORBS[Math.floor(r[0] * ORBS.length)];
  const orbB = ORBS[(Math.floor(r[0] * ORBS.length) + 1 + Math.floor(r[1] * 2)) % ORBS.length];
  const wrap: CSSProperties = {
    width: size ?? '100%',
    aspectRatio: shape === 'scene-portrait' && size === undefined ? undefined : `100 / ${h}`,
    height: shape === 'scene-portrait' && size === undefined ? '100%' : undefined,
    borderRadius: radius,
    ['--mono-size' as string]: size ? `${Math.round(size * 0.4)}px` : '2.4em',
  };
  const id = (k: string) => `aura-${uid}-${k}`;

  return (
    <span aria-hidden="true" className={['aura', className].filter(Boolean).join(' ')} data-aura={shape} data-shape={shape} style={wrap}>
      <span className="aura-body">
        <svg viewBox={`0 0 100 ${h}`} preserveAspectRatio="xMidYMid slice" focusable="false">
          <defs>
            <radialGradient id={id('base')} cx="35%" cy="30%" r="85%">
              <stop offset="0" style={{ stopColor: tint }} />
              <stop offset="0.5" style={{ stopColor: color }} />
              <stop offset="1" style={{ stopColor: deep }} />
            </radialGradient>
            <radialGradient id={id('o1')}>
              <stop offset="0" stopColor={orbA} stopOpacity="0.55" />
              <stop offset="1" stopColor={orbA} stopOpacity="0" />
            </radialGradient>
            <radialGradient id={id('o2')}>
              <stop offset="0" stopColor={orbB} stopOpacity="0.4" />
              <stop offset="1" stopColor={orbB} stopOpacity="0" />
            </radialGradient>
            <linearGradient id={id('sheen')} gradientTransform="rotate(20 .5 .5)">
              <stop offset="0.3" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.18" />
              <stop offset="0.7" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="100" height={h} fill={`url(#${id('base')})`} />
          <circle cx={20 + r[2] * 60} cy={h * (0.15 + r[3] * 0.35)} r={30 + r[4] * 18} fill={`url(#${id('o1')})`} />
          <circle cx={15 + r[5] * 70} cy={h * (0.5 + r[6] * 0.4)} r={26 + r[7] * 16} fill={`url(#${id('o2')})`} />
          <rect width="100" height={h} fill={`url(#${id('sheen')})`} />
          {showPrint ? (
            <g fill="#fff" opacity="0.82">
              {Array.from({ length: 24 }, (_, i) => {
                const bh = 3 + r[(i + 6) % r.length] * (h * 0.14);
                const x = 8 + i * 3.6;
                const cy = h * 0.8;
                return <rect key={i} x={x} y={cy - bh / 2} width="2" height={bh} rx="1" opacity={i % 3 === 2 ? 0.5 : 1} />;
              })}
            </g>
          ) : null}
        </svg>
        <span className="aura-noise" />
        {monogram ? <span className="aura-mono">{def.monogram}</span> : null}
      </span>
      {ring !== 'none' ? <span className="aura-ring" data-ring={ring} data-spin={ringSpin ? '' : undefined} data-loop={ringSpin ? '' : undefined} /> : null}
    </span>
  );
}
