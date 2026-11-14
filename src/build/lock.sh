#!/bin/sh
# Bir vaqtda ikki chat ishlamasligi uchun belgi (repo ildizidan).
#   sh src/build/lock.sh check   — kim ishlayapti? (3 soatdan eski belgi hisobga olinmaydi)
#   sh src/build/lock.sh on "izoh" — ish boshlandi;   sh src/build/lock.sh off — ish tugadi
# 14.11.2026: belgi `main` da emas, alohida `ish-belgi` tarmog'ida — main ga har push Vercel'ning kunlik
# chegarasini (100 ta) yerdi (o'tkazib yuborilgan yig'ish ham sanaladi); boshqa tarmoqlar Vercel'da yig'ilmaydi (preview o'chiq).
set -e
F=WORKING.txt; B=ish-belgi
case "$1" in
  check) git fetch -q origin $B 2>/dev/null || true
         if git cat-file -e origin/$B:$F 2>/dev/null; then
           T=$(git show origin/$B:$F | sed -n 1p); NOW=$(date +%s)
           if [ $((NOW - T)) -lt 10800 ]; then echo "BAND: $(git show origin/$B:$F | sed -n 2p) ($(( (NOW - T)/60 )) daqiqa oldin)"; exit 1; fi
         fi; echo "BO'SH" ;;
  on|off) # alohida vaqtinchalik nusxada (worktree) — ishchi papkadagi o'zgarish/commit'lar tushib ketmaydi
       if git fetch -q origin $B 2>/dev/null; then BASE=origin/$B; else git fetch -q origin main; BASE=origin/main; fi
       WT=$(mktemp -d); git worktree add -q --detach "$WT" $BASE
       if [ "$1" = on ]; then printf '%s\n%s\n' "$(date +%s)" "${2:-ish}" > "$WT/$F"; git -C "$WT" add $F; git -C "$WT" commit -q -m "ish boshlandi: ${2:-ish}"
       else git -C "$WT" rm -q $F 2>/dev/null && git -C "$WT" commit -q -m "ish tugadi" || true; fi
       git -C "$WT" push -q -f origin HEAD:refs/heads/$B || true; git worktree remove --force "$WT"
       [ "$1" = on ] && echo "belgi qo'yildi" || echo "belgi olindi" ;;
esac
