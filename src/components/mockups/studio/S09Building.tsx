import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit/Screen';

type S09BuildingProps = MockProps & { state: 'building' | 'ready' };

/** S1 `S09Building`: clone build progress, no percentage (spec §7.2). STUB (WP0a), owned by WP5: replace wholesale. */
export function S09Building({ state, className }: S09BuildingProps) {
  return (
    <Screen theme="cream">
      <div data-mock="S09Building" data-state={state} className={className} />
    </Screen>
  );
}
