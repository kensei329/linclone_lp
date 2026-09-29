import type { MockProps } from '@/components/mockups/types';
import { Icon } from '@/components/site';
import { cx } from '../parts';

/**
 * F21 `ConfirmSheetMini` (spec §7.1): the confirm sheet shown before anything
 * is spent, with the automatic-refund line. No amounts.
 * Hooks: `[data-m="sheet"]` (slides up), `[data-m="refund"]` (SVG check to draw).
 */
export function ConfirmSheetMini({ d, className }: MockProps) {
  const t = d.mock.fan.confirm;
  return (
    <figure role="img" aria-label={t.alt} className={cx('fm-mini fm-cm', className)} data-mock="ConfirmSheetMini">
      <div className="fm-cm-win" aria-hidden="true">
        <div className="fm-cm-sheet" data-m="sheet">
          <span className="fm-cm-grab" />
          <span className="fm-cm-head">
            <span className="fm-cm-ico">
              <Icon name="auto_awesome" filled size={18} />
            </span>
            <span className="fm-cm-title">{t.title}</span>
          </span>
          <span className="fm-cm-body">{t.body}</span>
          <span className="fm-cm-btns">
            <span className="fm-cm-ok">{t.confirm}</span>
            <span className="fm-cm-cancel">{t.cancel}</span>
          </span>
          <span className="fm-cm-refund">
            <svg viewBox="0 0 20 20" width="18" height="18" data-m="refund">
              <circle cx="10" cy="10" r="8.25" fill="none" strokeWidth="1.5" />
              <path d="M6 10.4l2.7 2.6L14.2 7.4" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.refund}
          </span>
        </div>
      </div>
    </figure>
  );
}
