import type { PersonaId } from '@/lib/personas';
import { Aura } from '@/components/site/aura/Aura';

/** Avatar with story/live/seen ring (spec §4.8). */
export function RingAvatar({ persona, size, ring }: { persona: PersonaId | 'oshi'; size: number; ring: 'none' | 'story' | 'live' | 'seen' }) {
  return <Aura persona={persona} shape="avatar" size={size} ring={ring} />;
}
