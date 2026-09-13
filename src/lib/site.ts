/**
 * Facts that appear in more than one place. Changing the address or the
 * booking link is a one-line edit here.
 */
export const site = {
  name: "Proofload",
  email: "saadhassan817@gmail.com",
  booking: "https://calendly.com/saadhassan817/30min",
  city: "Lahore, Pakistan",
} as const;

export const mailto = `mailto:${site.email}`;
