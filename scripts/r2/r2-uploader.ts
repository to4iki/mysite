import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { R2_PUBLIC_URL } from "./const.ts";
import type { ConvertedImage, UploadOptions, UploadResult } from "./types.ts";

type R2Context = {
  client: S3Client;
  bucket: string;
};

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`missing required environment variable: ${name}`);
  }
  return value;
};

const createR2Context = (): R2Context => ({
  client: new S3Client({
    region: "auto",
    endpoint: `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
  }),
  bucket: requireEnv("R2_BUCKET_NAME"),
});

const objectExists = async (r2: R2Context, key: string): Promise<boolean> => {
  try {
    await r2.client.send(
      new HeadObjectCommand({ Bucket: r2.bucket, Key: key }),
    );
    return true;
  } catch (error) {
    // Only "object not found" means absent; auth/network errors must surface
    if (error instanceof Error && error.name === "NotFound") {
      return false;
    }
    throw error;
  }
};

const uploadOne = async (
  r2: R2Context,
  image: ConvertedImage,
): Promise<UploadResult> => {
  const publicUrl = `${R2_PUBLIC_URL}/${image.r2Key}`;

  try {
    if (await objectExists(r2, image.r2Key)) {
      console.log(`  [skip] ${image.r2Key} (already exists)`);
      return { r2Key: image.r2Key, publicUrl, success: true };
    }

    await r2.client.send(
      new PutObjectCommand({
        Bucket: r2.bucket,
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
};

export const uploadImages = async (
  images: ConvertedImage[],
  options: UploadOptions,
): Promise<UploadResult[]> => {
  if (options.dryRun) {
    console.log("[upload] dry-run mode");
    return images.map((image) => {
      const publicUrl = `${R2_PUBLIC_URL}/${image.r2Key}`;
      console.log(`  [dry-run] ${image.r2Key} -> ${publicUrl}`);
      return { r2Key: image.r2Key, publicUrl, success: true };
    });
  }

  console.log(`[upload] uploading ${images.length} file(s)...`);
  const r2 = createR2Context();
  return Promise.all(images.map((image) => uploadOne(r2, image)));
};
