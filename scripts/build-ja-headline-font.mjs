#!/usr/bin/env node
// JA headline font subset (spec §3.6). Collects every glyph the display face
// draws in Japanese (dictionary strings whose key path is a headline, fill,
// statement, caption or sticker, plus a few fixed keys) and writes a single
// Noto Sans JP ExtraBold (800) woff2 with exactly those glyphs to
// public/fonts/NotoSansJP-Headline.woff2, declared in site.css as
// "LC JP Headline". Latin glyphs come from Plus Jakarta Sans, so none are kept.
//
//   node scripts/build-ja-headline-font.mjs          fetch the subset and write it (network)
//   node scripts/build-ja-headline-font.mjs --check  offline: fail if a headline glyph is
//                                                    missing from the committed subset
//
// The subset is produced by the Google Fonts CSS2 API (`text=`), which serves
// the official Noto Sans JP (SIL OFL 1.1) cut to the requested characters.
// The glyph list it was built from is committed next to this script, so the
// build-time check needs no network.
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DICT = join(ROOT, 'src/i18n/dictionaries/ja');
const OUT = join(ROOT, 'public/fonts/NotoSansJP-Headline.woff2');
const MANIFEST = join(ROOT, 'scripts/ja-headline-chars.txt');
const CHECK = process.argv.includes('--check');

/** Key paths (inside a namespace) rendered with the display face. */
const KEY =
  /(^|\.)(title|fill|statement|captionLine|eyebrow\.label|fanCaption|oshiCaption|lineOne|lineTwo|doneTitle|stickers\.[a-z0-9]+|chips\.[a-z0-9]+|lines\.[a-z0-9]+)$/;
/** Full paths outside that pattern. */
const EXTRA = new Set(['common.tagline', 'common.disclosure', 'common.disclosureOfficial', 'home.final.eyebrow', 'creators.header.lockup']);
/** Punctuation headlines may use even when no current string does. */
const PUNCT = '、。・？！「」『』（）～…ー';

const isCjk = (ch) => ch.codePointAt(0) > 0x2000;

function collect() {
  const chars = new Set(PUNCT);
  const walk = (obj, path, ns) => {
    for (const [k, v] of Object.entries(obj)) {
      const kp = path ? `${path}.${k}` : k;
      if (v && typeof v === 'object') walk(v, kp, ns);
      else if (KEY.test(kp) || EXTRA.has(`${ns}.${kp}`)) for (const ch of String(v)) if (isCjk(ch)) chars.add(ch);
    }
  };
  for (const file of readdirSync(DICT).filter((f) => f.endsWith('.json')).sort()) {
    walk(JSON.parse(readFileSync(join(DICT, file), 'utf8')), '', basename(file, '.json'));
  }
  return [...chars].sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join('');
}

const wanted = collect();

if (CHECK) {
  let have = '';
  try {
    have = readFileSync(MANIFEST, 'utf8').trim();
  } catch {
    console.error('ja headline font: scripts/ja-headline-chars.txt is missing; run `npm run font:ja`');
    process.exit(1);
  }
  const missing = [...wanted].filter((ch) => !have.includes(ch));
  if (missing.length) {
    console.error(`ja headline font: ${missing.length} glyph(s) missing from the subset: ${missing.join('')}\nRun \`npm run font:ja\` and commit public/fonts/NotoSansJP-Headline.woff2.`);
    process.exit(1);
  }
  console.log(`ja headline font: ok (${wanted.length} glyphs covered)`);
  process.exit(0);
}

// A current Chrome UA makes the API answer with woff2.
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const api = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@800&text=${encodeURIComponent(wanted)}`;
const css = await (await fetch(api, { headers: { 'User-Agent': UA } })).text();
const urls = [...css.matchAll(/src:\s*url\(([^)]+)\)\s*format\('woff2'\)/g)].map((m) => m[1]);
if (urls.length !== 1) throw new Error(`expected one woff2 face, got ${urls.length}:\n${css}`);
const res = await fetch(urls[0]);
if (!res.ok) throw new Error(`font download failed: ${res.status}`);
const buf = Buffer.from(await res.arrayBuffer());
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, buf);
writeFileSync(MANIFEST, `${wanted}\n`);
console.log(`wrote public/fonts/NotoSansJP-Headline.woff2 (${wanted.length} glyphs, ${(buf.length / 1024).toFixed(1)} KB)`);
