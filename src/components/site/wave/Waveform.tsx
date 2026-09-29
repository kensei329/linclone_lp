import type { CSSProperties } from 'react';

type WaveformProps = {
  bars?: number;
  widths?: number[];
  seed?: number;
  tone: 'teal' | 'neon' | 'white' | 'purple' | 'ink';
  size?: 'sm' | 'md' | 'thick';
  playing?: boolean;
  orientation?: 'h' | 'v';
  amp?: 'css-var';
};

/** The app's voice-note capsule pattern. */
const APP_WIDTHS = [7, 22, 14, 7, 18, 26, 10, 22, 14, 18, 10, 22];

/**
 * Capsule waveform (spec §4.7). `h`: 7px-tall capsules of varying width
 * (`thick`: 20px wide, 4–12px tall); `v`: the same pattern as bar heights.
 * `playing` runs the CSS `wave` loop per bar (in view only, `data-loop`);
 * `amp="css-var"` scales every bar by `var(--amp, 1)` for stage timelines.
 */
export function Waveform({ bars = 12, widths = APP_WIDTHS, seed = 0, tone, size = 'md', playing = false, orientation = 'h', amp }: WaveformProps) {
  const n = widths.length;
  return (
    <span
      aria-hidden="true"
      className="waveform"
      data-wave=""
      data-tone={tone}
      data-size={size}
      data-orientation={orientation}
      data-playing={playing ? '' : undefined}
      data-amp={amp ? '' : undefined}
      data-loop={playing ? '' : undefined}
    >
      {Array.from({ length: bars }, (_, i) => {
        const w = widths[(i + seed) % n];
        const style = {
          '--w': `${orientation === 'v' ? Math.round(w * 1.4) : size === 'sm' ? Math.round(w * 0.7) : w}px`,
          '--h': `${Math.round(4 + ((w - 7) / 19) * 8)}px`,
          '--d': `${360 + ((i * 97) % 180)}ms`,
          '--dl': `${(i % 5) * 120}ms`,
        } as CSSProperties;
        return <span key={i} style={style} />;
      })}
    </span>
  );
}
