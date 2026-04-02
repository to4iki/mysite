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
- Playwright: E2Eテスト・アクセシビリティチェック
- Lighthouse CI: パフォーマンス・品質計測

## ディレクトリ構造

- `docs/` - ドキュメント一覧
- `e2e/` - E2Eテスト（現在はアクセシビリティテストのみ）
- `public/` - 静的アセット（そのままコピーされる）
- `scripts/r2/` - Cloudflare R2 へのアップロードスクリプトなど
- `src/assets/` - ビルド時に処理・最適化されるアセット
- `src/components/`: - 再利用可能なUIコンポーネント
- `src/content/blog/` - Content Collectionsで管理するブログ記事
- `src/layouts/` - ページテンプレート
- `src/ogp/` - OGP画像の動的生成 (satori + sharp を使ってSVG→PNG変換)
- `src/pages/` - ルーティングとページ（`/blog/tag/[tag]/` でタグ別記事一覧を生成）
- `src/styles/` - グローバルスタイル・プラグイン用スタイル

## 開発コマンド

- `bun run dev` - 開発サーバー
- `bun run format` - biomeでフォーマット
- `bun run a11y-check` - アクセシビリティチェック (要事前ビルド)

## Moduler Rules

- `code-style.md` - コードスタイル
