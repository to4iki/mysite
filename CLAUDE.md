# CLAUDE.md - AI開発ガイド

個人サイトのフロントエンド。
JavaScriptランタイムとツールキットには Bun、デプロイ先には Cloudflare Workers を利用する。

## 開発環境

プロジェクトの開発環境の構築には、mise を使う。

## セットアップ

```bash
mise install
bun install
lefthook install
```

## 技術スタック

- Astro v5: SSG/SSR対応
- Tailwind CSS v4: UI/スタイリング
- biome: リンター及びフォーマッター (astroファイルはexperimentalモード)

## ディレクトリ構造

- `public/` - 静的アセット（そのままコピーされる）
- `src/assets/` - ビルド時に処理・最適化されるアセット
- `src/components/`: - 再利用可能なUIコンポーネント
- `src/content/blog/` - Content Collectionsで管理するブログ記事
- `src/layouts` - ページテンプレート
- `src/pages` - ルーティングとページ

## 開発コマンド

- `bun run dev` - 開発サーバー
- `bun run format` - biomeでフォーマット

## Moduler Rules

- `code-style.md` - コードスタイル
