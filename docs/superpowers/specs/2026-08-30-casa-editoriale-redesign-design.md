# Casa Editoriale — Mamma Giovanna v2 redesign

**Status:** Design approved by user; implementation pending written-spec review
**Date:** 2026-08-30
**Surface:** Public multilingual website (FR, EN, DE, IT)
**Mode:** Persuade — help a visitor decide to visit, call, and read the menu

## 1. Product truth and invariants

Mamma Giovanna is an Italian restaurant and pizzeria in Colmar. The existing translated content is the source of truth and must remain verbatim. This redesign may add small interface labels where necessary, but it must not rewrite, paraphrase, delete, or silently correct existing `src/messages/{fr,en,de,it}.json` content.

The implementation must preserve:

- The original white Mamma Giovanna logo asset.
- All existing menu items, descriptions, prices, opening hours, contact details, and social links.
- Four locale routes and locale switching: `fr`, `en`, `de`, `it`.
- Server-rendered route content, semantic headings, canonical URLs, hreflang alternates, sitemap, robots, Restaurant JSON-LD, and Menu JSON-LD.
- The current factual schedule: open Tuesday–Saturday for lunch and dinner; closed Monday and Sunday.
- Mobile-first behavior at a 390px viewport without horizontal page overflow.

No reservation provider, ordering system, analytics vendor, or new factual restaurant claim is introduced by this visual redesign.

## 2. Chosen visual world — Casa Editoriale / Milanese modernism

The visual language is a premium Italian editorial identity, not a fine-dining impersonation and not a generic dark/gold restaurant template. It combines the restraint of Noma and Osteria Francescana with the typographic confidence and food-led storytelling seen in current award-winning restaurant work.

### Palette

- **Ink:** near-black green-charcoal for the primary canvas and high-contrast type.
- **Porcelain:** warm off-white for the main reading surfaces and menu paper panels.
- **Rosso:** a single confident vermilion/red accent for calls to action, rules, active index states, and selected editorial highlights.
- **Olive:** restrained operational accent for the open state and ingredient/value details.
- No gradients as the primary visual identity, no purple/blue SaaS colours, and no decorative colour overload.

The page may alternate between ink and porcelain editorial bands, but each band has one clear contrast system. Colour changes are structural and intentional, never random card decoration.

### Typography

- **Display:** the installed Bodoni Moda Variable remains the Italian editorial display face. It is used for the restaurant name, section titles, pull quotes, and menu category headings with generous line-height and disciplined scale.
- **Utility/body:** Outfit Variable remains the readable grotesk for navigation, descriptions, prices, labels, and metadata-like UI.
- Text hierarchy is established by scale, weight, and whitespace before colour. No all-caps paragraphs. Letter-spacing is reserved for short labels and navigation.

### Material language

The site should feel like a well-designed printed menu/poster translated to the web: thin rules, numbered sections, generous margins, offset image crops, restrained paper grain, and editorial captions. Grain is a low-opacity CSS texture only; it must not materially affect contrast or performance.

## 3. Information architecture and page surfaces

### Shared navigation

- Desktop: compact fixed navigation with logo, Home, Menu, Contact, locale switcher, and a persistent reservation/phone action.
- Mobile: one clear menu trigger with a full-width sheet, large tap targets, locale choices, and the phone action.
- On scroll, the header transitions from transparent over the hero to a solid ink/porcelain surface using opacity/background only.
- The logo remains the supplied asset; no recreated text logo is used.

### Home page

1. **Hero:** retain the existing dining-room image as the primary visual. Avoid duplicating text already embedded in that asset. Keep the first-screen action dock simple: view menu, call/reservation, and the factual open/closed state.
2. **Value ticker:** reuse existing value copy verbatim. Desktop shows the complete editorial strip; mobile uses a clearly moving horizontal ticker with a non-animated overflow fallback that lets users reveal the complete line.
3. **Menu index:** a poster-like numbered index of the actual menu families (salads, pasta, specialities, meat/fish, desserts, ice cream, pizzas, wines, drinks). It is visible, scannable, and links to the menu page/anchors.
4. **Editorial menu preview:** four selected existing dishes, displayed as an asymmetric list/grid with typography and rules. No new food claims are needed.
5. **Mamma Giovanna values block:** use the existing approved values text verbatim; visual treatment is an oversized pull quote with one supporting image/texture, not a rewritten family biography.
6. **Visit block:** hours, address, map link, phone, open state, and a clear call action.
7. **Footer:** navigation, contact, opening hours, social links, and legal/accessibility affordances remain available without animation.

### Menu page

- Top heading and reservation phone action remain visible in the initial server HTML.
- Replace the current ambiguous single-row category rail with an explicit **Category Index**:
  - Mobile: a wrapped, numbered two-column/three-column index where all categories are discoverable without guessing that hidden content exists.
  - Desktop/tablet: a sticky editorial index with visible labels, active marker, and optional horizontal overflow only when there is insufficient room.
- Each section remains a real semantic `<section>` with a stable fragment id.
- Menu rows use a clear name/description/price rhythm, with enough width for long translated dish names and no clipped prices.
- Wine tables remain tabular in meaning, with an accessible responsive presentation rather than a visually truncated table.
- The full menu remains rendered on the server; motion only reveals or highlights content that already exists.

## 4. Motion system

Motion is for orientation and atmosphere, not for hiding content.

- Hero image: slow crop drift using `transform`, never layout-affecting properties.
- Page entry: opacity/translate reveal on sections via one small IntersectionObserver client island.
- Menu index: active marker and section highlight transition using opacity/transform.
- Images: subtle hover crop/scale on pointer devices only; no essential hover-only information.
- Value ticker: CSS transform animation with duplicated content. If reduced motion is requested, the ticker becomes a manually scrollable strip with a visible continuation affordance rather than freezing on a partial sentence.
- Route changes: optional native View Transition enhancement only if it can be feature-detected and does not delay or replace server navigation. It is not required for content or SEO.
- All motion honors `prefers-reduced-motion`; focus states, keyboard navigation, and touch interaction remain immediate.
- No WebGL, canvas scene, autoplay video, large animation runtime, or animation-dependent text.

## 5. SEO, accessibility, and performance contract

The existing SEO architecture is retained and audited after the redesign:

- Keep Next.js App Router server components for page content.
- Keep `generateMetadata` per locale/page with localized title, description, canonical, Open Graph, Twitter, and hreflang/x-default.
- Keep `sitemap.ts` and `robots.ts` and verify their production responses.
- Keep Restaurant JSON-LD with the current address, phone, social links, geo, and Tue–Sat hours.
- Keep Menu JSON-LD generated from the same typed menu data.
- Use `next/image` for local assets; use the current Next.js 16 LCP preload convention for the hero image and accurate `sizes` values.
- Keep the page-level `<h1>` in initial HTML. Decorative image text is not treated as the only heading.
- Every meaningful image gets descriptive alt text; decorative images use empty alt text.
- Preserve keyboard focus visibility, skip link, semantic landmarks, accessible names, and minimum touch target sizes.
- Test at 390px, 768px, 1024px, and wide desktop. The document itself must never overflow horizontally.
- Avoid loading third-party image hosts or fonts when a local optimized asset can provide the same result.

## 6. Implementation boundaries

Implementation is staged one component at a time:

1. Update the design tokens and local font/image loading; run type/lint/build checks.
2. Refine shared header/footer; verify locale paths and keyboard behavior.
3. Build the home hero and action dock; verify LCP/preload and initial HTML.
4. Build the value ticker and editorial home sections; verify reduced-motion fallback.
5. Build the new menu Category Index; verify all category labels are discoverable at mobile width.
6. Refine menu typography/rows/wine tables without changing data.
7. Run the web-interface accessibility audit, production build, route smoke tests, SEO extraction, and responsive browser checks.
8. Commit and report the verified artifact. Production deployment remains a separate explicit user decision.

## 7. Acceptance criteria

- Existing translation JSON files are unchanged unless an explicitly approved interface-only key is required; all existing user-facing text remains available.
- The logo is reused from the supplied asset.
- Home and Menu are visually coherent as Casa Editoriale: ink/porcelain/rosso/olive, editorial typography, rules, poster index, and restrained image-led composition.
- Home has a clear menu/call/open-state action surface above the fold.
- The complete value ticker is readable on mobile either through continuous animation or a usable overflow fallback.
- All menu categories are discoverable without requiring the user to infer hidden horizontal content.
- All existing menu sections, prices, descriptions, and wine information remain present.
- `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm format:check`, and `pnpm build` exit 0 with zero lint warnings/errors.
- The 4 locale home/menu routes, sitemap, robots, and critical assets return successful responses in a production smoke test.
- SEO metadata/JSON-LD remains in initial HTML and passes structural checks.
- No horizontal page overflow at 390px; reduced-motion mode does not remove content or interaction.

## 8. Research basis

- [Noma](https://noma.dk/) — editorial image sequencing, restrained chrome, seasonal/place-led storytelling.
- [Osteria Francescana](https://www.osteriafrancescana.it/) — minimal navigation, image-led introduction, “Tradition in Evolution” narrative, art as part of the identity.
- [Dishoom](https://www.dishoom.com/) — story-led long-scroll, rich typographic systems, structured content discovery.
- [Momofuku](https://www.momofuku.com/) — image-led modules, direct action routing, editorial story blocks.
- [Ottolenghi](https://www.ottolenghi.co.uk/) — distinctive visual system beyond photography and ingredient-led information architecture.
- [Triplet​ta Pizza — Awwwards Site of the Day](https://www.awwwards.com/sites/tripletta-pizza) — disciplined two-colour palette, typography, micro-interactions, infinite-scroll craft.
- [Tenuta Centoporte — Awwwards nominee](https://www.awwwards.com/sites/tenuta-centoporte) — animation, large background imagery, and content architecture.
- [Top restaurant website design analysis](https://toimi.pro/blog/best-restaurant-website-designs/) — custom typography, illustration, editorial restraint, and mobile-first content systems.
- [Next.js JSON-LD guide](https://nextjs.org/docs/app/guides/json-ld) and [Next.js Image reference](https://nextjs.org/docs/app/api-reference/components/image) — server-rendered structured data and optimized responsive images.
