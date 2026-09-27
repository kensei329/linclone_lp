/** Coin pill with no number, by design (spec §4.8). STUB (WP0a). */
export function CoinPill({ theme }: { theme: 'cream' | 'night' }) {
  return (
    <span className="coin-pill" data-theme={theme}>
      <span className="coin">LC</span>
      <span className="coin-plus">+</span>
    </span>
  );
}
