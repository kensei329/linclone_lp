import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** S4 `S04QuickPicks` (spec §7.2). STUB (WP0a), owned by WP5: replace wholesale. */
export function S04QuickPicks({ className }: MockProps) {
  return (
    <Screen theme="cream">
      <div data-mock="S04QuickPicks" className={className} />
    </Screen>
  );
}
