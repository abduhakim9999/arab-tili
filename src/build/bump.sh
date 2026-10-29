#!/bin/sh
# Versiyani oshiradi va «?» ichidagi sanani yangilaydi. Repo ildizidan: sh src/build/bump.sh
set -e
B=src/build/scratchpad/site
V=$(sed -n "s/^VER = '\([0-9]*\)'/\1/p" $B/build.py); N=$((V+1))
D=$(TZ=Asia/Samarkand date '+%d.%m.%Y, %H:%M')
sed -i "s/^VER = '$V'/VER = '$N'/" $B/build.py
sed -i "3s/v$V'/v$N'/" sw.js
sed -i "s/var VINFO = '[^']*'/var VINFO = 'v$N · $D'/" shell.js
cp shell.js $B/shell.js
echo "v$N · $D"
