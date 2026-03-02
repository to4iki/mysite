import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { R2_PREFIX, R2_PUBLIC_URL } from "./constants.ts";

const BLOG_DIR = join(process.cwd(), "src/content/blog");
const MEDIA_PATTERN = /!\[([^\]]*)\]\(\/media\/([^)]+)\)/g;

function parseArgs(args: string[]): { dryRun: boolean } {
  return { dryRun: args.includes("--dry-run") };
}

async function processFile(file: string, dryRun: boolean): Promise<number> {
  const filePath = join(BLOG_DIR, file);
  const content = await readFile(filePath, "utf-8");
  let count = 0;

  const replaced = content.replace(MEDIA_PATTERN, (_match, alt, mediaPath) => {
    const avifPath = mediaPath.replace(extname(mediaPath), ".avif");
    const newUrl = `${R2_PUBLIC_URL}/${R2_PREFIX}/${avifPath}`;
    console.log(`  ${file}: /media/${mediaPath} -> ${newUrl}`);
    count++;
    return `![${alt}](${newUrl})`;
  });

  if (count > 0 && !dryRun) {
    await writeFile(filePath, replaced, "utf-8");
  }

  return count;
}

async function main() {
  const { dryRun } = parseArgs(process.argv.slice(2));

  console.log(`[replace-paths] mode: ${dryRun ? "dry-run" : "replace"}`);

  const files = await readdir(BLOG_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));

  const counts = await Promise.all(
    mdFiles.map((file) => processFile(file, dryRun)),
  );
  const totalReplacements = counts.reduce((sum, n) => sum + n, 0);

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
