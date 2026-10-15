/**
 * Portfolio work shown on the home page. Each description says what the
 * screens show and what kind of product it is; nothing here claims a metric
 * or a result the images do not show. Images live in src/assets/portfolio.
 */
import odycy from "../assets/portfolio/odycy.jpg";
import compassion from "../assets/portfolio/compassion-recovery.jpg";
import nimbly from "../assets/portfolio/nimbly-health.jpg";
import paya from "../assets/portfolio/paya.jpg";
import soularia from "../assets/portfolio/soularia.jpg";
import banking from "../assets/portfolio/banking.jpg";

export const portfolio = [
  {
    name: "Odycy Health",
    kind: "Healthcare web platform",
    image: odycy,
    alt: "Odycy Health web app showing healthcare search and a referral and results flow",
    body: "Patients search, compare and book tests, treatments and appointments near them. A referral and results flow lets them upload documents, request a referral online and review results with a care coordinator.",
    tags: ["Web app", "Healthcare", "UI and UX"],
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
    name: "Nimbly Health",
    kind: "iOS and Android app",
    image: nimbly,
    alt: "Nimbly Health patient care app screens for appointments, specialists and clinic search",
    body: "A patient care app for iPhone and Android: book appointments, find specialists, track referrals and find nearby clinics with directions, all from one home screen.",
    tags: ["Mobile app", "Healthcare", "React Native"],
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
    name: "Soularia",
    kind: "Wellness mobile app",
    image: soularia,
    alt: "Soularia mindfulness app screens showing a library, a creation flow and an audio player",
    body: "A mindfulness app for personalised affirmations and audio: a guided creation flow, a personal library and a player with timer, loop and background sound.",
    tags: ["Mobile app", "Wellness", "Audio"],
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
