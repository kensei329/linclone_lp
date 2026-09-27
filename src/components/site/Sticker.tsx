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

/** Vinyl-edge glass sticker (spec §4.3). STUB: WP0b adds the pop entrance styling. */
export function Sticker({ icon, label, tilt = 0, tone = 'teal', dark = false, index = 0 }: StickerProps) {
  const style = { '--tilt': `${tilt}deg`, '--i': index } as CSSProperties;
  return (
    <span className="glass-fake sticker t-label" data-tone={tone} data-dark={dark ? '' : undefined} style={style}>
      <Icon name={icon} filled size={14} />
      {label}
    </span>
  );
}
