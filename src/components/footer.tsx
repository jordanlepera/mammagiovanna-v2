import { getTranslations } from 'next-intl/server';
import { MapPin, Phone, UtensilsCrossed } from 'lucide-react';
import { CONTACT, SOCIALS } from '@/lib/site';

export async function Footer() {
  const t = await getTranslations('common');

  return (
    <footer id="contact" className="border-border/60 bg-secondary/40 border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 md:gap-8">
        <div>
          <h2 className="font-display text-cream text-2xl">{t('restaurant')}</h2>
          <p className="text-muted-foreground mt-3 max-w-xs text-sm leading-6">
            {t('footer-summary')}
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href={SOCIALS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-muted-foreground hover:text-cream rounded-md p-2 transition-colors hover:bg-white/5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- real brand logo from Simple Icons CDN */}
              <img
                src="https://cdn.simpleicons.org/facebook/ffffff"
                alt=""
                width={20}
                height={20}
                className="opacity-80"
              />
            </a>
            <a
              href={SOCIALS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-cream rounded-md p-2 transition-colors hover:bg-white/5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- real brand logo from Simple Icons CDN */}
              <img
                src="https://cdn.simpleicons.org/instagram/ffffff"
                alt=""
                width={20}
                height={20}
                className="opacity-80"
              />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
            {t('opening-time')}
          </h3>
          <ul className="text-cream/85 mt-3 space-y-1 text-sm">
            <li>{t('opening-days')}</li>
            <li>{t('lunch-hours')}</li>
            <li>{t('dinner-hours')}</li>
            <li className="text-muted-foreground">{t('closed')}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
            {t('contact')}
          </h3>
          <address className="text-cream/85 mt-3 space-y-2 text-sm not-italic">
            <p className="flex items-start gap-2">
              <MapPin className="text-gold mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {CONTACT.street}
                <br />
                {CONTACT.postalCode} {CONTACT.city}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="text-gold h-4 w-4 shrink-0" />
              <a href={CONTACT.phoneHref} className="hover:text-cream">
                {CONTACT.phone}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <UtensilsCrossed className="text-gold h-4 w-4 shrink-0" />
              <a
                href="https://www.google.com/maps/search/?api=1&query=Mamma+Giovanna+12+rue+des+Marchands+Colmar"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream"
              >
                Google Maps
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="border-border/60 text-muted-foreground border-t py-4 text-center text-xs">
        © {new Date().getFullYear()} {t('restaurant')} · Colmar
      </div>
    </footer>
  );
}
