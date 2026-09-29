import type { MockProps } from '@/components/mockups/types';
import { VerifiedMark } from '@/components/mockups/kit';
import { Aura, Icon } from '@/components/site';
import { cx, NamedToggle } from './parts';
import s from './studio.module.css';

/**
 * S13 `D08ProfileCard` (card; spec §7.2, source d08-public-profile, edited):
 * squircle aura (aoi), name + verified + licensed line (no follower count),
 * bio, the two grown facts with edit/delete (no +N), and the AI-images
 * switch `[data-toggle="ai-images"]` (SSR on). When the micro flips it off,
 * the row tints and `aiImagesSub` highlights via `:has()`. No "allow fan posts
 * on social media" row.
 */
export function D08ProfileCard({ d, className }: MockProps) {
  const p = d.mock.studio.profile;
  return (
    <div className={cx(s.card, className)} data-mock="D08ProfileCard">
      <span className={s.cardTitle}>{p.title}</span>
      <div className={s.profTop}>
        <span className={s.squircle}>
          <Aura persona="aoi" shape="card" size={62} voiceprint={false} />
        </span>
        <span className={s.cardHead}>
          <span className={s.profName}>
            {d.personas.aoi.name}
            <VerifiedMark size={17} />
          </span>
          <span className={s.profLicensed}>{p.licensed}</span>
        </span>
      </div>
      <div className={cx(s.pane, s.bio)}>
        <span>{p.bio}</span>
        <Icon name="edit" size={16} />
      </div>
      <span className={s.factsTitle}>{p.factsTitle}</span>
      <div className={s.pane}>
        {(['f1', 'f2'] as const).map((k) => (
          <div key={k} className={s.factRow}>
            <span className={s.factCat}>{p.facts[k].cat}</span>
            <span className={s.factText}>{p.facts[k].text}</span>
            <span className={s.factIcons}>
              <Icon name="edit" size={16} />
              <Icon name="delete" size={16} />
            </span>
          </div>
        ))}
      </div>
      <div className={cx(s.pane, s.aiRow)}>
        <span className={s.aiText}>
          <span className={s.aiTitle}>{p.aiImages}</span>
          <span className={s.aiSub}>{p.aiImagesSub}</span>
        </span>
        <NamedToggle hook="ai-images" on tone="cyan" />
      </div>
    </div>
  );
}
