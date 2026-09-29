/** 44×26 switch, 22px knob; `data-toggle`/`data-on` are the animator hooks (spec §4.8). */
export function Toggle({
  on,
  tone = 'teal',
  hook,
  name,
  className,
}: {
  on: boolean;
  tone?: 'teal' | 'pink' | 'cyan';
  /** optional `data-m` animator hook */
  hook?: string;
  /** optional `data-toggle` value (e.g. 'pause'); default empty */
  name?: string;
  className?: string;
}) {
  return (
    <span
      className={className ? `mock-toggle ${className}` : 'mock-toggle'}
      data-toggle={name ?? ''}
      data-m={hook}
      data-on={on ? '' : undefined}
      data-tone={tone}
    />
  );
}
