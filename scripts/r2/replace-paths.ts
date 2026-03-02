import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const BLOG_DIR = join(process.cwd(), "src/content/blog");
const MEDIA_PATTERN = /!\[([^\]]*)\]\(\/media\/([^)]+)\)/g;
const R2_PREFIX = "blog";
const R2_PUBLIC_URL = "https://media.to4iki.com";

function parseArgs(args: string[]): { dryRun: boolean } {
  return { dryRun: args.includes("--dry-run") };
}

function replaceMediaPaths(content: string): string {
  return content.replace(MEDIA_PATTERN, (_match, alt, mediaPath) => {
    const avifPath = mediaPath.replace(extname(mediaPath), ".avif");
    return `![${alt}](${R2_PUBLIC_URL}/${R2_PREFIX}/${avifPath})`;
  });
}

async function main() {
  const { dryRun } = parseArgs(process.argv.slice(2));

  console.log(`[replace-paths] mode: ${dryRun ? "dry-run" : "replace"}`);

  const files = await readdir(BLOG_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));
  let totalReplacements = 0;

  for (const file of mdFiles) {
    const filePath = join(BLOG_DIR, file);
    const content = await readFile(filePath, "utf-8");
    const replaced = replaceMediaPaths(content);

    if (content === replaced) continue;

    const matches = content.matchAll(MEDIA_PATTERN);
    for (const match of matches) {
      const avifPath = match[2].replace(extname(match[2]), ".avif");
      console.log(
        `  ${file}: /media/${match[2]} -> ${R2_PUBLIC_URL}/${R2_PREFIX}/${avifPath}`,
      );
      totalReplacements++;
    }

    if (!dryRun) {
      await writeFile(filePath, replaced, "utf-8");
    }
  }

  if (totalReplacements === 0) {
    console.log("[replace-paths] no paths to replace");
  } else {
    console.log(
      `[replace-paths] ${totalReplacements} path(s) ${dryRun ? "to be replaced (dry-run)" : "replaced"}`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
