/** v2's motion module: hero stagger, scroll-reveal, dashboard float, accordion. */

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initHeroStagger() {
  const items = document.querySelectorAll<HTMLElement>("[data-v2-hero-item]");
  if (!items.length) return;

  if (prefersReducedMotion()) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }

  items.forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
    requestAnimationFrame(() => el.classList.add("is-in"));
  });
}

function initScrollReveal() {
  const targets = document.querySelectorAll<HTMLElement>(
    "[data-v2-reveal], [data-v2-reveal-fade]"
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
        const delay = el.dataset.v2Delay;
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
  const trigger = item.querySelector<HTMLElement>("[data-v2-accordion-trigger]");
  trigger?.setAttribute("aria-expanded", open ? "true" : "false");
  const panel = item.querySelector<HTMLElement>(".v2-accordion-panel");
  if (!panel) return;
  panel.style.maxHeight = open ? `${panel.scrollHeight}px` : "0px";
}

function initAccordion() {
  const items = document.querySelectorAll<HTMLElement>("[data-v2-accordion-item]");
  if (!items.length) return;

  items.forEach((item) => {
    setAccordionState(item, item.getAttribute("data-open") === "true");

    const trigger = item.querySelector<HTMLElement>("[data-v2-accordion-trigger]");
    trigger?.addEventListener("click", () => {
      const isOpen = item.getAttribute("data-open") === "true";
      items.forEach((other) => setAccordionState(other, false));
      setAccordionState(item, !isOpen);
    });
  });
}

function initCounters() {
  const bars = document.querySelectorAll<HTMLElement>("[data-v2-bar-fill]");
  if (!bars.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    bars.forEach((el) => {
      el.style.width = el.dataset.v2BarTarget ?? "0%";
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.style.width = el.dataset.v2BarTarget ?? "0%";
        observer.unobserve(el);
      }
    },
    { threshold: 0.4 }
  );

  bars.forEach((el) => observer.observe(el));
}

export function initV2Entrance() {
  initHeroStagger();
  initScrollReveal();
  initAccordion();
  initCounters();
}
