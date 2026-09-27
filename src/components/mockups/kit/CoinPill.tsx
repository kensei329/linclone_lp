/** LCCoin pill: gold "LC" disc + teal "+" disc. No number, by design: there is no prop for one (spec §4.8). */
export function CoinPill({ theme }: { theme: 'cream' | 'night' }) {
  return (
    <span className="coin-pill" data-theme={theme}>
      <span className="coin">LC</span>
      <span className="coin-plus">+</span>
    </span>
  );
}
