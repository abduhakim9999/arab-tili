# Dars sahifalarini yasash uchun ish fayllari (zaxira)

Bu papka faqat Claude uchun. Sayt va bot shu fayllarsiz ham ishlaydi.

## Ichida
- `scratchpad/site/` — yig'uvchi `build.py` va shablonlar (index, tinglash, fel, shell, hdr.js va boshqalar).
- `scratchpad/hdr/` — dars boshidagi ovozlar (bismillah va boshqalar) hamda `hcfg.json`.
- `scratchpad/dNN/` — har bir darsning ma'lumotlari: `dataNN.py` (e'rob), `vocNN.py` (lug'at), `jmNN.py`, `quizNN.py`, `genNN.py`, suhbat ovozi `dlgNN.mp3`.
- `scratchpad/sarf/` — sarf sahifasi (`build_sarf.py`).
- `site/tarkib.py` + `site/tarkib.js` — «Таркиб» tugmasi: so'z ostidagi yozuvlar (IRB.k dan), шибҳи жумла/жумла qavslari, gap turi. build.py har darsga qo'llaydi.
- `site/hdr.js` — dars boshi: bismillah, (yangi ваҳданинг 1-darsida ваҳда), dars raqami. Qaysi darsda ваҳда chiqishi — build.py dagi `SHOWU`.
- `outputs/lessonNN/index.html` — yig'uvchi kiritadigan dars sahifalari. `genNN.py` dagi qolip `lesson71`.

## Tiklash (yangi sessiyada)
Yo'llar skriptlarda qattiq yozilgan, shuning uchun eski joylariga qaytariladi:

    S=/tmp/claude-0/-home-claude/d13da55d-9a5a-5fc0-96fe-93eeb8284943/scratchpad
    mkdir -p "$S" /mnt/user-data/outputs
    cp -r src/build/scratchpad/. "$S"/
    cp -r src/build/outputs/. /mnt/user-data/outputs/
    cp icon-*.png "$S/site/"
    cp l74-c166f09f.mp3 "$S/listen/l74.mp3"   # tinglash.html dagi joriy l74-….mp3

Agar `/tmp/...` yo'liga yozib bo'lmasa, skriptlardagi `S` yo'lini yangisiga almashtiring:

    grep -rl d13da55d src/build/scratchpad

## Yangi dars qo'shish
1. `dNN/` papkasini oldingi darsdan nusxalang (`d04` → `d05`); `dataNN.py`, `vocNN.py`, `jmNN.py`, `quizNN.py` ni yangilang.
2. Suhbat ovozini `align/in/cNN.mp3`, matnini `align/in/cNN.txt` ga qo'ying. GitHub `align` workflow `align/out/cNN.align.json` ni yasaydi.
3. `python3 genNN.py` → `/mnt/user-data/outputs/lessonNN/index.html`.
4. `site/build.py`: `LESSONS`, `UNIT`, kerak bo'lsa `HDR`/`DROP0` ga qo'shing, `VER` ni oshiring. Dars ikonkasi `site/index.tpl.html` dagi `ICO` da turadi.
5. `python3 build.py && python3 ../sarf/build_sarf.py /mnt/user-data/outputs/arab-tili/sarf.html`, keyin `/mnt/user-data/outputs/arab-tili/.` ni repoga nusxalab push qiling.

## Eslatma (29.10.2026)
Manba yorliqlari («Китобда йўқ», «Бизнинг китобда (N)», «ҳужжатдаги…», «Дарс ҳужжатида…») sahifalardan to'g'ridan-to'g'ri olib tashlangan.
Generator skriptlarda (d03, d04, d73, a70, irb/*92*, site/build.py) ular hali bor — darsni qayta yasasangiz, yorliqlarni ham olib tashlang.
