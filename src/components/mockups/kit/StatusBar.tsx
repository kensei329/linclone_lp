/** 54px iOS-style status bar (spec §4.8). STUB (WP0a): time only; WP0b adds the icon cluster. */
export function StatusBar({ time, theme }: { time: string; theme: 'cream' | 'night' }) {
  return (
    <div data-statusbar={theme} style={{ height: 54, padding: '18px 32px 0', font: '600 15px var(--font-pjs)', color: theme === 'night' ? '#fff' : '#28273b' }}>
      {time}
    </div>
  );
}
