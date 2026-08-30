'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CONTACT } from '@/lib/site';
import type { Locale } from '@/i18n/routing';

export interface HeroSlide {
  src: string;
  alt: string;
}

const AUTOPLAY_MS = 6500;

function SlideField({
  slide,
  index,
  current,
  count,
}: {
  slide: HeroSlide;
  index: number;
  current: number;
  count: number;
}) {
  const active = index === current;
  return (
    <div
      aria-hidden={!active}
      aria-roledescription="slide"
      aria-label={`${index + 1} / ${count}`}
      className={cn(
        'hero-fade absolute inset-0 overflow-hidden',
        active ? 'opacity-100' : 'opacity-0',
      )}
    >
      <Image
        src={slide.src}
        alt={slide.alt}
        fill
        priority={index === 0}
        loading="eager"
        sizes="100vw"
        quality={82}
        className={cn('object-cover', active && 'animate-ken-burns-loop')}
      />
      {/* Constant legibility gradient: part of this slide, fades with it. */}
      <div
        className="from-ink/70 via-ink/5 to-ink/10 pointer-events-none absolute inset-0 bg-gradient-to-t"
        aria-hidden
      />
    </div>
  );
}

export function HeroCarousel({
  locale,
  slides,
  label,
  menuLabel,
  callLabel,
  openLabel,
  closedLabel,
  open,
  previousLabel,
  nextLabel,
}: {
  locale: Locale;
  slides: HeroSlide[];
  label: string;
  menuLabel: string;
  callLabel: string;
  openLabel: string;
  closedLabel: string;
  open: boolean;
  previousLabel: string;
  nextLabel: string;
}) {
  const [current, setCurrent] = useState(0);
  const interactionRef = useRef(false);
  const hoverCapableRef = useRef(false);

  const step = useCallback(
    (delta: number) => {
      setCurrent((c) => (c + delta + slides.length) % slides.length);
    },
    [slides.length],
  );

  // Autoplay: advances every AUTOPLAY_MS on every device, so the slide
  // crossfade keeps breathing. Paused only while a real (hover-capable)
  // pointer rests over the hero or keyboard focus is inside — plain touches
  // never freeze the loop.
  useEffect(() => {
    hoverCapableRef.current = window.matchMedia('(hover: hover)').matches;
    const timer = window.setInterval(() => {
      if (!interactionRef.current) step(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [step]);

  return (
    <section className="ink-surface flex min-h-[100svh] flex-col" aria-labelledby="home-title">
      <h1 id="home-title" className="sr-only">
        {label}
      </h1>

      <div
        className="relative flex-1 overflow-hidden"
        onPointerEnter={() => {
          if (hoverCapableRef.current) interactionRef.current = true;
        }}
        onPointerLeave={() => {
          interactionRef.current = false;
        }}
        onFocusCapture={(event) => {
          if (event.target instanceof Element && event.target.matches(':focus-visible')) {
            interactionRef.current = true;
          }
        }}
        onBlurCapture={() => {
          interactionRef.current = false;
        }}
      >
        {slides.map((slide, index) => (
          <SlideField
            key={slide.src}
            slide={slide}
            index={index}
            current={current}
            count={slides.length}
          />
        ))}

        <div className="absolute inset-x-0 bottom-5 flex items-center justify-between px-5 sm:bottom-7 sm:px-8">
          <div className="pointer-events-auto flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="text-porcelain/80 flex items-baseline gap-1 font-sans text-xs tracking-[0.18em]">
              <span className="text-porcelain text-base font-semibold">
                {String(current + 1).padStart(2, '0')}
              </span>
              <span aria-hidden>/</span>
              <span>{String(slides.length).padStart(2, '0')}</span>
            </div>

            <div
              className="flex gap-1.5"
              role="tablist"
              aria-label={slides.map((s) => s.alt).join(', ')}
            >
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  role="tab"
                  aria-selected={current === index}
                  aria-label={slide.alt}
                  onClick={() => setCurrent(index)}
                  className={cn(
                    'focus-editorial h-1.5 rounded-full transition-all duration-500',
                    current === index
                      ? 'bg-rosso-soft w-8'
                      : 'bg-porcelain/35 hover:bg-porcelain/60 w-3',
                  )}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={previousLabel}
                className="focus-editorial border-porcelain/30 text-porcelain hover:border-rosso-soft hover:text-rosso-soft flex min-h-11 min-w-11 items-center justify-center rounded-full border transition-colors"
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={nextLabel}
                className="focus-editorial border-porcelain/30 text-porcelain hover:border-rosso-soft hover:text-rosso-soft flex min-h-11 min-w-11 items-center justify-center rounded-full border transition-colors"
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </div>
          </div>
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            {`${current + 1} / ${slides.length}`}
          </span>
        </div>
      </div>

      {/* Action dock — the only non-photo content on the hero, kept visible at all times. */}
      <div className="border-porcelain/15 bg-ink relative z-10 border-b">
        <div className="mx-auto grid max-w-7xl sm:grid-cols-[1fr_auto_auto]">
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
              className={`size-2 rounded-full ${open ? 'animate-gentle-pulse bg-olive-soft' : 'bg-porcelain/40'}`}
              aria-hidden
            />
            <span>{open ? openLabel : closedLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
