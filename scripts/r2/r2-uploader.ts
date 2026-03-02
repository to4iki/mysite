import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { R2_PUBLIC_URL } from "./const.ts";
import type { ConvertedImage, UploadOptions, UploadResult } from "./types.ts";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});
const bucket = process.env.R2_BUCKET_NAME ?? "";

async function objectExists(key: string): Promise<boolean> {
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadOne(
  image: ConvertedImage,
  options: UploadOptions,
): Promise<UploadResult> {
  const publicUrl = `${R2_PUBLIC_URL}/${image.r2Key}`;

  if (options.dryRun) {
    console.log(`  [dry-run] ${image.r2Key} -> ${publicUrl}`);
    return { r2Key: image.r2Key, publicUrl, success: true };
  }

  try {
    if (await objectExists(image.r2Key)) {
      console.log(`  [skip] ${image.r2Key} (already exists)`);
      return { r2Key: image.r2Key, publicUrl, success: true };
    }

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: image.r2Key,
        Body: image.buffer,
        ContentType: "image/avif",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    console.log(`  [upload] ${image.r2Key} -> ${publicUrl}`);
    return { r2Key: image.r2Key, publicUrl, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  [error] ${image.r2Key}: ${message}`);
    return { r2Key: image.r2Key, publicUrl, success: false, error: message };
  }
}

export async function uploadImages(
  images: ConvertedImage[],
  options: UploadOptions,
): Promise<UploadResult[]> {
  if (options.dryRun) {
    console.log("[upload] dry-run mode");
  } else {
    console.log(`[upload] uploading ${images.length} file(s)...`);
  }

  return Promise.all(images.map((image) => uploadOne(image, options)));
}
