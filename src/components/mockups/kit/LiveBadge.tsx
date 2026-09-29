/** Pink LIVE tag, radius 6, PJS 700 10 (spec §4.8). `pulse` runs the live-dot loop while in view. */
export function LiveBadge({ pulse = false }: { pulse?: boolean }) {
  return (
    <span className="live-badge" data-loop={pulse ? '' : undefined}>
      LIVE
    </span>
  );
}
