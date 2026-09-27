/** 44×26 switch (spec §4.8). STUB (WP0a). */
export function Toggle({ on, tone = 'teal' }: { on: boolean; tone?: 'teal' | 'pink' | 'cyan' }) {
  return <span className="mock-toggle" data-toggle="" data-on={on ? '' : undefined} data-tone={tone} />;
}
