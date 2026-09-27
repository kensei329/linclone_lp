import type { ElementType, ReactNode } from 'react';

const TONE = { day: 'glass', night: 'glass-night', fake: 'glass-fake', live: 'glass-live' } as const;

/** Maps to the §3.3 glass classes. Radius: 'xl' = 20, '2xl' = 28 (20 below 768px). */
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
  return (
    <Tag className={['glass-card', TONE[tone], className].filter(Boolean).join(' ')} data-radius={radius}>
      {children}
    </Tag>
  );
}
