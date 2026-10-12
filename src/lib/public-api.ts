import 'server-only';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';

// The two unauthenticated reads behind the DONE-C pages (contract §1.1, §1.2):
//   GET /public/v1/clone-pages/:slug     → /c/<slug>
//   GET /public/v1/studio-invites/:code  → /studio/invite/<code>
//
// Caching (contract §2): the site's server reaches the API from Vercel's shared
// egress addresses, so every visitor shares ONE rate-limit bucket. Each answer
// (the 200 and the 404 alike) is kept for 60 s. A 429, a 5xx or a network
// failure throws inside the cached function, so it is never stored: a stale
// answer keeps being served (Next.js returns the stale entry when its
// revalidation throws), and only a first-ever read falls back to the neutral
// page. Slugs and codes are never logged (a link-only slug is a secret).
//
// API host: LINCLONE_PUBLIC_API_URL (server-only). Production must set
// https://api.linclone.com; unset, the dev host is used (docs/clone-pages.md).

export const DEFAULT_PUBLIC_API_URL = 'https://api-dev.linclone.com';
const REVALIDATE_SECONDS = 60;
const TIMEOUT_MS = 5000;

function apiBase(): string {
  const raw = (process.env.LINCLONE_PUBLIC_API_URL ?? '').trim();
  return (raw || DEFAULT_PUBLIC_API_URL).replace(/\/+$/, '');
}

// Shapes the backend accepts (clone-page-resolver.ts SLUG_SHAPE, invite-page.ts
// CODE_SHAPE): anything else is a 404 there, so it is answered here without a call.
const SLUG_SHAPE = /^[A-Za-z0-9_-]{1,64}$/;
const CODE_SHAPE = /^[A-Z0-9_-]{1,32}$/;

const CANONICAL_CLONE_URL = /^https:\/\/linclone\.com\/c\/[A-Za-z0-9_-]{1,64}$/;
const CANONICAL_INVITE_URL = /^https:\/\/linclone\.com\/studio\/invite\/[A-Z0-9_-]{1,32}$/;
const STUDIO_APP_LINK = /^lcstudio:\/\/invite\?code=[A-Z0-9_-]{1,32}$/;

export type ClonePage = {
  slug: string;
  url: string;
  redirect: boolean;
  mode: 'PUBLIC' | 'UNLISTED';
  influencerId: string;
  displayName: string;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  og: { title: string; description: string | null; image: string | null; url: string };
};

export type InvitePage = {
  code: string;
  status: 'VALID' | 'USED' | 'EXPIRED';
  expiresAt: string | null;
  url: string;
  appLink: string;
};

/** `unavailable`: throttled / API down and nothing cached yet — the neutral page, never a reason. */
export type PageResult<T> = { kind: 'ok'; data: T } | { kind: 'notFound' } | { kind: 'unavailable' };
type Cached<T> = { kind: 'ok'; data: T } | { kind: 'notFound' };

class TransientApiError extends Error {}

const str = (v: unknown): v is string => typeof v === 'string' && v.length > 0;
const strOrNull = (v: unknown): string | null => (typeof v === 'string' && v.length > 0 ? v : null);
const httpsOrNull = (v: unknown): string | null => {
  const s = strOrNull(v);
  return s && /^https:\/\//.test(s) ? s : null;
};

/** One GET; 200 → parsed body, 404 → null, anything else throws (and is not cached). */
async function getJson(path: string): Promise<unknown | null> {
  let res: Response;
  try {
    res = await fetch(`${apiBase()}${path}`, {
      headers: { accept: 'application/json' },
      cache: 'no-store', // cached one level up, by unstable_cache (both 200 and 404)
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new TransientApiError('public api unreachable');
  }
  if (res.status === 404) return null;
  if (!res.ok) throw new TransientApiError(`public api answered ${res.status}`);
  try {
    return await res.json();
  } catch {
    throw new TransientApiError('public api answered non-JSON');
  }
}

function parseClonePage(body: unknown): ClonePage | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const og = (b.og && typeof b.og === 'object' ? b.og : {}) as Record<string, unknown>;
  if (!str(b.slug) || !str(b.url) || !CANONICAL_CLONE_URL.test(b.url) || !str(b.influencerId) || !str(b.displayName)) return null;
  const mode = b.mode === 'UNLISTED' ? 'UNLISTED' : 'PUBLIC';
  return {
    slug: b.slug,
    url: b.url,
    redirect: b.redirect === true,
    mode,
    influencerId: b.influencerId,
    displayName: b.displayName,
    username: mode === 'UNLISTED' ? null : strOrNull(b.username),
    avatarUrl: httpsOrNull(b.avatarUrl),
    bio: strOrNull(b.bio),
    og: {
      title: str(og.title) ? og.title : b.displayName,
      description: strOrNull(og.description),
      image: httpsOrNull(og.image),
      url: str(og.url) && CANONICAL_CLONE_URL.test(og.url) ? og.url : b.url,
    },
  };
}

function parseInvitePage(body: unknown): InvitePage | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  if (!str(b.code) || !CODE_SHAPE.test(b.code)) return null;
  if (b.status !== 'VALID' && b.status !== 'USED' && b.status !== 'EXPIRED') return null;
  if (!str(b.url) || !CANONICAL_INVITE_URL.test(b.url) || !str(b.appLink) || !STUDIO_APP_LINK.test(b.appLink)) return null;
  return { code: b.code, status: b.status, expiresAt: strOrNull(b.expiresAt), url: b.url, appLink: b.appLink };
}

const cachedClonePage = unstable_cache(
  async (slug: string): Promise<Cached<ClonePage>> => {
    const body = await getJson(`/public/v1/clone-pages/${encodeURIComponent(slug)}`);
    const page = body === null ? null : parseClonePage(body);
    if (body !== null && !page) throw new TransientApiError('public api answered an unexpected clone page');
    return page ? { kind: 'ok', data: page } : { kind: 'notFound' };
  },
  ['public-clone-page-v1'],
  { revalidate: REVALIDATE_SECONDS, tags: ['public-clone-page'] },
);

const cachedInvitePage = unstable_cache(
  async (code: string): Promise<Cached<InvitePage>> => {
    const body = await getJson(`/public/v1/studio-invites/${encodeURIComponent(code)}`);
    const page = body === null ? null : parseInvitePage(body);
    if (body !== null && !page) throw new TransientApiError('public api answered an unexpected invitation');
    return page ? { kind: 'ok', data: page } : { kind: 'notFound' };
  },
  ['public-studio-invite-v1'],
  { revalidate: REVALIDATE_SECONDS, tags: ['public-studio-invite'] },
);

async function settle<T>(read: () => Promise<Cached<T>>, what: string): Promise<PageResult<T>> {
  try {
    return await read();
  } catch (e) {
    console.warn(`[clone-pages] ${what}: ${(e as Error)?.message ?? 'failed'}; neutral page`);
    return { kind: 'unavailable' };
  }
}

/** The clone page for a `/c/<slug>` (or `/u/<slug>`) slug. Deduplicated per request (metadata + page). */
export const getClonePage = cache(async (rawSlug: string): Promise<PageResult<ClonePage>> => {
  const slug = safeDecode(rawSlug);
  if (slug === null || !SLUG_SHAPE.test(slug)) return { kind: 'notFound' };
  return settle(() => cachedClonePage(slug), 'clone page');
});

/** The invitation for a `/studio/invite/<code>` code (trimmed + upper-cased, as the API reads it). */
export const getInvitePage = cache(async (rawCode: string): Promise<PageResult<InvitePage>> => {
  const decoded = safeDecode(rawCode);
  const code = decoded === null ? null : decoded.trim().toUpperCase();
  if (code === null || !CODE_SHAPE.test(code)) return { kind: 'notFound' };
  return settle(() => cachedInvitePage(code), 'studio invite');
});

function safeDecode(s: string): string | null {
  try {
    return decodeURIComponent(s);
  } catch {
    return null;
  }
}
