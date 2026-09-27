import type { ElementType, ReactNode } from 'react';

const TONE = { day: 'glass', night: 'glass-night', fake: 'glass-fake', live: 'glass glass-live' } as const;

/** Maps to the §3.3 glass classes. */
export function GlassCard({
  as: Tag = 'div',
  tone,
  radius = '2xl',
  className,
  children,
}: {
  as?: ElementType;
  tone: 'day' | 'night' | 'fake' | 'live';
  radius?: 'xl' | '2xl';
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={[TONE[tone], radius === 'xl' ? 'rounded-xl' : 'rounded-2xl', className].filter(Boolean).join(' ')}>{children}</Tag>;
}
