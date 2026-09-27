import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** F3 `IncomingRing06b` (spec §7.1). STUB (WP0a), owned by WP4: replace wholesale. */
export function IncomingRing06b({ className }: MockProps) {
  return (
    <Screen theme="night">
      <div data-mock="IncomingRing06b" className={className} />
    </Screen>
  );
}
