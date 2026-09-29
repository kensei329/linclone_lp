import type { MockProps } from '@/components/mockups/types';
import { Icon } from '@/components/site';
import { cx } from '../parts';

/**
 * F21 `InviteMini` (spec §7.1): the fictional invite code `YUZUHINA`.
 * Hook: `[data-m="copy"]`, `data-state` = copy | copied (+ `[data-copied]`)
 * swaps icon and label. Visual only (the section never writes the clipboard).
 */
export function InviteMini({ d, className }: MockProps) {
  const t = d.mock.fan.invite;
  return (
    <figure role="img" aria-label={t.alt} className={cx('fm-mini fm-im', className)} data-mock="InviteMini">
      <div className="fm-mini-in" aria-hidden="true">
        <span className="fm-im-title">
          <Icon name="group" filled size={18} />
          {t.title}
        </span>
        <span className="fm-im-code">
          <span className="fm-im-lbl">{t.codeLabel}</span>
          <span className="fm-im-val">{t.code}</span>
        </span>
        <span className="fm-im-copy" data-m="copy" data-state="copy">
          <span data-l="copy">
            <Icon name="content_copy" size={16} />
            {t.copy}
          </span>
          <span data-l="copied">
            <Icon name="check" size={16} />
            {t.copied}
          </span>
        </span>
      </div>
    </figure>
  );
}
