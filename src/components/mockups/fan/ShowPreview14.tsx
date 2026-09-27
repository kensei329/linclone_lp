import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

/** F13 `ShowPreview14` (spec §7.1). STUB (WP0a), owned by WP4: replace wholesale. */
export function ShowPreview14({ className }: MockProps) {
  return (
    <Screen theme="cream">
      <div data-mock="ShowPreview14" className={className} />
    </Screen>
  );
}
