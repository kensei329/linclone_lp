import type { ReactNode } from 'react';

type MarqueeProps = { rows: 1 | 2; items: ReactNode[]; label: string; speed?: number };

/** CSS marquee (spec §4.7). STUB (WP0a): a static list; WP0b adds the loop and duplicate set. */
export function Marquee({ rows, items, label, speed = 40 }: MarqueeProps) {
  return (
    <div role="group" aria-label={label} className="marquee" data-rows={rows} style={{ ['--speed' as string]: `${speed}s` }}>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
