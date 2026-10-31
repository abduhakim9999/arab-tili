#!/bin/bash
# SINOV (ko'rib chiqish) joylash — o'quvchilarga ko'rinmaydi, versiya oshmaydi:
#   bash src/build/sinov.sh 6.html tinglash.html a6-xxxx.mp3 v6-xxxx.mp3 ...
# .html fayllar saytga «sinov-NOM.html» bo'lib chiqadi (masalan sinov-6.html), qolganlari (mp3, json) o'z nomi bilan.
# Ishchi papkadagi o'zgarishlar commit qilinmaydi — alohida vaqtinchalik nusxada (worktree) push qilinadi.
# Foydalanuvchi barcha izohlarini bir xabarda beradi -> hammasi tuzatiladi -> bir marta deploy.sh (u sinov-* ni o'chiradi).
set -e
[ $# -gt 0 ] || { echo "Ishlatish: bash src/build/sinov.sh fayl1 [fayl2 ...]"; exit 1; }
ROOT=$(pwd); WT=$(mktemp -d)
git fetch -q origin main
git worktree add -q --detach "$WT" origin/main
trap 'cd "$ROOT"; git worktree remove --force "$WT" >/dev/null 2>&1 || true' EXIT
for f in "$@"; do
  b=$(basename "$f")
  case "$b" in *.html) cp "$f" "$WT/sinov-$b"; echo "https://abduhakim9999.github.io/arab-tili/sinov-$b";;
               *) cp "$f" "$WT/$b";; esac
done
cd "$WT"
git add -A . && git commit -q -m "sinov: $*" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
for TRY in 1 2 3; do
  git push -q origin HEAD:main && { echo "Sinovga qo'yildi (1–2 daqiqada ochiladi)."; exit 0; }
  git fetch -q origin main && git rebase -q origin/main
done
echo "TO'XTA: sinov push bo'lmadi"; exit 4
