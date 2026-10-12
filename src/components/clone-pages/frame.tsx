import type { ReactNode } from 'react';

// Frame and no-action state card of the DONE-C pages. Plain props, no
// server-only imports: also rendered by NotAvailable.client.tsx (not-found
// boundaries cannot read the route's [lang] on the server).

export type ShellProps = {
  brand: string;
  homeHref: string;
  homeAria: string;
  /** The same page in the other language, when there is one. */
  langLink?: { href: string; label: string; lang: string };
  children: ReactNode;
};

/** The page frame: brand lockup back to the site, the other-language link, then the content. */
export function Shell({ brand, homeHref, homeAria, langLink, children }: ShellProps) {
  return (
    <main id="main" className="cp surface-dawn">
      <div className="cp-frame">
        <header className="cp-top">
          <a href={homeHref} className="cp-lockup" aria-label={homeAria}>
            {/* eslint-disable-next-line @next/next/no-img-element -- 28px brand mark */}
            <img src="/brand/mark-56.png" alt="" width={28} height={28} />
            <span className="wordmark">{brand}</span>
          </a>
          {langLink ? (
            <a href={langLink.href} hrefLang={langLink.lang} lang={langLink.lang} className="cp-lang" data-analytics={`lang_switch:${langLink.lang}`}>
              {langLink.label}
            </a>
          ) : null}
        </header>
        {children}
      </div>
    </main>
  );
}

/** A state with no action (not available; invitation invalid, used or expired). */
export function StateCard({ title, body, homeHref, homeLabel }: { title: string; body: string; homeHref: string; homeLabel: string }) {
  return (
    <section className="cp-card cp-state glass" aria-labelledby="cp-state-title">
      <h1 id="cp-state-title" className="cp-title">
        {title}
      </h1>
      <p className="t-body ink-2 cp-state-body">{body}</p>
      <p className="cp-state-home">
        <a href={homeHref} className="btn-ghost">
          {homeLabel}
        </a>
      </p>
    </section>
  );
}
