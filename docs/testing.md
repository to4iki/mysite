# テスト

## アクセシビリティチェック

[Playwright](https://playwright.dev/) + [axe-core](https://github.com/dequelabs/axe-core) を使用し、全ページの WCAG 2.1 AA 準拠を検証する。

### セットアップ

Playwright ブラウザ (Chromium) のインストール:

```bash
bunx playwright install chromium
```

### テスト実行

```bash
# 事前にビルドが必要
bun run build

# アクセシビリティチェック
bun run a11y-check
```

### テスト構成

テストファイルは `e2e/` ディレクトリに配置:

| ファイル       | 対象                                     |
| -------------- | ---------------------------------------- |
| `a11y.spec.ts` | axe-core による WCAG 2.1 AA 準拠チェック |

### 設計方針

- ビルド済みの静的ファイルに対してテスト (`bun run preview`) し、本番同等の環境を検証する
- ブラウザは Chromium のみ（CI 高速化のため）
- pre-commit hook には含めない（ビルド必須で遅いため、CI でのみ実行）
