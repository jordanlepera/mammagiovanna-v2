'use client';

import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  label: string;
}

/**
 * Sticky category rail with explicit scroll affordances:
 * - chevron buttons scroll by one viewport-width of the rail
 * - edge gradients show when more items exist beyond each side
 * - the active section is highlighted (scroll-spy) and auto-scrolled into view
 */
export function CategoryRail({ sections, label }: { sections: Section[]; label: string }) {
  const railRef = useRef<ComponentRef<'nav'>>(null);
  const listRef = useRef<ComponentRef<'ul'>>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [active, setActive] = useState(sections[0]?.id);

  const syncEdges = () => {
    const el = listRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  useEffect(() => {
    syncEdges();
    const el = listRef.current;
    if (!el) return;
    el.addEventListener('scroll', syncEdges, { passive: true });
    window.addEventListener('resize', syncEdges);
    return () => {
      el.removeEventListener('scroll', syncEdges);
      window.removeEventListener('resize', syncEdges);
    };
  }, []);

  // Scroll-spy: highlight the last section whose top passed the rail.
  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [sections]);

  // Keep the active chip visible inside the rail.
  useEffect(() => {
    const list = listRef.current;
    const chip = list?.querySelector<HTMLAnchorElement>(`a[href="#${CSS.escape(active ?? '')}"]`);
    if (list && chip) {
      const left = chip.offsetLeft - (list.clientWidth - chip.offsetWidth) / 2;
      list.scrollTo({ left, behavior: 'smooth' });
    }
  }, [active]);

  const scrollBy = (dir: 1 | -1) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 200), behavior: 'smooth' });
  };

  return (
    <nav
      ref={railRef}
      aria-label={label}
      className="border-border/60 bg-background/90 sticky top-16 z-30 -mx-4 border-y px-4 py-2 backdrop-blur-md sm:mx-0 sm:rounded-lg sm:border"
    >
      <div className="relative flex items-center gap-1">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          disabled={atStart}
          aria-label="Previous categories"
          className={cn(
            'border-border bg-background text-cream/80 z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all',
            'hover:border-gold/50 hover:text-gold-soft',
            atStart && 'pointer-events-none opacity-0',
          )}
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>

        <div className="relative min-w-0 flex-1">
          <ul
            ref={listRef}
            className="flex [scrollbar-width:none] gap-1 overflow-x-auto scroll-smooth px-3 py-1 [&::-webkit-scrollbar]:hidden"
          >
            {sections.map((section) => (
              <li key={section.id} className="shrink-0">
                <a
                  href={`#${section.id}`}
                  className={cn(
                    'block rounded-full border px-3.5 py-1.5 text-sm whitespace-nowrap transition-all duration-300',
                    active === section.id
                      ? 'border-gold/60 bg-gold/15 text-gold-soft'
                      : 'text-muted-foreground hover:border-border hover:text-cream border-transparent',
                  )}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
          {/* Edge fades: signal that more categories exist beyond each side */}
          {!atStart && (
            <div
              className="from-background pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r to-transparent"
              aria-hidden
            />
          )}
          {!atEnd && (
            <div
              className="from-background pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l to-transparent"
              aria-hidden
            />
          )}
        </div>

        <button
          type="button"
          onClick={() => scrollBy(1)}
          disabled={atEnd}
          aria-label="Next categories"
          className={cn(
            'border-border bg-background text-cream/80 z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all',
            'hover:border-gold/50 hover:text-gold-soft',
            atEnd && 'pointer-events-none opacity-0',
          )}
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </nav>
  );
}
