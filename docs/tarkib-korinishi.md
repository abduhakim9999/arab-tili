# Tarkib ko'rinishi — yangi tizim (sinov)

Qaror: 16.11.2026, foydalanuvchi bilan chatda, rasm-namunalar asosida (oxirgi tanlov — «matnda faqat 5 asosiy rang, qolgani bosganda»). Holat: **fiqh 2-darsda sinov** (`tayyor-fiqh-2`), Таркиб rejimida «Эски / Янги»; boshqa darslarda eski ko'rinish. Bu fayl — yagona manba (grammatika qoidalari — konspektda, bu yerda faqat *qanday ko'rsatilishi*).

## 1. Tamoyil
- Matnda faqat **tarjima uchun eng kerakli narsa** — gapning skeleti (kim/nima — nima qildi/qanday — nimani). Qolgani o'quvchi qiynalgan joyda, so'z bosilganda.
- O'qiyotganda vazifa muhim, holat (raf/nasb/jar/jazm) ikkinchi darajali.
- Asos: belgi kam bo'lsa ishlaydi, ortiqchasi o'rganishga xalaqit beradi (Mayer: signaling, coherence); kam kerak bo'ladigani ikkinchi qavatga (Nielsen: progressive disclosure); toifa ranglari 6 tadan oshsa qiyinlashadi.

## 2. Uch qavat
| Qavat | Qachon | Nima |
|---|---|---|
| 1 | doim | faqat 5 asosiy rang (3-bo'lim); boshqa hech qanday belgi yo'q |
| 2 | so'z bosilganda; ustoz audiosi bog'lanishni tushuntirayotganda (xiralashtirmasdan) | bog'langan so'zga pastdan chiziq, turi yorlig'i, so'zning o'z rangi (och yashil, pushti), yashirin foil; bosilganda gapning qolgani xiralashadi |
| 3 | bosib turganda | so'z oynasi: to'liq e'rob (holat, alomat, izoh, hazf, sharh) |

## 3. Ranglar
**Matnda (doim) — 5 ta:**
| Rang | Nima | O'zgaruvchi |
|---|---|---|
| ko'k | mubtado; kananing/innaning ismi | `--cm` |
| qizil | xabar; kananing/innaning xabari | `--cx` |
| jigarrang | fe'l | `--cf` |
| binafsha | foil, noibi foil | `--co` |
| to'q yashil | maf'ulun bih (ikki maf'ul bo'lsa — ikkalasi) | `--nb` |

**Faqat bosganda — 2 ta** (matnda qora):
| Rang | Nima | O'zgaruvchi |
|---|---|---|
| och yashil | boshqa mansublar: maf'ulun mutlaq, lahu, zarf, ma'ahu, hol, tamyiz, mustasno, munodo | `--nn` |
| pushti | kana, inna va sheriklarining o'zi (kana, laysa, kada…; inna, anna, layta…; jinsni inkor qiluvchi «lo») | `--nz` |

- Qolgan hamma so'z qora: harflar, majrur, muzofun ilayh, tobe'lar.
- Zanna — oddiy fe'l rangida, ikki maf'uli to'q yashil.
- Qo'shilgan zamir o'z vazifasi rangida (bir so'z bo'laklab bo'yaladi); muzofun ilayh bo'lgan zamir qora.
- Ma'tuf — o'zi ergashgan so'z rangida. Jar-majrur xabar o'rnida — ikkala so'z qizil. Ismi foil fe'ldek amal qilsa — maf'uli yashil.

## 4. Bog'lanish chizig'i (2-qavat)
- Bog'langan bo'lakdan bosh so'zga **pastdan ingichka chiziq**, bosh so'z tomonda nuqta. Tutash — ibora (izofa, atf, sifat…), uzuq — mutaalliq (jar-majrur, zarf).
- Rangi — bosh so'zniki; bosh so'z qora bo'lsa — kulrang.
- Boshqa qatordagi so'zga — egri chiziq; boshqa gapdagi (tarkib qutisi orqasidagi) so'zga chiziq chizilmaydi, faqat yorliq.
- Yorliq — turi: мутааллиқ, маътуф, музофун илайҳ, хабари, баён, қайтади.
- **Yashirin foil:** fe'l tagida kichik arabcha zamir (هُوَ، أَنْتَ، نَحْنُ، أَنَا), binafsha; kananing yashirin ismi — ko'k. Ism fe'l/kanadan oldin kelsa — u mubtado, foil/ism — yashirin zamir. Qo'shilgan zamirga yozuv qo'yilmaydi.
- Bog'lanishlar ustoz audiosidagi tushuntirishdan olinadi (`TL` → `REL`); audioda yo'q bog'lanish uchun chiziq yo'q.

## 5. Ko'rib chiqilib rad etilganlar
Rangli fon (tutash / nuqtali / uzuq, ichma-ich, «ulab») — matn og'ir, foydalanuvchiga yoqmadi; doimiy chiziq yoki yoy (pastdan ham, tepadan ham); ramka («oyna»); doimiy strelka; holat rangi (raf/nasb/jar/jazm bo'yicha); matnda o'zbekcha yorliq; nosix ramkada yoki feruza; doimiy yashirin zamir yozuvi; matnda 7 rang (och yashil va pushti doim).

## 6. Kodda (fiqh `fN.html`)
- `#tx.fqn` — yangi ko'rinish. Tugma `#fvk` «Эски / Янги»; `localStorage["fiqh-vk"]` (0/1, sukut 1).
- So'z rangi: eski `c-*` yonida yangi `n-*` (`cm cx cf co cb cn cz`). `nk()` eskisidan o'giradi (`cj` → qora, `ch` → `cn`); farq bo'lsa `NC={"seg-so'z":"klass"}`. `cn`, `cz` matnda qora, `.foc` bo'lganda o'z rangida.
- `GR=[[seg, birinchi, oxirgi, tur, rang]]` — iboralar chegarasi; ko'rinmaydi, bosganda mutaalliq bo'lagini butunicha olish uchun (`.fg.gm`). Eski izofa yoylari (`IZ`, `.fiz`) yangi ko'rinishda yashirin.
- 2-qavat: `ykRel(kalit, nishonlar, tur, xira)` — chiziq `.fyk` (SVG, `#pM` ichida), yorliq `.fykc` (chetdan chiqmaydi), xiralashish `.fqfoc` / `.foc`; so'z bosilganda va audio `timeupdate` da. Bog'lanishi yo'q och yashil / pushti so'z bosilsa — faqat o'z rangiga kiradi.
- Belgilar qatori `.flgn` — 5 rangdan faqat darsda uchraganlari; izoh `.flgc` («Белгилар»).
- **Hali kodda yo'q:** yashirin foil yozuvi (2-darsda fe'l yo'q); o'qilayotgan so'z eski usulda yonadi.

## 7. Namunalar
`docs/tarkib-korinishi/asosiy-ranglar.png` — yakuniy ko'rinish (fiqh 2-dars matni + so'z bosilganda). Oldingi (rad etilgan, fonli) variantlar: `yakun-1…8.png` (61 holat), `oraga-soz-tushganda.png`, `yechim-uch-qavat.png`; generator `gen/yakun.py` (Playwright + Chrome).

## 8. Navbatda
1. Sinovdan keyin «Эски / Янги» tugmasini olib tashlab, bitta ko'rinish qoldirish.
2. Fe'lli matnda (arab tili darsi) sinash: yashirin foil yozuvi, och yashil / pushti bosganda.
3. Rang ajratishi sust odamlar uchun tekshiruv (qizil/yashil/jigarrang): och-to'qligi bilan ham farq qilsin.
4. O'qilayotgan so'z yonishini yangi ko'rinishga moslash.
5. Yo'riqnomaga mavzu; fiqh 1 va arab tili darslari (foydalanuvchi sinovni ma'qullagach).
