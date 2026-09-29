import type { Dictionary } from './dictionaries';
import type { Locale } from './config';

export type { Dictionary } from './dictionaries';
export type { Locale } from './config';
export type { PageKey } from './paths';

/** Props every page section receives (spec §5.0, §6). */
export type SectionProps = { d: Dictionary; lang: Locale };
