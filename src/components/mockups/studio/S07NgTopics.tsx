import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

type S07NgTopicsProps = MockProps & { compact?: boolean };

/** S8 `S07NgTopics` (spec §7.2). `compact` renders the 5 rows only. STUB (WP0a), owned by WP5: replace wholesale. */
export function S07NgTopics({ compact = false, className }: S07NgTopicsProps) {
  const body = <div data-mock="S07NgTopics" data-compact={compact ? '' : undefined} className={className} />;
  return compact ? body : <Screen theme="cream">{body}</Screen>;
}
