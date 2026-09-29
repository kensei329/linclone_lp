/** Chapter label row: optional number, a short rule, then the label (spec §4.3). */
export function Eyebrow({ num, label, tone = 'ink' }: { num?: string; label: string; tone?: 'ink' | 'white' | 'violet' }) {
  return (
    <p className="t-label eyebrow" data-tone={tone}>
      {num ? <span className="eyebrow-num">{num}</span> : null}
      <span aria-hidden="true" className="eyebrow-rule" />
      <span>{label}</span>
    </p>
  );
}
