#!/bin/sh
# Versiyani oshiradi; versiya faqat bosh sahifadagi «i» oynasida ko'rinadi. Repo ildizidan: sh src/build/bump.sh
set -e
B=src/build/scratchpad/site
V=$(sed -n "s/^VER = '\([0-9]*\)'/\1/p" $B/build.py); N=$((V+1))
D=$(TZ=Asia/Samarkand date '+%d.%m.%Y, %H:%M')
sed -i "s/^VER = '$V'/VER = '$N'/" $B/build.py
sed -i "3s/v$V'/v$N'/" sw.js
for f in index.html $B/index.tpl.html; do sed -i "s|<dd id=\"vinfo\">[^<]*</dd>|<dd id=\"vinfo\">v$N · $D</dd>|" $f; done
echo "v$N · $D"
