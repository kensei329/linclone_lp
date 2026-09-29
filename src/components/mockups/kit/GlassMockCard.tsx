import type { ReactNode } from 'react';

type GlassMockCardProps = {
  /** §4.8 lists 16 | 20; §7.1 F5 also uses 18 */
  radius?: 16 | 18 | 20;
  tone: 'light' | 'night';
  className?: string;
  children?: ReactNode;
};

/** In-mockup glass card: white .72 + 1px white .9 edge. Never uses backdrop-filter (spec §4.8). */
export function GlassMockCard({ radius = 16, tone, className, children }: GlassMockCardProps) {
  return (
    <div className={['glass-mock', className].filter(Boolean).join(' ')} data-tone={tone} style={{ borderRadius: radius }}>
      {children}
    </div>
  );
}
