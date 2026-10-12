import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { localePath } from '@/i18n/paths';
import { getInvitePage, type InvitePage } from '@/lib/public-api';
import { studioHandoff } from '@/lib/clone-links';
import { clonePageCopy, type ClonePageCopy } from '@/content/clone-pages/strings';
import { Shell, StateCard } from '@/components/clone-pages/frame';
import { ComputerPanel, PhoneHandoff, shellProps } from '@/components/clone-pages/parts';

// DONE-C §2.3 — the LC Studio invitation page. `/studio/invite/<code>` (JA,
// via the beforeFiles rewrite in next.config.ts) and `/en/studio/invite/<code>`.
//   API 404           → "this invitation is not valid", HTTP 404 (./not-found.tsx)
//   USED / EXPIRED    → their own states, no action
//   VALID             → the code in large type; phone: copy-then-store button
//                       (lcstudio:// first in in-app browsers); computer: badges + QR of `url`
//   API 429 / down    → the last cached answer; with none, the neutral page (HTTP 200, not cached long: ISR 60 s)
// Never indexed. Rendered on demand and kept 60 s (ISR).

type Params = Promise<{ lang: string; code: string }>;

export const revalidate = 60;
export const dynamicParams = true;
export function generateStaticParams(): { code: string }[] {
  return [];
}

const pathFor = (lang: Locale, code: string) => (lang === 'en' ? `/en/studio/invite/${code}` : `/studio/invite/${code}`);

function titleOf(copy: ClonePageCopy, invite: InvitePage | null): string {
  if (!invite) return copy['invite.invalidTitle'];
  if (invite.status === 'USED') return copy['invite.usedTitle'];
  if (invite.status === 'EXPIRED') return copy['invite.expiredTitle'];
  return copy['invite.title'];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang: rawLang, code } = await params;
  if (!isLocale(rawLang)) notFound();
  const lang: Locale = rawLang;
  const copy = clonePageCopy(lang);
  const result = await getInvitePage(code);
  const title =
    result.kind === 'unavailable' ? copy['shared.notAvailableTitle'] : titleOf(copy, result.kind === 'ok' ? result.data : null);
  return {
    title: { absolute: title },
    robots: { index: false, follow: false },
    // No site share card: the inherited fan-app OG image does not describe an LC Studio invitation.
    openGraph: { title, images: [] },
    twitter: { card: 'summary', title, images: [] },
  };
}

export default async function InvitePageRoute({ params }: { params: Params }) {
  const { lang: rawLang, code } = await params;
  if (!isLocale(rawLang)) notFound();
  const lang: Locale = rawLang;
  const result = await getInvitePage(code);
  if (result.kind === 'notFound') notFound();
  // Throttled / down with nothing cached (any cached answer is served first): the neutral page.
  // Not the "invalid" page, and not a throw (a bare 500 on an on-demand ISR render).
  if (result.kind === 'unavailable') return <UnavailableView lang={lang} />;
  return <InviteView lang={lang} invite={result.data} />;
}

function UnavailableView({ lang }: { lang: Locale }) {
  const d = getDictionary(lang);
  const copy = clonePageCopy(lang);
  return (
    <Shell {...shellProps(d, lang)}>
      <StateCard
        title={copy['shared.notAvailableTitle']}
        body={copy['shared.notAvailableBody']}
        homeHref={localePath(lang, 'home')}
        homeLabel={d.meta.notFound.home}
      />
    </Shell>
  );
}

function InviteView({ lang, invite }: { lang: Locale; invite: InvitePage }) {
  const d = getDictionary(lang);
  const copy = clonePageCopy(lang);
  const other: Locale = lang === 'ja' ? 'en' : 'ja';
  const shell = shellProps(d, lang, pathFor(other, invite.code));

  if (invite.status !== 'VALID') {
    const used = invite.status === 'USED';
    return (
      <Shell {...shell}>
        <StateCard
          title={titleOf(copy, invite)}
          body={used ? copy['invite.usedBody'] : copy['invite.expiredBody']}
          homeHref={localePath(lang, 'home')}
          homeLabel={d.meta.notFound.home}
        />
      </Shell>
    );
  }

  const targets = studioHandoff(invite.url, invite.appLink);
  return (
    <Shell {...shell}>
      <div className="cp-grid">
        <section className="cp-card glass" aria-labelledby="cp-invite-title">
          <p className="cp-eyebrow">{d.common.studioBrand}</p>
          <h1 id="cp-invite-title" className="cp-title">
            {copy['invite.title']}
          </h1>
          <p className="t-body ink-2 cp-bio">{copy['invite.lead']}</p>
          <div className="cp-code">
            <p className="cp-code-label" id="cp-code-label">
              {copy['invite.codeLabel']}
            </p>
            <p className="cp-code-value" aria-labelledby="cp-code-label" translate="no">
              {invite.code}
            </p>
          </div>
          <PhoneHandoff targets={targets} label={copy['invite.cta']} hint={copy['shared.handoffHint']} loc="studio_invite" />
        </section>
        <ComputerPanel d={d} lang={lang} copy={copy} storesLabel={copy['invite.storesLabel']} targets={targets} qrUrl={invite.url} loc="studio_invite" />
      </div>
    </Shell>
  );
}
