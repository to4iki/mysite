---
paths:
  - "src/**/*.{ts,astro}"
---

# コードスタイルルール

## TypeScript

- 型定義は明示的に書く（`any` は使わない）
- `interface` より `type` を優先
- 関数は arrow function で統一

## Astro

### パフォーマンス

- ゼロ JS をデフォルトとし、必要な場合のみ `client:*` ディレクティブを使う
- `client:idle` - 優先度低のインタラクティブ要素
- `client:visible` - ビューポート内に入った時のみロード
- 静的に生成できるものは静的に保つ

### スタイル

- Astro のスコープ付きスタイルを活用する
- カスタム配色のTailwind CSSを活用する
- グローバルスタイルは `src/styles/` に配置
