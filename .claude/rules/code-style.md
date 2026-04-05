---
paths:
  - "src/**/*.{ts,astro}"
---

# コードスタイルルール

## TypeScript

- 型定義は `type` で書く（`interface` は使わない）
- `any` 禁止。`unknown` を使い、型を絞り込む
- 関数は arrow function で統一（`export const fn = () => {}` の形式）
- 型の import は `import type` を使う（`.ts` ファイルのみ。Astro ファイルでは biome が `useImportType` を off にしている）
- フォーマットは biome に任せる（インデント: スペース2、クォート: ダブル）

## Astro

### コンポーネント設計

- コンポーネントは PascalCase で命名し `src/components/` に配置
- アイコンコンポーネントは `src/components/icons/` に配置
- Props の型は frontmatter 内で `type Props = ...` として定義する
- ページコンポーネントは `src/pages/` 配下に `index.astro` として配置

### パフォーマンス

- ゼロ JS がデフォルト。`client:*` ディレクティブはやむを得ない場合のみ使う
- ページ単位の `<script>` タグでの vanilla JS を優先する（フレームワーク不要）
- 静的に生成できるものは静的に保つ（SSG優先）

### スタイル

- Tailwind CSS のユーティリティクラスを使う（カスタム配色トークン: `text-muted`, `text-foreground`, `border-border` 等）
- Astro のスコープ付き `<style>` はTailwindで表現しにくい場合のみ使う
- グローバルスタイル・外部プラグイン用CSSは `src/styles/` に配置
