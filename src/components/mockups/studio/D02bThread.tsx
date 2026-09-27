import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** S15 `D02bThread` (spec §7.2). STUB (WP0a), owned by WP5: replace wholesale. */
export function D02bThread({ className }: MockProps) {
  return (
    <Screen theme="cream">
      <div data-mock="D02bThread" className={className} />
    </Screen>
  );
}
