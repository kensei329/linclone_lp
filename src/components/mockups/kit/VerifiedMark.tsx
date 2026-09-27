import { Icon } from '@/components/site/icons/Icon';

/** Filled check_circle in teal (or neon on dark) (spec §4.8). */
export function VerifiedMark({ size = 16, tone = 'teal' }: { size?: number; tone?: 'teal' | 'neon' }) {
  return (
    <span style={{ color: tone === 'neon' ? '#7df4ff' : '#00c4d8', display: 'inline-flex' }}>
      <Icon name="check_circle" filled size={size} />
    </span>
  );
}
