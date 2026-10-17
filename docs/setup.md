# プロジェクトセットアップ

## 依存ツールのインストール

Node.js と pnpm の版は `package.json` の `devEngines.runtime` と `packageManager` に固定されている。

```bash
pnpm install --frozen-lockfile
pnpm exec vp hooks enable
```

`ignoreScripts: true` のため、install では lifecycle script が走らない。pre-commit は `vp hooks enable` で有効にする。

## Git worktree の設定

worktreeの管理には、[git-wt](https://github.com/k1LoW/git-wt) を利用している。

`.worktreeinclude` は Claude Code Desktop 用の設定。
CLIの git-wt では worktree を作成した際に `.gitignore` に指定しているファイルやフォルダは作業ディレクトリにコピーされないので、
`.git/config` にコピー設定を追加すること。

### worktree への `.env` コピーを設定する

```bash
git config --add wt.copy ".env"
git config --add wt.copy ".env.*"
```
