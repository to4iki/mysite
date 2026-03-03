# プロジェクトセットアップ

## 依存ツールのインストール

```bash
mise install
mise trust
bun install --frozen-lockfile
lefthook install
```

## Git worktree の設定

worktreeの管理には、[git-wt](https://github.com/k1LoW/git-wt) を利用している。

`.worktreeinclude` は Claude Code Desktop 用の設定。
CLIの git-wt では worktree を作成した際に `.gitignore` に指定しているファイルやフォルダは作業ディレクトリにコピーされないので、
`.git/config` にコピー設定を追加すること。

### worktree への `.env` コピーを設定する

```bash
git config --add wt.copy ".env"
git config --add wt.copy ".env.*"
git config --add wt.copy "**/.claude/settings.local.json"
```
