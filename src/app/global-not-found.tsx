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
        <main id="main" style={{ minHeight: '100svh', display: 'grid', placeContent: 'center', gap: 24, padding: 16, textAlign: 'center' }}>
          <p className="wordmark">LinClone</p>
          <div>
            <h1 className="t-h2">{jaMeta.notFound.title}</h1>
            <p className="t-body">{jaMeta.notFound.body}</p>
            <p>
              <a href="/">{jaMeta.notFound.home}</a>
            </p>
          </div>
          <div lang="en">
            <p className="t-h3">{enMeta.notFound.title}</p>
            <p className="t-body">{enMeta.notFound.body}</p>
            <p>
              <a href="/en" hrefLang="en">
                {enMeta.notFound.home}
              </a>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
