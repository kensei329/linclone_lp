import type { MockProps } from '@/components/mockups/types';
import { Icon } from '@/components/site';
import { GoogleG, cx } from '../parts';

/**
 * F21 `SignInMini` (spec §7.1): Apple and Google rows (as F20, 44 tall) and
 * the no-password chip. Hook: `[data-m="nopw"]`.
 */
export function SignInMini({ d, className }: MockProps) {
  const t = d.mock.fan.gate;
  return (
    <figure role="img" aria-label={t.alt} className={cx('fm-mini fm-si', className)} data-mock="SignInMini">
      <div className="fm-mini-in" aria-hidden="true">
        <span className="fm-signin" data-kind="apple" data-size="sm">
          <Icon name="apple" size={18} />
          {t.apple}
        </span>
        <span className="fm-signin" data-kind="google" data-size="sm">
          <GoogleG size={18} />
          {t.google}
        </span>
        <span className="fm-nopw" data-m="nopw">
          <Icon name="key" size={14} />
          {t.noPassword}
        </span>
      </div>
    </figure>
  );
}
