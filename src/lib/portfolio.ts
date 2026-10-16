/**
 * Portfolio work shown on the home page. Each description says what the
 * screens show and what kind of product it is; nothing here claims a metric
 * or a result the images do not show. Images live in src/assets/portfolio.
 * The first two entries are shown larger.
 */
import gleam from "../assets/portfolio/gleam-dental.jpg";
import seed from "../assets/portfolio/seed.jpg";
import compassion from "../assets/portfolio/compassion-recovery.jpg";
import paya from "../assets/portfolio/paya.jpg";
import banking from "../assets/portfolio/banking.jpg";

export const portfolio = [
  {
    name: "Gleam Dental",
    kind: "Healthcare booking website",
    image: gleam,
    alt: "Gleam Dental website with live appointment openings at two clinic locations",
    body: "Patients book a dentist in under a minute, with live openings at both clinic locations, a same day option for tooth pain, family booking and a waitlist that texts when an earlier slot opens. In English and Spanish.",
    tags: ["Website", "Healthcare", "Online booking"],
  },
  {
    name: "Seed",
    kind: "Youth finance web app",
    image: seed,
    alt: "Seed dashboard showing wallet balance, savings goals, badges and orders",
    body: "A money and activities dashboard for young people: a wallet, savings goals, badges for progress, activities and orders, a monthly story, and an accountant they can ask for help.",
    tags: ["Web app", "Fintech", "Dashboard"],
  },
  {
    name: "Compassion Recovery",
    kind: "Website redesign",
    image: compassion,
    alt: "Compassion Recovery website homepage for mental health and addiction treatment",
    body: "A conversion focused redesign for a mental health and addiction treatment provider: a coverage check up front, insurance partners on the first screen and clear pages for day and evening programmes.",
    tags: ["Website", "Healthcare", "Conversion"],
  },
  {
    name: "Paya",
    kind: "Fintech landing page",
    image: paya,
    alt: "Paya fintech website landing page with phone mockup and feature sections",
    body: "The marketing site for a money app: send, save and pay bills, explained in one screen, with a three step setup guide, customer stories and app store downloads.",
    tags: ["Website", "Fintech", "Landing page"],
  },
  {
    name: "Digital banking",
    kind: "Banking website",
    image: banking,
    alt: "Digital banking website hero with card and balance previews",
    body: "A landing page for a personal banking product, with card and balance previews beside the sign up so the product is understood before the first click.",
    tags: ["Website", "Fintech", "UI and UX"],
  },
];
