import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { getClonePage, type ClonePage } from '@/lib/public-api';
import { fanHandoff } from '@/lib/clone-links';
import { clonePageCopy } from '@/content/clone-pages/strings';
import { Shell } from '@/components/clone-pages/frame';
import { ComputerPanel, PhoneHandoff, shellProps } from '@/components/clone-pages/parts';

// DONE-C §2.1 — the clone page. `/c/<slug>` (JA, via the beforeFiles rewrite
// in next.config.ts) and `/en/c/<slug>`. `/u/<slug>` 301s here (§2.2).
//   API 404                → the neutral not-available page, HTTP 404 (./not-found.tsx)
//   API redirect: true     → permanent redirect to the canonical `url`
//   API 429 / down         → the last cached answer (lib/public-api.ts); with none, the neutral page (404)
//   otherwise              → avatar, name, @username (when non-null), bio; OG/Twitter from `og`;
//                            phone: the copy-then-store button; computer: badges + QR of `url`.
// Rendered on demand and kept 60 s (ISR); no per-visitor input on the server.

type Params = Promise<{ lang: string; slug: string }>;

export const revalidate = 60;
export const dynamicParams = true;
export function generateStaticParams(): { slug: string }[] {
  return []; // every slug on demand
}

/** The page's own path in a language (JA unprefixed, as the API's canonical `url`). */
const pathFor = (lang: Locale, slug: string) => (lang === 'en' ? `/en/c/${slug}` : `/c/${slug}`);

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  if (!isLocale(rawLang)) notFound();
  const lang: Locale = rawLang;
  const result = await getClonePage(slug);
  if (result.kind !== 'ok' || result.data.redirect) {
    return { title: { absolute: clonePageCopy(lang)['shared.notAvailableTitle'] }, robots: { index: false, follow: false } };
  }
  const p = result.data;
  const ogImages = p.og.image ? [{ url: p.og.image }] : [];
  return {
    title: { absolute: p.og.title },
    description: p.og.description ?? undefined,
    // A link-only clone is reachable only through its link: never indexed.
    robots: p.mode === 'PUBLIC' ? { index: true, follow: true } : { index: false, follow: false },
    alternates: p.mode === 'PUBLIC' ? { canonical: lang === 'ja' ? p.url : pathFor('en', p.slug) } : undefined,
    openGraph: {
      type: 'profile',
      siteName: 'LinClone',
      title: p.og.title,
      description: p.og.description ?? undefined,
      url: p.og.url,
      images: ogImages, // [] on purpose: no site card in place of a missing avatar
      locale: lang === 'ja' ? 'ja_JP' : 'en_US',
    },
    twitter: {
      card: 'summary',
      title: p.og.title,
      description: p.og.description ?? undefined,
      images: p.og.image ? [p.og.image] : [],
    },
  };
}

export default async function ClonePageRoute({ params }: { params: Params }) {
  const { lang: rawLang, slug } = await params;
  if (!isLocale(rawLang)) notFound();
  const lang: Locale = rawLang;
  const result = await getClonePage(slug);
  // 404, and "throttled / down with nothing cached" (lib/public-api.ts serves any cached answer first),
  // look the same: the neutral page, never saying why. (A throw here would be a bare 500 on an
  // on-demand ISR render — error.tsx is not used for it.)
  if (result.kind !== 'ok') notFound();
  const p = result.data;
  if (p.redirect) permanentRedirect(lang === 'ja' ? p.url : pathFor('en', p.slug));
  return <CloneView lang={lang} p={p} />;
}

function CloneView({ lang, p }: { lang: Locale; p: ClonePage }) {
  const d = getDictionary(lang);
  const copy = clonePageCopy(lang);
  const targets = fanHandoff(p.url, p.influencerId);
  const other: Locale = lang === 'ja' ? 'en' : 'ja';
  return (
    <Shell {...shellProps(d, lang, pathFor(other, p.slug))}>
      <div className="cp-grid">
        <section className="cp-card glass" aria-labelledby="cp-name">
          <div className="cp-avatar" aria-hidden={p.avatarUrl ? undefined : true}>
            {p.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- the API's absolute avatar URL (any host); no image optimiser hop
              <img src={p.avatarUrl} alt="" width={128} height={128} referrerPolicy="no-referrer" decoding="async" fetchPriority="high" />
            ) : (
              <span className="cp-avatar-initial">{Array.from(p.displayName)[0]}</span>
            )}
          </div>
          <h1 id="cp-name" className="cp-title">
            {p.displayName}
          </h1>
          {p.username ? <p className="cp-username">@{p.username}</p> : null}
          {p.bio ? <p className="t-body cp-bio">{p.bio}</p> : null}
          <PhoneHandoff targets={targets} label={copy['clone.cta']} hint={copy['shared.handoffHint']} loc="clone_page" />
        </section>
        <ComputerPanel d={d} lang={lang} copy={copy} storesLabel={copy['clone.storesLabel']} targets={targets} qrUrl={p.url} loc="clone_page" />
      </div>
    </Shell>
  );
}
