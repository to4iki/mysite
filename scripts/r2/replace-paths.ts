import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { R2_PUBLIC_URL } from "./const.ts";

const CONTENT_DIR = join(process.cwd(), "src/content");
const MEDIA_PATTERN = /!\[([^\]]*)\]\(\/media\/([^)]+)\)/g;

function parseArgs(args: string[]): { dryRun: boolean } {
  return { dryRun: args.includes("--dry-run") };
}

async function collectMdFiles(dir: string): Promise<string[]> {
  const items = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const item of items) {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...(await collectMdFiles(fullPath)));
    } else if (item.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

async function processFile(filePath: string, dryRun: boolean): Promise<number> {
  const content = await readFile(filePath, "utf-8");
  const displayPath = relative(CONTENT_DIR, filePath);
  let count = 0;

  const replaced = content.replace(MEDIA_PATTERN, (_match, alt, mediaPath) => {
    const avifPath = mediaPath.replace(extname(mediaPath), ".avif");
    const newUrl = `${R2_PUBLIC_URL}/${avifPath}`;
    console.log(`  ${displayPath}: /media/${mediaPath} -> ${newUrl}`);
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

  const mdFiles = await collectMdFiles(CONTENT_DIR);

  const counts = await Promise.all(
    mdFiles.map((filePath) => processFile(filePath, dryRun)),
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
