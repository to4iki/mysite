import { defineConfig } from "vite-plus";

const ignored = [
  "dist",
  ".wrangler",
  ".astro",
  ".cursor",
  "src/content",
  "DESIGN.md",
  "pnpm-lock.yaml",
];

export default defineConfig({
  fmt: {
    printWidth: 80,
    astro: true,
    ignorePatterns: ignored,
  },
  lint: {
    ignorePatterns: ignored,
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  staged: {
    "*": "vp check --fix",
  },
});
