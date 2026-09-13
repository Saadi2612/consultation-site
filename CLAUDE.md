# Proofload — build constraints

A single-page marketing site for Proofload, a two-person software studio (Mohib and Saad) in Lahore, Pakistan. It sells consultations, MVP builds, and hardening of live-but-unstable products to founders in the US, UK, EU and Australia.

Read `SPEC.md` for page content. This file holds the rules that apply to every change you make. Re-read it before each section.

## Stack

Astro with Tailwind. No React, Vue, or any UI framework. The page is static HTML; the three interactive pieces (hero rail, FAQ accordion, sticky bar) are one small vanilla TypeScript module.

This is deliberate. The page has one genuinely interactive component and a hard JS budget. Astro ships zero JS for everything else, which is the cheapest route to the performance floor below. Do not add a framework to make a component easier to write.

## Design tokens

Define these once in CSS custom properties. Never hardcode a hex value in a component.

```
--paper:  #E4E6E3
--ink:    #17231E   /* deep pine; near-black as text, clearly green in fills */
--spot:   #1F4FD8   /* ultramarine */
--muted:  #6E7A74
--white:  #FFFFFF   /* the one surface that lifts off the paper */
--rule:   rgba(23, 35, 30, 0.15)
```

Three inks and nothing else. No gradients anywhere. No additional greys. The spot colour appears in about five places on the entire page — if you find yourself reaching for it a sixth time, use ink instead.

## Type

Two families, both from Google Fonts, both subset to latin and self-hosted.

- **Archivo** (variable) for everything structural. Headings `wdth 115–125`, `wght 600–700`, `letter-spacing -0.02em`. Body `wdth 100`, `wght 400`.
- **Newsreader** `wght 300` for client quotes and the founders' paragraphs only. Italic for quotes.

No monospace anywhere. Sentence case everywhere. No all-caps, including on buttons and labels.

```
--text-display: clamp(3.25rem, 7vw, 6rem)
--text-marker:  clamp(3rem, 6vw, 5.5rem)   /* the v? v0 v1 markers */
--text-h2:      clamp(1.75rem, 3vw, 2.75rem)
--text-h3:      1.375rem
--text-body:    1.0625rem                   /* 17px, line-height 1.6 */
--text-small:   0.9375rem
```

Body copy caps at 68 characters per line.

## Layout

Left-aligned and asymmetric. 12-column grid, 1200px max width. Headings sit in a narrow left column, content in a wider right column, with real empty space between. Section spacing 128px desktop, 72px mobile. Boundaries are 1px `--rule`, never shadows.

Radius has exactly two tiers and encodes interactivity: `0` on structural blocks and dividers, `10px` on anything clickable. Never one uniform radius across the page.

## Motion

Smoothness comes from a few well-tuned transitions, not from many animations. Everything that moves must respond to something the visitor did.

```
--dur-micro: 120ms   /* hover, focus, colour */
--dur-state: 240ms   /* selection, expand, collapse */
--dur-enter: 320ms   /* a panel appearing */
--ease-out:      cubic-bezier(0.16, 1, 0.30, 1)
--ease-standard: cubic-bezier(0.20, 0, 0, 1)
```

Animate only `transform`, `opacity`, `clip-path`, `color`, `border-color`, and `grid-template-columns`/`grid-template-rows` on the hero rail specifically. Never animate `width`, `height`, `top`, `left`, `margin`, `padding`, `box-shadow`, `filter` or `backdrop-filter`. Set `will-change` when a transition starts and remove it on `transitionend`.

**The complete list of things that move. Nothing else animates.**

1. Hero rail selection — the signature moment, 240ms `--ease-standard`
2. Hover and focus — colour and underline only, 120ms, no lift or scale or shadow
3. Header bottom rule fading in past the hero, 160ms
4. Sticky bar sliding in past the hero, 240ms, once
5. FAQ accordion, 200ms
6. Scope table row hover, colour only
7. Form submit crossfading to confirmation, 280ms
8. Native smooth scroll on anchors

Under `prefers-reduced-motion: reduce`, all durations drop to 0.01ms, state changes apply instantly, `scroll-behavior` becomes `auto`, and the page stays fully usable.

## Never build

These are the patterns that make a site read as machine-generated. They are not stylistic preferences.

- Gradients of any kind, gradient text, glassmorphism, `backdrop-filter`, animated blobs, mesh backgrounds
- Identical rounded cards in a grid, each with the same soft grey shadow
- Tracked-out all-caps eyebrow labels above headings
- Monospace for small labels or metrics
- `01 / 02 / 03` numbering on anything that is not a real sequence
- Meta strings joined by middle dots
- An arrow character appended to button or link text
- Generic icons sitting in tinted rounded squares
- A grid of technology logos
- Stock photography
- Scroll-triggered fade-and-slide-up on section entry, staggered card entrances, parallax, marquees, typewriter text, counting-number reveals, spring overshoot
- Two headings that say the same thing in one viewport

## Copy

Write real copy. No lorem ipsum, no placeholder prose. Second person for the reader, first person plural where Mohib and Saad speak.

Banned: seamless, leverage, robust, cutting-edge, empower, unlock, elevate, transform, journey, landscape, bespoke, holistic, synergy, game-changing, tailored solutions, commitment to, stands as, testament to, in today's fast-paced world.

Also avoid three-item lists used for rhythm rather than because there are three things, sentences padded with a trailing `-ing` clause, heavy em dash use, a punchy fragment after every claim, and vague authorities like "studies show".

Headings should say something, not label something. "It's live and it keeps falling over" beats "Our Services". A specific number beats any adjective.

**Never invent a client, a company, a metric, a quotation or a country.** The two engagement examples in `SPEC.md` are written as illustrative and must stay labelled that way. If a fact is missing, leave a visible placeholder with a `--spot` background rather than filling the gap.

## Floors

- WCAG AA contrast on every text pair. Visible focus rings in `--spot`. Full keyboard operability including the hero rail.
- Responsive from 360px up.
- Total JS under 40kb gzipped. There is no framework in the bundle, so this should be comfortable.
- Zero cumulative layout shift. Reserve dimensions on every image. Use a `size-adjust` fallback font so the swap does not shift text.
- Lighthouse mobile: performance 95+, accessibility 100, best practices 100, SEO 100.
- Photographs as AVIF with WebP fallback, explicit width and height.

## How to work

Build one section at a time, in `SPEC.md` order.

After each section:

1. `npm run build` — it must pass with no errors
2. Screenshot with Playwright at 1440x900 and 390x844, then actually look at the images before continuing
3. Check the section against the "Never build" list above, item by item
4. `git commit` with the section name

Stop and ask before: adding any dependency, deviating from a token, or making a layout choice `SPEC.md` does not cover.
