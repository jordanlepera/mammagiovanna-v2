'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { localeFlag, localeNames } from '@/lib/locale-utils';
import { routing, type Locale } from '@/i18n/routing';
import { CONTACT } from '@/lib/site';

function isCurrentPath(pathname: string, href: string): boolean {
  const cleanPath = pathname.split('#')[0].replace(/\/$/, '') || '/';
  const cleanHref = href.split('#')[0].replace(/\/$/, '') || '/';
  return cleanPath === cleanHref;
}

export function Navbar() {
  const t = useTranslations('common');
  const locale = useLocale() as Locale;
  const pathname = usePathname() || `/${locale}`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: `/${locale}`, label: t('homepage') },
    { href: `/${locale}/menu`, label: t('menu') },
    { href: `/${locale}/#contact`, label: t('contact') },
  ];
  const otherLocales = routing.locales.filter((l) => l !== locale);

  const switchLocale = (next: Locale) => {
    const segments = pathname.split('/');
    segments[1] = next;
    return segments.join('/') || `/${next}`;
  };

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
        scrolled || open
          ? 'border-porcelain/12 bg-ink/95 border-b backdrop-blur-md'
          : 'bg-ink/10 border-b border-transparent backdrop-blur-[2px]',
      )}
    >
      <nav
        className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8"
        aria-label={t('navigation')}
      >
        <Link
          href={`/${locale}`}
          className="focus-editorial flex min-h-11 items-center gap-3"
          aria-label={t('restaurant')}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- supplied brand SVG */}
          <img src="/brand/logo-white.svg" alt="" width={116} height={48} className="h-9 w-auto" />
          <span className="bg-porcelain/25 hidden h-5 w-px sm:block" aria-hidden />
          <span className="text-porcelain/65 hidden text-[0.6rem] font-medium tracking-[0.25em] uppercase sm:block">
            Colmar
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = isCurrentPath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'focus-editorial relative mx-0.5 flex min-h-11 items-center rounded-sm px-3 text-[0.7rem] font-medium tracking-[0.18em] uppercase transition-colors',
                  active ? 'text-porcelain' : 'text-porcelain/65 hover:text-porcelain',
                )}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
                <span
                  className={cn(
                    'bg-rosso-soft absolute inset-x-3 bottom-2 h-px origin-left transition-transform duration-300',
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                  )}
                  aria-hidden
                />
              </Link>
            );
          })}
          <span className="bg-porcelain/20 mx-3 h-5 w-px" aria-hidden />
          <a
            href={CONTACT.phoneHref}
            className="focus-editorial border-rosso/70 bg-rosso text-porcelain hover:bg-rosso-soft hover:text-ink flex min-h-11 items-center gap-2 border px-4 text-[0.65rem] font-semibold tracking-[0.14em] uppercase transition-colors"
          >
            <Phone className="size-3.5" aria-hidden />
            <span>{t('home-cta-call')}</span>
          </a>
          <div className="ml-2 flex items-center gap-0.5" aria-label={t('language')}>
            {otherLocales.map((l) => (
              <Link
                key={l}
                href={switchLocale(l)}
                hrefLang={l}
                className="focus-editorial flex min-h-11 min-w-9 items-center justify-center rounded-sm px-2 text-base opacity-60 transition-opacity hover:opacity-100"
                aria-label={localeNames[l]}
              >
                {localeFlag(l)}
              </Link>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="focus-editorial border-porcelain/25 text-porcelain inline-flex min-h-11 min-w-11 items-center justify-center border lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-navigation"
          className="border-porcelain/12 bg-ink border-t px-5 pt-2 pb-6 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col">
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="focus-editorial border-porcelain/10 font-display text-porcelain flex min-h-14 items-center justify-between border-b text-2xl"
                onClick={closeMenu}
              >
                <span>{link.label}</span>
                <span className="text-porcelain/40 font-sans text-xs tracking-[0.18em] uppercase">
                  0{index + 1}
                </span>
              </Link>
            ))}
            <a
              href={CONTACT.phoneHref}
              className="focus-editorial bg-rosso text-porcelain mt-5 flex min-h-12 items-center justify-center gap-2 px-4 text-xs font-semibold tracking-[0.14em] uppercase"
              onClick={closeMenu}
            >
              <Phone className="size-4" aria-hidden />
              {t('home-cta-call')}
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
            <div className="mt-5 flex flex-wrap gap-2" aria-label={t('language')}>
              {otherLocales.map((l) => (
                <Link
                  key={l}
                  href={switchLocale(l)}
                  hrefLang={l}
                  className="focus-editorial border-porcelain/20 text-porcelain/75 flex min-h-11 items-center gap-2 border px-3 text-sm"
                  onClick={closeMenu}
                >
                  {localeFlag(l)} {localeNames[l]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
