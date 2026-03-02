import { convertImages } from "./image-converter.ts";
import { uploadImages } from "./r2-uploader.ts";
import type { UploadOptions } from "./types.ts";

function parseArgs(args: string[]): UploadOptions {
  const dryRun = args.includes("--dry-run");
  let maxWidth: number | undefined;

  const maxWidthIdx = args.indexOf("--max-width");
  if (maxWidthIdx !== -1 && args[maxWidthIdx + 1]) {
    maxWidth = Number.parseInt(args[maxWidthIdx + 1], 10);
  }

  return { dryRun, maxWidth };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  console.log(
    `[r2-upload] mode: ${options.dryRun ? "dry-run" : "upload"}${options.maxWidth ? `, maxWidth: ${options.maxWidth}px` : ""}`,
  );

  const converted = await convertImages({ maxWidth: options.maxWidth });
  if (converted.length === 0) return;

  const results = await uploadImages(converted, options);

  const succeeded = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(
    `[r2-upload] done: succeeded=${succeeded.length}, failed=${failed.length}`,
  );

  if (failed.length > 0) {
    for (const f of failed) {
      console.error(`  FAILED: ${f.r2Key} - ${f.error}`);
    }
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
