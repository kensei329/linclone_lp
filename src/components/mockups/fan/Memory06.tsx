import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** F8 `Memory06` (spec §7.1). STUB (WP0a), owned by WP4: replace wholesale. */
export function Memory06({ className }: MockProps) {
  return (
    <Screen theme="cream">
      <div data-mock="Memory06" className={className} />
    </Screen>
  );
}
