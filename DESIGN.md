# Design System

## 1. Visual Theme & Atmosphere

ミニマルでクリーンな個人サイト。装飾を最小限に抑え、テキストコンテンツを主役にする。余白を広くとり、低密度で読みやすさを優先した静的なデザイン。ライトテーマのみで、ダークモードは使用しない。

**キーワード**: ミニマル、クリーン、ライト、コンテンツファースト、静的

**主な特徴**:

- 単一カラム（最大幅 720px）の中央揃えレイアウト
- 影やグラデーション、アニメーション（色遷移以外）を使わないフラットデザイン
- 言語は日本語（`lang="ja"`）
- ゼロ JS がデフォルト。インタラクションは vanilla JS の `<script>` で最小限に実装する

## 2. Color Palette & Roles

### Primary

- **Teal Accent** (`#007a9e`): リンク、アクセントカラー。アクティブ状態のナビゲーション、タグのテキスト色、ホバー時のアイコンボーダーに使用

### Text & Neutral

- **Deep Teal-Dark** (`#113340`): 本文テキスト、アイコンのデフォルト色。黒より柔らかく、落ち着いた印象を与える
- **Muted Gray** (`text-muted`, Tailwind v4 デフォルト): 補助テキスト、非アクティブなナビリンク。主テキストに対してトーンを落とす
- **Soft Border** (`border-border`, Tailwind v4 デフォルト): 区切り線、モバイルナビの区切り

### Surface

- **Pure White** (`#ffffff`): ページ背景。サーフェスの階層分けはせず、白一色で統一する
- **Ice Blue** (`#e8f0f2`): インラインコードの背景色。本文中のコード片を控えめに区別する

### Semantic

現時点では Danger / Warning / Success の定義なし。必要になった場合に追加する。

### カラートークン定義場所

`src/styles/global.css` の `@theme` ブロックで定義。新しい色が必要な場合はここに追加する。

## 3. Typography Rules

**フォントファミリー**: `system-ui, sans-serif`（OS 標準のゴシック体にフォールバック）。OGP 画像生成のみ `Noto Sans JP` を使用。

### 文字サイズ・ウェイト階層

| Role       | Size                | Weight  | 備考                   |
| ---------- | ------------------- | ------- | ---------------------- |
| Display    | text-5xl (3rem)     | 700     | ページ見出し。中央揃え |
| Heading 1  | text-4xl (2.25rem)  | 700     | メイン見出し（名前等） |
| Heading 2  | text-3xl (1.875rem) | 700     | ブログ記事タイトル     |
| Heading 3  | text-2xl (1.5rem)   | 700     | セクション見出し       |
| Body Large | text-xl (1.25rem)   | 600     | ブログ一覧のタイトル   |
| Body       | text-lg (1.125rem)  | 600-700 | ナビリンク、日付       |
| Body Small | text-sm (0.875rem)  | 400     | タグ、補足テキスト     |

### 行間・字間

- **本文の行間**: `leading-relaxed`（1.625）でゆったりした読み心地
- **見出しの行間**: Tailwind デフォルト
- **字間**: ナビリンクのみ `tracking-wide` で上品な広がり。それ以外は normal
- **日付の数字**: `tabular-nums` で等幅数字による桁揃え

## 4. Component Stylings

### Links

- **テキストリンク**: 下線なし。200ms の色遷移でホバー時に Teal Accent (`#007a9e`) へ変化
- **ナビリンク**: セミボールド、やや広い字間。アクティブ状態は Teal Accent、非アクティブは Muted Gray

### Tags（ピル型ラベル）

- 透明背景に Teal Accent のテキストと薄いボーダー（`border-primary/30`）
- 完全な丸角（pill-shaped）、コンパクトなパディング
- `flex-wrap` で折り返し配置

### Cards（外部リンクカード）

- 固定高さ、やや大きな丸角（`rounded-xl`）
- 薄いグレーボーダー。ホバー時にボーダーが濃くなり背景が淡いグレーに変化
- 左側にテキスト（タイトル + 説明 + URL）、右側にサムネイル画像

### Icon Buttons（円形アイコン）

- 40x40px の円形、極めて薄いボーダー（`border-foreground/15`）
- ホバー時にボーダーとアイコン色が Teal Accent へ 200ms で遷移

### List Items（一覧の行要素）

- 下ボーダーで区切るフラットなリスト
- デスクトップ: 日付（左固定幅）とタイトル（右）を横並び
- モバイル: 縦積みに切り替え

### Navigation

- デスクトップ: 右寄せの横並びリンク + RSS アイコン
- モバイル: ハンバーガーメニューで開閉するドロワー
- 影やエレベーションなし。フラットなまま

## 5. Layout Principles

### Container

- **最大幅**: 720px（`--max-width-prose`）で中央揃え
- **水平パディング**: `px-6`（モバイル: `px-4`）

### Spacing

Tailwind v4 のデフォルトスペーシングを使用。

| 用途                     | Value             |
| ------------------------ | ----------------- |
| コンポーネント間の小余白 | `gap-2` (8px)     |
| ナビリンク間隔           | `gap-6` (24px)    |
| セクション間余白         | `mb-8` ～ `mb-12` |

### Grid

- 基本は単一カラムレイアウト
- BIOGRAPHY ページのみ 3 カラムグリッド（モバイルは 1 カラム）

### Responsive

- **ブレークポイント**: `md: 768px`（Tailwind v4 デフォルト）
- **デスクトップファースト**: デフォルトスタイルがデスクトップ向け。モバイル向けは `max-md:` で上書き
- 横並び要素はモバイルで縦積みに切り替え（`max-md:flex-col`）
- テキストサイズはモバイルで 1 段階小さく（例: `text-5xl` → `max-md:text-4xl`）
- タッチターゲット: ハンバーガーメニュー `w-8 h-8`、アイコンボタン `h-10 w-10`

## 6. Design System Notes

### Do（推奨）

- Tailwind CSS のユーティリティクラスで直接スタイリングする
- 定義済みのカラートークン（`foreground`, `primary`, `muted` 等）を使う
- `prose` クラス（`@tailwindcss/typography`）をブログ記事本文に使う
- ホバーエフェクトは `transition-colors duration-200` で色変化のみにする
- リンクは下線なし (`no-underline`) にする

### Don't（禁止）

- ダークモードのスタイルを追加しない
- 影 (`box-shadow`)、グラデーション、アニメーション（色遷移以外）を使わない
- CSS-in-JS やランタイム CSS ライブラリを使わない
- `client:*` ディレクティブでクライアントサイドフレームワークを読み込まない
- インラインスタイル (`style` 属性) は使わない（OGP テンプレートを除く）

### クイックリファレンス

```
Primary Color: #007a9e (Teal Accent)
Text Color: #113340 (Deep Teal-Dark)
Background: #ffffff (Pure White)
Inline Code BG: #e8f0f2 (Ice Blue)
Font: system-ui, sans-serif
Body Line Height: leading-relaxed (1.625)
Max Width: 720px (--max-width-prose)
Shadows: なし
```

### OGP 画像仕様

```
Size: 1200x630
Background: #ffffff
Accent Bar: #007a9e, height 8px (上部)
Title: #113340, bold, center, 動的サイズ (52/44/36px)
Site Name: #007a9e, right-bottom, 24px
Font: Noto Sans JP
```
