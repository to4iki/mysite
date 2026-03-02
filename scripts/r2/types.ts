export type ImageEntry = {
  /** Relative path from media/ (e.g. "slug/hero.jpg") */
  relativePath: string;
  /** R2 object key (e.g. "blog/slug/hero.avif") */
  r2Key: string;
  /** Absolute path to the source file */
  srcPath: string;
};

export type ConvertedImage = ImageEntry & {
  buffer: Buffer;
  sizeBytes: number;
};

export type UploadResult = {
  r2Key: string;
  publicUrl: string;
  success: boolean;
  error?: string;
};

export type UploadOptions = {
  dryRun: boolean;
  maxWidth?: number;
};
