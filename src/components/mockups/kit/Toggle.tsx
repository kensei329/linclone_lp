/** 44×26 switch, 22px knob; `data-toggle`/`data-on` are the animator hooks (spec §4.8). */
export function Toggle({ on, tone = 'teal' }: { on: boolean; tone?: 'teal' | 'pink' | 'cyan' }) {
  return <span className="mock-toggle" data-toggle="" data-on={on ? '' : undefined} data-tone={tone} />;
}
