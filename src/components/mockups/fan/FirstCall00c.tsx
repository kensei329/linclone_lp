import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** F1 `FirstCall00c` (spec §7.1). STUB (WP0a), owned by WP4: replace wholesale. */
export function FirstCall00c({ className }: MockProps) {
  return (
    <Screen theme="night">
      <div data-mock="FirstCall00c" className={className} />
    </Screen>
  );
}
