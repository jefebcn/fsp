// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL || 'https://www.fsp.sm',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { format: 'directory' },
});
