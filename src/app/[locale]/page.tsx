import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import { CONTACT, OPENING_HOURS } from '@/lib/site';

function isOpenNow(): boolean {
  const now = new Date();
  // Colmar is Europe/Paris year-round (CET/CEST).
  const paris = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const day = paris.find((p) => p.type === 'weekday')?.value ?? '';
  const hour = Number(paris.find((p) => p.type === 'hour')?.value ?? '0');
  const minute = Number(paris.find((p) => p.type === 'minute')?.value ?? '0');
  const t = hour * 60 + minute;

  const dayMap: Record<string, number> = {
    lundi: 1,
    mardi: 2,
    mercredi: 3,
    jeudi: 4,
    vendredi: 5,
    samedi: 6,
    dimanche: 7,
  };
  const dow = dayMap[day.toLowerCase()] ?? 0;
  if (dow === 0 || dow === 7) return false; // closed Sunday

  return OPENING_HOURS.some(({ opens, closes }) => {
    const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));
    return t >= toMin(opens) && t < toMin(closes);
  });
}

const SIGNATURE_KEYS = ['etoile-chef', 'gnocchi-gorgonzola', 'tiramisu', 'pizza-steak'] as const;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'common' });
  const m = await getTranslations({ locale, namespace: 'menu' });
  const open = isOpenNow();

  return (
    <>
      {/* HERO — logo on the dining-room photo, full-bleed */}
      <section className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden">
        <Image src="/brand/salle.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
        <div
          className="from-background via-background/55 to-background/25 absolute inset-0 bg-gradient-to-t"
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 pt-28 pb-20 sm:px-6 md:pb-28">
          <p className="font-display text-cream/90 text-2xl md:text-3xl">Benvenuti,</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h1 className="font-display text-cream text-5xl leading-[1.05] font-bold md:text-7xl">
              Mamma Giovanna
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                open
                  ? 'border-basil/50 bg-basil/15 text-basil-soft'
                  : 'border-border text-muted-foreground bg-white/5'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-basil' : 'bg-muted-foreground'}`}
              />
              {open ? t('home-open-now') : t('home-closed-now')}
            </span>
          </div>
          <p className="text-cream/75 mt-4 max-w-xl text-base leading-relaxed md:text-lg">
            {t('home-hero-sub')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/menu`}
              className="bg-basil text-background hover:bg-basil/85 inline-flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors"
            >
              {t('home-cta-menu')}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <a
              href={CONTACT.phoneHref}
              className="border-cream/40 text-cream inline-flex h-11 items-center gap-2 rounded-lg border bg-transparent px-6 text-sm font-medium transition-colors hover:bg-white/10"
            >
              <Phone className="size-4" aria-hidden />
              {t('home-cta-call')}
            </a>
          </div>
        </div>
      </section>

      {/* HOURS + ADDRESS strip */}
      <section className="border-border/60 bg-secondary/30 border-b">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <Clock className="text-basil mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <div>
              <p className="text-cream text-sm font-semibold">{t('opening-time')}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {t('opening-days')} · {t('lunch-hours')} · {t('dinner-hours')}
              </p>
              <p className="text-muted-foreground text-sm">{t('closed')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="text-basil mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <div>
              <p className="text-cream text-sm font-semibold">{t('home-find-us')}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {CONTACT.street}, {CONTACT.postalCode} {CONTACT.city}
              </p>
              <a
                className="text-basil-soft text-sm underline-offset-4 hover:underline"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `Mamma Giovanna ${CONTACT.street} ${CONTACT.city}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNATURE DISHES — asymmetric grid, one image-led cell */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <h2 className="font-display text-cream text-3xl font-bold md:text-4xl">
          {t('home-signature-title')}
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SIGNATURE_KEYS.map((key, i) => (
            <li
              key={key}
              className={
                i === 0
                  ? 'border-basil/30 bg-accent/40 rounded-lg border p-5 sm:col-span-2 lg:col-span-2'
                  : 'border-border/70 bg-card rounded-lg border p-5'
              }
            >
              <p className="font-display text-cream text-xl">{m(key)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Link
            href={`/${locale}/menu`}
            className="text-basil-soft inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
          >
            {t('home-cta-menu')}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* STORY — full-width photo + text overlay band */}
      <section className="border-border/60 relative overflow-hidden border-y">
        <Image
          src="/brand/salle.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom opacity-25"
        />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="font-display text-cream text-3xl font-bold md:text-4xl">
            {t('home-story-title')}
          </h2>
          <p className="text-cream/75 mx-auto mt-4 max-w-xl text-base leading-relaxed">
            {t('home-story-body')}
          </p>
        </div>
      </section>

      {/* RESERVATION CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 md:py-24">
        <p className="text-muted-foreground text-sm">{t('follow-us')}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={CONTACT.phoneHref}
            className="bg-basil text-background hover:bg-basil/85 inline-flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors"
          >
            <Phone className="size-4" aria-hidden />
            {CONTACT.phone}
          </a>
        </div>
      </section>
    </>
  );
}
