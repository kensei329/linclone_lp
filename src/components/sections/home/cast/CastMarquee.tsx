import type { SectionProps } from '@/i18n/types';
import type { PersonaId } from '@/lib/personas';
import { Aura, Icon, Marquee } from '@/components/site';
import s from './cast.module.css';

/** The fictional cast, Yuzu first (as the fan's 推し, so she follows the 推し色 picker). */
const CAST: { id: PersonaId; aura: PersonaId | 'oshi' }[] = [
  { id: 'yuzu', aura: 'oshi' },
  { id: 'ren', aura: 'ren' },
  { id: 'kai', aura: 'kai' },
  { id: 'sora', aura: 'sora' },
  { id: 'nagi', aura: 'nagi' },
  { id: 'aoi', aura: 'aoi' },
];

/**
 * #cast (spec §5.2): "these are official AI clones of creators", at a glance
 * and with no faces. Each item is a vinyl-glass can badge: a メンカラ aura
 * with a spinning story ring, the name, genre and the official chip. Two rows
 * on desktop (the second reversed), one on mobile; a static wrap under
 * reduced motion. No heading: the section is labelled.
 */
export function CastMarquee({ d }: SectionProps) {
  const t = d.home.cast;
  const item = ({ id, aura }: (typeof CAST)[number]) => (
    <div className={`glass-fake ${s.card}`}>
      <span className={s.badge}>
        <Aura persona={aura} shape="badge" ring="story" ringSpin voiceprint={false} />
      </span>
      <span className={s.text}>
        <span className={s.name}>{d.personas[id].name}</span>
        <span className={`t-small ${s.genre}`}>{d.personas[id].genre}</span>
        <span className={s.official}>
          <Icon name="verified" filled size={12} />
          {t.badge}
        </span>
      </span>
    </div>
  );
  return (
    <section id="cast" aria-label={t.label} data-surface="light" className={`surface-cream ${s.cast}`}>
      <Marquee rows={2} label={t.label} speed={48} items={CAST.map((c) => item(c))} />
      <p className={`t-small container-site ${s.note}`}>{t.note}</p>
    </section>
  );
}
