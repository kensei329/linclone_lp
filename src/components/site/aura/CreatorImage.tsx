import Image from 'next/image';
import type { PersonaId } from '@/lib/personas';
import { PERSONAS } from '@/lib/personas';
import { Aura, type AuraShape } from './Aura';

type CreatorImageProps = { persona: PersonaId | 'oshi'; shape: AuraShape; sizes: string; preload?: boolean; theme?: 'cream' | 'night' };

/**
 * A licensed photo when `PERSONAS[p].portrait` exists, otherwise the faceless
 * Aura (spec §4.7). Fills its container. `lib/personas.ts` throws at import if
 * a portrait lacks `licensed: true` and a `rightsRef`, so an unlicensed photo
 * can never ship. Today no persona has a portrait.
 */
export function CreatorImage({ persona, shape, sizes, preload = false, theme }: CreatorImageProps) {
  const def = PERSONAS[persona === 'oshi' ? 'yuzu' : persona];
  const photo = def.portrait;
  if (!photo) return <Aura persona={persona} shape={shape} theme={theme} />;
  const round = shape === 'avatar' || shape === 'badge';
  const scrim = shape === 'card' || shape === 'reel';
  return (
    <span
      className="creator-image"
      style={{ position: 'relative', display: 'block', width: '100%', height: '100%', overflow: 'hidden', borderRadius: round ? '50%' : shape === 'scene-portrait' ? 0 : 20 }}
    >
      <Image
        src={photo.src}
        alt=""
        fill
        sizes={sizes}
        preload={preload}
        style={{ objectFit: 'cover', objectPosition: `${photo.focal[0] * 100}% ${photo.focal[1] * 100}%` }}
      />
      {scrim ? <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'var(--grad-photo-fade)' }} /> : null}
    </span>
  );
}
