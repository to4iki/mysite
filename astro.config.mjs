// @ts-check

import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { remarkAlert } from "remark-github-blockquote-alert";
import remarkLinkCard from "remark-link-card-plus";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://to4iki.com",
  integrations: [sitemap()],
  adapter: cloudflare({
    imageService: "compile",
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkLinkCard, remarkAlert],
  },
});
