/**
 * The questions founders ask before signing. Shared by the FAQ section and the
 * FAQPage structured data, so the two can never drift apart.
 */
export const faqs = [
  {
    q: "What is product hardening?",
    a: "Product hardening is the work that turns a live but unstable product into one you can safely market. We audit the code, fix the bugs that are costing you users, add automated tests around every critical flow, review security, speed up slow pages and APIs, and set up deploys, monitoring and alerts. It usually takes four weeks and starts from $1,999.",
  },
  {
    q: "Can you fix an app that another developer or an AI tool built?",
    a: "Yes, most of our hardening work starts that way. We read the code before we quote, tell you plainly what is worth keeping and what is not, and fix it in place rather than proposing a rewrite you do not need.",
  },
  {
    q: "Do you build iOS and Android apps?",
    a: "Yes. We build cross platform mobile apps in React Native, published to the App Store and Google Play from one codebase, and usually sharing an API with your web product. That keeps the build and the maintenance cost close to a single app.",
  },
  {
    q: "Which technologies do you use?",
    a: "Next.js and React for websites and web apps, React Native for iOS and Android, Node.js and Django on the backend, PostgreSQL for data, and AWS with Docker and CI/CD pipelines for hosting and deployment. For AI features we integrate the Claude, Gemini and ChatGPT APIs.",
  },
  {
    q: "How much does an MVP cost, and how long does it take?",
    a: "MVP development starts from $3,499 and usually takes six to eight weeks to a product real users can sign into. The final price depends on the number of screens, platforms and integrations, which is why we recommend a two week consultation first if you do not yet have a written scope.",
  },
  {
    q: "What happens if one of you gets sick halfway through a build?",
    a: "The other one keeps shipping, a little slower. We both have access to every project and the Friday note records what moved, so nothing lives only in one head. If an absence lasts more than a few days we tell you that week and give you a revised date rather than quietly missing the old one.",
  },
  {
    q: "Who owns the code, and from when?",
    a: "You do, from the moment each milestone is paid. That includes the repository, its history, the deployment configuration and the credentials. We do not hold a licence back and we do not keep a copy running anywhere after handover.",
  },
  {
    q: "What if the scope changes?",
    a: "Changes are quoted before they are built, as a written line item with a price and its effect on the date. We never absorb them silently and then arrive late, and we never start them on a verbal yes in a call.",
  },
  {
    q: "Can you work alongside our existing developer?",
    a: "Yes. It works best when the split is by area rather than by ticket: we take the API and they take the app, or the other way round. Two people sharing one codebase with no boundary means two people rewriting each other's work.",
  },
  {
    q: "How do we pay you?",
    a: "By Wise, Payoneer or a direct SWIFT transfer, in USD, GBP, EUR or AUD. Invoices are issued per milestone with seven day terms. Wise and Payoneer usually clear in one to two working days and SWIFT in three to five.",
  },
  {
    q: "What happens after launch?",
    a: "Thirty days of bug fixes on delivered scope are included. After that you can book a hardening engagement when you need one, or run the product yourself with the runbook we hand over. We do not lock you into a retainer.",
  },
];
