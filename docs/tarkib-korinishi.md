# Tarkib ko'rinishi — yangi tizim (sinov)

Qaror: 16–17.11.2026, foydalanuvchi bilan chatda, rasm-namunalar asosida. Holat: **fiqh 2-darsda sinov** (`tayyor-fiqh-2`), Таркиб rejimida «Эски / Янги»; boshqa darslarda eski ko'rinish. Bu fayl — yagona manba (grammatika qoidalari — konspektda, bu yerda faqat *qanday ko'rsatilishi*).

## 1. Tamoyil
- **Rang — so'zning vazifasi yoki holati oilasi; to'q rang — uni o'zgartirgan harf; ramka — asosiy bo'lak o'rnida kelgan bo'lak.**
- O'qiyotganda vazifa muhim: gapning asosiy bo'laklari o'z rangida. Raf alohida ko'rsatilmaydi — har bir marfu' ism asosiy bo'lak (mubtado, xabar, foil, noibi foil), rangi bor.
- Qolgani so'z bosilganda (2-qavat) yoki bosib turganda (3-qavat, so'z oynasi).

## 2. Uch qavat
| Qavat | Qachon | Nima |
|---|---|---|
| 1 | doim | ranglar (3-bo'lim) va asosiy bo'lak ramkasi (4-bo'lim) |
| 2 | so'z bosilganda; ustoz audiosi bog'lanishni tushuntirayotganda (xiralashtirmasdan) | bo'lak o'z rangidagi ramkada, bosh so'zdan chiziq (yarmidan ramka rangiga o'tadi), ostida nomi; kana/inna — pushti; yashirin zamir; bosilganda gapning qolgani xiralashadi |
| 3 | bosib turganda | so'z oynasi: to'liq e'rob (holat, alomat, izoh, hazf, sharh) |

## 3. Ranglar (matnda doim)
| Rang | Nima | O'zgaruvchi |
|---|---|---|
| ko'k | mubtado; kananing/innaning ismi | `--cm` |
| qizil | xabar; kananing/innaning xabari | `--cx` |
| jigarrang | fe'l | `--cf` |
| binafsha | foil, noibi foil | `--co` |
| to'q yashil | maf'ulun bih (ikki-uch maf'ul ham) | `--nb` |
| och yashil | boshqa mansublar: maf'ulun mutlaq, lahu, zarf, ma'ahu, hol, tamyiz, mustasno, munodo | `--nn` |
| feruza | majrur: harf jardan keyingi so'z va muzofun ilayh | `--nj` |
| to'q feruza | jar harfi | `--nh` |
| to'q jigarrang | fe'lni nasb yoki jazm qiluvchi harf: an, lan, kay, lam, nahy «lo», shart «in» | `--nd` |

**Faqat bosganda:** pushti — kana, inna va sheriklarining o'zi (`--nz`); matnda qora.

- Qo'shilgan zamir **o'z vazifasi rangida**: foil — binafsha, maf'ul — to'q yashil, muzofun ilayh — feruza, innaning ismi — ko'k.
- Tobe'lar (sifat, ma'tuf, ta'kid, badal) — ergashgan so'z rangida.
- Zanna — oddiy fe'l rangida, maf'ullari to'q yashil. Ismi foil fe'ldek amal qilsa — maf'uli to'q yashil.
- Fe'lning o'z holati (marfu', mansub, majzum) — oynada. Harflar (atf, so'roq…) qora.

## 4. Ramka (matnda doim)
- Bo'lakning so'zlari rangi uning gapdagi o'rnini ko'rsatmasa, u o'sha o'rin rangidagi ramkaga olinadi:
  - jar-majrur yoki zarf xabar bo'lsa — qizil; noibi foil bo'lsa — binafsha;
  - jumla xabar bo'lsa — qizil (ism fe'l/kanadan oldin kelsa ham);
  - jumla maf'ul o'rnida (aytilgan gap, «an» + fe'l, «anna» + jumla) — to'q yashil.
- Ramka qo'yilmaydi: mavsul (o'zi vazifasi rangida), izofa, sifat, hol jumlasi, sila, shart — ular bosganda ko'rsatiladi.

## 5. Bosganda (2-qavat)
- Bo'lak o'z rangidagi ramkada (jar-majrur — feruza, mansub — och yashil, tobe' — ergashgan so'z rangi, nosix — pushti; rangsiz bo'lsa — kulrang).
- Bosh so'zdan chiziq: bosh so'z rangida boshlanadi, yarmidan ramka rangiga o'tadi; bosh so'zda nuqta. Ostida nomi (мутааллиқ, маътуф, музофун илайҳ…), ramka rangida.
- Bog'lanish boshqa gapda (tarkib qutisi orqasida) bo'lsa — chiziq yo'q, faqat ramka va nomi.
- **Yashirin foil:** fe'l tagida kichik arabcha zamir (هُوَ، أَنْتَ، نَحْنُ، أَنَا), binafsha; kananing yashirin ismi — ko'k.
- **Hazf:** tushib qolgan so'z xira ko'rinadi (taklif, kodda yo'q).
- Bog'lanishlar ustoz audiosidagi tushuntirishdan olinadi (`TL` → `REL`).

## 6. Ko'rib chiqilib rad etilganlar
Rangli fon (tutash / nuqtali / uzuq, ichma-ich, «ulab»); doimiy chiziq yoki yoy; doimiy strelka; holat rangi butun so'zga (raf/nasb/jar/jazm bo'yicha); matnda o'zbekcha yorliq; nosix ramkada yoki feruza; muzofun ilayh alohida rangda (apelsin); matnda faqat 5 rang (majrur va mansublar qora — 16.11 kech varianti).

## 7. Kodda (fiqh `fN.html`)
- `#tx.fqn` — yangi ko'rinish. Tugma `#fvk` «Эски / Янги»; `localStorage["fiqh-vk"]` (0/1, sukut 1).
- So'z rangi: eski `c-*` yonida yangi `n-*` (`cm cx cf co cb cn cj jh cd cz`). `nk()` eskisidan o'giradi (`cj` → feruza, `ch` → `cn`); farq bo'lsa `NC={"seg-so'z":"klass"}`.
- `ZC={"seg-so'z":"klass"}` — qo'shilgan zamir (`.fz`) rangi; `JH={"seg-so'z":"بِ"}` — so'z oldidagi jar harfi (`.fpre` ichida `.n-jh`).
- `GR=[[seg, birinchi, oxirgi, tur, rang]]` — tur `m` (mutaalliq bo'lagi, bosganda butunicha olinadi), `i` (ibora), `r` (asosiy bo'lak ramkasi, matnda ko'rinadi: `.fg.gr.t*`); rang `m x f o b n g`.
- 2-qavat: `ykRel(kalit, nishonlar, tur, xira)` — SVG `.fyk` (`#pM` ichida): ramka `rect`, chiziq `path` (`linearGradient`), nuqta; yorliq `.fykc`; xiralashish `.fqfoc` / `.foc`. Ramkadagi so'zda eski `.sel` / `.now` qutisi ko'rsatilmaydi.
- Belgilar qatori `.flgn` — faqat darsda uchragan ranglar; izoh `.flgc` («Белгилар»).
- Ranglar kunduzgi va tungi rejimda (`--nj --nh --nd` tungi qiymatlari bor).
- **Hali kodda yo'q:** yashirin zamir yozuvi, hazf ko'rinishi (2-darsda fe'l yo'q); uzun bo'lak qatordan qatorga o'tsa ramka faqat birinchi qatorda.

## 8. Namunalar
`docs/tarkib-korinishi/oila-*.png` — joriy tartib, 52 misol, 7 guruh (gap asosi, nosixlar, mansublar, majrur va tobe'lar, fe'l nasbi va jazmi, ichki jumlalar, boshqalar). Qolgan rasmlar (`yakun-*`, `asosiy-ranglar`, `yechim-uch-qavat`, `oraga-soz-tushganda`) — rad etilgan oldingi variantlar.

## 9. Navbatda
1. Fe'lli matnda (arab tili darsi) sinash: yashirin zamir, fe'l harflari, ramkalar.
2. Rang ajratishi sust odamlar uchun tekshiruv; feruza/ko'k va to'q jigarrang/jigarrang farqi.
3. Sinovdan keyin «Эски / Янги» tugmasini olib tashlab, bitta ko'rinish qoldirish.
4. Yo'riqnomaga mavzu; fiqh 1 va arab tili darslari (foydalanuvchi ma'qullagach).
