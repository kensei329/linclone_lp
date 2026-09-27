import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** F6 `Conversation04` (spec §7.1). STUB (WP0a), owned by WP4: replace wholesale. */
export function Conversation04({ className }: MockProps) {
  return (
    <Screen theme="cream">
      <div data-mock="Conversation04" className={className} />
    </Screen>
  );
}
