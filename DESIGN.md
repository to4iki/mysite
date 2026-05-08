---
version: alpha
name: to4iki mysite
description: Minimal, text-first personal site built with Astro and Tailwind CSS.
colors:
  primary: "#007a9e"
  foreground: "#113340"
  background: "#ffffff"
  inline-code-background: "#e8f0f2"
  divider: "#88999f"
typography:
  display:
    fontFamily: "system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.1
  heading-1:
    fontFamily: "system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.2
  heading-2:
    fontFamily: "system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.25
  heading-3:
    fontFamily: "system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
  body-lg:
    fontFamily: "system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.625
  body-md:
    fontFamily: "system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  body-date:
    fontFamily: "system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.5
  body-sm:
    fontFamily: "system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section-sm: "32px"
  section-md: "48px"
  container-x: "24px"
  container-x-mobile: "16px"
  content-max-width: "768px"
  biography-inset: "64px"
rounded:
  none: "0px"
  md: "6px"
  xl: "12px"
  full: "9999px"
components:
  text-link:
    textColor: "{colors.foreground}"
  text-link-hover:
    textColor: "{colors.primary}"
  nav-link:
    textColor: "{colors.foreground}"
    typography: "{typography.body-lg}"
  nav-link-active:
    textColor: "{colors.primary}"
    typography: "{typography.body-lg}"
  tag:
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "4px 8px"
  icon-button:
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    size: "40px"
  link-card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
  list-item:
    textColor: "{colors.foreground}"
  divider:
    backgroundColor: "{colors.divider}"
    height: "1px"
  inline-code:
    backgroundColor: "{colors.inline-code-background}"
    textColor: "{colors.foreground}"
  ogp-image:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    size: "1200px 630px"
---

# Design System

## Overview

ミニマルでクリーンな個人サイト。装飾を最小限に抑え、テキストコンテンツを主役にする。余白を広くとり、読みやすさを優先した静的なデザインにする。ライトテーマのみで、ダークモードは使用しない。

- キーワードはミニマル、クリーン、ライト、コンテンツファースト、静的
- 単一カラムの中央揃え。影、グラデーション、アニメーションは使わず、色遷移だけを許可する
- 言語は日本語（`lang="ja"`）
- ゼロ JS がデフォルト。インタラクションは vanilla JS の `<script>` で最小限に実装する

## Colors

色の正規値は YAML frontmatter の `colors` に定義する。実装側のトークン定義は `src/styles/global.css` の `@theme` ブロックに置く。

- **Primary** (`#007a9e`): リンク、アクティブ状態のナビゲーション、タグのテキスト色、ホバー時のアイコンボーダーに使うアクセントカラー
- **Foreground** (`#113340`): 本文テキスト、見出し、アイコンのデフォルト色。黒より柔らかく、落ち着いた印象にする
- **Background** (`#ffffff`): ページ背景。サーフェスの階層分けはせず、白一色で統一する
- **Inline Code Background** (`#e8f0f2`): 本文中のコード片を控えめに区別する
- **Divider** (`#88999f`): `foreground` を半透明にした区切り色。CSS では `border-divider` として `color-mix(in srgb, var(--color-foreground) 50%, transparent)` を使う

現時点では Danger / Warning / Success の定義なし。必要になった場合に追加する。

## Typography

フォントファミリーは `system-ui, sans-serif`。OS 標準のゴシック体へフォールバックする。サイズとウェイトの正規値は YAML frontmatter の `typography` に定義する。

- `display` はページ見出し、`heading-*` は本文内見出し、`body-lg` はブログ一覧タイトルとナビリンクに使う
- 本文は `body-md` と `leading-relaxed`、日付は `body-date` と `tabular-nums`、タグや補足は `body-sm` を使う
- 字間はナビリンクのみ `tracking-wide` を使い、それ以外は normal にする
- OGP 画像生成のみ `Noto Sans JP` を使う

## Layout

全ページ単一カラムレイアウト。コンテンツの最大幅は `768px`（`max-w-3xl`）で中央揃えにする。水平パディングは `px-6`、モバイルでは `px-4` を使う。

- Tailwind v4 のデフォルトスペーシングを基本にし、小余白は `gap-2`、ナビ間隔は `gap-6`、セクション間は `mb-8` から `mb-12` を使う
- BIOGRAPHY ページはセクションを `flex flex-col gap-y-8` で縦積みし、`px-16` で内側の余白を追加する
- ブレークポイントは `md: 768px`。デフォルトはデスクトップ向け、モバイル向けは `max-md:` で上書きする
- 横並び要素はモバイルで縦積みに切り替える（`max-md:flex-col`）
- テキストサイズはモバイルで 1 段階小さくする（例: `text-5xl` から `max-md:text-4xl`）
- タッチターゲットはハンバーガーメニュー `w-8 h-8`、アイコンボタン `h-10 w-10` を基準にする

## Elevation & Depth

影やエレベーションは使わない。階層表現は余白、文字サイズ、色、ボーダーで作る。外部リンクカードや一覧行もフラットなまま、薄いボーダーとホバー時の色変化で状態を表す。

## Shapes

基本の形状はフラットで控えめにする。タグとアイコンボタンは完全な丸角、外部リンクカードは `rounded-xl` を使う。本文やページセクションを装飾的なカードとして囲わない。

## Components

- Links: 下線なし。200ms の色遷移で hover 時に Primary へ変化。ナビリンクはセミボールド、`tracking-wide`、active は Primary
- Tags: 透明背景、Primary のテキスト、`border-primary/30`、完全な丸角、コンパクトな padding。`flex-wrap` で折り返す
- Cards: 外部リンクカードのみカード扱い。固定高さ、`rounded-xl`、薄いボーダー、hover 時にボーダーと背景を少し強める
- Icon buttons: 40x40px の円形、`border-foreground/15`。hover 時にボーダーとアイコン色を Primary にする
- List items: 下ボーダーで区切る。desktop は日付固定幅 + タイトル、mobile は縦積み
- Navigation: desktop は右寄せリンク + RSS アイコン、mobile はハンバーガードロワー。影やエレベーションは使わない
- OGP image: 1200x630、Background、上部 8px の Primary bar。タイトルは Foreground の bold 中央揃え（52/44/36px）、サイト名は Primary で右下 24px、フォントは `Noto Sans JP`

## Do's and Don'ts

### Do

- Tailwind CSS のユーティリティクラスで直接スタイリングする
- 定義済みのカラートークン（`foreground`, `primary`, `divider` 等）を使う
- `prose` クラス（`@tailwindcss/typography`）をブログ記事本文に使う
- ホバーエフェクトは `transition-colors duration-200` で色変化のみにする
- リンクは下線なし (`no-underline`) にする

### Don't

- ダークモードのスタイルを追加しない
- 影 (`box-shadow`)、グラデーション、アニメーション（色遷移以外）を使わない
- CSS-in-JS やランタイム CSS ライブラリを使わない
- `client:*` ディレクティブでクライアントサイドフレームワークを読み込まない
- インラインスタイル (`style` 属性) は使わない（OGP テンプレートを除く）
