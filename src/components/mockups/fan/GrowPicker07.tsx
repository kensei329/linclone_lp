import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** F15 `GrowPicker07` (spec §7.1). STUB (WP0a), owned by WP4: replace wholesale. */
export function GrowPicker07({ className }: MockProps) {
  return (
    <Screen theme="cream">
      <div data-mock="GrowPicker07" className={className} />
    </Screen>
  );
}
