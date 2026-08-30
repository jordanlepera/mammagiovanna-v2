import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/i18n/routing';

interface MenuCategory {
  id: string;
  label: string;
}

export function MenuCategoryIndex({
  locale,
  categories,
  label,
}: {
  locale: Locale;
  categories: MenuCategory[];
  label: string;
}) {
  return (
    <nav className="porcelain-surface paper-grain border-ink/15 border-y" aria-label={label}>
      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 md:py-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-rosso text-[0.65rem] font-semibold tracking-[0.28em] uppercase">
            {label}
          </p>
          <span className="font-display text-ink/25 text-2xl italic sm:text-3xl" aria-hidden>
            01—{String(categories.length).padStart(2, '0')}
          </span>
        </div>

        <ol className="border-ink/15 bg-ink/15 grid grid-cols-2 gap-px overflow-hidden border sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, index) => (
            <li key={category.id} className="bg-porcelain">
              <Link
                href={`#${category.id}`}
                className="focus-editorial group hover:bg-rosso hover:text-porcelain flex min-h-[4.75rem] items-center gap-3 px-3 py-3 transition-colors sm:min-h-20 sm:px-4"
              >
                <span className="text-rosso/80 group-hover:text-porcelain/75 self-start pt-0.5 font-sans text-[0.6rem] font-semibold tracking-[0.14em] transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-ink group-hover:text-porcelain text-base leading-tight transition-colors sm:text-lg">
                  {category.label}
                </span>
                <ArrowUpRight
                  className="text-ink/35 group-hover:text-porcelain ml-auto size-3.5 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
