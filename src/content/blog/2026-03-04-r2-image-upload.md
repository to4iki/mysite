---
title: "ブログの画像管理を Cloudflare R2 に移行した"
description: ""
pubDate: "2026-03-04"
tags: [Cloudflare]
---

スケーラビリティを考えると、画像は専用ストレージに格納しておきたいので Cloudflare R2 を使うことにした。

## R2バケットの作成

Cloudflare R2 ページからバケットを作成[^1]. カスタムドメインを設定しておく。
また後々、スクリプト経由で画像をバケットにアップロードする予定なので、アカウントAPIトークンを発行[^2]し内容を手元に控えておく。

[^1]: [Get started · Cloudflare R2 docs](https://developers.cloudflare.com/r2/get-started/#2-create-a-bucket)

[^2]: [Authentication · Cloudflare R2 docs](https://developers.cloudflare.com/r2/api/tokens/)

## 運用フロー

以下のような作業ステップで進める。

1. ローカルでの画像保持
   - 手元での下書き時には、パス補完を効かせながらプレビューしたいので、所定のディレクトリへ画像を配置
     - astroのビルドプロセスに含まれないよう、src/、public/ 配下ではなく、ルートの `media/{content-type}/` 配下に画像を置く
2. 画像の変換と最適化
   - 画像サイズを調整。またPNGなどから高圧縮なAVIF形式に変換
3. R2へアップロード
4. プレビューをローカル画像からリモート画像へ自動切り替えし、反映を確認

## 実装

実装を簡単に解説する。最初に依存関係はこんな感じで定義している。

```
upload-images.ts (CLI エントリーポイント)
├── image-converter.ts
│   └── types.ts      (ImageEntry, ConvertedImage, UploadOptions)
└── r2-uploader.ts
    ├── const.ts      (R2_PUBLIC_URL)
    └── types.ts      (ConvertedImage, UploadOptions, UploadResult)

replace-paths.ts (CLI エントリーポイント)
└── const.ts      (R2_PUBLIC_URL)
```

### `media/` 配下を静的配信する

開発環境でのみ有効な、ルートに設置した `media/` を `/media/` パスで静的配信するviteプラグインを追加する。

```ts
function serveMedia() {
  const mediaDir = resolve("media");
  return {
    name: "serve-media",
    apply: "serve",
    configureServer(/** @type {import("vite").ViteDevServer} */ server) {
      if (!existsSync(mediaDir)) return;
      server.middlewares.use("/media", (req, res, next) => {
        const filePath = join(mediaDir, decodeURIComponent(req.url ?? ""));
        createReadStream(filePath)
          .on("error", () => next())
          .pipe(res);
      });
    },
  };
}

// astro.config.mjs
export default defineConfig({
  ...
  vite: {
    plugins: [serveMedia()],
  },
  ...
});
```

### 画像圧縮とアップロード

`bun run r2:upload` で実行する。

- `--dry-run`: AVIF変換・R2 アップロードを行わず、何がアップロードされるかをログで確認する用
- `--max-width <px>`: リサイズ上限 (例: --max-width 1200)

#### image-converter.ts

`media/` ディレクトリを再帰走査し、対象画像ファイルを sharp で AVIF 形式に変換する。

[mysite/scripts/r2/image-converter.ts](https://github.com/to4iki/mysite/blob/main/scripts/r2/image-converter.ts)

#### r2-uploader.ts

環境変数を準備しておく。

```bash
# .env
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

`ConvertedImage[]` を受け取り、AWS SDK のS3 互換のAPI経由でR2にアップロードする。
`objectExists(key)` でメタデータのみを取得して存在確認している。アップロード前にこのチェックを挟むことで冪等性を担保し、既存ファイルの上書きせず再実行性を実現する。

```ts
async function objectExists(key: string): Promise<boolean> {
  try {
    // `HeadObject` はボディを取得しないため、`GetObject` より軽量
    await s3Client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}
```

[mysite/scripts/r2/r2-uploader.ts](https://github.com/to4iki/mysite/blob/main/scripts/r2/r2-uploader.ts)

### ローカル画像のPATHを置換する

`bun run r2:replace-paths` で実行する。

- `--dry-run`: 実際のファイル書き換えを行わず、どのパスが何に置換されるかをログで確認する用

`src/content` 以下の `.md` ファイルを再帰走査し、`/media/` で始まるローカル画像パスを R2 の公開 URLに置換する。

```ts
const CONTENT_DIR = join(process.cwd(), "src/content");
const MEDIA_PATTERN = /!\[([^\]]*)\]\(\/media\/([^)]+)\)/g;
```

[mysite/scripts/r2/replace-paths.ts](https://github.com/to4iki/mysite/blob/main/scripts/r2/replace-paths.ts)

## 参考

- [ブログの画像管理をGitHubからCloudflare R2へ移行した \| eiji.page](https://eiji.page/blog/manage-image-to-r2/)
- [Astroでシンプルなサイトを作る](https://slimalized.dev/posts/build-astro-site#r2%E3%81%A7%E3%81%AE%E7%94%BB%E5%83%8F%E7%AE%A1%E7%90%86)
