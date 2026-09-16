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

Motion is now a primary design tool, not a garnish. The site's premium feel comes from two things working together: a sticky-scroll reading pattern for content sections, and a distinct, considered entrance animation per section. Distinct means a visitor who scrolls through the whole page should be able to feel that section 4 moves differently from section 6 — repeating the same fade-up on every section is the cheap version of this idea, and is exactly as banned as doing nothing.

```
--dur-micro:  120ms   /* hover, focus, colour */
--dur-state:  240ms   /* the hero rail, accordion, sticky bar */
--dur-enter:  480ms   /* a section element entering on scroll */
--dur-stage:  600ms   /* the sticky-scroll handoff between stages within a section */
--ease-out:      cubic-bezier(0.16, 1, 0.30, 1)
--ease-standard: cubic-bezier(0.20, 0, 0, 1)
--ease-premium:  cubic-bezier(0.22, 1, 0.36, 1)   /* slightly more settle, use for --dur-enter and --dur-stage */
```

Animate only `transform`, `opacity`, `clip-path`, `color`, `border-color`, and `grid-template-rows`/`grid-template-columns` where a track genuinely resizes (the hero rail). Never animate `width`, `height`, `top`, `left`, `margin`, `padding`, `box-shadow`, or `filter`. Set `will-change` only while a transition is active and remove it on `transitionend` or when the element leaves the viewport.

### Sticky heading, scrolling content

This is the section layout for 3 through 11. The section heading — and only the heading, plus at most one short supporting line — pins to the left column and stays fixed on screen for the full height of that section's content. The right column scrolls underneath it, revealing its content piece by piece as the visitor scrolls.

Implementation: the heading is `position: sticky; top: <header height + 32px>` inside a section whose own height is driven by its content column, so the sticky heading releases naturally when the section ends — do not fake this with `position: fixed` and manual scroll math. On mobile below 900px, drop the sticky behaviour entirely and stack heading above content normally; sticky-while-scrolling on a phone viewport that's already narrow reads as broken, not premium.

### One distinct entrance animation per section

Each section's right-column content animates in via `IntersectionObserver` (threshold ~0.2, `rootMargin: "0px 0px -10% 0px"`), once, never re-triggering on scroll-up. Assign a different treatment per section so the page has rhythm rather than a single repeated effect:

- **Ground-truth strip (3):** each fact rises in place — `opacity 0→1`, `translateY(16px)→0`, `--dur-enter` `--ease-premium`, each row offset from the previous by 80ms.
- **Consultation (4a):** the two-week strip draws on a horizontal axis — each week's block enters with `translateX(-24px)→0` plus opacity, left block first, right block 120ms behind it, since the content itself is sequential.
- **MVP scope table (4b):** rows resolve top to bottom, `opacity 0→1` only, no translate, staggered 60ms per row — a table reordering itself in space would look glitchy, a table appearing in reading order looks composed.
- **Hardening readout (4c):** the four metrics count and settle — the "before" figure appears first, holds for 200ms, then the "after" figure and its improvement crossfade in beside it. This is the one place a numeric transition earns its keep, because the before/after gap is the actual content of the section.
- **How an engagement runs (5):** each week card enters from the right, `translateX(24px)→0` with opacity, 100ms stagger, mirroring forward progress through the weeks.
- **Worked examples (6):** reuse the treatments from section 4 for internal consistency, since these sections share a visual grammar already.
- **Fit filter (7):** the two columns enter independently — "work we take" rises from below, "work we turn down" fades in with no motion at all, so the asymmetry in the copy (one list is a positive pitch, the other a filter) is echoed in how each column arrives.
- **Cross-border (8) and FAQ (11):** plain opacity fade only, `--dur-enter`, no transform. These are dense reading sections; do not add motion competing with reading.
- **Founders (10):** each founder's block enters with a very slight scale, `scale(0.98)→1` plus opacity, `--dur-enter` `--ease-premium` — this is the one place a scale transform is allowed, reserved for the section introducing the two people.

Nothing here uses spring overshoot, bounce, or blur-in. Every entrance is monotonic: it moves toward its resting state and stops.

### Hero rail — expansion must not reflow abruptly

The failure mode to avoid: a segment's box changes size the instant it's selected and its inner text pops into existence, which reads exactly as "snappy and cheap" rather than premium. Fix:

- The grid-track transition (`1fr 1fr 1fr` → `0.9fr 2.2fr 0.9fr`) and the inner content reveal must run on the same `--dur-state` (240ms) and the same easing, so the box and its contents finish growing at the same moment. Do not let the track resize and then have content fade in afterward with a visible gap.
- Inner content of the selected segment (deliverable, timeframe, button) is present in the DOM at all times at `opacity: 0; transform: translateY(6px)`, and transitions to `opacity: 1; translateY(0)` on the same 240ms clock, delayed by 60ms so the box has started widening before its content starts appearing — not before, not simultaneously.
- Text inside the collapsing segments does not disappear abruptly; it fades over the first 120ms of the 240ms transition, finishing before the box has finished narrowing.

### Sticky bar and header rule

Header bottom rule fades in past the hero, 160ms. The sticky summary bar (selected state + primary button) slides in once past the hero, 240ms, and does not re-animate on subsequent scrolling.

### Reduced motion

Under `prefers-reduced-motion: reduce`: sticky headings still pin (that's layout, not motion), but every IntersectionObserver entrance applies its end state immediately with no transition, all durations drop to 0.01ms, and `scroll-behavior` becomes `auto`. The page must remain fully usable and fully readable with motion off entirely.

### Budget, revised

The sticky-scroll pattern and IntersectionObserver module add real code. Total JS budget is now 70kb gzipped, still with no UI framework — this is one vanilla TypeScript motion module handling the hero rail, the sticky sections, the accordion, and the entrance observer. If you find yourself needing more than that, the animations are too elaborate, not the budget too small.

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
- The *same* entrance animation repeated on every section — motion is a rhythm device now, and repeating one effect throughout is the cheap version of using it at all
- Parallax (background moving at a different rate than foreground), marquees, typewriter text, blur-in, spring overshoot or bounce on anything, `position: fixed` hacks for sticky headings
- A sticky heading that stays pinned on mobile below 900px
- Content that pops into existence the instant a container finishes resizing, rather than resolving on the same clock as the resize (see hero rail rules)
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
3. Screen-record or step through the scroll behaviour specifically — the sticky heading must release cleanly at the section boundary, and the entrance animation must match the treatment assigned to that section in the Motion section above, not a copy of the previous section's treatment
4. Toggle `prefers-reduced-motion` and confirm the section is still fully readable with all motion removed
5. Check the section against the "Never build" list above, item by item
6. `git commit` with the section name

Stop and ask before: adding any dependency, deviating from a token, or making a layout choice `SPEC.md` does not cover.
