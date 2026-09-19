/**
 * v3's motion module. Mercury's own motion guidance is deliberately small —
 * hover lifts, a 1.02 scale on ghost buttons, opacity for state — so the
 * scroll work here stays equally restrained: a hero stagger, a single reveal
 * that runs once per element, and an accordion. Nothing re-triggers on
 * scroll-up, and everything collapses to its end state under reduced motion.
 */

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initHeroStagger() {
  const items = document.querySelectorAll<HTMLElement>("[data-v3-hero-item]");
  if (!items.length) return;

  if (prefersReducedMotion()) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }

  items.forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
  });

  requestAnimationFrame(() => {
    items.forEach((el) => el.classList.add("is-in"));
  });
}

function initScrollReveal() {
  const targets = document.querySelectorAll<HTMLElement>(
    "[data-v3-reveal], [data-v3-fade]"
  );
  if (!targets.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        const delay = el.dataset.v3Delay;
        if (delay) el.style.transitionDelay = `${delay}ms`;
        el.classList.add("is-in");
        observer.unobserve(el);
      }
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

function setAccordionState(item: HTMLElement, open: boolean) {
  item.setAttribute("data-open", open ? "true" : "false");
  item
    .querySelector<HTMLElement>("[data-v3-accordion-trigger]")
    ?.setAttribute("aria-expanded", open ? "true" : "false");

  const panel = item.querySelector<HTMLElement>("[data-v3-accordion-panel]");
  if (!panel) return;
  panel.hidden = false;
  panel.style.gridTemplateRows = open ? "1fr" : "0fr";
}

function initAccordion() {
  const items = document.querySelectorAll<HTMLElement>("[data-v3-accordion-item]");
  if (!items.length) return;

  items.forEach((item) => {
    setAccordionState(item, item.getAttribute("data-open") === "true");

    item
      .querySelector<HTMLElement>("[data-v3-accordion-trigger]")
      ?.addEventListener("click", () => {
        const isOpen = item.getAttribute("data-open") === "true";
        items.forEach((other) => setAccordionState(other, false));
        setAccordionState(item, !isOpen);
      });
  });
}

/**
 * The top bar picks up its shadow only once the page has moved past the hero,
 * so the nav and the dark hero read as one surface at rest (§6: the nav shadow
 * is a "subtle downward hint", which it cannot be while nothing is under it).
 */
function initNavShadow() {
  const nav = document.querySelector<HTMLElement>("[data-v3-nav]");
  const sentinel = document.querySelector<HTMLElement>("[data-v3-nav-sentinel]");
  if (!nav || !sentinel || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      nav.classList.toggle("is-past", !entry.isIntersecting);
    },
    { threshold: 0 }
  );

  observer.observe(sentinel);
}

export function initV3() {
  initHeroStagger();
  initScrollReveal();
  initAccordion();
  initNavShadow();
}
