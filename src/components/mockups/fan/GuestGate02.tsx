import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** F20 `GuestGate02` (spec §7.1). STUB (WP0a), owned by WP4: replace wholesale. */
export function GuestGate02({ className }: MockProps) {
  return (
    <Screen theme="night">
      <div data-mock="GuestGate02" className={className} />
    </Screen>
  );
}
