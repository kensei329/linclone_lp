import { Fragment } from 'react';
import type { MockProps } from '@/components/mockups/types';
import { Icon } from '@/components/site';
import { cx } from './parts';
import s from './studio.module.css';

const PIPE = ['draft', 'synth', 'published'] as const;

/**
 * S17a `D07HomeVoiceCard` (card, night-glass variant for the `#voice` band;
 * spec §7.2, source d07-home-voice): the AI draft, the pipeline chips
 * `[data-m="pipe"]` ×3 (SSR all lit: `data-lit`; the micro lights them in
 * sequence) with `[data-m="pipe-check"]` after the last, and the confirm /
 * publish buttons. No play counts, no slots.
 */
export function D07HomeVoiceCard({ d, className }: MockProps) {
  const h = d.mock.studio.homeVoice;
  return (
    <div className={cx(s.card, s.night, className)} data-mock="D07HomeVoiceCard">
      <div className={s.cardHead}>
        <span className={s.cardTitle}>{h.title}</span>
        <span className={s.cardSub}>{h.sub}</span>
      </div>
      <span className={s.nLabel}>{h.draftsLabel}</span>
      <div className={cx(s.nPane, s.draft)}>
        <span className={s.draftText}>{h.draft}</span>
        <span className={s.pipe}>
          {PIPE.map((k, i) => (
            <Fragment key={k}>
              {i > 0 ? (
                <span className={s.pipeChev}>
                  <Icon name="chevron_right" size={14} />
                </span>
              ) : null}
              <span className={s.pipeChip} data-m="pipe" data-lit="">
                {h.pipeline[k]}
              </span>
            </Fragment>
          ))}
          <span className={s.pipeCheck} data-m="pipe-check">
            <Icon name="check" size={14} />
          </span>
        </span>
        <span className={s.nBtns}>
          <span className={s.nGhost}>{h.confirm}</span>
          <span className={s.nSolid}>
            <Icon name="graphic_eq" size={15} />
            {h.publish}
          </span>
        </span>
      </div>
    </div>
  );
}
