// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import solidJs from '@astrojs/solid-js';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://knpw.rs',
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Comic Mono',
      cssVariable: '--font-comic-mono',
    },
  ],
  integrations: [mdx(), sitemap(), solidJs()],
  redirects: {
    '/blog/[...slug]': '/blg/[...slug]',
    '/log': '/lg',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
