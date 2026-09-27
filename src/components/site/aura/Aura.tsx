import type { PersonaId } from '@/lib/personas';
import { PERSONAS } from '@/lib/personas';

export type AuraShape = 'avatar' | 'badge' | 'card' | 'reel' | 'scene-portrait';

type AuraProps = {
  persona: PersonaId | 'oshi';
  shape: AuraShape;
  size?: number;
  ring?: 'none' | 'story' | 'live' | 'seen';
  ringSpin?: boolean;
  voiceprint?: boolean;
  monogram?: boolean;
  theme?: 'cream' | 'night';
  className?: string;
};

/**
 * Faceless メンカラ aura portrait (spec §4.7). STUB (WP0a): a flat colour disc
 * with the monogram; WP0b builds the SVG gradients, ring and voiceprint.
 */
export function Aura({ persona, shape, size = 96, monogram = true, className }: AuraProps) {
  const p = PERSONAS[persona === 'oshi' ? 'yuzu' : persona];
  const color = persona === 'oshi' ? 'var(--oshi)' : p.color;
  return (
    <span
      aria-hidden="true"
      className={className}
      data-aura={shape}
      style={{ display: 'inline-grid', placeItems: 'center', width: size, height: size, borderRadius: shape === 'avatar' || shape === 'badge' ? '50%' : 20, background: color, color: '#fff' }}
    >
      {monogram ? p.monogram : null}
    </span>
  );
}
