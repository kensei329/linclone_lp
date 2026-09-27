import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import type { StudioPlacement } from '@/lib/site-config';
import { mailtoStudio } from '@/lib/store-links';
import { Icon } from '../icons/Icon';

type MailtoButtonProps = { d: Dictionary; lang: Locale; variant: 'primary' | 'header' | 'compact'; placement: StudioPlacement };

/** LC Studio invitation request (spec §4.2). STUB (WP0a): WP0b adds analytics and styling. */
export function MailtoButton({ d, lang, variant, placement }: MailtoButtonProps) {
  const describedBy = `opens-mail-${placement}`;
  const label =
    variant === 'primary' ? d.creators.hero.cta : variant === 'header' ? d.creators.header.requestInvite : d.creators.header.requestShort;
  return (
    <>
      <a href={mailtoStudio(lang, d)} className="btn-violet" data-variant={variant} aria-describedby={describedBy} data-analytics={`studio_mailto:${placement}`}>
        <Icon name="mail" size={20} />
        {label}
      </a>
      <span id={describedBy} hidden>
        {d.a11y.opensMail}
      </span>
    </>
  );
}
