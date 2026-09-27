import { Icon } from '@/components/site/icons/Icon';

/** Filled check_circle in #00c4d8 (neon #7df4ff on dark) (spec §4.8). */
export function VerifiedMark({ size = 16, tone = 'teal' }: { size?: number; tone?: 'teal' | 'neon' }) {
  return (
    <span className="verified-mark" data-tone={tone}>
      <Icon name="check_circle" filled size={size} />
    </span>
  );
}
