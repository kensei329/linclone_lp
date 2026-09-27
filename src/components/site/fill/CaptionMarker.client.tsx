'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { loadMotion } from '@/lib/motion/load';

type CaptionMarkerProps = { targetId: string; restOn?: 'last' | number; tone: 'teal' | 'neon' | 'violet' };

type Box = { x: number; y: number; w: number; h: number };

/**
 * The travelling 声のテロップ marker (spec §4.3): one pill behind the target's
 * `[data-u]` units that hops phrase by phrase (0.35s power3.inOut, 0.12s gap)
 * and rests on the last unit or `restOn`. It never changes text colour or
 * opacity. Motion uses transform + clip-path only. Reduced motion or lite:
 * placed on the resting unit at once. No JS: no marker.
 */
export function CaptionMarker({ targetId, restOn = 'last', tone }: CaptionMarkerProps) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [marker, setMarker] = useState<HTMLSpanElement | null>(null);

  useEffect(() => {
    // The target is a server-rendered element elsewhere in the tree.
    setHost(document.getElementById(targetId));
  }, [targetId]);

  useEffect(() => {
    if (!host || !marker) return;
    host.classList.add('has-caption-marker');
    const units = Array.from(host.querySelectorAll<HTMLElement>('[data-u]'));
    if (!units.length) return;
    const rest = restOn === 'last' ? units.length - 1 : Math.min(Math.max(0, restOn), units.length - 1);

    const measure = (): Box[] => {
      const base = host.getBoundingClientRect();
      const lh = parseFloat(getComputedStyle(host).lineHeight) || base.height;
      return units.map((u) => {
        const r = u.getClientRects()[0] ?? u.getBoundingClientRect();
        const h = Math.min(r.height, lh) * 0.9;
        return { x: r.left - base.left, y: r.top - base.top + (r.height - h) / 2, w: r.width, h };
      });
    };
    const clipFor = (b: Box, width: number) =>
      `inset(0px ${Math.max(0, width - b.x - b.w)}px 0px ${Math.max(0, b.x)}px round ${b.h / 2}px)`;
    const place = (b: Box) => {
      const width = host.clientWidth;
      marker.style.height = `${b.h}px`;
      marker.style.transform = `translate3d(0, ${b.y}px, 0)`;
      marker.style.clipPath = clipFor(b, width);
      marker.style.opacity = '1';
    };

    let boxes = measure();
    let done = false;
    let killed = false;
    let tl: { kill: () => void } | undefined;
    let idle: number | undefined;
    const ric = typeof window.requestIdleCallback === 'function';

    const settle = () => {
      boxes = measure();
      if (done) place(boxes[rest]);
    };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lite = document.documentElement.hasAttribute('data-lite');

    const run = async () => {
      if (reduce || lite) {
        done = true;
        place(boxes[rest]);
        return;
      }
      const { gsap } = await loadMotion();
      if (killed) return;
      boxes = measure();
      const width = host.clientWidth;
      place(boxes[0]);
      gsap.set(marker, { y: boxes[0].y });
      const t = gsap.timeline({ onComplete: () => void (done = true) });
      for (let i = 1; i <= rest; i++) {
        const b = boxes[i];
        t.to(marker, { y: b.y, clipPath: clipFor(b, width), duration: 0.35, ease: 'power3.inOut' }, '+=0.12');
      }
      if (rest === 0) done = true;
      tl = t;
    };

    // Start once the target is in view, after the browser is idle.
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const go = () => void run();
        idle = ric ? window.requestIdleCallback(go, { timeout: 1200 }) : window.setTimeout(go, 200);
      },
      { threshold: 0.3 },
    );
    io.observe(host);

    const ro = new ResizeObserver(settle);
    ro.observe(host);
    void document.fonts?.ready.then(() => !killed && settle());

    return () => {
      killed = true;
      io.disconnect();
      ro.disconnect();
      if (idle !== undefined) {
        if (ric) window.cancelIdleCallback(idle);
        else window.clearTimeout(idle);
      }
      tl?.kill();
      host.classList.remove('has-caption-marker');
    };
  }, [host, marker, restOn]);

  if (!host) return null;
  return createPortal(<span ref={setMarker} className="caption-marker" data-tone={tone} aria-hidden="true" style={{ opacity: 0 }} />, host);
}
