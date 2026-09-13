/**
 * Hero rail.
 *
 * Three positions on one band. Nothing is selected until the visitor picks
 * one, and the page reads completely in that resting state. Selecting writes
 * a hash so the choice is shareable, and records the stage so the contact
 * form can pre-fill its current-state field.
 */

const STAGE_KEY = "proofload:stage";

type Rail = {
  el: HTMLElement;
  segments: HTMLElement[];
  buttons: HTMLButtonElement[];
  stages: string[];
};

function read(): Rail | null {
  const el = document.getElementById("rail");
  if (!el) return null;

  const segments = Array.from(el.querySelectorAll<HTMLElement>(".seg"));
  const buttons = segments.map(
    (seg) => seg.querySelector<HTMLButtonElement>(".seg-hit")!,
  );
  if (segments.length === 0 || buttons.some((b) => !b)) return null;

  return {
    el,
    segments,
    buttons,
    stages: segments.map((seg) => seg.dataset.stage ?? ""),
  };
}

/** `will-change` only for the length of the transition it belongs to. */
function hintTransition(el: HTMLElement, property: string) {
  el.style.willChange = property;
  const clear = () => {
    el.style.willChange = "";
    el.removeEventListener("transitionend", clear);
    el.removeEventListener("transitioncancel", clear);
  };
  el.addEventListener("transitionend", clear);
  el.addEventListener("transitioncancel", clear);
}

function select(rail: Rail, index: number | null, writeHash: boolean) {
  const axis =
    window.matchMedia("(min-width: 768px)").matches
      ? "grid-template-columns"
      : "grid-template-rows";
  hintTransition(rail.el, axis);

  rail.segments.forEach((seg, i) => {
    const on = i === index;
    seg.toggleAttribute("data-on", on);
    rail.buttons[i].setAttribute("aria-pressed", String(on));
    rail.buttons[i].tabIndex = on || (index === null && i === 0) ? 0 : -1;
  });

  if (index === null) {
    rail.el.removeAttribute("data-selected");
  } else {
    rail.el.setAttribute("data-selected", String(index));
  }

  const stage = index === null ? "" : rail.stages[index];

  try {
    if (stage) sessionStorage.setItem(STAGE_KEY, stage);
    else sessionStorage.removeItem(STAGE_KEY);
  } catch {
    /* private mode; the hash still carries the choice */
  }

  if (writeHash) {
    // replaceState rather than assigning location.hash: no scroll jump and no
    // history entry per click.
    const url = stage ? `#${stage}` : window.location.pathname + window.location.search;
    history.replaceState(null, "", url);
  }

  document.dispatchEvent(
    new CustomEvent("proofload:stage", { detail: { stage } }),
  );
}

function moveFocus(rail: Rail, from: number, delta: number) {
  const next = (from + delta + rail.buttons.length) % rail.buttons.length;
  rail.buttons.forEach((b, i) => (b.tabIndex = i === next ? 0 : -1));
  rail.buttons[next].focus();
}

export function initHeroRail() {
  const rail = read();
  if (!rail) return;

  rail.buttons.forEach((button, i) => {
    button.addEventListener("click", () => {
      const already = rail.segments[i].hasAttribute("data-on");
      select(rail, already ? null : i, true);
    });

    button.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          moveFocus(rail, i, 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          moveFocus(rail, i, -1);
          break;
        case "Home":
          event.preventDefault();
          moveFocus(rail, i, -i);
          break;
        case "End":
          event.preventDefault();
          moveFocus(rail, i, rail.buttons.length - 1 - i);
          break;
      }
    });
  });

  const fromHash = () => {
    const stage = window.location.hash.slice(1);
    const index = rail.stages.indexOf(stage);
    if (index !== -1) select(rail, index, false);
  };

  fromHash();
  window.addEventListener("hashchange", fromHash);
}

/** Read by the contact form once section 12 exists. */
export function currentStage(): string {
  try {
    return sessionStorage.getItem(STAGE_KEY) ?? "";
  } catch {
    return "";
  }
}
