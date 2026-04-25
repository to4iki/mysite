# AIエージェントの運用

Claude Code と Cursor を併用するため、ルールとスキルは **エージェント間で共有できる単一の出典 (single source of truth) を持つ** 方針で運用する。

参考: [AIエージェントに優しいオンボーディング体験を作る (SmartBank Tech Blog)](https://blog.smartbank.co.jp/entry/2026/01/09/ai-onboarding-document)

## 構成

- `AGENTS.md` - 全エージェント共通のハブ
- `CLAUDE.md` - AGENTS.md へのシンボリックリンク
- `.agents/rules/` - Modular Rules の本体
- `.cursor/rules/` - Cursor 用ラッパー（.agents を参照）
- `.claude/rules/` - Claude Code 用ラッパー（.agents を参照）
- `.claude/skills/` - Claude Code / Cursor 共通のスキル

## モジュールルール

ルール本文は `.agents/rules/*.md` に置く。Cursor / Claude Code 用のファイルは frontmatter で適用パターンだけを指定し、本文は `@` 構文で `.agents/rules/` をインポートする。

`.cursor/rules/code-style.mdc`:

```mdc
---
globs: src/**/*.ts,src/**/*.astro
alwaysApply: false
---

@.agents/rules/code-style.md
```

`.claude/rules/code-style.md`:

```md
---
paths:
  - "src/**/*.{ts,astro}"
---

@.agents/rules/code-style.md
```

新しいルールを追加するときは、`.agents/rules/` に本文を書き、`.cursor/rules/` と `.claude/rules/` にラッパーを置く。

## スキル

スキルは `.claude/skills/` に集約する。Cursor は公式に Claude Code Skills の互換モードを持ち、`.claude/skills/` をそのまま読み取れる。

参考: [Cursor Docs - Skills](https://cursor.com/ja/docs/skills#-2)
