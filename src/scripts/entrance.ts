/**
 * Section entrance animations.
 *
 * Every section that opts in marks its content column `data-entrance`. Once
 * that element crosses the threshold, it's marked visible and never
 * re-observed — entrances play once, never re-trigger on scroll-up. The
 * actual motion (what rises, what fades, timing, stagger) lives entirely in
 * CSS per treatment class; this module only flips the one attribute.
 */

export function initEntrances() {
  const targets = document.querySelectorAll<HTMLElement>("[data-entrance]");
  if (targets.length === 0) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
  );

  targets.forEach((target) => observer.observe(target));
}
