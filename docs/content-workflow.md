# コンテンツ作成のワークフロー

## ブログ

- `src/content/blog/YYYY-MM-DD-{title}.md` の形式で作成
- 画像は `media/blog/` に配置する
  - ブログ内からのアクセス: `![](/media/blog/xxx.png)`
- タグは英小文字で統一する（例: `"astro"`, `"cloudflare"`, `"note"`）
- タグを設定すると、ブログ詳細ページにタグが表示され、`/blog/tag/{tag}/` でタグ別一覧ページが生成される

## 画像

画像は以下の手順で Cloudflare R2 の専用バケットにアップロードする。

1. ローカルでの画像保持: 手元での下書き時には `media/{content-type}` 配下に任意の画像をセットしプレビューする
2. AVIF へ変換して R2 へアップロードする: `bun run r2:upload`
   - `--dry-run` - 変換は行い、R2 へのアップロードだけ省いて公開 URL をログに出す
   - `--max-width <px>` - 変換時の幅の上限。元より拡大はしない
3. 記事中のローカル画像パスを公開 URL に置換する: `bun run r2:replace-paths`
   - `--dry-run` - ファイルは書き換えず、置換内容だけログに出す
