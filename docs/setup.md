# プロジェクトセットアップ

```bash
mise install
mise trust
bun install --frozen-lockfile
bunx lefthook install
```

Bun は mise で入れる。lefthook は devDependency である。`bunfig.toml` の `ignoreScripts` により `bun install` では Git hooks が入らないので、`bunx lefthook install` を一度実行する。

## Git worktree

worktree は [git-wt](https://github.com/k1LoW/git-wt) で作り、作ったディレクトリで `mise trust` を実行する。

`.worktreeinclude` は Claude Code Desktop 用。CLI の git-wt は `.gitignore` 対象をコピーしないので、`.env` をコピーする設定を足す。

```bash
git config --add wt.copy ".env"
git config --add wt.copy ".env.*"
```
