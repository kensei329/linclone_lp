import type { PersonaId } from '@/lib/personas';
import { Aura, type AuraShape } from './Aura';

type CreatorImageProps = { persona: PersonaId | 'oshi'; shape: AuraShape; sizes: string; preload?: boolean; theme?: 'cream' | 'night' };

/**
 * Licensed photo if one exists, otherwise the Aura (spec §4.7). No persona has
 * a portrait, so this renders the Aura. STUB (WP0a): WP0b adds the next/image
 * branch.
 */
export function CreatorImage({ persona, shape, theme }: CreatorImageProps) {
  return <Aura persona={persona} shape={shape} theme={theme} />;
}
