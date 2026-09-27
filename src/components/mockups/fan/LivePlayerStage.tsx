import type { ReactNode } from 'react';
import type { MockProps } from '@/components/mockups/types';

type LivePlayerStageProps = MockProps & { fillSlot?: ReactNode };

/** F10 `LivePlayerStage`: full-viewport audio LIVE player (spec §7.1). STUB (WP0a), owned by WP4: replace wholesale. */
export function LivePlayerStage({ fillSlot, className }: LivePlayerStageProps) {
  return (
    <div data-mock="LivePlayerStage" className={className}>
      {fillSlot ? <div data-fill="">{fillSlot}</div> : null}
    </div>
  );
}
