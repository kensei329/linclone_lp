import type { SectionProps } from '@/i18n/types';
import type { PersonaId } from '@/lib/personas';
import { Marquee } from '@/components/site/marquee/Marquee';

const CAST: PersonaId[] = ['yuzu', 'ren', 'kai', 'sora', 'nagi'];

/** #cast: can-badge marquee, no heading (spec §5.2). STUB (WP0a), owned by WP1: replace wholesale. */
export function CastMarquee({ d }: SectionProps) {
  return (
    <section id="cast" aria-label={d.home.cast.label} data-surface="light">
      <Marquee rows={1} label={d.home.cast.label} items={CAST.map((p) => d.personas[p].name)} />
      <p className="t-small">{d.home.cast.note}</p>
    </section>
  );
}
