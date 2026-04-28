---
title: "Zennの記事をGitHubリポジトリで管理する"
description: "Zenn記事をGitHub連携でローカル執筆できる環境を整え、textlintとAIレビューを組み合わせた執筆フローを紹介する。"
pubDate: "2026-04-01"
tags:
  - "zenn"
---

zenn.dev の個人の記事に関して、ローカルの好きなエディタで書きたいので GitHub と連携するようにした。

https://github.com/to4iki/zenn-articles

## 連携

以下の公式のガイドに従い、適当なリポジトリを作成し、設定画面からリポジトリを接続するだけで、指定したブランチへの push をトリガーに記事がデプロイされる。

https://zenn.dev/zenn/articles/connect-to-github

セットアップに関しては、zenn-cli の `zenn init` コマンドでテンプレートとなるディレクトリを作成する。
例えば、記事であれば `./articles` 配下に作成したmdファイルがデプロイ対象となる。

https://zenn.dev/zenn/articles/zenn-cli-guide

### 記事の作成

ローカルで記事管理できるようになったことで、新規記事作成時にslug名を指定できるようになったのが嬉しい。

```bash
zenn new:article --slug 2026-03-31-git-wt
```

### 記事のプレビュー

以下のコマンドで、プレビュー用のサーバーが起動する。

```bash
zenn preview
```

## 執筆環境

せっかく手元で執筆ができるようになったので、textlint や AIエージェントによるレビュースキル[^1]を整理してみた。

[^1]: Zenn公式のAIレビュー機能を併用するのが良いかもしれない: https://zenn.dev/zenn/articles/how-to-use-ai-review

### textlint

技術文章向けのルールプリセットを提供する textlint-rule-preset-ja-technical-writing を利用する。[^2]
デフォルト値だと全体的に厳しめなので調整する。

[^2]: 日本語向けルールは他にもいくつか存在するので眺めてみると面白い: https://github.com/textlint-ja

https://github.com/textlint-ja/textlint-rule-preset-ja-technical-writing

#### ルールのカスタマイズ

最低限緩和したルールは以下の通り。

```json
{
  "rules": {
    "preset-ja-technical-writing": {
      "sentence-length": {
        "max": 120
      },
      "max-ten": {
        "max": 4
      },
      "ja-no-mixed-period": false,
      "ja-no-weak-phrase": false
    }
  }
}
```

[Zenn記法](https://zenn.dev/zenn/articles/markdown-guide#zenn-%E7%8B%AC%E8%87%AA%E3%81%AE%E8%A8%98%E6%B3%95)の `:::message` が lint に引っかからないように、`ja-no-mixed-period`（文末の「。」固定）に関してはOFFにしている。
他には、`ja-no-weak-phrase`（弱い日本語表現：〜と思う）も許容している。

### review skill

次に、Claude Code用の記事レビュースキルを考えてみる。
書式のチェックは textlint で実施するので、文脈の乱れがないか、知識の一貫性が保たれているかなどを意味論的にレビューし、結果を出力するようにした。

https://github.com/to4iki/zenn-articles/blob/main/.claude/skills/article-review/SKILL.md

他には、意見に対して主張の根拠が伴っているか、例えば「〜と思う」「〜が良い」と書いてある箇所に理由や経験が添えられているかチェックするようにしている。

```md
意見や推奨を述べている箇所に、根拠が伴っているか。

- 「〜が良い」「〜すべき」と書いている箇所に、理由や経験が添えられているか
- 比較（A より B が良い）をしている場合、比較軸が明示されているか
- ただし、個人ブログとして「私はこうしている」という経験共有は、それ自体が根拠として十分
```

また、完璧や網羅性を目指すのではなく、論理構造の指摘を優先するようにしている。

```md
- 指摘は多くても 5-7 件に絞る。重要度の高いものを優先する
- 些細な指摘を並べるより、記事の核となる論理構造への指摘を優先する
```

## 最後に

AIによるコンテンツ執筆とは別に、自身の経験や洞察を交えた技術記事や、想いを込めた人の手による記事作成は継続したい。そのための仕組みづくりは続けようと思う。
