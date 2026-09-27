import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** S7 `S06ModesFree` (spec §7.2). STUB (WP0a), owned by WP5: replace wholesale. */
export function S06ModesFree({ className }: MockProps) {
  return (
    <Screen theme="cream">
      <div data-mock="S06ModesFree" className={className} />
    </Screen>
  );
}
