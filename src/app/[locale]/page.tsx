import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'common' });

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl">{t('restaurant')}</CardTitle>
          <CardDescription>
            {t('opening-days')} · {t('lunch-hours')} · {t('dinner-hours')} · {t('closed')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            {t('homepage')} → {t('menu')} · {t('contact')}
          </p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="default">{t('menu')}</Button>
          <Button variant="outline">{t('contact')}</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
