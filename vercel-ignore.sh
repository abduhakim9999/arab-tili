#!/bin/sh
# Vercel «Ignored Build Step» (09.11.2026): exit 0 — yig'ilmaydi, 1 — yig'iladi.
#   sh vercel-ignore.sh site | fiqh
# Oldingi muvaffaqiyatli commit Vercel'ning sayoz nusxasida bo'lmasa (ko'p commit o'tganda),
# eski buyruq «fatal: bad object» bilan yiqilardi — endi bunday holda shunchaki yig'iladi.
M="$1"; P="${VERCEL_GIT_PREVIOUS_SHA:-}"
if [ -n "$P" ] && ! git cat-file -e "$P^{commit}" 2>/dev/null; then
  git fetch -q --depth=300 origin main 2>/dev/null || true
fi
if [ -z "$P" ] || ! git cat-file -e "$P^{commit}" 2>/dev/null; then
  echo "oldingi commit ($P) topilmadi — yig'iladi"; exit 1
fi
if [ "$M" = fiqh ]; then
  git diff --quiet "$P" HEAD -- fiqh.html fkitob.html 'f[0-9]*.html' 'af*.mp3' 'fiqh-*' fiqh.webmanifest \
    shell.css shell.js tg.js naskh.woff 'icon-*.png' vercel-build.sh vercel-ignore.sh
else
  git diff --quiet "$P" HEAD -- . ':!docs' ':!src' ':!align' ':!CLAUDE.md' ':!WORKING.txt' \
    ':!fiqh.html' ':!fkitob.html' ':!f[0-9]*.html' ':!af*.mp3' ':!fiqh-*' ':!fiqh.webmanifest'
fi
R=$?; [ $R -eq 0 ] && echo "o'zgarish yo'q — yig'ilmaydi" || echo "o'zgarish bor — yig'iladi"
[ $R -le 1 ] && exit $R || exit 1
