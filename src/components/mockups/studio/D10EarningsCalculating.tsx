import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** S19 `D10EarningsCalculating` (spec §7.2). STUB (WP0a), owned by WP5: replace wholesale. */
export function D10EarningsCalculating({ className }: MockProps) {
  return (
    <Screen theme="cream">
      <div data-mock="D10EarningsCalculating" className={className} />
    </Screen>
  );
}
