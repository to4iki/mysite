// @ts-check

import { createReadStream, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { remarkAlert } from "remark-github-blockquote-alert";
import remarkLinkCard from "remark-link-card-plus";

// vite plugin to serve media/ directory at /media/ path in dev server
function serveMedia() {
  const mediaDir = resolve("media");
  return {
    name: "serve-media",
    apply: "serve",
    configureServer(/** @type {import("vite").ViteDevServer} */ server) {
      if (!existsSync(mediaDir)) return;
      server.middlewares.use("/media", (req, res, next) => {
        const filePath = join(mediaDir, decodeURIComponent(req.url ?? ""));
        createReadStream(filePath)
          .on("error", () => next())
          .pipe(res);
      });
    },
  };
}

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://to4iki.com",
  integrations: [sitemap()],
  adapter: cloudflare({
    imageService: "compile",
    prerenderEnvironment: "node",
  }),
  vite: {
    plugins: [tailwindcss(), serveMedia()],
  },
  markdown: {
    remarkPlugins: [remarkLinkCard, remarkAlert],
  },
});
