import type { Metadata } from 'next';
import '@/styles/site.css';
import { fontVariables } from '@/lib/fonts';
import jaMeta from '@/i18n/dictionaries/ja/meta.json';
import enMeta from '@/i18n/dictionaries/en/meta.json';

// Global 404 for URLs that match neither root layout (spec §2.6).

export const metadata: Metadata = {
  title: 'Page not found | LinClone',
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="ja" className={fontVariables}>
      <body>
        <main id="main" className="surface-dawn not-found">
          <div className="container-site not-found-inner">
            <p className="not-found-brand">
              {/* eslint-disable-next-line @next/next/no-img-element -- brand mark */}
              <img src="/brand/mark-128.png" alt="" width={36} height={36} />
              <span className="wordmark">LinClone</span>
            </p>
            <div className="not-found-copy">
              <h1 className="t-h2">{jaMeta.notFound.title}</h1>
              <p className="t-body ink-2">{jaMeta.notFound.body}</p>
              <p>
                <a href="/" className="btn-primary">
                  {jaMeta.notFound.home}
                </a>
              </p>
            </div>
            <div className="not-found-copy" lang="en">
              <p className="t-h3">{enMeta.notFound.title}</p>
              <p className="t-body ink-2">{enMeta.notFound.body}</p>
              <p>
                <a href="/en" hrefLang="en" className="btn-ghost">
                  {enMeta.notFound.home}
                </a>
              </p>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
