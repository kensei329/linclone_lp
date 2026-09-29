import type { SectionProps } from '@/i18n/types';
import { SITE, STUDIO_LIVE } from '@/lib/site-config';
import { Units } from '@/lib/units';
import { Section, Eyebrow, MailtoButton, CopyEmail, StudioStoreCTA, Icon, RevealGroup, type IconName } from '@/components/site';
import { JoinConnector } from './JoinConnector.client';
import '../creators.css';

/**
 * #join: 08 参加方法, はじまりは、招待から。 (spec §6.10). A 4-step track whose
 * connector draws on scroll (scaleX desktop / scaleY mobile) and lights each
 * step as it passes, then the invitation card (the page's one live-glass
 * card): mailto, the selectable address with a copy fallback, the email
 * template, and the 近日公開 pills. Server HTML: connector full, all lit.
 */
export function StudioJoin({ d, lang }: SectionProps) {
  const t = d.creators.join;
  const steps: { key: string; icon: IconName; title: string; body: string }[] = [
    { key: 'request', icon: 'mail', ...t.steps.request },
    { key: 'contact', icon: 'forum', ...t.steps.contact },
    { key: 'get', icon: 'phone_iphone', ...(STUDIO_LIVE ? t.steps.getLive : t.steps.get) },
    { key: 'setup', icon: 'key', ...t.steps.setup },
  ];
  return (
    <Section id="join" surface="lavender" labelledBy="join-title" className="cr-join">
      <div className="container-site">
        <header className="cr-sec-head cr-join-head">
          <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} tone="violet" />
          <h2 id="join-title" className="t-h2">
            <Units text={t.title} lang={lang} mode="phrase" />
          </h2>
        </header>

        <div className="cr-track">
          <ol className="cr-track-steps">
            {steps.map((s) => (
              <li key={s.key} className="cr-track-step" data-step={s.key}>
                <span className="cr-track-node" aria-hidden="true">
                  <Icon name={s.icon} size={22} />
                </span>
                <h3 className="t-h3">{s.title}</h3>
                <p className="t-body ink-2">{s.body}</p>
              </li>
            ))}
          </ol>
          <JoinConnector />
        </div>

        <RevealGroup selector=".cr-invite">
          <div className="glass-live cr-invite">
            <span className="cr-invite-glow" aria-hidden="true" />
            <p className="t-h3 cr-invite-title">{t.ctaTitle}</p>
            <p className="t-body ink-2 cr-invite-body">{t.ctaBody}</p>
            <div className="cr-invite-cta">
              <MailtoButton d={d} lang={lang} variant="primary" placement="join" />
            </div>
            <div className="cr-invite-email">
              <span className="t-label ink-2">{t.emailLabel}</span>
              <code className="cr-email-code">{SITE.contactEmail}</code>
              <CopyEmail label={t.copyEmail} copiedLabel={t.copied} selectedLabel={d.common.copySelected} placement="join" variant="chip" />
            </div>
            <details className="cr-template">
              <summary>
                <span>{t.templateToggle}</span>
                <Icon name="expand_more" size={20} className="cr-template-chev" />
              </summary>
              <pre className="t-small whitespace-pre-wrap cr-template-pre">{d.creators.mailto.body}</pre>
            </details>
            <StudioStoreCTA d={d} lang={lang} />
            <p className="t-small cr-invite-fine">{t.fine}</p>
          </div>
        </RevealGroup>
      </div>
    </Section>
  );
}
