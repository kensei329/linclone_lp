import 'server-only';
import type { Locale } from './config';
import { ja, en, type Dictionary } from './dictionaries';

export type { Dictionary } from './dictionaries';

/** Synchronous: both locales are statically bundled into the server build. */
export function getDictionary(lang: Locale): Dictionary {
  return lang === 'en' ? en : ja;
}
