'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { localeFlag, localeNames } from '@/lib/locale-utils';
import { routing, type Locale } from '@/i18n/routing';

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

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled || open
          ? 'bg-background/85 border-border/60 border-b backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href={`/${locale}`} className="flex items-center gap-2" aria-label={t('restaurant')}>
          {/* eslint-disable-next-line @next/next/no-img-element -- brand SVG needs fill-current */}
          <img src="/brand/logo-white.svg" alt="" width={116} height={48} className="h-9 w-auto" />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-cream/85 hover:text-cream rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
          <div className="bg-border mx-2 h-5 w-px" aria-hidden />
          {otherLocales.map((l) => (
            <Link
              key={l}
              href={switchLocale(l)}
              hrefLang={l}
              className="text-muted-foreground hover:text-cream rounded-md px-2 py-2 text-xs font-medium tracking-wide uppercase transition-colors hover:bg-white/5"
              aria-label={localeNames[l]}
            >
              {localeFlag(l)}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="text-cream inline-flex h-10 w-10 items-center justify-center rounded-md md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-border/60 bg-background/95 border-t backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-cream/90 rounded-md px-3 py-3 text-base font-medium hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-border/60 mt-2 flex gap-2 border-t px-3 pt-3">
              {otherLocales.map((l) => (
                <Link
                  key={l}
                  href={switchLocale(l)}
                  hrefLang={l}
                  className="border-border text-muted-foreground hover:text-cream rounded-md border px-3 py-2 text-sm"
                  onClick={() => setOpen(false)}
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
