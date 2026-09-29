import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { alternatesFor, localePath } from '@/i18n/paths';
import { creatorsGraph } from '@/lib/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { SkipLink, Header, Footer } from '@/components/site';
import { CreatorsHero } from '@/components/sections/creators/hero/CreatorsHero';
import { CreatorsStatement } from '@/components/sections/creators/statement/CreatorsStatement';
import { CommandCentre } from '@/components/sections/creators/command-centre/CommandCentre';
import { StudioSetup } from '@/components/sections/creators/setup/StudioSetup';
import { CloneCheck } from '@/components/sections/creators/check/CloneCheck';
import { StudioControl } from '@/components/sections/creators/control/StudioControl';
import { StudioReal } from '@/components/sections/creators/real/StudioReal';
import { StudioVoice } from '@/components/sections/creators/voice/StudioVoice';
import { StudioInsights } from '@/components/sections/creators/insights/StudioInsights';
import { StudioJoin } from '@/components/sections/creators/join/StudioJoin';
import { StudioFaq } from '@/components/sections/creators/faq/StudioFaq';
import { CreatorsFinal } from '@/components/sections/creators/final/CreatorsFinal';

// LC Studio, `/creators` (via rewrite) and `/en/creators` (spec §6). No Smart
// App Banner, sticky bar or QR dock on this page.

type PageProps = { params: Promise<{ lang: string }> };

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const d = getDictionary(lang);
  return {
    title: { absolute: d.meta.creators.title },
    description: d.meta.creators.description,
    alternates: alternatesFor('creators', lang),
    openGraph: {
      type: 'website',
      siteName: 'LinClone',
      url: localePath(lang, 'creators'),
      title: d.meta.creators.ogTitle,
      description: d.meta.creators.ogDescription,
      locale: lang === 'ja' ? 'ja_JP' : 'en_US',
      alternateLocale: [lang === 'ja' ? 'en_US' : 'ja_JP'],
    },
    twitter: { card: 'summary_large_image', title: d.meta.creators.ogTitle, description: d.meta.creators.ogDescription },
  };
}

export default async function CreatorsPage({ params }: PageProps) {
  const lang = (await params).lang as Locale;
  const d = getDictionary(lang);
  return (
    <>
      <SkipLink href="#main" label={d.common.skip.toContent} />
      <Header d={d} lang={lang} page="creators" />
      <main id="main" className="overflow-x-clip">
        <CreatorsHero d={d} lang={lang} />
        <CreatorsStatement d={d} lang={lang} />
        <CommandCentre d={d} lang={lang} />
        <StudioSetup d={d} lang={lang} />
        <CloneCheck d={d} lang={lang} />
        <StudioControl d={d} lang={lang} />
        <StudioReal d={d} lang={lang} />
        <StudioVoice d={d} lang={lang} />
        <StudioInsights d={d} lang={lang} />
        <StudioJoin d={d} lang={lang} />
        <StudioFaq d={d} lang={lang} />
        <CreatorsFinal d={d} lang={lang} />
      </main>
      <Footer d={d} lang={lang} page="creators" />
      <JsonLd data={creatorsGraph(lang, d)} />
    </>
  );
}
