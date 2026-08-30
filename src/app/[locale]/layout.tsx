import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
// Latin subsets only — Colmar's languages (fr/en/de/it) need no Cyrillic.
import '@fontsource-variable/outfit';
import '@fontsource/caveat/latin-400.css';
import '@fontsource/caveat/latin-700.css';
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

  const meta: Record<Locale, { title: string; description: string }> = {
    fr: {
      title: 'Mamma Giovanna · Restaurant italien à Colmar',
      description:
        'Restaurant italien et pizzeria à Colmar. Pâtes fraîches, pizzas au feu de bois et desserts maison, au 12 rue des Marchands.',
    },
    en: {
      title: 'Mamma Giovanna · Italian Restaurant in Colmar',
      description:
        'Italian restaurant and pizzeria in Colmar. Fresh pasta, wood-fired pizzas and homemade desserts at 12 rue des Marchands.',
    },
    de: {
      title: 'Mamma Giovanna · Italienisches Restaurant in Colmar',
      description:
        'Italienisches Restaurant und Pizzeria in Colmar. Frische Pasta, Holzofen-Pizzen und hausgemachte Desserts, 12 rue des Marchands.',
    },
    it: {
      title: 'Mamma Giovanna · Ristorante italiano a Colmar',
      description:
        'Ristorante italiano e pizzeria a Colmar. Pasta fresca, pizze al forno a legna e dolci fatti in casa, al 12 rue des Marchands.',
    },
  };
  const m = meta[locale as Locale] ?? meta.fr;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: m.title,
      template: `%s · ${siteName}`,
    },
    description: m.description,
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
      title: m.title,
      description: m.description,
      locale: locale === 'en' ? 'en_GB' : locale,
      images: [{ url: '/brand/salle.jpg', width: 1200, height: 800, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
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
