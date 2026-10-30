#!/bin/bash
# Saytga xavfsiz joylash (repo ildizidan):  bash src/build/deploy.sh "commit xabari" [fayl ...]
# 1) boshqa chat o'zgartirgan fayllarni ustidan yozib yubormaslikni tekshiradi (BASE — ish boshlangan commit),
# 2) eng yangi main ustiga qo'yadi, 3) versiyani oshiradi, 4) push; rad etilsa qaytadan urinadi.
# BASE: muhit tiklanganda yoziladi:  git rev-parse HEAD > .git/claude-base
set -e
MSG="$1"; shift || true
[ -n "$MSG" ] || { echo "Ishlatish: bash src/build/deploy.sh \"xabar\" [fayllar]"; exit 1; }
BASE=$(cat .git/claude-base 2>/dev/null || echo "")
for TRY in 1 2 3; do
  git fetch -q origin main
  if [ -n "$BASE" ]; then
    MINE=$( { git diff --name-only HEAD; git diff --name-only --cached; git ls-files --others --exclude-standard; git diff --name-only "$BASE" HEAD; } | sort -u)
    THEIRS=$(git diff --name-only "$BASE" origin/main | sort -u)
    CLASH=$(printf '%s\n' "$MINE" | grep -Fxf - <(printf '%s\n' "$THEIRS") 2>/dev/null | grep -v -E '^(sw\.js|index\.html|src/build/scratchpad/site/(build\.py|index\.tpl\.html)|align/out/.*)$' || true)
    if [ -n "$CLASH" ]; then
      echo "TO'XTA: bu fayllarni ish davomida boshqa chat ham o'zgartirgan:"; echo "$CLASH"
      echo "Yechim: o'sha fayllarni origin/main dagi yangi nusxasidan olib, faqat o'z o'zgarishingni qayta kirit."; exit 2
    fi
  fi
  git stash -q --include-untracked || true
  git reset -q --hard origin/main
  git stash pop -q || { echo "TO'XTA: stash qo'yishda to'qnashuv"; exit 3; }
  sh src/build/bump.sh
  git add --sparse -A ${@:-.}
  git add --sparse sw.js index.html src/build/scratchpad/site/build.py src/build/scratchpad/site/index.tpl.html
  git commit -q -m "$MSG" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" || true
  if git push -q origin HEAD:main; then
    git rev-parse HEAD > .git/claude-base; echo "Joylandi: $(grep "^var C" sw.js)"; exit 0
  fi
  echo "Push rad etildi (boshqa chat joyladi) — qayta urinish $TRY"; git reset -q --soft HEAD~1
done
echo "TO'XTA: 3 marta urinib bo'lmadi"; exit 4
