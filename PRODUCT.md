# Product

## Register

brand

## Users

Founders in the US, UK, EU and Australia who have a software product at one
of three points: an idea with no spec, a spec with nothing built, or a live
product breaking under real load. They're evaluating a two-person studio
(Mohib and Saad, Lahore, Pakistan) against alternatives — freelancers,
bigger agencies, hiring in-house — and need to trust a small remote team
enough to hand over a codebase and money before ever meeting them in
person. They read fast, are skeptical of marketing language, and are
budgeting in concrete numbers.

## Product Purpose

Proofload is a single-page marketing site that sells three services:
scoping consultations ($35/hr), MVP builds (from $3,499), and hardening
engagements (from $1,999). It exists to get a qualified founder to book a
call or fill out a contact form, having already understood the process,
the pricing, and what disqualifies a bad fit — before they ever talk to
Mohib or Saad. Success is a founder who arrives at the call already
sold on the method, not just the price.

## Brand Personality

Confident, technical, understated. The site earns trust through specific
numbers, named constraints (timezones, response times, code-ownership
terms), and a willingness to say what the studio won't do — not through
adjectives, urgency, or social proof it can't back up. Voice is second
person for the reader, first person plural when the founders speak
directly (founders section, quotes).

## Anti-references

The full list lives in `CLAUDE.md` under "Never build" and is the
canonical source; summarized:

- Generic SaaS-template visual grammar: gradients, glassmorphism,
  identical card grids, tracked-out uppercase eyebrows, `01/02/03`
  numbering on non-sequences, icons in tinted rounded squares, gradient
  text, hero-metric-with-gradient-accent templates.
- Stock photography, logo walls, fabricated testimonials/clients/metrics.
- Centered giant-gradient-hero SaaS-startup layout; the site is
  left-aligned and editorial instead.
- Repeating one entrance animation across every section (motion is a
  rhythm device, not a garnish).

## Design Principles

- **Real facts over adjectives.** Never invent a client, metric, quote, or
  country. A specific number beats any adjective; if a fact is missing,
  leave a visible placeholder rather than fill the gap with language.
- **Say what disqualifies, not just what qualifies.** The fit-filter
  section (work turned down) does more trust-building work than the
  pitch section, because it's the one claim a generic competitor won't
  make.
- **Restraint as credibility.** A tight, deliberate palette and two type
  families read as considered rather than decorated; every added color
  or font is a claim the design has to justify.
- **Process, not personality, sells the studio.** Founders are shown
  through what they own on a project and first-person specifics, not
  broad "full-stack" claims — buyers of a two-person team are quietly
  worried about bus factor, and naming ownership answers that early.
- **Motion earns its place per section.** Each section's entrance
  treatment is chosen for what it reveals (sequential content animates
  differently from a table, which animates differently from a
  before/after readout) rather than one effect reused everywhere.

## Accessibility & Inclusion

WCAG AA contrast on every text pair, including placeholder and muted
text. Visible focus rings (site's accent color) on every interactive
element. Full keyboard operability, including custom widgets like the
hero rail and accordions. `prefers-reduced-motion: reduce` must leave
every section fully readable and usable with all motion removed, not
degraded. Responsive from 360px wide, zero cumulative layout shift,
explicit image dimensions.
