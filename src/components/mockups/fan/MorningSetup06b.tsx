import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** F4 `MorningSetup06b` (spec §7.1). STUB (WP0a), owned by WP4: replace wholesale. */
export function MorningSetup06b({ className }: MockProps) {
  return (
    <Screen theme="cream">
      <div data-mock="MorningSetup06b" className={className} />
    </Screen>
  );
}
