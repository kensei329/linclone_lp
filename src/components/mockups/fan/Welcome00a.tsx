import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** F18 `Welcome00a` (spec §7.1). STUB (WP0a), owned by WP4: replace wholesale. */
export function Welcome00a({ className }: MockProps) {
  return (
    <Screen theme="night">
      <div data-mock="Welcome00a" className={className} />
    </Screen>
  );
}
