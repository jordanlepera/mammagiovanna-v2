import { getTranslations } from 'next-intl/server';
import { ArrowUpRight, MapPin, Phone, UtensilsCrossed } from 'lucide-react';
import { CONTACT, SOCIALS } from '@/lib/site';

export async function Footer() {
  const t = await getTranslations('common');

  return (
    <footer id="contact" className="porcelain-surface paper-grain border-ink/15 border-t">
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <div className="grid gap-14 md:grid-cols-[1.35fr_0.85fr_0.85fr] md:gap-10">
          <div>
            <p className="text-rosso text-[0.65rem] font-semibold tracking-[0.3em] uppercase">
              {t('contact')}
            </p>
            <h2 className="font-display text-ink mt-4 max-w-sm text-4xl leading-none tracking-tight sm:text-5xl">
              {t('restaurant')}
            </h2>
            <p className="text-ink/70 mt-6 max-w-sm text-sm leading-6">{t('footer-summary')}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              <a
                href={SOCIALS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-editorial border-ink/20 text-ink hover:border-rosso hover:text-rosso inline-flex min-h-11 items-center gap-2 border px-3 text-xs font-semibold tracking-[0.14em] uppercase transition-colors"
              >
                Instagram <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
              <a
                href={SOCIALS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-editorial border-ink/20 text-ink hover:border-rosso hover:text-rosso inline-flex min-h-11 items-center gap-2 border px-3 text-xs font-semibold tracking-[0.14em] uppercase transition-colors"
              >
                Facebook <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            </div>
          </div>

          <div>
            <p className="text-rosso text-[0.65rem] font-semibold tracking-[0.3em] uppercase">01</p>
            <h3 className="font-display text-ink mt-4 text-2xl">{t('opening-time')}</h3>
            <ul className="text-ink/70 mt-5 space-y-2 text-sm leading-6">
              <li>{t('opening-days')}</li>
              <li>{t('lunch-hours')}</li>
              <li>{t('dinner-hours')}</li>
              <li className="text-ink font-medium">{t('closed')}</li>
            </ul>
          </div>

          <div>
            <p className="text-rosso text-[0.65rem] font-semibold tracking-[0.3em] uppercase">02</p>
            <h3 className="font-display text-ink mt-4 text-2xl">{t('contact')}</h3>
            <address className="text-ink/70 mt-5 space-y-3 text-sm leading-6 not-italic">
              <p className="flex items-start gap-3">
                <MapPin className="text-rosso mt-1 size-4 shrink-0" aria-hidden />
                <span>
                  {CONTACT.street}
                  <br />
                  {CONTACT.postalCode} {CONTACT.city}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="text-rosso size-4 shrink-0" aria-hidden />
                <a href={CONTACT.phoneHref} className="text-ink hover:text-rosso font-medium">
                  {CONTACT.phone}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <UtensilsCrossed className="text-rosso size-4 shrink-0" aria-hidden />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Mamma+Giovanna+12+rue+des+Marchands+Colmar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-rosso"
                >
                  Google Maps <ArrowUpRight className="ml-1 inline size-3.5" aria-hidden />
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-ink/15 text-ink/55 mt-16 flex flex-col gap-2 border-t pt-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {t('restaurant')} · {CONTACT.city}
          </span>
          <span>FR · EN · DE · IT</span>
        </div>
      </div>
    </footer>
  );
}
