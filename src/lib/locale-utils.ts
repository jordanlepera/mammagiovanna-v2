import type { Locale } from '@/i18n/routing';
import { localeNames, routing } from '@/i18n/routing';

export interface AppMessages {
  common: Record<string, string>;
}

/** Flag emoji for a locale (deprecated in TS; isolate the mapping here). */
export function localeFlag(locale: Locale): string {
  const flags: Record<Locale, string> = {
    fr: '🇫🇷',
    en: '🇬🇧',
    de: '🇩🇪',
    it: '🇮🇹',
  };
  return flags[locale];
}

export { localeNames, routing };
