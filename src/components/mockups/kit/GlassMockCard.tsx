import type { ReactNode } from 'react';

type GlassMockCardProps = {
  /** §4.8 lists 16 | 20; §7.1 F5 also uses 18 */
  radius?: 16 | 18 | 20;
  tone: 'light' | 'night';
  className?: string;
  children?: ReactNode;
};

/** In-mockup glass card; never uses backdrop-filter (spec §4.8). STUB (WP0a). */
export function GlassMockCard({ radius = 16, tone, className, children }: GlassMockCardProps) {
  return (
    <div
      className={className}
      data-tone={tone}
      style={{
        borderRadius: radius,
        background: tone === 'night' ? 'rgba(15,16,24,.55)' : 'rgba(255,255,255,.72)',
        border: `1px solid ${tone === 'night' ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.9)'}`,
      }}
    >
      {children}
    </div>
  );
}
