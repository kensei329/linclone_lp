#!/usr/bin/env node
// Fonts for the Open Graph images (spec §8.2). Satori needs TTF/OTF, and the
// images are rendered at build time, so the subsets are committed under
// src/lib/og/fonts and read from disk: no network while building or serving.
//
//   node scripts/build-og-fonts.mjs          fetch the subsets and write them (network)
//   node scripts/build-og-fonts.mjs --check  offline: fail if an OG glyph is missing
//
// Japanese: Noto Sans JP 800 (headline, chip, pill) and 500 (lead, disclosure),
// cut to the CJK characters of the strings the images draw from. Latin: Plus Jakarta Sans 800/500, printable
// ASCII plus typographic punctuation. All via the Google Fonts CSS2 `text=`
// API (SIL OFL 1.1 fonts); without a browser UA it answers with TrueType.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DICT = join(ROOT, 'src/i18n/dictionaries/ja');
const OUT = join(ROOT, 'src/lib/og/fonts');
const MANIFEST = join(OUT, 'chars.txt');
const CHECK = process.argv.includes('--check');

const read = (ns) => JSON.parse(readFileSync(join(DICT, `${ns}.json`), 'utf8'));
function cjk() {
  const set = new Set('、。・？！「」（）～…ー');
  const add = (o) => {
    for (const v of Object.values(o)) {
      if (v && typeof v === 'object') add(v);
      else for (const ch of String(v)) if (ch.codePointAt(0) > 0x2000) set.add(ch);
    }
  };
  // What the images draw (plus the rest of the two hero namespaces, so hero
  // copy edits rarely need a rebuild).
  add(read('home.hero'));
  add(read('creators').hero);
  const common = read('common');
  add({ brand: common.brand, first60: common.friction.first60, disclosure: common.disclosure });
  add({ pill: read('meta').creators.ogPill });
  return [...set].sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join('');
}
const LATIN = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('') + '’‘“”–—…·×';

const wanted = cjk();
if (CHECK) {
  let have = '';
  try {
    have = readFileSync(MANIFEST, 'utf8');
  } catch {
    console.error('og fonts: src/lib/og/fonts/chars.txt is missing; run `npm run font:og`');
    process.exit(1);
  }
  const missing = [...wanted].filter((ch) => !have.includes(ch));
  if (missing.length) {
    console.error(`og fonts: ${missing.length} glyph(s) missing: ${missing.join('')}\nRun \`npm run font:og\` and commit src/lib/og/fonts.`);
    process.exit(1);
  }
  console.log(`og fonts: ok (${wanted.length} CJK glyphs covered)`);
  process.exit(0);
}

async function ttf(family, weight, text) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`)).text();
  const m = css.match(/src:\s*url\(([^)]+)\)\s*format\('truetype'\)/);
  if (!m) throw new Error(`no truetype face for ${family} ${weight}:\n${css}`);
  const res = await fetch(m[1]);
  if (!res.ok) throw new Error(`download failed: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

mkdirSync(OUT, { recursive: true });
const jobs = [
  ['NotoSansJP-800.ttf', 'Noto+Sans+JP', 800, wanted],
  ['NotoSansJP-500.ttf', 'Noto+Sans+JP', 500, wanted],
  ['PlusJakartaSans-800.ttf', 'Plus+Jakarta+Sans', 800, LATIN],
  ['PlusJakartaSans-500.ttf', 'Plus+Jakarta+Sans', 500, LATIN],
];
for (const [file, family, weight, text] of jobs) {
  const buf = await ttf(family, weight, text);
  writeFileSync(join(OUT, file), buf);
  console.log(`wrote src/lib/og/fonts/${file} (${(buf.length / 1024).toFixed(1)} KB)`);
}
writeFileSync(MANIFEST, `${wanted}\n`);
