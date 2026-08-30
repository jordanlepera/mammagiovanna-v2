import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['fr', 'en', 'de', 'it'],

  // Used when no locale matches
  defaultLocale: 'fr',

  // The visitor's device language (Accept-Language) decides on every visit.
  // No cookie: a first auto-detection must never freeze later visits to a
  // locale the phone no longer requests. French remains the fallback only.
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  de: 'Deutsch',
  it: 'Italiano',
};
