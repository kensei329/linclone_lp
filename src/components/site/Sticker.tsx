import type { CSSProperties } from 'react';
import { Icon, type IconName } from './icons/Icon';

type StickerProps = {
  icon: IconName;
  label: string;
  /** −6..6 degrees */
  tilt?: number;
  tone?: 'teal' | 'pink' | 'purple' | 'gold' | 'violet';
  dark?: boolean;
  index?: number;
};

/**
 * Vinyl-edge glass sticker with a CSS pop entrance (spec §4.3). Budget: at most
 * 4 per desktop viewport and 2 on mobile, heroes and chapter openers only.
 */
export function Sticker({ icon, label, tilt = 0, tone = 'teal', dark = false, index = 0 }: StickerProps) {
  const t = Math.max(-6, Math.min(6, tilt));
  const style = { '--tilt': `${t}deg`, '--i': index } as CSSProperties;
  return (
    <span className="glass-fake sticker t-label" data-tone={tone} data-dark={dark ? '' : undefined} style={style}>
      <span className="sticker-disc" aria-hidden="true">
        <Icon name={icon} filled size={15} />
      </span>
      {label}
    </span>
  );
}
