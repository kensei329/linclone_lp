import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** F9 `LiveFeedCard` (spec §7.1). STUB (WP0a), owned by WP4: replace wholesale. */
export function LiveFeedCard({ className }: MockProps) {
  return (
    <Screen theme="night">
      <div data-mock="LiveFeedCard" className={className} />
    </Screen>
  );
}
