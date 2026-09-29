// GSAP equivalents of the CSS easing/duration tokens (spec §4.5).
export const EASE = {
  reveal: 'power3.out',
  pop: 'back.out(1.6)',
  inout: 'power3.inOut',
  sine: 'sine.inOut',
  burst: 'cubic-bezier(.7,0,.84,0)',
} as const;

export const DUR = { fast: 0.16, base: 0.26, fluid: 0.42, stagger: 0.06 } as const;

/** Opacity only (never visibility): pending items stay focusable and in the a11y tree. */
export const REVEAL_FROM = { y: 16, scale: 0.97, opacity: 0 } as const;
