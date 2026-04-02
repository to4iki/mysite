---
title: "ブログを構築した"
description: ""
pubDate: "2026-02-08"
tags:
  - "blog"
  - "astro"
  - "cloudflare"
---

## モチベーション

最近はブログをあまり書けていなかったので、また書けたら良いなと思い仕組みから構築した。noteやZenn、はてなブログなどプラットフォームによらず書けるものではあるが、自分が構築したシステム上で書けた方が嬉しい。

ちなみに、実務はモバイル中心で、さらに直近はマネジメント寄りでもあるので、Webフロントエンドには興味があり追ってはいるものの、経験で言うと7,8年前から止まっている。（Angular v1を触っていた程度）
なので、AIコーディングエージェントに壁打ちしながら構成を考えた。とはいえ、基本は静的サイトジェネレータとして選定した Astro のブログテンプレート `npm create astro -- --template blog` をベースに微調整を加えた感じではある。

https://github.com/withastro/astro/tree/latest/examples/blog

## 技術スタック

前述の通りで、SSG/SSR用に [Astro](https://astro.build/)を採用した。あまり比較ができないが Next.js / Remix も調べた上で、現状の静的コンテンツ中心のWebサイトにおいては、Markdown を標準で管理（メタデータの型定義など）できたり、アイランド・アーキテクチャによる JavaScript の部分適用が個人ブログサイトにおいては適切かなと思い Astro が最適と判断した。

https://docs.astro.build/ja/concepts/islands/

ホスティング先には当初は GitHub Pages を利用しようと考えていたが、 ちゃんと触れたことがなかったので [Cloudflare Workers](https://developers.cloudflare.com/workers/) を利用することにした。Astro が Cloudflare に買収されたらしく親和性も高いだろうと思っている[^1]。また、Cloudflare Workers に [Static Assets](https://developers.cloudflare.com/workers/static-assets/) という機能が追加されていて、これまで Pages 側の機能だった静的ファイルの配信が Workers に統合されたようである。

[^1]: [静的サイトジェネレータ「Astro」、Cloudflareによる買収を発表 － Publickey](https://www.publickey1.jp/blog/26/astrocloudflare.html)

```json
"assets": {
  "binding": "ASSETS",
  "directory": "./dist"
}
```

スタイリングにはデファクトスタンダードになっている [Tailwind CSS v4](https://tailwindcss.com/) を利用した。マークアップ（HTML）と装飾（CSS）を分離せずにインラインで直接 class に記述するのは SwiftUI/UIKit に慣れ親しんでいる身としては自然だった。大量のクラス名は [VSCode extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) で補完が効くし外れた使い方をしない限りはきっとなんとかなっている。

フォーマッターには [biome](https://biomejs.dev/) を使っている。当初は astro ファイルに対応している prettier と併用しようかなと考えていたが、biome もベータで対応しているようなので、一旦はツールを一元化したく biome のみでいく。

### 実行環境

JavaScript ランタイム & ツールキット には [Bun](https://bun.com/) を採用した。Node、Deno と比較できていないが、今の所特に困っていない。

### 開発環境

ポータブルな環境であるに越したことはないのと、AIコーディングエージェントによる自律的な開発をメインに据えた際に、隔離されていて且つ使い捨てやすいコンテナ環境で開発をしたい気持ちがある。

当初は、[VSCode Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) でエディタ毎管理していたが、コンテナ起動のオーバーヘッド、AIコーディングエージェントを並行で動かす用に git worktree と組み合わせた際に、コンテナにルートの git 環境を適切にマウントする設定に時間かかりそうだったので、開発環境の隔離、再現性の担保といった目的に対しては、OSの仮想化ではなく、ローカル環境のディレクトレベルで隔離するNixラッパーの [Devbox](https://www.jetify.com/devbox) で必要充分であったのでこちらを採用した。Nix は文法が特殊で難しいらしいが、Devbox に関しては設定がシンプルでコマンドも現代的で非常に扱いやすい。

ちなみに、Devbox には `devbox generate dockerfile` という [機能](https://www.jetify.com/docs/devbox/cli-reference/devbox-generate) があるので、Devbox 環境をそのままDev Containers 用の設定に変換することも可能。ランタイムの管理という点では、[mise](https://mise.jdx.dev/) が有名だが、今のところの個人の使い方だと一部のランタイム（Node.jsなど）をグローバルにインストールするために使っている。なので、プロジェクトの依存管理には Devbox を採用することにした。とはいえ、棲み分けはいまだに悩んでいたり、移動時に Devbox の場合ワンテンポディレイが挟まるので今後 mise に倒すかもしれない。

その他で言うと、commit時に markdown を整形して欲しかったので、Git hooks マネージャーに [Lefthook](https://lefthook.dev/) を使っている。

## 更新の仕組み

手元の好きなエディタで Markdown を書いて、GitHub にプッシュ、GitHub Actions 経由で Cloudflare Workers にデプロイするようにした。[Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) という機能で、Cloudflare Workers のダッシュボード経由でGitHubリポジトリと接続しデプロイパイプラインを構築することができるが、非常に簡易的で間にfomartを挟んだりするとなると GitHub Actions の方が柔軟に扱えるので、今回は Actions を利用することにした。

https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/

肝心のコンテンツの編集環境に関しては、ここ1年は Obsidian をメインのノートとして運用しているので、下書きを Obsidian で書くことにした。いつか、Obsidian から直接 publish できるようにしたい。

## 苦労した点のメモ

最後に、苦労した点に関して参考した記事をメモしておく。感謝です。

- ブログ内のカードリンク表示
  - [Markdown内のリンクをカード化するremarkプラグインremark-link-card-plusをリリースした \| okaryo.log](https://blog.okaryo.studio/20250108-release-remark-link-card-plus/)
  - Astro Embed と迷ったが、現状はリンク展開のみで充分なのと、Auto-embed機能があるとはいえ、素のmarkdownファイルにリンクを貼るだけで展開される方が何かと楽かなと思い採用
- 記事毎のOGP画像の生成
  - [Astro + SatoriでブログのOGP画像を自動生成した - @kimulaco/blog](https://blog.kimulaco.dev/article/ogp-img-with-astro-and-satori)
  - [Next.js Conf 2022で最も感動したライブラリ、vercel/satoriについて紹介させてください。 - Commune Engineer Blog](https://tech.commune.co.jp/entry/2023/01/24/113000)
  - Satori をラップしているであろう vercel/og と迷ったが、Cloudflare Workers にデプロイするのと、依存を最低限にしておきたく素の Satori を利用することにした。SVG → PNG 変換には、Astro v5 インストール時にデフォルトで依存に含まれている sharp を使う。
- リポジトリ構成の参考
  - [GitHub - sota1235/sota1235.github.io](https://github.com/sota1235/sota1235.github.io)
