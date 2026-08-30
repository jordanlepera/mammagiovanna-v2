import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing, type Locale } from './routing';
// Static imports (Turbopack can't statically analyze dynamic `import(\`${locale}.json\`)`)
import fr from '../messages/fr.json';
import en from '../messages/en.json';
import de from '../messages/de.json';
import it from '../messages/it.json';

const messages = { fr, en, de, it } as const;
type Messages = (typeof messages)[Locale];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: messages[locale] as Messages,
  };
});
