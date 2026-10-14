// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // v5 is served at the root now; keep old /v5 links working.
  redirects: {
    '/v5': '/',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
