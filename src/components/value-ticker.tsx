import { ArrowRight } from 'lucide-react';

function TickerTrack({ items, decorative = false }: { items: string[]; decorative?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-7 pr-7" aria-hidden={decorative}>
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="flex items-center gap-7 whitespace-nowrap">
          <span className="font-display text-ink/75 text-lg italic sm:text-xl">{item}</span>
          <span className="text-rosso" aria-hidden>
            <ArrowRight className="size-4" />
          </span>
        </span>
      ))}
    </div>
  );
}

export function ValueTicker({ value, label }: { value: string; label: string }) {
  const items = value
    .split('·')
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <section className="porcelain-surface border-ink/15 border-y py-5" aria-label={label}>
      <div className="marquee-mask overflow-hidden">
        <div className="animate-marquee flex w-max items-center" aria-live="off">
          <TickerTrack items={items} />
          <TickerTrack items={items} decorative />
        </div>
      </div>
    </section>
  );
}
