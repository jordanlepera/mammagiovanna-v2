import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import { CONTACT, OPENING_HOURS } from '@/lib/site';
import { Reveal } from '@/components/reveal';

function isOpenNow(): boolean {
  const now = new Date();
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
  if (dow === 0 || dow === 7) return false;

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

  const marqueeItems = t('home-marquee').split('·');

  return (
    <>
      {/* HERO — editorial luxury: centered Bodoni wordmark over cinematic photo */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/brand/salle.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="animate-ken-burns object-cover"
          />
          {/* Luxury vignette: deep at edges, breathable center */}
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(12,11,9,0.55)_55%,rgba(12,11,9,0.92)_100%)]"
            aria-hidden
          />
          <div className="bg-background/25 absolute inset-0" aria-hidden />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-6 pt-24 text-center">
          <p className="text-gold-soft/90 text-[0.65rem] font-medium tracking-[0.42em] uppercase sm:text-xs">
            {t('home-kicker')}
          </p>

          <h1 className="font-display text-cream mt-6 text-[clamp(3.2rem,10vw,7rem)] leading-[0.95] font-medium tracking-tight">
            Mamma
            <br />
            Giovanna
          </h1>

          <div className="mx-auto mt-8 flex w-24 items-center justify-center gap-2" aria-hidden>
            <span className="to-gold/80 h-px w-10 bg-gradient-to-r from-transparent" />
            <span className="bg-gold h-1 w-1 rotate-45" />
            <span className="to-gold/80 h-px w-10 bg-gradient-to-l from-transparent" />
          </div>

          <p className="text-cream/80 mx-auto mt-8 max-w-xl text-base leading-relaxed text-balance md:text-lg">
            {t('home-hero-sub')}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/${locale}/menu`}
              className="group border-gold/70 bg-gold/10 text-gold-soft hover:bg-gold hover:text-background inline-flex h-12 items-center gap-2 border px-8 text-sm font-medium tracking-wide backdrop-blur-sm transition-all duration-300"
            >
              {t('home-cta-menu')}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
            <span className="border-cream/20 text-cream/80 inline-flex items-center gap-2 border px-4 py-3 text-xs">
              <span
                className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-basil' : 'bg-muted-foreground'}`}
              />
              {open ? t('home-open-now') : t('home-closed-now')}
            </span>
          </div>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2" aria-hidden>
          <div className="border-cream/25 flex h-12 w-7 justify-center rounded-full border p-1.5">
            <span className="bg-gold/90 h-2 w-1 animate-bounce rounded-full" />
          </div>
        </div>
      </section>

      {/* MARQUEE — signature claims strip */}
      <section aria-hidden className="border-gold/15 bg-background border-y py-5">
        <div className="marquee-mask overflow-hidden">
          <div className="animate-marquee flex w-max items-center gap-8 pr-8">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="flex items-center gap-8 whitespace-nowrap">
                <span className="font-display text-cream/70 text-lg italic">{item.trim()}</span>
                <span className="bg-gold/70 h-1 w-1 rotate-45" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* HOURS + ADDRESS */}
      <section className="border-border/60 bg-secondary/30 border-b">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-2">
          <Reveal>
            <div className="flex items-start gap-4">
              <Clock className="text-gold mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              <div>
                <h2 className="text-gold-soft text-xs font-semibold tracking-[0.24em] uppercase">
                  {t('opening-time')}
                </h2>
                <p className="text-cream/85 mt-3 text-sm">
                  {t('opening-days')} · {t('lunch-hours')} · {t('dinner-hours')}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">{t('closed')}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="flex items-start gap-4">
              <MapPin className="text-gold mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              <div>
                <h2 className="text-gold-soft text-xs font-semibold tracking-[0.24em] uppercase">
                  {t('home-find-us')}
                </h2>
                <p className="text-cream/85 mt-3 text-sm">
                  {CONTACT.street}, {CONTACT.postalCode} {CONTACT.city}
                </p>
                <a
                  className="text-gold-soft mt-1 inline-block text-sm underline-offset-4 hover:underline"
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
          </Reveal>
        </div>
      </section>

      {/* SIGNATURE DISHES — editorial serif list */}
      <section className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <Reveal>
          <h2 className="font-display text-cream text-center text-3xl font-medium md:text-4xl">
            {t('home-signature-title')}
          </h2>
          <div className="mx-auto mt-6 flex w-16 items-center justify-center gap-2" aria-hidden>
            <span className="to-gold/80 h-px w-6 bg-gradient-to-r from-transparent" />
            <span className="bg-gold h-1 w-1 rotate-45" />
            <span className="to-gold/80 h-px w-6 bg-gradient-to-l from-transparent" />
          </div>
        </Reveal>
        <ul className="divide-border/50 mt-14 divide-y">
          {SIGNATURE_KEYS.map((key, i) => (
            <Reveal as="li" key={key} delay={i * 100} className="group py-8">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-cream/90 group-hover:text-cream text-xl italic transition-colors duration-300 md:text-2xl">
                  {m(key)}
                </h3>
                <span className="price-leader" aria-hidden />
                <span className="font-display text-gold-soft/70 text-lg">✦</span>
              </div>
            </Reveal>
          ))}
        </ul>
        <Reveal>
          <div className="mt-10 text-center">
            <Link
              href={`/${locale}/menu`}
              className="group text-gold-soft inline-flex items-center gap-2 text-sm font-medium"
            >
              <span className="link-underline">{t('home-cta-menu')}</span>
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* STORY — tribute to Nonna Giovanna */}
      <section className="border-border/60 relative overflow-hidden border-y">
        <Image
          src="/brand/salle.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom opacity-20"
        />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
          <Reveal>
            <p className="text-gold-soft/90 text-[0.65rem] font-medium tracking-[0.42em] uppercase sm:text-xs">
              {t('home-story-title')}
            </p>
            <p className="font-display text-cream/90 mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-balance italic md:text-2xl">
              {t('home-story-body')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* RESERVATION CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center md:py-32">
        <Reveal>
          <h2 className="font-display text-cream text-3xl font-medium md:text-4xl">
            {t('home-cta-call')}
          </h2>
          <a
            href={CONTACT.phoneHref}
            className="group border-gold/70 bg-gold/10 font-display text-gold-soft hover:bg-gold hover:text-background mt-8 inline-flex h-14 items-center gap-3 border px-10 text-xl tracking-wide transition-all duration-300"
          >
            <Phone className="size-5" aria-hidden />
            {CONTACT.phone}
          </a>
          <p className="text-muted-foreground mt-6 text-sm">
            {CONTACT.street}, {CONTACT.city}
          </p>
        </Reveal>
      </section>
    </>
  );
}
