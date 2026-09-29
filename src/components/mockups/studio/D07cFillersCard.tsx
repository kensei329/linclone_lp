import type { MockProps } from '@/components/mockups/types';
import { Waveform } from '@/components/site';
import { cx } from './parts';
import s from './studio.module.css';

/**
 * S17c `D07cFillersCard` (card, night-glass; spec §7.2, source
 * d07c-call-fillers): two tone cards with a sample and a `Waveform`
 * (`[data-m="wave-gentle"]` / `[data-m="wave-casual"]`). The selected card
 * (`data-selected`, SSR gentle) has the 2px cyan ring and its waveform plays
 * (CSS loop, in view only; static under reduced motion). No "10 per tone",
 * no coin note.
 */
export function D07cFillersCard({ d, className }: MockProps) {
  const f = d.mock.studio.fillers;
  const tones = [
    { key: 'gentle', name: f.gentle, sample: f.gentleSample, selected: true, seed: 0 },
    { key: 'casual', name: f.casual, sample: f.casualSample, selected: false, seed: 5 },
  ];
  return (
    <div className={cx(s.card, s.night, className)} data-mock="D07cFillersCard">
      <div className={s.cardHead}>
        <span className={s.cardTitle}>{f.title}</span>
        <span className={s.cardSub}>{f.intro}</span>
      </div>
      <div className={s.toneCards}>
        {tones.map((t) => (
          <div key={t.key} className={cx(s.nPane, s.toneCard)} data-selected={t.selected ? '' : undefined} data-tone-card={t.key}>
            <span className={s.toneName}>
              {t.name}
              <span className={s.toneRadio} />
            </span>
            <span className={s.toneSample}>{t.sample}</span>
            <span data-m={`wave-${t.key}`}>
              <Waveform tone={t.selected ? 'neon' : 'white'} size="sm" bars={9} seed={t.seed} playing={t.selected} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
