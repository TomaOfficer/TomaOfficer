import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://www.thomasofficer.com',
  output: 'static',
  build: { format: 'file' },
  trailingSlash: 'never',
  compressHTML: true,
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404') })],
});
