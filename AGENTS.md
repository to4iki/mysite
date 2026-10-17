# AI開発ガイド

個人サイトのフロントエンド。
JavaScriptランタイムは Node.js、パッケージマネージャは pnpm、デプロイ先には Cloudflare Workers を利用する。

## 開発環境

- Node の版は `devEngines.runtime`、pnpm の版は `packageManager` に固定する
- Git worktree を作ったあとは `pnpm install` と `pnpm exec vp hooks enable` を実行する

## 技術スタック

- Astro v7: SSG/SSR対応。`dev` / `build` / `preview` は Astro CLI
- Vite+（`vp`）: Vite、Oxlint、Oxfmt、型検査
- Tailwind CSS v4: UI/スタイリング
- Knip: 未使用コード・依存パッケージの検出
- Playwright: E2Eテスト・アクセシビリティチェック
- Lighthouse CI: パフォーマンス・品質計測

## ディレクトリ構造

- `docs/` - ドキュメント一覧
- `e2e/` - E2Eテスト（現在はアクセシビリティテストのみ）
- `public/` - 静的アセット（そのままコピーされる）
- `scripts/r2/` - Cloudflare R2 へのアップロードスクリプトなど
- `src/assets/` - ビルド時に処理・最適化されるアセット
- `src/components/` - 再利用可能なUIコンポーネント
- `src/content/blog/` - Content Collectionsで管理するブログ記事
- `src/layouts/` - ページテンプレート
- `src/lib/` - ページ・コンポーネント間で共有するドメインロジックやヘルパー
- `src/ogp/` - OGP画像の動的生成 (satori + sharp を使ってSVG→PNG変換)
- `src/pages/` - ルーティングとページ（`/blog/tag/[tag]/` でタグ別記事一覧を生成）
- `src/styles/` - グローバルスタイル・プラグイン用スタイル

## 開発コマンド

- `pnpm run dev` - 開発サーバー
- `pnpm run lint` - `vp check`（整形、Oxlint、型検査）
- `pnpm run format` - `vp check --fix`
- `pnpm run knip` - 未使用コード・依存パッケージの検出
- `pnpm run a11y-check` - アクセシビリティチェック (要事前ビルド)

## Design System

- `DESIGN.md` - デザイン制約やツールについて
