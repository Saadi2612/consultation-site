/**
 * Facts that appear in more than one place. Changing an address, the hours or
 * the booking link is a one-line edit here.
 */
export const site = {
  name: "Proofload",
  email: "mohibijaz9@gmail.com",
  emails: [
    { name: "Mohib", address: "mohibijaz9@gmail.com" },
    { name: "Saad", address: "saadhassan817@gmail.com" },
  ],
  booking: "https://calendly.com/mohibijaz9/30min",
  hours: "9am to 5pm EST",
  base: "Pakistan",
  experience: "7+ years",
  /* Set this to the live domain (https://...) once it exists. It switches on
     the canonical link and absolute Open Graph URLs. */
  url: "",
  /* Only the older /v2 and /v3 builds still print the city. */
  city: "Lahore, Pakistan",
} as const;

export const mailto = `mailto:${site.email}`;

/**
 * Client products we have built or supported. A logo file can be added per
 * brand later (drop it in src/assets/clients and import it here); until then
 * each one is set as a wordmark so nothing is drawn that the brand did not.
 */
export const clients = [
  { name: "Newlista Property" },
  { name: "StickerFury" },
  { name: "Compassion Recovery" },
  { name: "Odycy Health" },
  { name: "Marysia Online Store" },
  { name: "Sweetcorn" },
  { name: "Doctor Jeff" },
  { name: "1stForex" },
  { name: "UnionHealth" },
] as const;
