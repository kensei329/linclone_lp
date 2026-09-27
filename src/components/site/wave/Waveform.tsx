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

const APP_WIDTHS = [7, 22, 14, 7, 18, 26, 10, 22, 14, 18, 10, 22];

/** Capsule waveform (spec §4.7). STUB (WP0a): static bars; WP0b adds sizing and the wave loop. */
export function Waveform({ bars = 12, widths = APP_WIDTHS, tone, size = 'md', playing = false, orientation = 'h' }: WaveformProps) {
  return (
    <span aria-hidden="true" className="waveform" data-tone={tone} data-size={size} data-orientation={orientation} data-loop={playing ? '' : undefined}>
      {Array.from({ length: bars }, (_, i) => (
        <span key={i} style={{ '--w': `${widths[i % widths.length]}px` } as CSSProperties} />
      ))}
    </span>
  );
}
