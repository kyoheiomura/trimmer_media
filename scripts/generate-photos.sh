#!/bin/bash
# ダミー期間用の写真を AI（Codex 組み込みの image_gen / gpt-image-2）で生成する。
# 人の顔は作らない（作り物の質感が出るため）。犬・猫、手元、道具、サロンの様子だけ。
#   bash scripts/generate-photos.sh          … まだ無い写真だけ作る
#   FORCE=1 bash scripts/generate-photos.sh  … すべて作り直す
set -u
cd "$(dirname "$0")/.."
mkdir -p public/images/trimmer public/images/interview public/images/top
LOG_DIR=artifacts/photos
mkdir -p "$LOG_DIR"

STYLE="Photorealistic editorial photograph for a Japanese lifestyle magazine about pet grooming. NO human faces visible (people cropped at the shoulders or out of frame), no text, no logos, no brand marks, no watermark. The animals look calm and relaxed, never restrained or distressed. Japan, small clean pet grooming salon, soft cool daylight from a window, white tile and pale wood, stainless steel, pale aqua towels, natural slightly desaturated colors, shallow depth of field, quiet gentle atmosphere."

gen() { # gen <公開するパス（.jpg）> <サイズ> <プロンプト>
  if [ -f "$1" ] && [ "${FORCE:-0}" != "1" ]; then echo "あり: $1"; return; fi
  local raw="$LOG_DIR/$(basename "${1%.jpg}").png"
  codex exec --sandbox workspace-write --skip-git-repo-check --cd "$PWD" "Codex 組み込みの image_gen ツール（gpt-image-2）を直接呼んで画像を1枚作ってください。
API キーも Python/Node スクリプトも不要です。

プロンプト: '$3'
サイズ: $2
保存先: $raw" > "$LOG_DIR/$(basename "$1").log" 2>&1
  sips -s format jpeg -s formatOptions 86 "$raw" --out "$1" > /dev/null && file "$1"
}

T=public/images/trimmer
I=public/images/interview
# トリマーの写真（縦 4:5。カードと記事の冒頭）
gen $T/mihon-yuki.jpg 1024x1280 "A female pet groomer in a pale gray apron holding closed grooming scissors still in her open palm while a small cream toy poodle standing on a grooming table calmly sniffs them, her other hand resting lightly under the dog's chin, groomer cropped at the shoulders so her face is out of frame. $STYLE" &
gen $T/kari-sota.jpg 1024x1280 "A male pet groomer in a navy apron gently towel-drying an elderly miniature dachshund with a graying muzzle that is lying relaxed on a low padded grooming table with a non-slip mat, his hands supporting the dog's chest, groomer cropped at the shoulders so his face is out of frame. $STYLE" &
gen $T/hinagata-mai.jpg 1024x1280 "A female pet groomer scissoring the round fluffy head of an apricot toy poodle in a teddy bear cut on a grooming table, a steel comb in her other hand, a large mirror softly blurred behind, groomer cropped at the shoulders so her face is out of frame. $STYLE" &
wait
# トップの写真
gen public/images/top/comb.jpg 1536x1024 "Extreme close-up of a groomer's hand drawing a steel comb through the fluffy white coat of a bichon frise, individual hairs catching the light, no face of the person. $STYLE" &
gen public/images/top/talk.jpg 1536x1024 "A pet groomer in an apron and a dog owner standing at a small salon reception counter talking, the owner holding a small shih tzu in her arms, the groomer holding a clipboard, both people seen from the side cropped at the shoulders so faces are out of frame, the dog looking at the groomer. $STYLE" &
gen $I/mihon-yuki-room.jpg 1536x1024 "Interior of a tiny one-table pet grooming salon with nobody in it: a single grooming table with a non-slip mat, a stainless dog bath, folded pale aqua towels on a shelf, a window with sheer curtain, wide shot. $STYLE" &
wait
# 取材記事の本文に入れる写真（サロンの様子・道具・犬）
gen $I/mihon-yuki-tools.jpg 1536x1024 "Still life on a folded pale towel: grooming scissors, thinning shears, a steel comb, a slicker brush and a small nail clipper arranged neatly, nobody in frame. $STYLE" &
gen $I/kari-sota-bath.jpg 1536x1024 "A low stainless steel dog bathtub with a small step and a non-slip rubber mat inside, a hand shower, a stack of towels and a soft cushion beside it in a grooming salon, nobody in frame, wide shot. $STYLE" &
gen $I/kari-sota-karte.jpg 1536x1024 "Close-up of a clipboard with a handwritten-style grooming chart with a simple dog outline diagram (no readable text) and a pen on a wooden counter, the front paws of an old dog resting on a soft mat blurred in the background, nobody's face in frame. $STYLE" &
wait
gen $I/hinagata-mai-salon.jpg 1536x1024 "Interior of a bright stylish pet grooming salon with nobody in it: two grooming tables in front of a large round mirror, a wall rack of scissors and combs, a small sofa waiting corner with dog photo frames with no readable text, wide shot. $STYLE" &
gen $I/hinagata-mai-finish.jpg 1536x1024 "A freshly groomed apricot toy poodle with a round teddy bear cut sitting on a grooming table wearing a small pale blue gingham bandana, looking toward the camera, a groomer's hand just out of focus at the edge of the frame holding a comb. $STYLE" &
wait
echo "完了。public/images/ を確認してください。"
