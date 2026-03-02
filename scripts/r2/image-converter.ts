import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import sharp from "sharp";
import type { ConvertedImage, ImageEntry, UploadOptions } from "./types.ts";

const SUPPORTED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
]);
const MEDIA_DIR = join(process.cwd(), "media");
const R2_PREFIX = "blog";

async function collectEntries(dir: string): Promise<ImageEntry[]> {
  const entries: ImageEntry[] = [];
  const items = await readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      entries.push(...(await collectEntries(fullPath)));
    } else if (SUPPORTED_EXTENSIONS.has(extname(item.name).toLowerCase())) {
      const rel = relative(MEDIA_DIR, fullPath);
      const r2Key = `${R2_PREFIX}/${rel.replace(extname(rel), ".avif")}`;
      entries.push({ relativePath: rel, r2Key, srcPath: fullPath });
    }
  }

  return entries;
}

async function convertOne(
  entry: ImageEntry,
  maxWidth?: number,
): Promise<ConvertedImage> {
  const input = await readFile(entry.srcPath);
  let pipeline = sharp(input);

  if (maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  const buffer = await pipeline.avif({ quality: 75, effort: 4 }).toBuffer();

  return { ...entry, buffer, sizeBytes: buffer.length };
}

export async function convertImages(
  options: Pick<UploadOptions, "maxWidth">,
): Promise<ConvertedImage[]> {
  const dirStat = await stat(MEDIA_DIR).catch(() => null);
  if (!dirStat?.isDirectory()) {
    console.log("[convert] media/ directory not found");
    return [];
  }

  const entries = await collectEntries(MEDIA_DIR);
  if (entries.length === 0) {
    console.log("[convert] no images to convert");
    return [];
  }

  console.log(`[convert] converting ${entries.length} file(s)...`);
  const results: ConvertedImage[] = [];
  for (const entry of entries) {
    const converted = await convertOne(entry, options.maxWidth);
    const kb = (converted.sizeBytes / 1024).toFixed(1);
    console.log(`  ${entry.relativePath} -> ${entry.r2Key} (${kb} KB)`);
    results.push(converted);
  }

  return results;
}
