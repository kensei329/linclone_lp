import { useId } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import type { StudioPlacement } from '@/lib/site-config';
import { mailtoStudio } from '@/lib/store-links';
import { Icon } from '../icons/Icon';

type MailtoButtonProps = { d: Dictionary; lang: Locale; variant: 'primary' | 'header' | 'compact'; placement: StudioPlacement };

/**
 * LC Studio invitation request, the only Studio CTA while it is invite-only
 * (spec §4.2). Analytics `studio_mailto{loc}` via the delegated listener.
 * `header` shows the long label from 1024px and the short one below.
 */
export function MailtoButton({ d, lang, variant, placement }: MailtoButtonProps) {
  const describedBy = `opens-mail-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const h = d.creators.header;
  return (
    <>
      <a
        href={mailtoStudio(lang, d)}
        className={['btn-violet', 'mailto-btn', variant === 'primary' ? 'btn-lg' : null].filter(Boolean).join(' ')}
        data-variant={variant}
        aria-describedby={describedBy}
        data-analytics={`studio_mailto:${placement}`}
      >
        <Icon name="mail" size={variant === 'primary' ? 22 : 18} />
        {variant === 'primary' ? (
          d.creators.hero.cta
        ) : variant === 'header' ? (
          <>
            <span className="lbl-lg">{h.requestInvite}</span>
            <span className="lbl-sm">{h.requestShort}</span>
          </>
        ) : (
          h.requestShort
        )}
      </a>
      <span id={describedBy} hidden>
        {d.a11y.opensMail}
      </span>
    </>
  );
}
