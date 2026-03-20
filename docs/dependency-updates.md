# ライブラリ自動更新

依存パッケージの更新PRを自動作成するために [Dependabot](https://docs.github.com/en/code-security/dependabot) を利用している。

## 設定ファイル

`.github/dependabot.yml`

## 更新スケジュール

- 毎週月曜（JST）に更新チェック
- npm パッケージと GitHub Actions の両方が対象

## グルーピング

PRの氾濫を防ぐため、関連パッケージをグループ化している。

| グループ         | 対象                            |
| ---------------- | ------------------------------- |
| astro            | `astro`, `@astrojs/*`           |
| tailwind         | `tailwindcss`, `@tailwindcss/*` |
| dev-dependencies | 全ての devDependencies          |

## なぜ Dependabot か

Renovate も検討したが、以下の理由で Dependabot を採用した。

- **GitHub ネイティブ**: 外部Appのインストールが不要で、YAML 1ファイルの追加だけで動作する
- **十分な機能**: 依存数が少ない個人サイトではグルーピングとスケジュール設定があれば十分で、Renovate の高度な機能（正規表現マネージャー、automerge の細かな制御等）は不要
- **メンテナンスコストが低い**: GitHub が管理するため、Bot自体の更新やトークン管理が不要
