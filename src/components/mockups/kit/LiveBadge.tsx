/** Pink LIVE tag (spec §4.8). STUB (WP0a). */
export function LiveBadge({ pulse = false }: { pulse?: boolean }) {
  return (
    <span className="live-badge" data-loop={pulse ? '' : undefined} style={{ background: '#e14b81', color: '#fff', borderRadius: 6, font: '700 10px var(--font-pjs)', letterSpacing: '.6px', padding: '2px 6px' }}>
      LIVE
    </span>
  );
}
