# CLAUDE.md - AI開発ガイド

個人サイトのフロントエンド。
JavaScriptランタイムとツールキットには Bun、デプロイ先には Cloudflare Workers を利用する。

## 開発環境

- プロジェクトの開発環境の構築には、mise を使う
- Git worktree を利用する際は、作成したディレクトリで、`mise trust` を実行すること

## 技術スタック

- Astro v6: SSG/SSR対応
- Tailwind CSS v4: UI/スタイリング
- biome: リンター及びフォーマッター (astroファイルはexperimentalモード)

## ディレクトリ構造

- `docs/` - ドキュメント一覧
- `public/` - 静的アセット（そのままコピーされる）
- `scripts/r2/` - Cloudflare R2 へのアップロードスクリプトなど
- `src/assets/` - ビルド時に処理・最適化されるアセット
- `src/components/`: - 再利用可能なUIコンポーネント
- `src/content/blog/` - Content Collectionsで管理するブログ記事
- `src/layouts/` - ページテンプレート
- `src/pages/` - ルーティングとページ

## 開発コマンド

- `bun run dev` - 開発サーバー
- `bun run format` - biomeでフォーマット

## Moduler Rules

- `code-style.md` - コードスタイル
