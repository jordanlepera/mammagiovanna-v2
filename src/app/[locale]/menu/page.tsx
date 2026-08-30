import { getTranslations, setRequestLocale, getMessages } from 'next-intl/server';
import { cn } from '@/lib/utils';
import { MenuCategoryIndex } from '@/components/menu-category-index';
import type { Metadata } from 'next';
import {
  MENU_SECTIONS,
  PITCHER_WINES,
  ALSACIAN_WINES,
  formatPrice,
  itemName,
  itemDesc,
  type MenuItem,
  type MenuSection,
} from '@/lib/menu-data';
import { type Locale } from '@/i18n/routing';
import { localeAlternates, SITE_NAME, CONTACT, SITE_URL } from '@/lib/site';

type Messages = Record<string, Record<string, string>>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<Locale, string> = {
    fr: 'La carte',
    en: 'The menu',
    de: 'Die Karte',
    it: 'Il menù',
  };
  const alternates = localeAlternates('/menu');
  return {
    title: titles[locale as Locale] ?? titles.fr,
    alternates: {
      canonical: alternates[locale as Locale] ?? alternates.fr,
      languages: { ...alternates, 'x-default': alternates.fr },
    },
    openGraph: {
      title: `${titles[locale as Locale] ?? titles.fr} · ${SITE_NAME}`,
      url: alternates[locale as Locale] ?? alternates.fr,
    },
  };
}

function MenuRow({
  item,
  menu,
  locale,
}: {
  item: MenuItem;
  menu: Record<string, string>;
  locale: Locale;
}) {
  return (
    <div className="py-4">
      <div className="flex items-baseline">
        <h4 className="text-cream font-medium">{itemName(item, menu)}</h4>
        {item.capacity && (
          <span className="text-muted-foreground ml-2 text-xs tracking-wide uppercase">
            {item.capacity}
          </span>
        )}
        {item.price !== undefined && (
          <>
            <span className="price-leader" aria-hidden />
            {item.discount !== undefined ? (
              <del className="text-muted-foreground text-sm">{formatPrice(item.price, locale)}</del>
            ) : (
              <span className="text-cream font-semibold">{formatPrice(item.price, locale)}</span>
            )}
          </>
        )}
        {item.discount !== undefined && (
          <span className="text-tomato ml-2 font-semibold">
            {formatPrice(item.discount, locale)}
          </span>
        )}
      </div>
      {itemDesc(item, menu) && (
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm leading-relaxed">
          {itemDesc(item, menu)}
        </p>
      )}
      {item.children && item.children.length > 0 && (
        <p className="text-cream/70 mt-1 text-sm italic">
          {item.children
            .map((c) => menu[c])
            .filter(Boolean)
            .join(' · ')}
        </p>
      )}
    </div>
  );
}

function WineTable({
  wines,
  menu,
  locale,
  titleKey,
}: {
  wines: { name: string; prices: number[] }[];
  menu: Record<string, string>;
  locale: Locale;
  titleKey: string;
}) {
  const columns = [menu['pitcher-12cl'] ?? '12cl', '25cl', '50cl', '75cl'];
  return (
    <div aria-label={menu[titleKey]}>
      {wines.map((w) => (
        <div
          key={w.name}
          className="border-border/40 flex items-baseline border-b py-3 last:border-0"
        >
          <span className="text-cream font-medium">{w.name}</span>
          <span className="price-leader" aria-hidden />
          {w.prices.map((p, i) =>
            p > 0 ? (
              <span key={i} className={cn('ml-3 text-sm', i === 0 && 'text-cream font-semibold')}>
                {formatPrice(p, locale)}
              </span>
            ) : null,
          )}
        </div>
      ))}
      <span className="sr-only">{columns.join(' ')}</span>
    </div>
  );
}

export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'common' });
  const messages = (await getMessages({ locale })) as Messages;
  const menu = messages.menu ?? {};

  const renderSection = (section: MenuSection) => (
    <section key={section.id} id={section.id} className="scroll-mt-24">
      <h2 className="font-display text-cream text-2xl font-bold md:text-3xl">
        {menu[section.titleKey] ?? section.titleKey}
      </h2>
      {section.items.length > 0 && (
        <div className="divide-border/40 divide-y">
          {section.items.map((item, i) => (
            <MenuRow key={`${section.id}-${i}`} item={item} menu={menu} locale={locale as Locale} />
          ))}
        </div>
      )}
      {section.subsections.map((sub) => (
        <div key={sub.key} className="mt-8">
          <h3 className="text-basil-soft text-xs font-semibold tracking-[0.18em] uppercase">
            {menu[sub.key] ?? sub.key}
          </h3>
          <div className="divide-border/40 divide-y">
            {sub.items.map((item, i) => (
              <MenuRow key={`${sub.key}-${i}`} item={item} menu={menu} locale={locale as Locale} />
            ))}
          </div>
          {sub.key === 'pitcher-wine' && (
            <WineTable
              wines={PITCHER_WINES}
              menu={menu}
              locale={locale as Locale}
              titleKey={sub.key}
            />
          )}
          {sub.key === 'alsacian-wine' && (
            <WineTable
              wines={ALSACIAN_WINES}
              menu={menu}
              locale={locale as Locale}
              titleKey={sub.key}
            />
          )}
        </div>
      ))}
    </section>
  );

  const menuJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: `${SITE_NAME} · ${t('menu-page-title')}`,
    inLanguage: locale,
    hasMenuSection: MENU_SECTIONS.map((section) => ({
      '@type': 'MenuSection',
      name: menu[section.titleKey] ?? section.titleKey,
      hasMenuItem: [...section.items, ...section.subsections.flatMap((s) => s.items)].map(
        (item) => ({
          '@type': 'MenuItem',
          name: itemName(item, menu),
          ...(itemDesc(item, menu) ? { description: itemDesc(item, menu) } : {}),
          ...(item.price !== undefined
            ? {
                offers: {
                  '@type': 'Offer',
                  price: item.discount !== undefined ? item.discount : item.price,
                  priceCurrency: 'EUR',
                },
              }
            : {}),
        }),
      ),
    })),
    url: `${SITE_URL}/${locale}/menu`,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-24 pb-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd).replace(/</g, '\u003c') }}
      />
      <header className="border-porcelain/20 mb-10 border-b pb-8">
        <p className="text-rosso-soft text-[0.65rem] font-semibold tracking-[0.3em] uppercase">
          01
        </p>
        <h1 className="font-display text-porcelain mt-4 text-5xl font-medium md:text-7xl">
          {t('menu-page-title')}
        </h1>
        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-porcelain/65 max-w-xl text-sm leading-6">
            {t('reservation')} · {CONTACT.phone}
          </p>
          <a
            href={CONTACT.phoneHref}
            className="focus-editorial border-rosso-soft/70 bg-rosso text-porcelain hover:bg-rosso-soft hover:text-ink inline-flex min-h-11 items-center justify-center px-4 text-xs font-semibold tracking-[0.12em] uppercase transition-colors"
          >
            {t('home-cta-call')}
          </a>
        </div>
      </header>
      <div className="mb-12">
        <MenuCategoryIndex
          locale={locale as Locale}
          label={t('menu')}
          categories={MENU_SECTIONS.map((section) => ({
            id: section.id,
            label: menu[section.titleKey] ?? section.titleKey,
          }))}
        />
      </div>
      <div className="space-y-14">{MENU_SECTIONS.map(renderSection)}</div>
    </div>
  );
}
