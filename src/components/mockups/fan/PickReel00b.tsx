import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** F19 `PickReel00b` (spec §7.1). STUB (WP0a), owned by WP4: replace wholesale. */
export function PickReel00b({ className }: MockProps) {
  return (
    <Screen theme="night">
      <div data-mock="PickReel00b" className={className} />
    </Screen>
  );
}
