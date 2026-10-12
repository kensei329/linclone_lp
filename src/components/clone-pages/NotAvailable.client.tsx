'use client';

import { useParams } from 'next/navigation';
import { Shell, StateCard } from './frame';
import './clone-pages.css';

// The not-found boundary of the DONE-C routes. A not-found.tsx gets no
// params on the server, so the [lang] segment is read here and the matching
// variant (both are passed in, already resolved from the strings module and
// the site dictionaries) is rendered. HTTP status stays 404 (notFound()).

export type StateVariant = {
  brand: string;
  homeHref: string;
  homeAria: string;
  homeLabel: string;
  title: string;
  body: string;
};

export function NotAvailable({ ja, en }: { ja: StateVariant; en: StateVariant }) {
  const params = useParams<{ lang?: string }>();
  const v = params?.lang === 'en' ? en : ja;
  return (
    <Shell brand={v.brand} homeHref={v.homeHref} homeAria={v.homeAria}>
      <StateCard title={v.title} body={v.body} homeHref={v.homeHref} homeLabel={v.homeLabel} />
    </Shell>
  );
}
