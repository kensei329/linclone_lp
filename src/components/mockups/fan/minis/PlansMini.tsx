import type { Dictionary } from '@/i18n/dictionaries';
import type { MockProps } from '@/components/mockups/types';

type PlansMiniProps = MockProps & { cards: Dictionary['home']['more']['tiles']['plans']['cards'] };

/** F21 `PlansMini`: qualitative plan cards, no prices (spec §7.1). STUB (WP0a), owned by WP4: replace wholesale. */
export function PlansMini({ cards, className }: PlansMiniProps) {
  return (
    <ul data-mock="PlansMini" className={className}>
      {Object.entries(cards).map(([id, c]) => (
        <li key={id} data-m="plan">
          {c.name}
        </li>
      ))}
    </ul>
  );
}
