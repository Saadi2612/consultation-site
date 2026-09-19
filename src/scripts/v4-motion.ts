/**
 * v4's motion module. One vanilla TypeScript file, no framework, no library.
 *
 * The Brex document has no motion section, so the rules here come from the
 * animation guidance instead: transform and opacity (plus clip-path and
 * grid-template-rows) only, strong curves, UI state changes under 300ms,
 * entrances that run once and never re-trigger on scroll-up, hover effects
 * gated to fine pointers, and every effect collapsing to its end state under
 * prefers-reduced-motion.
 *
 * Each section gets its own treatment rather than one shared fade:
 *   hero      line wipe led by an orange bar, then the card and its floats
 *   holds     four cards dealt out of a stack
 *   scope     a connector that draws as you scroll, dots lighting as passed
 *   decision  an orange rule struck through everything not being built
 *   numbers   digit reels that roll from the before figure to the after one
 *   examples  the same two grammars again, on purpose
 *   engage    rows shuttered in from the top
 *   fit       one column rises, the other only fades
 *   pricing   figures rise, an underline draws beneath each
 *   borders   opacity only — it is a reading section
 *   faq       opacity only
 *   cta       an orange field opening out of the button
 */

const REDUCE = "(prefers-reduced-motion: reduce)";
const FINE = "(hover: hover) and (pointer: fine)";

function reduced(): boolean {
  return window.matchMedia(REDUCE).matches;
}

function finePointer(): boolean {
  return window.matchMedia(FINE).matches;
}

/** Marks everything in `nodes` as arrived, with no transition. */
function settle(nodes: Iterable<Element>) {
  for (const el of nodes) el.classList.add("is-in");
}

/**
 * One observer for every once-only entrance on the page. Elements opt in with
 * data-v4-reveal and are unobserved the moment they arrive, so nothing
 * re-animates when the reader scrolls back up.
 */
function initReveal() {
  const targets = document.querySelectorAll<HTMLElement>("[data-v4-reveal]");
  if (!targets.length) return;

  if (reduced() || !("IntersectionObserver" in window)) {
    settle(targets);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        const delay = el.dataset.v4Delay;
        if (delay) el.style.transitionDelay = `${delay}ms`;
        el.classList.add("is-in");
        // will-change only while the transition is actually running
        el.style.willChange = "transform, opacity";
        el.addEventListener(
          "transitionend",
          () => {
            el.style.willChange = "";
          },
          { once: true }
        );
        io.unobserve(el);
      }
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
  );

  targets.forEach((el) => io.observe(el));
}

/** Groups that stagger their own children: the dealt cards, the struck rows. */
function initGroups() {
  const groups = document.querySelectorAll<HTMLElement>("[data-v4-group]");
  if (!groups.length) return;

  const apply = (group: HTMLElement) => {
    const step = Number(group.dataset.v4Step ?? 80);
    const kids = Array.from(
      group.querySelectorAll<HTMLElement>("[data-v4-group-item]")
    );
    kids.forEach((kid, i) => {
      kid.style.transitionDelay = `${i * step}ms`;
      kid.classList.add("is-in");
    });
  };

  if (reduced() || !("IntersectionObserver" in window)) {
    groups.forEach((g) =>
      settle(g.querySelectorAll("[data-v4-group-item]"))
    );
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        apply(entry.target as HTMLElement);
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
  );

  groups.forEach((g) => io.observe(g));
}

/* ------------------------------------------------------------------ hero */

function initHero() {
  const wipes = document.querySelectorAll<HTMLElement>("[data-v4-wipe]");
  const items = document.querySelectorAll<HTMLElement>("[data-v4-hero-item]");
  const card = document.querySelector<HTMLElement>(".v4-rail-card");
  const floats = document.querySelectorAll<HTMLElement>("[data-v4-float]");

  if (reduced()) {
    settle(wipes);
    settle(items);
    if (card) card.classList.add("is-in");
    settle(floats);
    return;
  }

  items.forEach((el, i) => {
    el.style.transitionDelay = `${260 + i * 80}ms`;
  });

  const arrive = () => {
    settle(wipes);
    settle(items);
    if (card) card.classList.add("is-in");
    settle(floats);
  };

  // rAF gets the entrance onto the next paint, but it never fires while the
  // tab is in the background — so a timer backs it up and the hero is never
  // left invisible in a tab that was opened behind another one.
  requestAnimationFrame(arrive);
  window.setTimeout(arrive, 120);
}

/* ------------------------------------------------------------- hero rail */

function initRail() {
  const rail = document.querySelector<HTMLElement>("[data-v4-rail]");
  if (!rail) return;

  const buttons = Array.from(
    rail.querySelectorAll<HTMLButtonElement>("[data-v4-stage-button]")
  );
  if (!buttons.length) return;

  const select = (id: string, focus: boolean) => {
    buttons.forEach((button) => {
      const isTarget = button.dataset.v4StageButton === id;
      button.setAttribute("aria-checked", isTarget ? "true" : "false");
      button.tabIndex = isTarget ? 0 : -1;
      const stage = button.closest<HTMLElement>("[data-v4-stage]");
      if (stage) stage.dataset.selected = isTarget ? "true" : "false";
      if (isTarget && focus) button.focus();
    });

    // Shareable state, and the contact form's current-state field follows it.
    if (history.replaceState) {
      history.replaceState(null, "", `#${id}`);
    }
    const field = document.querySelector<HTMLSelectElement>("[data-v4-state-field]");
    if (field) field.value = id;
  };

  buttons.forEach((button, i) => {
    button.addEventListener("click", () => {
      select(button.dataset.v4StageButton!, false);
    });

    button.addEventListener("keydown", (event) => {
      const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
      const next = buttons[(i + (forward ? 1 : -1) + buttons.length) % buttons.length];
      select(next.dataset.v4StageButton!, true);
    });
  });

  const fromHash = window.location.hash.replace("#", "");
  const known = buttons.some((b) => b.dataset.v4StageButton === fromHash);
  select(known ? fromHash : buttons[0].dataset.v4StageButton!, false);
}

/* ------------------------------------------------- pointer tilt on the card */

function initTilt() {
  const scene = document.querySelector<HTMLElement>("[data-v4-tilt-scene]");
  const card = document.querySelector<HTMLElement>("[data-v4-tilt]");
  if (!scene || !card) return;
  if (reduced() || !finePointer()) return;

  card.dataset.tilting = "true";

  const move = (event: PointerEvent) => {
    const rect = scene.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    // 3.5deg is the whole range. Any more and the type starts to smear.
    card.style.setProperty("--ty", `${(px * 7).toFixed(2)}deg`);
    card.style.setProperty("--tx", `${(-py * 7).toFixed(2)}deg`);
  };

  const rest = () => {
    card.style.setProperty("--ty", "0deg");
    card.style.setProperty("--tx", "0deg");
  };

  scene.addEventListener("pointermove", move);
  scene.addEventListener("pointerleave", rest);
}

/* ------------------------------------------------------- magnetic buttons */

function initMagnets() {
  const magnets = document.querySelectorAll<HTMLElement>("[data-v4-magnet]");
  if (!magnets.length) return;
  if (reduced() || !finePointer()) return;

  magnets.forEach((magnet) => {
    magnet.addEventListener("pointermove", (event) => {
      const rect = magnet.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      magnet.dataset.pulling = "true";
      magnet.style.setProperty("--mx", `${(x * 0.18).toFixed(1)}px`);
      magnet.style.setProperty("--my", `${(y * 0.28).toFixed(1)}px`);
    });

    magnet.addEventListener("pointerleave", () => {
      magnet.dataset.pulling = "false";
      magnet.style.setProperty("--mx", "0px");
      magnet.style.setProperty("--my", "0px");
    });
  });
}

/* ------------------------------- header rule + the page's progress hairline */

function initScrollChrome() {
  const header = document.querySelector<HTMLElement>("[data-v4-header]");
  const progress = document.querySelector<HTMLElement>("[data-v4-progress]");
  const hero = document.querySelector<HTMLElement>(".v4-hero");
  if (!header && !progress) return;

  let ticking = false;

  const read = () => {
    ticking = false;
    const y = window.scrollY;

    if (header && hero) {
      const past = y > hero.offsetHeight - 120;
      header.dataset.lifted = past ? "true" : "false";
    }

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, y / max) : 0;
      progress.style.transform = `scaleX(${ratio.toFixed(4)})`;
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(read);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  read();
}

/* ------------------------------------------ scroll-scrubbed process track */

function initTracks() {
  const tracks = document.querySelectorAll<HTMLElement>("[data-v4-track]");
  if (!tracks.length) return;

  if (reduced()) {
    tracks.forEach((track) => {
      track.style.setProperty("--draw", "1");
      track
        .querySelectorAll<HTMLElement>("[data-v4-track-dot]")
        .forEach((dot) => (dot.dataset.lit = "true"));
    });
    return;
  }

  let ticking = false;

  const read = () => {
    ticking = false;
    const viewport = window.innerHeight;

    tracks.forEach((track) => {
      const rect = track.getBoundingClientRect();
      // 0 when the track's top reaches three-quarters down the viewport,
      // 1 when its bottom passes the halfway line.
      const start = viewport * 0.78;
      const end = viewport * 0.45;
      const span = rect.height + (start - end);
      const travelled = start - rect.top;
      const ratio = Math.max(0, Math.min(1, travelled / span));
      track.style.setProperty("--draw", ratio.toFixed(4));

      const dots = track.querySelectorAll<HTMLElement>("[data-v4-track-dot]");
      dots.forEach((dot, i) => {
        const at = dots.length > 1 ? i / (dots.length - 1) : 0;
        // light a little before the line reaches the dot, so the line
        // appears to trigger it rather than arrive after it
        dot.dataset.lit = ratio >= at * 0.92 ? "true" : "false";
      });
    });
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(read);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  read();
}

/* -------------------------------------------------------- the digit reels */

/**
 * Builds a reel per digit: a column of 0–9 that translates to its target.
 * Only transform moves, so the whole readout is one composited animation.
 */
function buildReel(host: HTMLElement) {
  const value = host.dataset.v4Odometer ?? host.textContent ?? "";
  host.textContent = "";

  // The reels are decoration as far as assistive tech is concerned; the value
  // itself stays in the accessibility tree as real text.
  const readable = document.createElement("span");
  readable.className = "v4-sr";
  readable.textContent = value;
  host.append(readable);

  let digitIndex = 0;

  for (const char of value) {
    if (char >= "0" && char <= "9") {
      const reel = document.createElement("span");
      reel.className = "v4-reel";
      reel.setAttribute("aria-hidden", "true");

      const strip = document.createElement("span");
      strip.className = "v4-reel__strip";
      strip.dataset.digit = char;
      strip.style.transitionDelay = `${digitIndex * 70}ms`;
      for (let d = 0; d <= 9; d += 1) {
        const cell = document.createElement("span");
        cell.className = "v4-reel__cell";
        cell.textContent = String(d);
        strip.append(cell);
      }

      reel.append(strip);
      host.append(reel);
      digitIndex += 1;
    } else {
      const glyph = document.createElement("span");
      glyph.className = "v4-reel__glyph";
      glyph.setAttribute("aria-hidden", "true");
      glyph.textContent = char;
      host.append(glyph);
    }
  }
}

function initOdometers() {
  const hosts = document.querySelectorAll<HTMLElement>("[data-v4-odometer]");
  if (!hosts.length) return;

  if (reduced()) {
    hosts.forEach((host) => {
      host.textContent = host.dataset.v4Odometer ?? host.textContent;
    });
    return;
  }

  hosts.forEach(buildReel);

  const roll = (host: HTMLElement) => {
    host
      .querySelectorAll<HTMLElement>(".v4-reel__strip")
      .forEach((strip) => {
        const digit = Number(strip.dataset.digit ?? 0);
        strip.style.transform = `translateY(${-digit * 10}%)`;
      });
  };

  if (!("IntersectionObserver" in window)) {
    hosts.forEach(roll);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const host = entry.target as HTMLElement;
        // the "before" figure is already legible; the "after" waits 200ms so
        // the gap between them is what the reader actually watches
        const hold = Number(host.dataset.v4Hold ?? 0);
        window.setTimeout(() => roll(host), hold);
        io.unobserve(host);
      }
    },
    { threshold: 0.4 }
  );

  hosts.forEach((host) => io.observe(host));
}

/* --------------------------------------------------------------- accordion */

function initAccordions() {
  const items = document.querySelectorAll<HTMLElement>("[data-v4-accordion-item]");
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector<HTMLButtonElement>("[data-v4-accordion-trigger]");
    const panel = item.querySelector<HTMLElement>("[data-v4-accordion-panel]");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", () => {
      const open = item.dataset.open === "true";
      item.dataset.open = open ? "false" : "true";
      trigger.setAttribute("aria-expanded", open ? "false" : "true");
    });
  });
}

/* ------------------------------------------------------- final CTA opening */

function initBurst() {
  const burst = document.querySelector<HTMLElement>("[data-v4-burst]");
  if (!burst) return;

  if (reduced() || !("IntersectionObserver" in window)) {
    burst.classList.add("is-in");
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.35 }
  );

  io.observe(burst);
}

/* -------------------------------------------------------------- nav state */

function initNavSpy() {
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(".v4-nav__item")
  );
  if (!links.length || !("IntersectionObserver" in window)) return;

  const sections = links
    .map((link) => document.querySelector<HTMLElement>(link.hash))
    .filter((el): el is HTMLElement => Boolean(el));
  if (!sections.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((link) => {
          link.dataset.current =
            link.hash === `#${entry.target.id}` ? "true" : "false";
        });
      }
    },
    { rootMargin: "-20% 0px -70% 0px" }
  );

  sections.forEach((section) => io.observe(section));
}

export function initV4() {
  initHero();
  initRail();
  initTilt();
  initMagnets();
  initReveal();
  initGroups();
  initTracks();
  initOdometers();
  initAccordions();
  initBurst();
  initScrollChrome();
  initNavSpy();
}
