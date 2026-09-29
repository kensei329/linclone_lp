export const LOCALES = ['ja', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ja';

export function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}
