import type { ReactNode } from 'react';
import type { MockProps } from '@/components/mockups/types';

type SelfCallStageProps = MockProps & { fillSlot?: ReactNode };

/** S11 `SelfCallStage`: full-viewport self-call (spec §7.2). STUB (WP0a), owned by WP5: replace wholesale. */
export function SelfCallStage({ fillSlot, className }: SelfCallStageProps) {
  return (
    <div data-mock="SelfCallStage" className={className}>
      {fillSlot ? <div data-fill="">{fillSlot}</div> : null}
    </div>
  );
}
