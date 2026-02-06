import satori from "satori";
import sharp from "sharp";
import { loadFonts } from "./font";
import { createOgpTemplate, type OgpTemplateData } from "./template";

export const generateOgpImage = async (
  data: OgpTemplateData,
): Promise<Buffer> => {
  const fonts = await loadFonts();
  const template = createOgpTemplate(data);
  const svg = await satori(template, { width: 1200, height: 630, fonts });
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return png;
};
