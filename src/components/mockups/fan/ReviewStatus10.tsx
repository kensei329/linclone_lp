import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** F17 `ReviewStatus10` (spec §7.1). STUB (WP0a), owned by WP4: replace wholesale. */
export function ReviewStatus10({ className }: MockProps) {
  return (
    <Screen theme="cream">
      <div data-mock="ReviewStatus10" className={className} />
    </Screen>
  );
}
