import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/i18n/routing';

interface Category {
  id: string;
  label: string;
}

export function CategoryIndex({
  locale,
  categories,
  eyebrow,
  title,
}: {
  locale: Locale;
  categories: Category[];
  eyebrow: string;
  title: string;
}) {
  return (
    <section
      className="porcelain-surface paper-grain border-ink/15 border-y"
      aria-labelledby="category-index-title"
    >
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
        <div className="border-ink/20 flex flex-col gap-3 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-rosso text-[0.65rem] font-semibold tracking-[0.3em] uppercase">
              {eyebrow}
            </p>
            <h2
              id="category-index-title"
              className="font-display text-ink mt-3 text-4xl leading-none sm:text-5xl"
            >
              {title}
            </h2>
          </div>
          <span className="font-display text-ink/20 text-4xl italic" aria-hidden>
            01—{String(categories.length).padStart(2, '0')}
          </span>
        </div>

        <ol className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <li
              key={category.id}
              className="border-ink/15 border-b sm:odd:border-r sm:odd:pr-6 lg:nth-[3n+1]:border-r lg:nth-[3n+1]:pr-6 lg:nth-[3n+2]:px-6"
            >
              <Link
                href={`/${locale}/menu#${category.id}`}
                className="focus-editorial group hover:text-rosso flex min-h-20 items-center gap-4 py-5 transition-colors"
              >
                <span className="text-rosso/80 font-sans text-[0.65rem] font-semibold tracking-[0.18em]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-ink text-xl transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">
                  {category.label}
                </span>
                <ArrowUpRight
                  className="text-ink/35 group-hover:text-rosso ml-auto size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
