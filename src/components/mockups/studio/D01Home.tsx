import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** S2 `D01Home` (spec §7.2). STUB (WP0a), owned by WP5: replace wholesale. */
export function D01Home({ className }: MockProps) {
  return (
    <Screen theme="cream">
      <div data-mock="D01Home" className={className} />
    </Screen>
  );
}
