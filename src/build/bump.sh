#!/bin/sh
# Versiyani oshiradi (repo ildizidan: sh src/build/bump.sh). Odatda o'zi emas, deploy.sh ichidan chaqiriladi.
# Joriy versiya = sw.js va build.py dagi eng kattasi (chatlar orasida chalkashmasin).
set -e
B=src/build/scratchpad/site
V1=$(sed -n "s/^var C = 'arab-tili-v\([0-9]*\)'.*/\1/p" sw.js); V2=$(sed -n "s/^VER = '\([0-9]*\)'/\1/p" $B/build.py)
V=$V1; [ "${V2:-0}" -gt "${V:-0}" ] && V=$V2
N=$((V+1)); D=$(TZ=Asia/Samarkand date '+%d.%m.%Y, %H:%M')
sed -i "s/^VER = '[0-9]*'/VER = '$N'/" $B/build.py
sed -i "s/^var C = 'arab-tili-v[0-9]*'/var C = 'arab-tili-v$N'/" sw.js
for f in index.html $B/index.tpl.html; do sed -i "s|<dd id=\"vinfo\">[^<]*</dd>|<dd id=\"vinfo\">v$N · $D</dd>|" $f; done
grep -q "arab-tili-v$N'" sw.js || { echo "XATO: sw.js versiyasi yangilanmadi"; exit 1; }
echo "v$N · $D"
