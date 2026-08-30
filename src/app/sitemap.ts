import type { MetadataRoute } from 'next';
import { LOCALES, SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return LOCALES.flatMap((locale) =>
    ['/', '/menu'].map((path) => {
      const url = path === '/' ? `${SITE_URL}/${locale}` : `${SITE_URL}/${locale}${path}`;
      return {
        url,
        lastModified,
        changeFrequency: path === '/menu' ? ('weekly' as const) : ('monthly' as const),
        priority: path === '/menu' ? 0.9 : 1,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, path === '/' ? `${SITE_URL}/${l}` : `${SITE_URL}/${l}${path}`]),
          ),
        },
      };
    }),
  );
}
