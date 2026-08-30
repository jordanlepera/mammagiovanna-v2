import { getTranslations, setRequestLocale, getMessages } from 'next-intl/server';
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
  const name = itemName(item, menu);
  const description = itemDesc(item, menu);
  const children = item.children
    ?.map((key) => menu[key])
    .filter(Boolean)
    .join(' · ');

  return (
    <article className="menu-row group border-porcelain/12 border-b py-5 last:border-0 sm:py-6">
      <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-8">
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-porcelain group-hover:text-rosso-soft min-w-0 text-xl leading-tight break-words transition-colors duration-300 sm:text-2xl">
              {name}
            </h3>
            {item.capacity && (
              <span className="text-porcelain/45 shrink-0 text-[0.65rem] font-semibold tracking-[0.14em] uppercase">
                {item.capacity}
              </span>
            )}
          </div>
          {description && (
            <p className="text-porcelain/60 mt-2 max-w-3xl text-sm leading-6">{description}</p>
          )}
          {children && (
            <p className="text-porcelain/70 mt-2 text-sm leading-6 italic">{children}</p>
          )}
        </div>
        {item.price !== undefined && (
          <div className="flex min-w-0 items-baseline sm:justify-end">
            <span className="price-leader hidden sm:block" aria-hidden />
            {item.discount !== undefined ? (
              <>
                <del className="text-porcelain/45 shrink-0 text-sm">
                  {formatPrice(item.price, locale)}
                </del>
                <span className="text-rosso-soft ml-3 shrink-0 font-semibold">
                  {formatPrice(item.discount, locale)}
                </span>
              </>
            ) : (
              <span className="font-display text-porcelain shrink-0 text-lg">
                {formatPrice(item.price, locale)}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
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
  const columns = ['12cl', '25cl', '50cl', '75cl'];
  return (
    <div className="mt-4" aria-label={menu[titleKey]}>
      <div className="border-porcelain/15 bg-porcelain/5 overflow-x-auto border">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <caption className="sr-only">{menu[titleKey]}</caption>
          <thead className="border-porcelain/20 text-porcelain/55 border-b text-[0.65rem] tracking-[0.16em] uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                {menu[titleKey]}
              </th>
              {columns.map((column) => (
                <th key={column} scope="col" className="px-3 py-3 text-right font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-porcelain/10 divide-y">
            {wines.map((wine) => (
              <tr key={wine.name}>
                <th
                  scope="row"
                  className="font-display text-porcelain px-4 py-3 text-base font-normal"
                >
                  {wine.name}
                </th>
                {wine.prices.map((price, index) => (
                  <td
                    key={`${wine.name}-${columns[index]}`}
                    className="text-porcelain/75 px-3 py-3 text-right"
                  >
                    {price > 0 ? formatPrice(price, locale) : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-porcelain/50 mt-3 text-xs sm:hidden">{menu['swipe-left']}</p>
    </div>
  );
}

export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'common' });
  const messages = (await getMessages({ locale })) as Messages;
  const menu = messages.menu ?? {};

  const renderSection = (section: MenuSection, sectionIndex: number) => (
    <section
      key={section.id}
      id={section.id}
      className="menu-section border-porcelain/15 scroll-mt-28 border-t pt-8 first:border-t-0"
    >
      <div className="mb-2 flex items-baseline gap-4">
        <span className="text-rosso-soft text-[0.65rem] font-semibold tracking-[0.2em]">
          {String(sectionIndex + 2).padStart(2, '0')}
        </span>
        <h2 className="font-display text-porcelain text-3xl font-medium md:text-4xl">
          {menu[section.titleKey] ?? section.titleKey}
        </h2>
      </div>
      {section.items.length > 0 && (
        <div>
          {section.items.map((item, i) => (
            <MenuRow key={`${section.id}-${i}`} item={item} menu={menu} locale={locale as Locale} />
          ))}
        </div>
      )}
      {section.subsections.map((sub) => (
        <div key={sub.key} className="mt-10">
          <h3 className="text-rosso-soft border-porcelain/15 border-b pb-3 text-xs font-semibold tracking-[0.22em] uppercase">
            {menu[sub.key] ?? sub.key}
          </h3>
          <div>
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
    <div className="ink-surface paper-grain mx-auto max-w-7xl px-5 pt-[6.5rem] pb-20 sm:px-8">
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
      <div className="space-y-20">
        {MENU_SECTIONS.map((section, index) => renderSection(section, index))}
      </div>
    </div>
  );
}
