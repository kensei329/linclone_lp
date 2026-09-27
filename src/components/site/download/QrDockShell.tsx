import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { QrBlock } from './QrBlock';
import { QrDock } from './QrDock.client';

/** Server shell: renders the dock's QR at build time and hands it to the client dock (spec §4.1). */
export function QrDockShell({ d, lang }: { d: Dictionary; lang: Locale }) {
  return (
    <QrDock d={{ qrDock: d.qrDock }}>
      <QrBlock d={d} lang={lang} placement="qr_dock" caption={d.qrDock.caption} />
    </QrDock>
  );
}
