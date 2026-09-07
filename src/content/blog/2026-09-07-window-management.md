---
title: "AeroSpaceによるウィンドウマネジメントを始めた"
description: "Mission ControlからAeroSpaceへ切り替え、周辺ツールとの組み合わせをまとめた。"
pubDate: "2026-09-07"
tags:
  - "aerospace"
  - "mac"
---

複数アプリの表示に関して、今までは macOS 標準の Mission Control の仮想デスクトップを4つほど作成し配置を割り当てて利用していたが、
キーボードショートカットだけで簡単にウィンドウを移動できるのと、複数アプリをシュッと整列させることができそうなので AeroSpace を使うことにした。

合わせていくつかツールを組み合わせているので備忘を兼ねて使い方をまとめる。

## AeroSpace とは

https://github.com/nikitabobko/AeroSpace

macOS 用のタイル型 Window Manager であり、macOS のワークスペースとは別の AeroSpace 独自のワークスペースを持つ。アニメーションを挟まなかったり、キーボードショートカットが充実していてカスタマイズも可能。以下の動画を見てもらうのが早い。

https://www.youtube.com/watch?v=UOl7ErqWbrk

自分は、1から9までのスペースを利用していて、開発系のツールは1から左寄せ、コミュニケーションとかそれ以外のアプリは9から右寄せにして利用することが多い。

- 1. Ghostty
- 2. Zed
- ...
- 8. Obsidian
- 9. Slack + Google Chrome

両端の Ghostty と Slack は起動時にスペースを固定するようにしている。

```toml
[[on-window-detected]]
if.app-id = 'com.mitchellh.ghostty'
run = 'move-node-to-workspace 1'

[[on-window-detected]]
if.app-id = 'com.tinyspeck.slackmacgap'
run = 'move-node-to-workspace 9'
```

個人的に `alt + 数字` はキー入力が片手となることが多く絶妙に遅れるので、隣のワークスペースに移動する `alt + [` / `alt + ]` を用意。

```toml
alt-leftSquareBracket = 'workspace --wrap-around prev'
alt-rightSquareBracket = 'workspace --wrap-around next'
```

### マルチウィンドウ配置の工夫

Zed を開きながら隣に幅30%くらいの Chrome を表示させて参考情報を眺めるような、Chrome のウィンドウを複数起動する使い方を行うことが多いので、
簡単に Chrome の新規ウィンドウを起動できるようにしている。

```toml
# Open a new Chrome window from any workspace
# Use AppleScript instead of open -na to avoid the profile picker
alt-shift-c = '''exec-and-forget osascript -e 'tell application "Google Chrome" to make new window'
'''
```

## 連携しているツールたち

### JankyBorders

複数ウィンドウを整列させて表示しているとアクティブなウィンドウがわかりづらいので、枠線を描画する JankyBorders を使うことにした。

https://github.com/FelixKratz/JankyBorders

AeroSpace 起動時に枠線を描画するようにしている。

```toml
# You can use it to add commands that run after AeroSpace startup.
# Available commands : https://nikitabobko.github.io/AeroSpace/commands
# Setup borders: https://github.com/FelixKratz/JankyBorders
after-startup-command = [
  'exec-and-forget borders active_color=0xffe1e3e4 inactive_color=0xff494d64 width=4.0',
]
```

### AutoRaise

macOS の場合に、操作対象のウィンドウにカーソルを乗せワンクリックしないとフォーカスが移らないのが地味にストレス。
そこで AutoRaise を利用してウィンドウにカーソルを当てるだけでアクティブ化できるようにした。

> [!WARNING]
> 誤爆が多いので、継続して利用するかは考え中

https://github.com/sbmpost/AutoRaise

### Nape Pro連携

Nape Pro のボタンに AeroSpace の移動でよく利用する `alt + tab` （直前に表示したワークスペースに移動する）や `alt + 9` を設定することにした。

![](https://media.to4iki.com/blog/napepro-mode-0.avif)

これでワンタップで直前のワークスペースに簡単に移動できるようになりライフチェンジング。
ついでに長押しに `alt + 9` を割り当てていたので、これでコミュニケーション用のワークスペースに移動できるようにもしている。

## AeroSpaceはいいぞ

設定と見た目は以下。凝ったことはしていなくて、標準のショートカットや機能で必要充分で、なくては困るくらい当たり前になってきた。
こういったウィンドウ管理系は一度最初に設定しておくと何かと便利。

https://github.com/to4iki/dotfiles/blob/main/dot_config/aerospace/aerospace.toml

![](https://media.to4iki.com/blog/my-aerospace.avif)

## 参考

- https://zenn.dev/mozumasu/articles/mozumasu-window-costomization
- https://unknownplace.org/blog/2026/01/10/aerotag/
