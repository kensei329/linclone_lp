import type { MockProps } from '@/components/mockups/types';
import { Icon, Scene } from '@/components/site';
import { cx } from './parts';
import s from './studio.module.css';

const SCENES = ['rain-neon', 'cafe-light', 'night-sea', 'stage-light', 'autumn-leaves', 'dawn-sky'] as const;

/**
 * S14 `D04GalleryCard` (card; spec §7.2, source d04-fan-content / d04a): tabs
 * (images underlined), a 3×2 grid of token-only `Scene` thumbs each tagged
 * AI生成, the AI-label chip `[data-m="label-chip"]` and the label note. The
 * first image carries the label ribbon `[data-m="ribbon"]` (the micro slides
 * it in; SSR shown). No Stop/Restore controls, no people.
 */
export function D04GalleryCard({ d, className }: MockProps) {
  const c = d.mock.studio.content;
  const ai = d.mock.fan.common.aiGenerated;
  return (
    <div className={cx(s.card, className)} data-mock="D04GalleryCard">
      <span className={s.cardTitle}>{c.title}</span>
      <div className={s.tabs}>
        <span data-selected="">{c.tabs.images}</span>
        <span>{c.tabs.voices}</span>
        <span>{c.tabs.stories}</span>
      </div>
      <div className={s.gallery}>
        {SCENES.map((kind, i) => (
          <span key={kind} className={s.gItem}>
            <Scene kind={kind} />
            {i === 0 ? (
              <span className={s.ribbon} data-m="ribbon">
                <Icon name="verified_user" filled size={11} />
                {ai}
              </span>
            ) : (
              <span className={s.aiTag}>{ai}</span>
            )}
          </span>
        ))}
      </div>
      <div className={s.labelRow}>
        <span className={s.labelChip} data-m="label-chip">
          <Icon name="check_circle" filled size={14} />
          {c.labelChip}
        </span>
        <span className={s.note10}>{c.labelNote}</span>
      </div>
    </div>
  );
}
