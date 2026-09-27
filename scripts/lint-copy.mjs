#!/usr/bin/env node
// Copy lint (spec §9.6). Fails on any rule violation in the dictionaries
// (src/i18n/dictionaries/{ja,en}/*.json); warns on the same patterns in
// user-visible strings inside src/components/**/*.tsx. Runs in `prebuild`.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DICT = join(ROOT, 'src/i18n/dictionaries');
const COMPONENTS = join(ROOT, 'src/components');
const LOCALES = ['ja', 'en'];

// ── load ────────────────────────────────────────────────────────────────────
function flatten(obj, prefix, out) {
  for (const [k, v] of Object.entries(obj)) {
    const key = `${prefix}${k}`;
    if (v && typeof v === 'object') flatten(v, `${key}.`, out);
    else out.set(key, String(v));
  }
  return out;
}

/** Map of full key path → value, built from the per-namespace files. */
function loadLocale(lang) {
  const dir = join(DICT, lang);
  const out = new Map();
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
    const ns = basename(file, '.json');
    flatten(JSON.parse(readFileSync(join(dir, file), 'utf8')), `${ns}.`, out);
  }
  return out;
}

// ── rules ───────────────────────────────────────────────────────────────────
const DIGIT_ALLOW = [
  /\d{1,2}:\d{2}/g, // clocks and timers
  /60秒|60-second|60 seconds/g,
  /第[1-5]章|Chapter [1-5]/g,
  /1回のみ|1回だけ/g,
  /1つのアカウントを1人/g,
  /2人の/g, // product name 「2人の関係と記憶」
  /\{current\}|\{total\}/g,
];
const EXACT_DIGIT_VALUES = /^(7日|30日|90日|7 days|30 days|90 days)$/;

const isCreatorKey = (k) => /^(creators|mock\.studio|meta\.creators)\./.test(k);
const isVideoKey = (k) => k.split('.').includes('video');

/** Each rule: (key, value, lastSegment) → message | null. */
const RULES = [
  {
    id: 'digits',
    test(key, value, last) {
      if (last === 'num' && /^0[1-9]$/.test(value)) return null;
      if (EXACT_DIGIT_VALUES.test(value)) return null;
      let rest = value;
      for (const re of DIGIT_ALLOW) rest = rest.replace(re, '');
      const m = rest.match(/\d+/);
      return m ? `numeral "${m[0]}"` : null;
    },
  },
  {
    id: 'money',
    test(key, value) {
      const m = value.match(/[¥$%]/) || value.match(/\d\s?(円|コイン|coins?)|(円|コイン|coins?)\s?\d/i);
      return m ? `money "${m[0]}"` : null;
    },
  },
  {
    id: 'version',
    test(key, value) {
      const m = value.match(/\bVER\b|\bv\d|version/i);
      return m ? `version "${m[0]}"` : null;
    },
  },
  {
    id: 'ja-voice',
    test(key, value) {
      const m = value.match(/あなた|！|ライブ(?!ラリ)|(?:ません|ました)・/);
      return m ? `JA voice "${m[0]}"` : null;
    },
  },
  {
    id: 'creator-pages',
    test(key, value) {
      if (!isCreatorKey(key)) return null;
      const m = value.match(/ファン|\bfans?\b/i);
      return m ? `creator page says "${m[0]}" (use フォロワー / followers)` : null;
    },
  },
  {
    id: 'personas-premium',
    test(key, value) {
      const m = value.match(
        /Mina|Kensei|kensei|星空|シンセ|深夜ラジオ|フィルム|神戸|Kobe|Digital Twilight|Romantic|Soulmate|Devoted|ロマンティック|ソウルメイト|18歳以上|18\+/,
      );
      return m ? `banned persona/premium term "${m[0]}"` : null;
    },
  },
  {
    id: 'refuted-claims',
    test(key, value) {
      if (!isVideoKey(key)) {
        const v = value.match(/ビデオ|video/i);
        if (v) return `refuted claim "${v[0]}" outside a *.video.* key`;
      }
      const m = value.match(
        /10分以内|within 10 minutes|24時間|24 hours|無料で作成|free to create|interview|インタビュー|共同配信|co-host|限定URL|unlisted|無制限|unlimited|通常約1分|about a minute|within a minute/i,
      );
      return m ? `refuted claim "${m[0]}"` : null;
    },
  },
  {
    id: 'studio-free',
    test(key, value) {
      if (!/^(creators|meta\.creators)\./.test(key)) return null;
      const m = value.match(/無料|\bfree\b/i);
      return m ? `LC Studio must not be called free ("${m[0]}")` : null;
    },
  },
];

// ── dictionaries (errors) ───────────────────────────────────────────────────
const errors = [];
const dicts = Object.fromEntries(LOCALES.map((l) => [l, loadLocale(l)]));

const [a, b] = LOCALES;
for (const [x, y] of [[a, b], [b, a]]) {
  for (const key of dicts[x].keys()) {
    if (!dicts[y].has(key)) errors.push(`[parity] ${key} exists in ${x} but not in ${y}`);
  }
}

for (const lang of LOCALES) {
  for (const [key, value] of dicts[lang]) {
    const last = key.split('.').at(-1);
    for (const rule of RULES) {
      const msg = rule.test(key, value, last);
      if (msg) errors.push(`[${rule.id}] ${lang}:${key}: ${msg}`);
    }
  }
}

// ── components (warnings) ───────────────────────────────────────────────────
// Only visible text is checked: JSX text nodes and string literals that
// contain Japanese or a space between words. Class names, SVG paths and
// numeric props are ignored.
function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.tsx') ? [p] : [];
  });
}

const JP = /[぀-ヿ㐀-鿿！-｠]/;
const warnings = [];
for (const file of walk(COMPONENTS)) {
  const rel = relative(ROOT, file);
  const src = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\/|(^|[^:])\/\/.*$/gm, '$1');
  const pseudoKey = /components\/(sections\/creators|mockups\/studio)\//.test(rel) ? 'creators.component' : 'component';
  const texts = [];
  for (const m of src.matchAll(/>([^<>{}]*[A-Za-z぀-鿿][^<>{}]*)</g)) texts.push(m[1].trim());
  for (const m of src.matchAll(/(['"`])((?:\\.|(?!\1).)*)\1/g)) {
    if (JP.test(m[2]) || /[A-Za-z]{2,} [A-Za-z]{2,}/.test(m[2])) texts.push(m[2]);
  }
  for (const text of texts) {
    if (!text) continue;
    for (const rule of RULES) {
      if (rule.id === 'digits' || rule.id === 'money') continue; // too noisy outside copy
      const msg = rule.test(pseudoKey, text, '');
      if (msg) warnings.push(`[${rule.id}] ${rel}: ${msg}`);
    }
  }
}

// ── report ──────────────────────────────────────────────────────────────────
for (const w of warnings) console.warn(`warn  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`error ${e}`);
  console.error(`\ncopy lint: ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}
const total = dicts[a].size;
console.log(`copy lint: ok (${total} keys × ${LOCALES.length} locales, ${warnings.length} warning(s))`);
