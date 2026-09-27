import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** S6 `S05Photos` (spec §7.2). STUB (WP0a), owned by WP5: replace wholesale. */
export function S05Photos({ className }: MockProps) {
  return (
    <Screen theme="cream">
      <div data-mock="S05Photos" className={className} />
    </Screen>
  );
}
