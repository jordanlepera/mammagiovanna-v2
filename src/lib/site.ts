import type { Locale } from '@/i18n/routing';

/**
 * Canonical site configuration — single source of truth for SEO, JSON-LD,
 * footer, and contact info. Values verified against v1 + public listings.
 */
export const SITE_URL = 'https://www.mammagiovanna.com';
export const SITE_NAME = 'Mamma Giovanna';
export const RESTAURANT_TYPE = ['Italian', 'Pizzeria'];

export const LOCALES: Locale[] = ['fr', 'en', 'de', 'it'];

export const CONTACT = {
  phone: '+33 3 89 41 24 79',
  phoneHref: 'tel:+33389412479',
  street: '12 rue des Marchands',
  postalCode: '68000',
  city: 'Colmar',
  country: 'FR',
  countryCode: 'FR',
  latitude: 48.0764,
  longitude: 7.3585,
} as const;

export const SOCIALS = {
  facebook: 'https://www.facebook.com/mammagiovanna.colmar/',
  instagram: 'https://www.instagram.com/mammagiovanna_fr/',
  tripadvisor:
    'https://www.tripadvisor.fr/Restaurant_Review-g187073-d10439955-Reviews-Mamma_Giovanna-Colmar_Haut_Rhin_Grand_Est.html',
} as const;

/** Midday + evening service, Monday to Saturday. Closed Sunday. */
export const OPENING_HOURS = [
  {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '11:45',
    closes: '14:00',
  },
  {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '18:45',
    closes: '22:00',
  },
] as const;

/** ISO day-of-week for schema.org (1=Monday … 7=Sunday). */
export function openingHoursSpecification() {
  return OPENING_HOURS.map(({ days, opens, closes }) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: days,
    opens,
    closes,
  }));
}

export function absoluteUrl(path: string, locale?: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale ? `${SITE_URL}/${locale}${clean === '/' ? '' : clean}` : `${SITE_URL}${clean}`;
}

export function localeAlternates(path = '/') {
  return Object.fromEntries(LOCALES.map((l) => [l, absoluteUrl(path, l)])) as Record<
    Locale,
    string
  >;
}
