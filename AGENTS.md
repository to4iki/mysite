# AI開発ガイド

個人サイトのフロントエンド。
JavaScriptランタイムとツールキットには Bun、デプロイ先には Cloudflare Workers を利用する。

## 開発環境

- プロジェクトの開発環境の構築には、mise を使う
- Git worktree を利用する際は、作成したディレクトリで、`mise trust` を実行すること

## 技術スタック

- Astro v6: SSG/SSR対応
- Tailwind CSS v4: UI/スタイリング
- biome: リンター及びフォーマッター (astroファイルはexperimentalモード)
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

- `bun run dev` - 開発サーバー
- `bun run format` - biomeでフォーマット
- `bun run knip` - 未使用コード・依存パッケージの検出
- `bun run a11y-check` - アクセシビリティチェック (要事前ビルド)

## Modular Rules

- `code-style.md` - コードスタイル

## Design System

- `DESIGN.md` - デザイン制約やツールについて

## Cursor Cloud specific instructions

静的サイト (Astro v6 + Bun) で、起動が必要なバックエンドサービスは無い。依存は起動時の update script で復元済み。

- ツールチェーンは `mise` 管理 (`bun`, `lefthook`)。`mise` は `~/.local/bin` にあり、対話シェルでは `~/.bashrc` 経由で有効化される。非対話/スクリプト実行で `bun` が見つからない場合は `mise exec -- <cmd>` を使う。
- 開発サーバー: `bun run dev`（ポート 4321）。dev 時は Cloudflare アダプタを無効化して `output: static` で動く (`astro.config.mjs` 参照)。
- a11y テスト (`bun run a11y-check`) は事前に `bun run build` が必須。Playwright は `bun run preview`（ビルド済み `dist`）を起動して検証する。Chromium は導入済み。
- コマンドは `package.json` の scripts を参照（`lint` = biome, `knip`, `build`, `a11y-check` 等）。
