import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import type { PersonaId } from '@/lib/personas';

/** Props every mockup takes (spec §7.0). There is deliberately no prop for prices, counts or versions. */
export type MockProps = { d: Dictionary; lang: Locale; persona?: PersonaId | 'oshi'; className?: string };
