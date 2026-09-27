import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** F12 `LiveSetup13` (spec §7.1). STUB (WP0a), owned by WP4: replace wholesale. */
export function LiveSetup13({ className }: MockProps) {
  return (
    <Screen theme="cream">
      <div data-mock="LiveSetup13" className={className} />
    </Screen>
  );
}
