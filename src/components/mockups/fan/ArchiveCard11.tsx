import type { MockProps } from '@/components/mockups/types';
import { Icon, Scene } from '@/components/site';
import { cx } from './parts';

/**
 * F14 `ArchiveCard11` (spec §7.1): a LIVE archive (V3 11, archive mode) as a
 * compact night card. No time labels: the scrubber is a bare 40% track.
 */
export function ArchiveCard11({ d, className }: MockProps) {
  const t = d.mock.fan.archive;
  return (
    <figure role="img" aria-label={t.alt} className={cx('fm-card fm-arch glass-night', className)} data-mock="ArchiveCard11">
      <div className="fm-arch-inner" aria-hidden="true">
        <span className="fm-arch-thumb">
          <Scene kind="rain-neon" />
          <Icon name="podcasts" filled size={22} />
        </span>
        <span className="fm-arch-txt">
          <span className="fm-arch-tag">{t.tag}</span>
          <span className="fm-arch-title">{t.title}</span>
          <span className="fm-arch-rec">
            <Icon name="mic" size={14} />
            {t.recording}
          </span>
          <span className="fm-arch-scrub">
            <i />
          </span>
        </span>
        <span className="fm-arch-play">
          <Icon name="play_arrow" filled size={22} />
        </span>
      </div>
    </figure>
  );
}
