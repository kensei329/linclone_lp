'use client';

import { useAnchorScope } from '@/lib/motion/use-anchor-scope';
import { useScrollScene } from '@/lib/motion/use-scroll-scene';

export type StepEventDetail = { sectionId: string; stepId: string };

/**
 * Desktop only: one ScrollTrigger per step ('top 55%' → 'bottom 55%') that
 * marks the matching `[data-screen]` active and dispatches `lc:step`
 * (spec §4.3). Mobile has no sticky phone, so nothing runs there.
 */
export function StickyStepsAnimator({ sectionId, stepIds }: { sectionId: string; stepIds: string[] }) {
  const { anchor, scope } = useAnchorScope('.sticky-steps');
  useScrollScene(scope, ({ ScrollTrigger, scope: root, isDesktop }) => {
    if (!isDesktop) return;
    const screens = Array.from(root.querySelectorAll<HTMLElement>('.ss-phone [data-screen]'));
    // -1 so the first step's activation also dispatches `lc:step`.
    let current = -1;
    const activate = (i: number) => {
      if (i === current || !screens[i]) return;
      screens.forEach((s, j) => {
        s.toggleAttribute('data-active', j === i);
        s.toggleAttribute('data-leaving', j === current && i > current);
      });
      current = i;
      window.dispatchEvent(new CustomEvent<StepEventDetail>('lc:step', { detail: { sectionId, stepId: stepIds[i] } }));
    };
    stepIds.forEach((id, i) => {
      const step = root.querySelector<HTMLElement>(`[data-step="${CSS.escape(id)}"]`);
      if (!step) return;
      ScrollTrigger.create({
        trigger: step,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => self.isActive && activate(i),
      });
    });
    return () => {
      screens.forEach((s, j) => {
        s.toggleAttribute('data-active', j === 0);
        s.removeAttribute('data-leaving');
      });
    };
  });
  return <span ref={anchor} hidden />;
}
