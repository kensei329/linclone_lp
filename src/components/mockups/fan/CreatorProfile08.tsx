import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** F16 `CreatorProfile08` (spec §7.1). STUB (WP0a), owned by WP4: replace wholesale. */
export function CreatorProfile08({ className }: MockProps) {
  return (
    <Screen theme="cream">
      <div data-mock="CreatorProfile08" className={className} />
    </Screen>
  );
}
