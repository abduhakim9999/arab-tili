#!/bin/bash
# github.io ko'rish manzili (14.11.2026, foydalanuvchi qarori; docs/texnik.md 1): `gh-pages` tarmog'ini yasaydi —
#   ildizda main (avvalgi github.io bilan bir xil), har bir tayyor-<nom> tarmog'i — tayyor/<nom>/ da, tayyor/ — ro'yxat.
#   Vercel'ga tegmaydi (gh-pages va tayyor-* Vercel'da yig'ilmaydi). Ko'rish sahifalari natijasi alohida (korish-shim.js).
#   bash src/build/korish.sh          — yasaydi, push qilmaydi (tekshirish: KORISH_CHIQ=papka — fayllar shu papkaga ham chiqadi)
#   bash src/build/korish.sh --push   — gh-pages ga push (.github/workflows/korish.yml ham shuni qiladi)
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
H=src/build
git fetch -q --prune --depth=1 origin '+refs/heads/main:refs/remotes/origin/main' '+refs/heads/tayyor-*:refs/remotes/origin/tayyor-*'

TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
export GIT_INDEX_FILE=$TMP/index
# saytga chiqmaydiganlar (_config.yml exclude + server/yig'ish fayllari)
CHIQMAYDI="src align docs .github api CLAUDE.md WORKING.txt _config.yml vercel-build.sh vercel-ignore.sh .vercelignore .gitignore"
olib() { local x; for x in $CHIQMAYDI; do git rm -r -q -f --cached --ignore-unmatch -- "$1$x" >/dev/null; done; }
qoy() { git update-index --add --cacheinfo "100644,$1,$2"; }
# main'ga to'liq qo'shilgan tayyor tarmoq (compare: ahead_by = 0) ro'yxatga chiqmaydi — faqat Actions'da (GITHUB_TOKEN bor)
birlashgan() {
  [ -n "${GITHUB_TOKEN:-}" ] && [ -n "${GITHUB_REPOSITORY:-}" ] || return 1
  local a; a=$(curl -fsS -H "Authorization: Bearer $GITHUB_TOKEN" -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/$GITHUB_REPOSITORY/compare/main...$1" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("ahead_by",""))') || return 1
  [ "$a" = 0 ]
}

git read-tree origin/main
olib ''
qoy "$(git show origin/main:sw.js | python3 $H/korish.py sw | git hash-object -w --stdin)" sw.js
qoy "$(printf '' | git hash-object -w --stdin)" .nojekyll

ROY=()
for r in $(git for-each-ref --format='%(refname:strip=3)' 'refs/remotes/origin/tayyor-*'); do
  if birlashgan "$r"; then echo "$r — main'ga qo'shilgan, ko'rsatilmaydi"; continue; fi
  n=${r#tayyor-}; p="tayyor/$n/"
  git read-tree --prefix="$p" "origin/$r"
  olib "$p"
  for f in $(git ls-files -- "$p" | grep '\.html$'); do
    qoy "$(git show "origin/$r:${f#$p}" | python3 $H/korish.py shim "$n" | git hash-object -w --stdin)" "$f"
  done
  ROY+=("$n"$'\t'"$(TZ=Asia/Tashkent git log -1 --format=%cd --date=format:'%d.%m %H:%M' "origin/$r")"$'\t'"$(git log -1 --format=%s "origin/$r")")   # TAB bilan: xabarda «:» bo'ladi
done
qoy "$(python3 $H/korish.py royxat "${ROY[@]}" | git hash-object -w --stdin)" tayyor/index.html

T=$(git write-tree)
echo "korish: main $(git rev-parse --short origin/main) + ${#ROY[@]} ta tayyor: ${ROY[*]%%$'\t'*}"
if [ -n "${KORISH_CHIQ:-}" ]; then mkdir -p "$KORISH_CHIQ"; git archive "$T" | tar -x -C "$KORISH_CHIQ"; echo "fayllar: $KORISH_CHIQ"; fi
if [ "${1:-}" = --push ]; then
  if git fetch -q --depth=1 origin gh-pages 2>/dev/null && [ "$(git rev-parse FETCH_HEAD^{tree})" = "$T" ]; then echo "o'zgarish yo'q"; exit 0; fi
  C=$(git commit-tree "$T" -m "korish: main $(git rev-parse --short origin/main) + ${#ROY[@]} ta tayyor")
  git push -q -f origin "$C:refs/heads/gh-pages"
  echo "gh-pages yangilandi"
fi
