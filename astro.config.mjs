// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://omartinez94.github.io',
  base: '/kalaa-fe',
  vite: {
    plugins: [tailwindcss()]
  }
});