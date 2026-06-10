import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Font } from "satori";

type FontConfig = {
  filename: string;
  weight: Font["weight"];
};

const FONT_CONFIGS: FontConfig[] = [
  { filename: "NotoSansJP-Regular.ttf", weight: 400 },
  { filename: "NotoSansJP-Bold.ttf", weight: 700 },
];

const FONT_DIR = join(process.cwd(), "src/assets/font");

// Cache across calls: fonts are static and read once per build, not per OGP image
let fontsPromise: Promise<Font[]> | undefined;

export const loadFonts = (): Promise<Font[]> => {
  fontsPromise ??= Promise.all(
    FONT_CONFIGS.map(async ({ filename, weight }) => ({
      name: "Noto Sans JP",
      data: await readFile(join(FONT_DIR, filename)),
      weight,
    })),
  );
  return fontsPromise;
};
