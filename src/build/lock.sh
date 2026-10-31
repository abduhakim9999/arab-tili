#!/bin/sh
# Bir vaqtda ikki chat ishlamasligi uchun belgi (repo ildizidan).
#   sh src/build/lock.sh check   — kim ishlayapti? (3 soatdan eski belgi hisobga olinmaydi)
#   sh src/build/lock.sh on "izoh" — ish boshlandi;   sh src/build/lock.sh off — ish tugadi
set -e
F=WORKING.txt
case "$1" in
  check) git fetch -q origin main; if git cat-file -e origin/main:$F 2>/dev/null; then
           T=$(git show origin/main:$F | sed -n 1p); NOW=$(date +%s)
           if [ $((NOW - T)) -lt 10800 ]; then echo "BAND: $(git show origin/main:$F | sed -n 2p) ($(( (NOW - T)/60 )) daqiqa oldin)"; exit 1; fi
         fi; echo "BO'SH" ;;
  on|off) # alohida vaqtinchalik nusxada (worktree) — ishchi papkadagi o'zgarish/commit'lar saytga tushib ketmaydi
       git fetch -q origin main; WT=$(mktemp -d); git worktree add -q --detach "$WT" origin/main
       if [ "$1" = on ]; then printf '%s\n%s\n' "$(date +%s)" "${2:-ish}" > "$WT/$F"; git -C "$WT" add $F; git -C "$WT" commit -q -m "ish boshlandi: ${2:-ish}"
       else git -C "$WT" rm -q $F 2>/dev/null && git -C "$WT" commit -q -m "ish tugadi" || true; fi
       git -C "$WT" push -q origin HEAD:main || true; git worktree remove --force "$WT"
       [ "$1" = on ] && echo "belgi qo'yildi" || echo "belgi olindi" ;;
esac
