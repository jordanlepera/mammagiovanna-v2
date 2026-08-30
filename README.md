# Mammagiovanna Website — v2

Rebuild of the **Mamma Giovanna** restaurant website (www.mammagiovanna.com) on a modern stack, **v2**. Same content, same translations — new UI, new features.

## Stack

| Layer | Tech |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack, React Compiler, `proxy.ts`) |
| UI | React 19, [shadcn/ui](https://ui.shadcn.com) (Tailwind CSS v4, Radix, Lucide) |
| i18n | [next-intl](https://next-intl.dev) — **4 locales: FR · EN · DE · IT** (carried over verbatim from v1) |
| Lint / Format | ESLint 9 (flat config) + Prettier 3 + prettier-plugin-tailwindcss + eslint-config-prettier |
| Package manager | pnpm 11 |
| Hosting | Vercel |

## Translation inventory

All v1 translations were migrated as-is — `src/messages/<locale>.json` (namespaces: `common`, `menu`), so nothing was lost:

- `fr`, `en`, `de`, `it` — 50 `common` keys + 245 `menu` keys each

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:3000 (auto-redirects to /fr)
pnpm build      # production build (prerenders all 4 locales)
pnpm start      # serve the production build
pnpm lint       # ESLint (path-safe invocation)
pnpm format     # Prettier --write
pnpm format:check
```

## Project layout

```
src/
  app/[locale]/   localised routes (fr/en/de/it), root layout + home page
  components/ui/  shadcn/ui components
  i18n/           routing.ts, request.ts (next-intl config)
  messages/       per-locale translation JSON (from v1)
  lib/            utils
```

## Roadmap (this phase)

- [x] Empty boilerplate: Next 16 + shadcn/ui + ESLint + Prettier + i18n foundation
- [ ] Recreate v1 pages/content in the new UI
- [ ] New UI direction + additional features
