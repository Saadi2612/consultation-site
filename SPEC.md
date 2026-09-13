# Proofload — page content

Every section must be understandable from its heading and layout alone. Body copy is depth for people who want it, never the only route to the point.

## Settled facts

Use these exactly. Do not embellish them.

- **Studio:** Proofload. Founders Mohib and Saad, 6+ years each, based in Lahore, Pakistan.
- **Stack:** Django, FastAPI, Express, NestJS, React, Postgres, AWS. State this once as plain text in a sentence. Never as a logo grid.
- **Timezone:** PKT is UTC+5, no daylight saving. Real overlap windows, to be stated as commitments rather than as a claim to work any timezone:
  - London — 1pm to 9pm PKT covers a full 9-to-5 there
  - Berlin and most of the EU — 12pm to 8pm PKT covers a full working day
  - New York — 6pm to 10pm PKT covers their morning
  - San Francisco — 9pm to 1am PKT covers their morning
  - Sydney — 8am to 12pm PKT covers their afternoon
  - Note in the copy that these shift by an hour when the client's region changes clocks
- **Pricing:** Consultation $35/hour; a two-week scoping engagement usually runs 20–30 hours, so $700–$1,050. MVP build from $3,499. Hardening from $1,999.
- **Booking:** https://calendly.com/saadhassan817/30min
- **Email:** saadhassan817@gmail.com — define once as a constant, reference everywhere, so it can be swapped for a domain address in one edit.

---

## 1. Header

Wordmark left. Three anchors and one button right. Sticky. No hamburger above 768px. The button reads "Tell us where you are" and scrolls to the hero rail.

## 2. Hero

**One heading, not two.** A previous build put "Where is your product right now?" as a small line on the left and "Choose the point you're at." as a display heading on the right. They say the same thing and compete. Set the question itself as the display `h1`, at `--text-display`, and delete the second line.

Under it, the rail.

**The rail is one instrument with three positions, not three cards.** Do not build three bordered, rounded rectangles side by side — that is the generic card grid and it flattens the whole idea. Build a single continuous band on the paper, divided by full-height 1px `--rule` verticals, no outer border, no radius on the band itself. The three positions, left to right, form a real progression:

1. **v?** — "You know the problem. You don't have a spec." Consultation. Two weeks. You leave with a scope you can hand to anyone.
2. **v0** — "Spec is ready. Nothing is built." MVP build. 6–8 weeks to something real users can use.
3. **v1** — "It's live, and it breaks under load." Hardening. Four weeks on stability, performance and tests.

Markers `v?`, `v0`, `v1` at `--text-marker`, Archivo extended. These are the visual anchor of the page.

Behaviour:

- **With no interaction, all three read equally and are fully legible.** Someone who never clicks anything understands the entire business from this one screen. This is the most important requirement on the page.
- On select: CSS grid tracks go from `1fr 1fr 1fr` to `0.9fr 2.2fr 0.9fr` (selected track wide), transitioned over 240ms. The selected segment's background becomes `--white` and its marker turns `--spot`. The two others keep their markers but their body text fades to `opacity: 0`. The selected segment reveals its deliverable, timeframe and a button.
- Segments are content-height, `min-height: 280px`, with the marker at the top and text anchored to the bottom. Do not leave a tall empty void under short text.
- Selection writes a URL hash so the state is shareable, and pre-fills the current-state field in the contact form.
- Keyboard: arrow keys move between positions, Enter selects, focus ring in `--spot`.
- Mobile: the band becomes vertical rows divided by horizontal rules, animating `grid-template-rows` on the same timing. The progression must survive the stack.

Below the rail, one quiet line: Mohib and Saad, 6+ years each, building from Lahore on your working hours.

## 3. Ground-truth strip

Four operating facts, not adjectives and not metrics: daily overlap with the client's working hours, typical response time, when code ownership transfers, whether NDAs get signed. These are things Mohib and Saad can stand behind. Invent nothing here.

## 4. Three service sections, each a different layout

Do not build a three-card grid.

- **Consultation** — a two-week strip showing what happens in each week and the artefact handed over at the end.
- **MVP build** — a two-column scope table. Left is what ships in v0. Right is what is deliberately left out, and why. The right column is the point of the section.
- **Hardening** — a before-and-after readout on four measures: p95 latency, error rate, test coverage, deploy frequency. Mark the numbers clearly as illustrative.

## 5. How an engagement runs

Four steps, week-numbered (a real sequence, so numbering is earned here). For each, state what Proofload does **and** what the client has to do that week. Naming the client's obligations is what makes this credible.

## 6. What an engagement looks like

Two worked examples. **Label them as illustrative** in the heading or a line directly beneath it, at body size and colour, not as small print. Attach no client name, company, country or quotation to either.

**Example one, hardening.** A B2B scheduling tool on Django and Postgres, roughly 8,000 monthly users, built quickly by a previous contractor. On arrival: p95 API response of 2.4 seconds at peak, booking requests timing out, no test suite, deploys by hand over SSH. Four weeks of work — an index audit and removal of N+1 queries, connection pooling through PgBouncer, report generation moved onto a Celery queue, 140 integration tests covering the booking path, CI with automated deploys, Sentry with structured logging. Typical outcome: p95 under 300ms, error rate from around 3% to under 0.5%, deploys from monthly to daily.

**Example two, MVP.** An equipment rental marketplace. The founder arrived with a Figma file and a spreadsheet of demand from twelve suppliers. v0 on FastAPI, React and Postgres: listings, search, an availability calendar, payouts through Stripe Connect, transactional email. Deliberately left out of v0: native mobile apps, in-app messaging, reviews, an analytics dashboard, multi-currency. Shipped in seven weeks with sixty listings live.

Present these in the same before-and-after and scope-table shapes as section 4, so the reader sees method rather than testimonial. No logo wall.

## 7. Fit filter

Two columns: work we take, work we turn down. The second column must be genuinely disqualifying, with at least three real entries. The stack sentence belongs here.

## 8. Working across borders

The section that closes cross-border deals. Cover contract and NDA, IP assignment terms, payment methods and currencies, communication channels and cadence, what happens if the client goes quiet, and the overlap windows listed under Settled facts. Plain and specific throughout.

## 9. Pricing

The three figures from Settled facts. Each starting price sits next to the scope it buys, at the same visual weight as the number — a bare "from" figure with no anchor reads as a hook and costs more trust than a higher price would. Show the consultation rate and the typical two-week total together, because a founder budgeting for a scope wants the total.

State plainly what pushes a quote above the starting figure: number of user-facing screens, third-party integrations, whether an existing codebase has to be understood first, compliance requirements, how much design already exists.

The starting prices describe the smallest sensible version of each engagement. Where a build genuinely takes the 6–8 weeks quoted in the hero, leave a clearly-marked placeholder for that figure rather than letting the reader assume $3,499 covers it.

## 10. The two of us

Real photographs of Mohib and Saad. For each: what they own on a project, then two or three sentences in first person set in Newsreader. Make the division of labour explicit rather than describing both as full-stack — buyers hiring a two-person team are quietly worried about the bus factor, and naming who owns what answers that before they ask. Links out.

## 11. FAQ

Eight questions, each a real objection: what happens if one of you gets sick mid-build; who owns the code and when; what if we go over scope; can you work alongside our existing developer; whose NDA do we sign; what if the MVP fails; how do we pay a studio in Pakistan; what happens after launch. Name actual payment rails and currencies. Answer the distance question directly rather than defensively.

## 12. Contact

Short qualifying form: name, email, company URL, current state (pre-filled from the hero selection), budget band, timeline, one free-text box. On submit, a confirmation stating exactly what happens next and by when.

Alongside it, direct booking as the faster path. **Do not embed the Calendly inline widget** — its script and iframe blow the JS budget on their own. Use a plain link, or Calendly's popup with the script injected only on click. Link text says what the call is: "Book a 30-minute call with Saad".

## 13. Footer

Wordmark, the email as a mailto, Lahore, legal links. Nothing else.
