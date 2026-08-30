import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
// Latin subsets only — Colmar's languages (fr/en/de/it) need no Cyrillic.
import '@fontsource-variable/outfit';
import '@fontsource-variable/bodoni-moda';
import { routing, localeNames, type Locale } from '@/i18n/routing';
import { SITE_NAME, SITE_URL, CONTACT, SOCIALS, localeAlternates } from '@/lib/site';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import '../globals.css';

// Prerender all four locales at build time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const alternates = localeAlternates('/');
  const siteName = SITE_NAME;

  // Translated titles + descriptions live in messages (common namespace).
  const titles: Record<Locale, string> = {
    fr: 'Mamma Giovanna · Restaurant italien à Colmar',
    en: 'Mamma Giovanna · Italian Restaurant in Colmar',
    de: 'Mamma Giovanna · Italienisches Restaurant in Colmar',
    it: 'Mamma Giovanna · Ristorante italiano a Colmar',
  };
  const t = await getTranslations({ locale, namespace: 'common' });
  const title = titles[locale as Locale] ?? titles.fr;
  const description = t('meta-home-description');

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s · ${siteName}`,
    },
    description: description,
    keywords: [
      'restaurant italien Colmar',
      'pizzeria Colmar',
      'Mamma Giovanna',
      'restaurant Colmar centre',
    ],
    alternates: {
      canonical: alternates[locale as Locale] ?? alternates.fr,
      languages: { ...alternates, 'x-default': alternates.fr },
    },
    openGraph: {
      type: 'website',
      siteName,
      url: alternates[locale as Locale] ?? alternates.fr,
      title: title,
      description: description,
      locale: locale === 'en' ? 'en_GB' : locale,
      images: [{ url: '/brand/salle.jpg', width: 1200, height: 800, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  setRequestLocale(locale);

  // Organization JSON-LD on every page (locale-independent facts).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/brand/salle.jpg`,
    telephone: CONTACT.phone,
    servesCuisine: ['Italian', 'Pizza'],
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.street,
      postalCode: CONTACT.postalCode,
      addressLocality: CONTACT.city,
      addressCountry: CONTACT.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: CONTACT.latitude,
      longitude: CONTACT.longitude,
    },
    sameAs: [SOCIALS.facebook, SOCIALS.instagram, SOCIALS.tripadvisor],
    acceptsReservations: 'True',
  };

  return (
    <html lang={locale} className="dark">
      <body className="bg-background text-foreground min-h-dvh font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <NextIntlClientProvider>
          <a
            href="#main-content"
            className="focus:bg-basil focus:text-background sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main-content" className="relative">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
        <span className="sr-only">{Object.values(localeNames).join(' ')}</span>
      </body>
    </html>
  );
}
