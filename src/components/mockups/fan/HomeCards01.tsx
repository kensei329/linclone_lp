import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** F5 `HomeCards01` (spec §7.1). STUB (WP0a), owned by WP4: replace wholesale. */
export function HomeCards01({ className }: MockProps) {
  return (
    <Screen theme="cream">
      <div data-mock="HomeCards01" className={className} />
    </Screen>
  );
}
