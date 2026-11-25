#!/bin/bash
# トップに置くイラストを AI（Codex 組み込みの image_gen）で作る。作り直すときは FORCE=1
set -u
cd "$(dirname "$0")/.."
OUT=public/images/top/friends.png
mkdir -p artifacts/photos public/images/top
if [ -f "$OUT" ] && [ "${FORCE:-0}" != "1" ]; then echo "あり: $OUT"; exit 0; fi
codex exec --sandbox workspace-write --skip-git-repo-check --cd "$PWD" "Codex 組み込みの image_gen ツール（gpt-image-2）を直接呼んで画像を1枚作ってください。
API キーも Python/Node スクリプトも不要です。

プロンプト: 'Cute flat vector illustration, Japanese kawaii editorial style with simple rounded shapes and soft thick outlines. Five pets sitting side by side in a row facing the viewer, evenly spaced, all the same size and cut off at the chest by the bottom edge of the image: an apricot toy poodle with a round teddy-bear cut, a white bichon frise, a gray miniature schnauzer with a beard, a red shiba inu, and a gray-and-white cat. Each has a simple happy face with dot eyes. Limited palette: mint green #5cc4ba, soft yellow #ffe566, apricot, cream, warm gray, pale pink cheeks. Pure white background, no text, no logos, no speech bubbles, no shadows on the background, wide composition with empty white space above the heads.'
サイズ: 1536x1024
保存先: $OUT" > artifacts/photos/friends.log 2>&1
file "$OUT"
