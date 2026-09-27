import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

type D05LiveProps = MockProps & { dropIn: boolean };

/** S16 `D05Live`: drop-in row only when CLAIMS.liveDropIn (spec §7.2). STUB (WP0a), owned by WP5: replace wholesale. */
export function D05Live({ dropIn, className }: D05LiveProps) {
  return (
    <Screen theme="cream">
      <div data-mock="D05Live" data-drop-in={dropIn ? '' : undefined} className={className} />
    </Screen>
  );
}
