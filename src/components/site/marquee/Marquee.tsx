import type { CSSProperties, ReactNode } from 'react';
import { MarqueeVelocity } from './MarqueeVelocity.client';

type MarqueeProps = { rows: 1 | 2; items: ReactNode[]; label: string; speed?: number };

function Row({ items, reverse }: { items: ReactNode[]; reverse?: boolean }) {
  return (
    <div className={['marquee-row', reverse ? 'marquee-row--rev' : null].filter(Boolean).join(' ')} aria-hidden={reverse || undefined}>
      <div className="marquee-skew">
        <div className="marquee-inner" data-loop="">
          <ul className="marquee-track">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <ul className="marquee-track" aria-hidden="true" inert>
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * CSS marquee (spec §4.7): items duplicated for a seamless loop, row 2 runs in
 * reverse (desktop only). Loops only in view, pauses on hover/focus; reduced
 * motion wraps the items as a static list. The duplicate copies are inert and
 * hidden from assistive tech.
 */
export function Marquee({ rows, items, label, speed = 40 }: MarqueeProps) {
  const half = Math.ceil(items.length / 2);
  const second = [...items.slice(half), ...items.slice(0, half)];
  return (
    <div role="group" aria-label={label} className="marquee" data-rows={rows} style={{ '--speed': `${speed}s` } as CSSProperties}>
      <Row items={items} />
      {rows === 2 ? <Row items={second} reverse /> : null}
      <MarqueeVelocity />
    </div>
  );
}
