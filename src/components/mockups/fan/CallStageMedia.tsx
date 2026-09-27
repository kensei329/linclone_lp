import type { MockProps } from '@/components/mockups/types';

type CallStageMediaProps = MockProps & { variant: 'stage' | 'final' };

/** F2 `CallStageMedia`: full-viewport call stage (spec §7.1). STUB (WP0a), owned by WP4: replace wholesale. */
export function CallStageMedia({ variant, className }: CallStageMediaProps) {
  return <div data-mock="CallStageMedia" data-variant={variant} data-state="speaking" className={className} />;
}
