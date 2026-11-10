// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://herculex.app',
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404'),
    }),
  ],
});
