'use client';

import { createElement, useEffect, useId, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type RevealTag = 'div' | 'section' | 'li' | 'p' | 'h2' | 'h3';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** stagger delay in ms */
  delay?: number;
  as?: RevealTag;
}

/**
 * Progressive-enhancement scroll reveal.
 *
 * The server-rendered element is visible by default. After hydration this
 * island opts into the hidden initial state, then observes the element and
 * reveals it as it enters the viewport. Crawlers/no-JS users therefore never
 * receive content hidden behind a client-only class.
 */
export function Reveal({ children, className, delay = 0, as: Tag = 'div' }: RevealProps) {
  const revealId = useId();

  useEffect(() => {
    const element = document.getElementById(revealId);
    if (!element) return;
    element.classList.add('reveal-ready');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.classList.add('revealed');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [revealId]);

  const style = delay > 0 ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined;

  return createElement(
    Tag,
    {
      id: revealId,
      className: cn('reveal', className),
      style,
    },
    children,
  );
}
