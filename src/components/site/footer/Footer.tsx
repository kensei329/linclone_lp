import type { ReactNode } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/paths';
import { mailtoStudio } from '@/lib/store-links';
import { SOCIAL } from '@/lib/site-config';
import { Icon } from '../icons/Icon';
import { StoreBadges } from '../download/StoreBadges';
import { StudioStoreCTA } from '../download/StudioStoreCTA';
import { LangPill } from '../header/LangPill';

type Link = { href: string; label: string; analytics?: string };

function Column({ title, links }: { title: string; links: Link[] }): ReactNode {
  return (
    <details className="footer-col">
      <summary>
        {title}
        <Icon name="expand_more" size={20} />
      </summary>
      <nav aria-label={title}>
        <ul>
          {links.map((l) => (
            <li key={l.href + l.label}>
              <a href={l.href} data-analytics={l.analytics}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}

/**
 * Site footer (spec §4.1, §5.14): night-deep with a 4% watermark wordmark;
 * four link columns on desktop, <details> accordions on mobile. Legacy pages
 * are plain <a> (different root layout, so always a full load).
 */
export function Footer({ d, lang, page }: { d: Dictionary; lang: Locale; page: 'home' | 'creators' }) {
  const L = d.footer.links;
  const anchor = (hash: string) => (page === 'home' ? hash : localePath(lang, 'home', hash));
  const home = page === 'home';
  return (
    <footer className="site-footer" data-surface="dark" data-page={page} data-download-block={home ? '' : undefined}>
      <span className="footer-watermark" aria-hidden="true">
        {d.common.brand}
      </span>
      <div className="container-site">
        <div className="footer-grid">
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element -- brand mark */}
            <img src="/brand/mark-white-256.png" alt="" width={36} height={36} />
            <p className="wordmark">{d.common.brand}</p>
            <p className="footer-tagline t-small">{d.footer.tagline}</p>
            {home ? <StoreBadges d={d} lang={lang} placement="footer" /> : <StudioStoreCTA d={d} lang={lang} compact />}
          </div>
          <div className="footer-cols">
            <Column
              title={d.footer.columns.app}
              links={[
                { href: anchor('#call'), label: L.call },
                { href: anchor('#morning-call'), label: L.morning },
                { href: anchor('#chat'), label: L.chat },
                { href: anchor('#live'), label: L.live },
                { href: anchor('#grow'), label: L.grow },
                { href: anchor('#faq'), label: L.faq },
                { href: localePath(lang, 'home'), label: L.fanApp },
              ]}
            />
            <Column
              title={d.footer.columns.creators}
              links={[
                { href: localePath(lang, 'creators'), label: L.studio, analytics: home ? 'creators_nav:footer' : undefined },
                { href: mailtoStudio(lang, d), label: L.requestInvite, analytics: 'studio_mailto:footer' },
              ]}
            />
            <Column
              title={d.footer.columns.support}
              links={[
                { href: '/support', label: L.support },
                { href: '/delete-user', label: L.deleteUser },
              ]}
            />
            <Column
              title={d.footer.columns.legal}
              links={[
                { href: '/privacy', label: L.privacy },
                { href: '/terms', label: L.terms },
                { href: '/cookies', label: L.cookies },
                { href: '/policies/child-protection-policy', label: L.childSafety },
              ]}
            />
          </div>
        </div>
        {SOCIAL.length ? (
          <ul className="footer-social">
            {SOCIAL.map((s) => (
              <li key={s.url}>
                <a href={s.url} rel="me noopener">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="footer-bottom">
          <LangPill lang={lang} page={page} d={d} />
          <p className="t-small">{d.footer.copyright}</p>
          <p className="t-small">{d.common.disclosure}</p>
        </div>
      </div>
    </footer>
  );
}
