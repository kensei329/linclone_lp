import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { alternatesFor, localePath } from '@/i18n/paths';
import { FAN_APP, SITE } from '@/lib/site-config';
import { hrefs } from '@/lib/store-links';
import { homeGraph } from '@/lib/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { SkipLink, Header, Footer, MobileDownloadBar, QrDockShell } from '@/components/site';
import { HomeHero } from '@/components/sections/home/hero/HomeHero';
import { CastMarquee } from '@/components/sections/home/cast/CastMarquee';
import { About } from '@/components/sections/home/about/About';
import { CallChapter } from '@/components/sections/home/call/CallChapter';
import { MorningChapter } from '@/components/sections/home/morning/MorningChapter';
import { ChatChapter } from '@/components/sections/home/chat/ChatChapter';
import { LiveChapter } from '@/components/sections/home/live/LiveChapter';
import { GrowChapter } from '@/components/sections/home/grow/GrowChapter';
import { MoreBento } from '@/components/sections/home/more/MoreBento';
import { HowChapter } from '@/components/sections/home/how/HowChapter';
import { Faq } from '@/components/sections/home/faq/Faq';
import { CreatorsBand } from '@/components/sections/home/creators-band/CreatorsBand';
import { FinalCta } from '@/components/sections/home/final/FinalCta';

// Fan home, `/` (via rewrite) and `/en` (spec §5.0). This file only composes.

type PageProps = { params: Promise<{ lang: string }> };

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const d = getDictionary(lang);
  const canonical = localePath(lang, 'home');
  return {
    title: { absolute: d.meta.home.title },
    description: d.meta.home.description,
    alternates: alternatesFor('home', lang),
    openGraph: {
      type: 'website',
      siteName: 'LinClone',
      url: canonical,
      title: d.meta.home.ogTitle,
      description: d.meta.home.ogDescription,
      locale: lang === 'ja' ? 'ja_JP' : 'en_US',
      alternateLocale: [lang === 'ja' ? 'en_US' : 'ja_JP'],
    },
    // A page-level `twitter` replaces the layout's, so the card type is repeated here.
    twitter: { card: 'summary_large_image', title: d.meta.home.ogTitle, description: d.meta.home.ogDescription },
    // Smart App Banner: fan pages only (spec §8.5).
    itunes: { appId: FAN_APP.appStoreId, appArgument: `${SITE.origin}${canonical}` },
  };
}

export default async function HomePage({ params }: PageProps) {
  const lang = (await params).lang as Locale;
  const d = getDictionary(lang);
  return (
    <>
      <SkipLink href="#main" label={d.common.skip.toContent} />
      <SkipLink href="#download" label={d.common.skip.toDownload} />
      <Header d={d} lang={lang} page="home" />
      <main id="main" className="overflow-x-clip">
        <HomeHero d={d} lang={lang} />
        <CastMarquee d={d} lang={lang} />
        <About d={d} lang={lang} />
        <CallChapter d={d} lang={lang} />
        <MorningChapter d={d} lang={lang} />
        <ChatChapter d={d} lang={lang} />
        <LiveChapter d={d} lang={lang} />
        <GrowChapter d={d} lang={lang} />
        <MoreBento d={d} lang={lang} />
        <HowChapter d={d} lang={lang} />
        <Faq d={d} lang={lang} />
        <CreatorsBand d={d} lang={lang} />
        <FinalCta d={d} lang={lang} />
      </main>
      <Footer d={d} lang={lang} page="home" />
      <MobileDownloadBar d={d} lang={lang} {...hrefs('sticky', lang)} />
      <QrDockShell d={d} lang={lang} />
      <JsonLd data={homeGraph(lang, d)} />
    </>
  );
}
