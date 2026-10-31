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
  on)  printf '%s\n%s\n' "$(date +%s)" "${2:-ish}" > $F; git add $F; git commit -q -m "ish boshlandi: ${2:-ish}" -- $F; git push -q origin HEAD:main; echo "belgi qo'yildi" ;;
  off) git pull -q --rebase origin main; git rm -q $F 2>/dev/null && git commit -q -m "ish tugadi" -- $F && git push -q origin HEAD:main; echo "belgi olindi" ;;
esac
