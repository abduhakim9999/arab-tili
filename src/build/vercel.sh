#!/bin/sh
# Vercel yig'ishi (08.11.2026): bitta repo — ikki Vercel loyihasi.
#   sh src/build/vercel.sh site  → darslar sayti (fiqhsiz) — «arab-tili» loyihasi (bot api/ ham shu yerda)
#   sh src/build/vercel.sh fiqh  → fiqh alohida manzilda (parol bilan) — «arab-tili-fiqh» loyihasi
# Natija: _vercel/ (Vercel «Output Directory»). Faqat repo ildizidagi sayt fayllari olinadi.
set -e
M="$1"; O=_vercel
rm -rf "$O"; mkdir -p "$O"
FQ='^(fiqh|fkitob|f[0-9]+)\.html$|^af[0-9]+-.*\.mp3$'
NO='^(CLAUDE\.md|_config\.yml|b2\.txt|\.gitignore|\.vercelignore|sinov-.*|shell-s\..*|tg-s\.js)$'
ls -A | while read -r f; do
  [ -f "$f" ] || continue
  echo "$f" | grep -Eq "$NO" && continue
  if [ "$M" = fiqh ]; then
    echo "$f" | grep -Eq "$FQ|^(shell\.css|shell\.js|tg\.js|naskh\.woff|icon-.*\.png|manifest\.webmanifest)$" || continue
  else
    echo "$f" | grep -Eq "$FQ" && continue
  fi
  cp "$f" "$O/"
done
if [ "$M" = fiqh ]; then
  cp "$O/fiqh.html" "$O/index.html"
else
  [ -d fq ] && cp -r fq "$O/"
  # sw.js: fiqh fayllari keshlanmaydi
  python3 - "$O/sw.js" <<'E'
import re, json, sys
p = sys.argv[1]; s = open(p).read()
fq = re.compile(r'^(fiqh|fkitob|f[0-9]+)\.html$')
m = re.search(r'^var FILES = (\[.*?\]);', s, re.M)
F = [f for f in json.loads(m.group(1)) if not fq.match(f)]
s = s[:m.start(1)] + json.dumps(F) + s[m.end(1):]
m = re.search(r'^var H = (\{.*?\});', s, re.M)
if m:
    H = {k: v for k, v in json.loads(m.group(1)).items() if not fq.match(k)}
    s = s[:m.start(1)] + json.dumps(H) + s[m.end(1):]
open(p, 'w').write(s)
E
fi
echo "vercel.sh $M: $(ls "$O" | wc -l) fayl"
