import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import type { ConvertedImage, UploadOptions, UploadResult } from "./types.ts";

const R2_PUBLIC_URL = "https://media.to4iki.com";

function createS3Client(): S3Client {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Missing R2 env vars (R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)",
    );
  }

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
}

function getBucket(): string {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) {
    throw new Error("Missing R2_BUCKET_NAME env var");
  }
  return bucket;
}

async function objectExists(
  client: S3Client,
  bucket: string,
  key: string,
): Promise<boolean> {
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadOne(
  client: S3Client,
  bucket: string,
  image: ConvertedImage,
  options: UploadOptions,
): Promise<UploadResult> {
  const publicUrl = `${R2_PUBLIC_URL}/${image.r2Key}`;

  if (options.dryRun) {
    console.log(`  [dry-run] ${image.r2Key} -> ${publicUrl}`);
    return { r2Key: image.r2Key, publicUrl, success: true };
  }

  try {
    if (await objectExists(client, bucket, image.r2Key)) {
      console.log(`  [skip] ${image.r2Key} (already exists)`);
      return { r2Key: image.r2Key, publicUrl, success: true };
    }

    await client.send(
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
    return images.map((img) => {
      const publicUrl = `${R2_PUBLIC_URL}/${img.r2Key}`;
      console.log(`  [dry-run] ${img.r2Key} -> ${publicUrl}`);
      return { r2Key: img.r2Key, publicUrl, success: true };
    });
  }

  const client = createS3Client();
  const bucket = getBucket();

  console.log(`[upload] uploading ${images.length} file(s)...`);
  const results: UploadResult[] = [];
  for (const image of images) {
    results.push(await uploadOne(client, bucket, image, options));
  }

  return results;
}
