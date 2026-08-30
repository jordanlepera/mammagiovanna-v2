import Image from 'next/image';
import Link from 'next/link';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowDownRight, ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import { CategoryIndex } from '@/components/category-index';
import { Reveal } from '@/components/reveal';
import { ValueTicker } from '@/components/value-ticker';
import { type Locale } from '@/i18n/routing';
import { CONTACT, OPENING_HOURS } from '@/lib/site';
import {
  MENU_SECTIONS,
  formatPrice,
  itemDesc,
  itemName,
  type MenuItem,
  type MenuSection,
} from '@/lib/menu-data';

/** Regenerate the time-sensitive status every five minutes while retaining SSR. */
export const revalidate = 300;

type MessageTree = Record<string, Record<string, string>>;

function isOpenNow(): boolean {
  const now = new Date();
  const paris = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const day = paris.find((part) => part.type === 'weekday')?.value ?? '';
  const hour = Number(paris.find((part) => part.type === 'hour')?.value ?? '0');
  const minute = Number(paris.find((part) => part.type === 'minute')?.value ?? '0');
  const minutes = hour * 60 + minute;
  const dayMap: Record<string, number> = {
    lundi: 1,
    mardi: 2,
    mercredi: 3,
    jeudi: 4,
    vendredi: 5,
    samedi: 6,
    dimanche: 7,
  };
  const dayNumber = dayMap[day.toLowerCase()] ?? 0;
  if (dayNumber === 0 || dayNumber === 1 || dayNumber === 7) return false;

  return OPENING_HOURS.some(({ opens, closes }) => {
    const toMinutes = (value: string) => Number(value.slice(0, 2)) * 60 + Number(value.slice(3, 5));
    return minutes >= toMinutes(opens) && minutes < toMinutes(closes);
  });
}

const FEATURED_KEYS = ['etoile-chef', 'gnocchi-gorgonzola', 'tiramisu', 'pizza-steak'] as const;

interface FeaturedItem {
  key: string;
  item: MenuItem;
  section: MenuSection;
}

function findFeaturedItems(): FeaturedItem[] {
  const items = MENU_SECTIONS.flatMap((section) => [
    ...section.items.map((item) => ({ item, section })),
    ...section.subsections.flatMap((subsection) =>
      subsection.items.map((item) => ({ item, section })),
    ),
  ]);

  return FEATURED_KEYS.flatMap((key) => {
    const found = items.find(({ item }) => item.key === key);
    return found ? [{ key, item: found.item, section: found.section }] : [];
  });
}

function Hero({
  locale,
  label,
  menuLabel,
  callLabel,
  openLabel,
  closedLabel,
  open,
}: {
  locale: Locale;
  label: string;
  menuLabel: string;
  callLabel: string;
  openLabel: string;
  closedLabel: string;
  open: boolean;
}) {
  return (
    <section className="bg-ink px-4 pt-[5.5rem] pb-0 sm:px-8" aria-labelledby="home-title">
      <div className="mx-auto max-w-7xl">
        <div className="border-porcelain/20 bg-ink-deep relative aspect-[2048/885] overflow-hidden border sm:aspect-[2.4/1]">
          <Image
            src="/brand/salle.jpg"
            alt={label}
            fill
            preload
            sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1280px) calc(100vw - 4rem), 1216px"
            className="animate-hero-drift object-cover object-center"
          />
          <div
            className="from-ink/70 to-ink/5 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent"
            aria-hidden
          />
          <h1 id="home-title" className="sr-only">
            {label}
          </h1>
        </div>
        <div className="border-porcelain/20 grid border-x border-b sm:grid-cols-[1fr_auto_auto]">
          <Link
            href={`/${locale}/menu`}
            className="focus-editorial group bg-rosso text-porcelain hover:bg-rosso-soft hover:text-ink flex min-h-14 items-center justify-between px-5 text-sm font-semibold tracking-[0.12em] uppercase transition-colors sm:px-7"
          >
            <span>{menuLabel}</span>
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
          <a
            href={CONTACT.phoneHref}
            className="focus-editorial border-porcelain/20 text-porcelain hover:bg-porcelain hover:text-ink flex min-h-14 items-center justify-center gap-2 border-t px-5 text-xs font-medium tracking-[0.1em] uppercase transition-colors sm:border-t-0 sm:border-l sm:px-6"
          >
            <Phone className="size-4" aria-hidden />
            <span>{callLabel}</span>
          </a>
          <div className="border-porcelain/20 text-porcelain/75 flex min-h-14 items-center justify-center gap-2 border-t px-5 text-xs sm:border-t-0 sm:border-l sm:px-6">
            <span
              className={`size-2 rounded-full ${open ? 'bg-olive-soft' : 'bg-porcelain/40'}`}
              aria-hidden
            />
            <span>{open ? openLabel : closedLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: 'common' });
  const messages = (await getMessages({ locale })) as MessageTree;
  const menu = messages.menu ?? {};
  const open = isOpenNow();
  const featured = findFeaturedItems();
  const categories = MENU_SECTIONS.map((section) => ({
    id: section.id,
    label: menu[section.titleKey] ?? section.titleKey,
  }));

  return (
    <div className="ink-surface">
      <Hero
        locale={activeLocale}
        label={t('restaurant')}
        menuLabel={t('home-cta-menu')}
        callLabel={t('home-cta-call')}
        openLabel={t('home-open-now')}
        closedLabel={t('home-closed-now')}
        open={open}
      />

      <ValueTicker value={t('home-marquee')} label={t('restaurant')} />

      {/* Lead statement: typography, not another redundant hero overlay. */}
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-20 sm:px-8 md:grid-cols-[0.8fr_1.7fr] md:items-end md:gap-16 md:py-28">
        <Reveal>
          <p className="text-rosso-soft text-[0.65rem] font-semibold tracking-[0.3em] uppercase">
            {t('home-kicker')}
          </p>
          <div className="bg-rosso mt-5 h-px w-20" aria-hidden />
        </Reveal>
        <Reveal delay={100}>
          <p className="font-display text-porcelain max-w-4xl text-[clamp(2rem,5vw,4.5rem)] leading-[1.02] tracking-tight">
            {t('home-hero-sub')}
          </p>
        </Reveal>
      </section>

      <CategoryIndex
        locale={activeLocale}
        categories={categories}
        eyebrow={t('menu')}
        title={t('menu-page-title')}
      />

      {/* Featured dishes: the menu is the hero of the product. */}
      <section
        className="ink-surface mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28"
        aria-labelledby="featured-title"
      >
        <Reveal>
          <div className="border-porcelain/20 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-rosso-soft text-[0.65rem] font-semibold tracking-[0.3em] uppercase">
                02
              </p>
              <h2
                id="featured-title"
                className="font-display text-porcelain mt-3 text-4xl leading-none sm:text-5xl"
              >
                {t('home-signature-title')}
              </h2>
            </div>
            <Link
              href={`/${locale}/menu`}
              className="focus-editorial group text-porcelain/65 hover:text-porcelain flex min-h-11 items-center gap-2 text-sm transition-colors"
            >
              {t('home-cta-menu')}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </div>
        </Reveal>
        <ol className="divide-porcelain/15 mt-4 divide-y">
          {featured.map(({ key, item, section }, index) => (
            <Reveal
              as="li"
              key={key}
              delay={index * 80}
              className="group grid gap-3 py-7 md:grid-cols-[5rem_0.7fr_1.2fr_auto] md:items-baseline md:gap-6"
            >
              <span className="text-rosso-soft font-sans text-[0.65rem] font-semibold tracking-[0.18em]">
                0{index + 1}
              </span>
              <span className="text-porcelain/45 text-[0.65rem] font-semibold tracking-[0.2em] uppercase">
                {menu[section.titleKey] ?? section.titleKey}
              </span>
              <div>
                <h3 className="font-display text-porcelain group-hover:text-rosso-soft text-2xl italic transition-colors duration-300 sm:text-3xl">
                  {itemName(item, menu)}
                </h3>
                {itemDesc(item, menu) && (
                  <p className="text-porcelain/60 mt-2 max-w-xl text-sm leading-6">
                    {itemDesc(item, menu)}
                  </p>
                )}
              </div>
              {item.price !== undefined && (
                <span className="font-display text-porcelain/80 text-lg md:text-right">
                  {formatPrice(item.price, activeLocale)}
                </span>
              )}
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Values block: large quote on Rosso, supported by the real brand photo as texture. */}
      <section
        className="border-rosso-soft/35 bg-rosso text-porcelain relative overflow-hidden border-y"
        aria-labelledby="story-title"
      >
        <div
          className="border-porcelain/20 pointer-events-none absolute -top-24 -right-16 h-80 w-80 rounded-full border sm:-top-36 sm:-right-20 sm:h-[30rem] sm:w-[30rem]"
          aria-hidden
        />
        <div
          className="border-porcelain/15 pointer-events-none absolute -bottom-40 -left-24 h-72 w-72 rounded-full border sm:h-96 sm:w-96"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 md:grid-cols-[0.55fr_1.45fr] md:items-center md:gap-20 md:py-28">
          <Reveal>
            <div className="flex items-center gap-4 md:block">
              <span className="text-porcelain/70 font-sans text-[0.65rem] font-semibold tracking-[0.3em] uppercase">
                03
              </span>
              <div className="bg-porcelain/70 hidden h-px w-20 md:mt-6 md:block" aria-hidden />
              <h2
                id="story-title"
                className="font-display text-porcelain text-3xl italic md:mt-6 md:text-4xl"
              >
                {t('home-story-title')}
              </h2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <blockquote className="font-display text-porcelain max-w-4xl text-[clamp(1.65rem,3.7vw,3.4rem)] leading-[1.12]">
              “{t('home-story-body')}”
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Visit block: high-intent information, still server rendered. */}
      <section
        id="visit"
        className="ink-deep-surface border-porcelain/15 border-b"
        aria-labelledby="visit-title"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-[1fr_1fr] md:gap-20 md:py-28">
          <Reveal>
            <p className="text-rosso-soft text-[0.65rem] font-semibold tracking-[0.3em] uppercase">
              04
            </p>
            <h2 id="visit-title" className="font-display text-porcelain mt-4 text-4xl sm:text-5xl">
              {t('home-find-us')}
            </h2>
            <div className="mt-8 flex items-start gap-4">
              <MapPin className="text-rosso-soft mt-1 size-5 shrink-0" aria-hidden />
              <address className="text-porcelain/75 text-sm leading-7 not-italic">
                {CONTACT.street}
                <br />
                {CONTACT.postalCode} {CONTACT.city}
              </address>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Mamma Giovanna ${CONTACT.street} ${CONTACT.city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-editorial text-rosso-soft mt-5 inline-flex min-h-11 items-center gap-2 text-sm underline-offset-4 hover:underline"
            >
              Google Maps <ArrowUpRightIcon />
            </a>
          </Reveal>
          <Reveal delay={120}>
            <div className="border-porcelain/20 border-t pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-12">
              <div className="flex items-start gap-4">
                <Clock className="text-rosso-soft mt-1 size-5 shrink-0" aria-hidden />
                <div>
                  <h3 className="font-display text-porcelain text-2xl">{t('opening-time')}</h3>
                  <ul className="text-porcelain/70 mt-4 space-y-2 text-sm leading-6">
                    <li>{t('opening-days')}</li>
                    <li>{t('lunch-hours')}</li>
                    <li>{t('dinner-hours')}</li>
                    <li className="text-porcelain">{t('closed')}</li>
                  </ul>
                </div>
              </div>
              <a
                href={CONTACT.phoneHref}
                className="focus-editorial border-rosso-soft/70 bg-rosso text-porcelain hover:bg-rosso-soft hover:text-ink mt-8 inline-flex min-h-12 items-center gap-3 border px-5 text-sm font-semibold transition-colors"
              >
                <Phone className="size-4" aria-hidden />
                {CONTACT.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="porcelain-surface text-ink/55 flex items-center justify-center gap-3 px-5 py-5 text-center text-xs font-medium tracking-[0.2em] uppercase">
        <ArrowDownRight className="text-rosso size-4" aria-hidden />
        <span>{t('home-cta-menu')}</span>
      </div>
    </div>
  );
}

function ArrowUpRightIcon() {
  return <ArrowRight className="size-4" aria-hidden />;
}
