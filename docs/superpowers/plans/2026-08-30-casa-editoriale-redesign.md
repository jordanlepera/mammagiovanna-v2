# Casa Editoriale Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current dark/gold presentation with the approved Casa Editoriale / Milanese modernism visual system while preserving every existing translated string, menu datum, route, and SEO contract.

**Architecture:** Keep the existing Next.js 16 App Router and server-first page architecture. Move visual composition into focused components: design tokens in `globals.css`, shared chrome in `navbar.tsx`/`footer.tsx`, hero and editorial home modules in `page.tsx` plus small client-only motion wrappers, and the menu index in a dedicated client component. All important content remains in server-rendered HTML; client code only enhances presentation and navigation.

**Tech Stack:** Next.js 16.3.3, React 19.2.8, TypeScript 5.9.3, Tailwind CSS 4.3.3, next-intl 4.14.1, shadcn/ui, CSS animations, IntersectionObserver client islands, `next/image`, ESLint 9, Prettier 3, pnpm 11.

## Global Constraints

- Preserve all existing `src/messages/{fr,en,de,it}.json` content and all existing typed menu data verbatim.
- Preserve FR/EN/DE/IT routes, locale switching, logo asset, opening hours, contact data, prices, menu descriptions, and social links.
- Use the approved Casa Editoriale palette: ink, porcelain, rosso, and restrained olive.
- Use Bodoni Moda Variable for display and Outfit Variable for utility/body text unless a verified visual QA result requires a token-only font substitution.
- Do not introduce WebGL, canvas, autoplay video, a large animation runtime, client-only page content, or remote runtime-critical images.
- Keep page content in Server Components; Client Components may only add intersection observation, nav state, hover enhancement, or reduced-motion handling.
- Preserve Restaurant/Menu JSON-LD, canonical URLs, hreflang/x-default, sitemap, robots, semantic landmarks, skip link, and accessible focus states.
- Every visual change must pass `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm format:check`, and `pnpm build` before the next dependent task.
- Verify responsive behavior at 390px, 768px, 1024px, and desktop; the document must never horizontally overflow.
- Production deployment is not part of this plan unless separately authorized by the user.

---

### Task 1: Create the implementation branch and baseline evidence

**Files:**
- Modify: none
- Evidence: git status, current commit, baseline quality commands

**Interfaces:**
- Consumes: approved design spec at `docs/superpowers/specs/2026-08-30-casa-editoriale-redesign-design.md`.
- Produces: clean implementation branch and recorded baseline command results.

- [ ] **Step 1: Create a task branch without altering production.**

```bash
git switch -c t1/casa-editoriale-redesign
```

If the branch already exists locally, switch to it only after confirming it points to the current `main` baseline.

- [ ] **Step 2: Record the baseline.**

```bash
git status --short
pnpm exec tsc --noEmit
pnpm lint
pnpm format:check
pnpm build
```

Expected: clean working tree before implementation and all four commands exit 0 with no lint warnings/errors.

- [ ] **Step 3: Commit only if branch setup requires a commit.**

Do not create a no-op commit. The existing approved design-spec commit remains the baseline.

---

### Task 2: Implement Casa Editoriale design tokens and image loading

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `public/site.webmanifest` only if its theme colors no longer match the approved palette

**Interfaces:**
- Consumes: existing Tailwind v4 theme variables, Bodoni Moda Variable, Outfit Variable, local `public/brand/salle.jpg`.
- Produces: `--ink`, `--porcelain`, `--rosso`, and `--olive` token aliases; display/body font tokens; grain/rule utilities; CSS-only motion primitives; `next/image` LCP preload.

- [ ] **Step 1: Replace the current token palette with explicit Casa Editoriale tokens.**

Use CSS custom properties under `:root`/`.dark` for the four approved semantic colours and map Tailwind aliases to them. Keep text contrast at WCAG AA for body copy and buttons.

- [ ] **Step 2: Add the material language.**

Implement low-opacity grain with a CSS data pattern or gradient, thin editorial rules, `scroll-margin` for anchored menu sections, and no layout-affecting animation properties.

- [ ] **Step 3: Define motion primitives.**

Provide `@keyframes` for hero crop drift, section reveal, ticker movement, and index marker transitions. Add a reduced-motion fallback that removes decorative movement while retaining all content and manual navigation.

- [ ] **Step 4: Update the hero image to the Next.js 16 preload convention.**

Use `preload` rather than deprecated `priority` for the single above-fold hero image, keep `fill`, and retain `sizes="100vw"`. Keep decorative image `alt=""` and the page-level text heading in server HTML.

- [ ] **Step 5: Run the token gate.**

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm format:check
pnpm build
```

Expected: 0 errors, 0 warnings, successful build with all locale routes generated.

- [ ] **Step 6: Commit.**

```bash
git add src/app/globals.css 'src/app/[locale]/layout.tsx' public/site.webmanifest
git commit -m "IMPL(T1): add Casa Editoriale design tokens"
```

---

### Task 3: Rebuild shared navigation and footer as editorial chrome

**Files:**
- Modify: `src/components/navbar.tsx`
- Modify: `src/components/footer.tsx`

**Interfaces:**
- Consumes: `useLocale`, `usePathname`, next-intl common messages, `CONTACT`, `SOCIALS`, locale utilities.
- Produces: responsive shared chrome with stable locale links, navigation labels, phone action, contact link, accessible mobile menu, and no route-specific content dependency.

- [ ] **Step 1: Keep the existing navigation link destinations and locale behavior.**

Home, Menu, Contact, and locale switch links must preserve the current path when switching locale. Every link receives a visible focus style and a minimum 44px touch target on mobile.

- [ ] **Step 2: Restyle the desktop header.**

Use a compact editorial masthead: logo at left, short utility navigation, locale controls, and phone/reservation action. Transparent-over-hero state may transition to porcelain/ink on scroll using background/opacity only.

- [ ] **Step 3: Restyle the mobile sheet.**

Use a full-width accessible menu panel with large links, locale choices, phone action, and deterministic close behavior. Preserve `aria-expanded` and an accessible button name.

- [ ] **Step 4: Restyle the footer.**

Use a porcelain/ink editorial grid with thin rules, contact block, Tue–Sat schedule, Monday/Sunday closure, Google Maps, and existing social links. Do not add unsupported factual claims.

- [ ] **Step 5: Verify shared chrome at all locales.**

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm format:check
pnpm build
```

Then inspect server HTML for all locale links and the phone/address strings.

- [ ] **Step 6: Commit.**

```bash
git add src/components/navbar.tsx src/components/footer.tsx
git commit -m "IMPL(T2): rebuild responsive editorial chrome"
```

---

### Task 4: Build the Casa Editoriale home surface

**Files:**
- Modify: `src/app/[locale]/page.tsx`
- Create: `src/components/home/value-ticker.tsx` only if the ticker needs a focused client island
- Create: `src/components/home/category-index.tsx` for the server-rendered poster-style menu index
- Create: `src/components/home/editorial-image.tsx` only if image crop/hover behavior needs isolation
- Reuse: `src/components/reveal.tsx` or replace it with a smaller focused reveal island if its current API prevents the design

**Interfaces:**
- Consumes: existing common/menu messages, `MENU_SECTIONS`, `CONTACT`, `OPENING_HOURS`, `Reveal`, local assets.
- Produces: server-rendered home with hero, value ticker, menu index, dish preview, Mamma Giovanna values block, visit block, and accessible actions.

- [ ] **Step 1: Replace the current hero composition.**

Keep the dining-room photograph and supplied logo treatment. Use a confident editorial crop and a compact action dock for menu, call/reservation, and open-state. Keep an actual server-rendered `<h1>`; never rely on text baked into an image for the document heading.

- [ ] **Step 2: Implement the value ticker.**

Render the existing value text in the server component. Duplicate the visual track only for the CSS animation. Under reduced motion, expose a horizontally scrollable track with a visible continuation cue; no claim may be hidden solely because JavaScript is disabled.

- [ ] **Step 3: Add the poster-style menu index.**

Generate the index from `MENU_SECTIONS` so it cannot drift from the menu page. Use numbered links to stable menu anchors; on mobile use a visible wrapped grid, not an unexplained clipped rail.

- [ ] **Step 4: Add editorial menu preview.**

Use the existing selected dish keys and descriptions without modifying their translations. Present them as a high-contrast list with rules, small category labels, and a single menu CTA. Do not invent prices or ingredients.

- [ ] **Step 5: Add the values and visit blocks.**

Use existing approved translated copy for Mamma Giovanna values, opening hours, address, phone, map, and open state. Visual hierarchy may change; user-facing source text may not.

- [ ] **Step 6: Run server-output checks.**

For each locale, fetch the route and assert that the initial HTML contains the heading, value text, menu link, phone number, address, and no client-only placeholder. Also assert that the Restaurant JSON-LD remains present.

- [ ] **Step 7: Run the full gate and commit.**

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm format:check
pnpm build
git add src/app/[locale]/page.tsx src/components/home
git commit -m "IMPL(T3): build Casa Editoriale home surface"
```

---

### Task 5: Build the discoverable menu Category Index

**Files:**
- Modify: `src/app/[locale]/menu/page.tsx`
- Modify or replace: `src/components/category-rail.tsx`
- Create: `src/components/menu/category-index.tsx` if the wrapped index and desktop sticky index need a separate boundary

**Interfaces:**
- Consumes: `MENU_SECTIONS`, localized section labels, stable section ids.
- Produces: accessible category index where all categories are discoverable at 390px and desktop/tablet users receive clear active-section feedback.

- [ ] **Step 1: Render a mobile wrapped index.**

Display every menu family as a numbered, wrapped link grid where all category labels are visible and discoverable at once, with no hidden overflow. Labels must be localized from existing menu messages and remain keyboard reachable.

- [ ] **Step 2: Render a desktop/tablet sticky index.**

Use a sticky bar or compact grid with visible labels, active marker, and no ambiguous clipping. If horizontal overflow is needed at an intermediate width, include explicit previous/next controls and edge continuation cues.

- [ ] **Step 3: Preserve anchor semantics.**

Keep each menu family as a real `<section id="...">` with `scroll-mt` large enough to clear the fixed header. The index must work with JavaScript disabled.

- [ ] **Step 4: Verify all labels.**

Fetch each locale’s menu page and compare the localized index label count to `MENU_SECTIONS.length`. Verify every section id has exactly one matching target.

- [ ] **Step 5: Run the full gate and commit.**

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm format:check
pnpm build
git add 'src/app/[locale]/menu/page.tsx' src/components/category-rail.tsx src/components/menu
git commit -m "IMPL(T4): make every menu category discoverable"
```

---

### Task 6: Refine menu typography, rows, and wine tables

**Files:**
- Modify: `src/app/[locale]/menu/page.tsx`
- Modify: `src/lib/menu-data.ts` only if a type/API correction is needed; do not change data values
- Create: `src/components/menu/menu-row.tsx` if extracting the current row improves responsive control
- Create: `src/components/menu/wine-table.tsx` if extracting the current table improves accessibility

**Interfaces:**
- Consumes: current typed `MenuItem`, `MenuSection`, wine arrays, localized menu messages.
- Produces: readable editorial menu layout with intact descriptions, prices, capacities, discount semantics, and accessible responsive wine data.

- [ ] **Step 1: Establish menu section hierarchy.**

Use display serif headings, numbered labels, clear subsection hierarchy, and porcelain/ink panel rhythm without turning every row into a generic card.

- [ ] **Step 2: Make menu rows robust for long translations.**

Use a responsive name/description/price layout: prices never clip, long names wrap safely, capacity remains associated with the item, and dotted leaders disappear or reflow at narrow widths rather than causing overflow.

- [ ] **Step 3: Make wine data accessible on narrow screens.**

Retain table meaning and all four price columns. On mobile use a scrollable table with an explicit accessible caption/continuation cue or a stacked equivalent that preserves column labels.

- [ ] **Step 4: Verify menu data integrity.**

Programmatically compare the rendered item names/prices against `MENU_SECTIONS`, `PITCHER_WINES`, and `ALSACIAN_WINES`; confirm no item/value was dropped or invented.

- [ ] **Step 5: Run the full gate and commit.**

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm format:check
pnpm build
git add 'src/app/[locale]/menu/page.tsx' src/lib/menu-data.ts src/components/menu
git commit -m "IMPL(T5): refine responsive editorial menu layout"
```

---

### Task 7: SEO, accessibility, and motion audit

**Files:**
- Modify: `src/app/[locale]/layout.tsx` only for verified metadata/schema issues
- Modify: `src/app/[locale]/menu/page.tsx` only for verified metadata/schema issues
- Modify: `src/app/globals.css` only for verified reduced-motion/contrast issues
- Modify: focused components only for audit findings

**Interfaces:**
- Consumes: all completed visual surfaces and existing metadata/JSON-LD helpers.
- Produces: evidence that design motion does not compromise crawlability, accessibility, or performance.

- [ ] **Step 1: Run the Vercel web-interface guidelines review.**

Fetch the current guideline source specified by `web-design-guidelines` and review all changed UI files. Fix every applicable finding rather than suppressing it.

- [ ] **Step 2: Verify initial HTML.**

For each locale home/menu route, assert: one meaningful `<h1>`, body text present before hydration, canonical link, four language alternates plus x-default, Restaurant JSON-LD, and Menu JSON-LD on menu.

- [ ] **Step 3: Verify reduced-motion behavior.**

Use a browser/CDP or a deterministic CSS inspection to confirm reduced-motion removes decorative transitions but leaves content, links, controls, and the value ticker’s manual fallback available.

- [ ] **Step 4: Verify responsive behavior.**

Measure `document.documentElement.scrollWidth` versus `clientWidth` at 390px, 768px, 1024px, and desktop for home/menu. Expected: equality at every viewport.

- [ ] **Step 5: Run quality gates.**

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm format:check
pnpm build
```

Expected: all exit 0, zero lint warnings/errors, all locale routes statically generated.

---

### Task 8: Final verification, commit, and handoff

**Files:**
- Modify: none unless a final verification gap is found
- Evidence: build output, runtime smoke output, git diff/status, route/SEO report

**Interfaces:**
- Consumes: completed implementation branch.
- Produces: verified commit history and a concise evidence-only report. No production deployment.

- [ ] **Step 1: Start a production server from the fresh build.**

```bash
./node_modules/.bin/next start -p 31XX
```

- [ ] **Step 2: Smoke-test every route and critical asset.**

Check `/`, all four locale homes, all four locale menus, `/sitemap.xml`, `/robots.txt`, logo, hero image, favicon, and manifest. Record status codes and redirect targets.

- [ ] **Step 3: Verify content preservation.**

Hash or structurally compare the pre-existing translation JSON and menu data values to the final files. Any difference must be an explicitly approved interface-only addition; otherwise fix it before completion.

- [ ] **Step 4: Verify Git state.**

```bash
git diff --check
git status --short
git log --oneline -8
```

- [ ] **Step 5: Commit any final verified fix and report.**

Use the required commit format with a detailed body. Report pass/fail for every acceptance criterion, including the fact that production deployment was intentionally not performed.
