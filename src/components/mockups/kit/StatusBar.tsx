/** 54px iOS-style status bar: time PJS 600 15 at x=32, y=18 and a signal/wifi/battery cluster (spec §4.8). */
export function StatusBar({ time, theme }: { time: string; theme: 'cream' | 'night' }) {
  return (
    <div className="mock-statusbar" data-theme={theme}>
      <span className="mock-statusbar-time">{time}</span>
      <span className="mock-statusbar-icons">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
          <path d="M7.5 2.2c2.2 0 4.2.8 5.7 2.2l1.1-1.1A9.6 9.6 0 0 0 7.5.6 9.6 9.6 0 0 0 .7 3.3l1.1 1.1A8 8 0 0 1 7.5 2.2Z" />
          <path d="M7.5 5.3c1.3 0 2.5.5 3.5 1.3l1.1-1.1a6.5 6.5 0 0 0-9.2 0L4 6.6c1-.8 2.2-1.3 3.5-1.3Z" />
          <path d="M7.5 8.3c.5 0 .9.2 1.3.5L7.5 10.9 6.2 8.8c.4-.3.8-.5 1.3-.5Z" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x=".5" y=".5" width="21" height="11" rx="3.5" stroke="currentColor" opacity=".4" />
          <rect x="2" y="2" width="18" height="8" rx="2" fill="currentColor" />
          <path d="M23 4v4c.8-.3 1.3-1.1 1.3-2S23.8 4.3 23 4Z" fill="currentColor" opacity=".45" />
        </svg>
      </span>
    </div>
  );
}
