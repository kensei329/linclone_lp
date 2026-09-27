import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** S5 `S04aOwnWords` (spec §7.2). STUB (WP0a), owned by WP5: replace wholesale. */
export function S04aOwnWords({ className }: MockProps) {
  return (
    <Screen theme="cream">
      <div data-mock="S04aOwnWords" className={className} />
    </Screen>
  );
}
