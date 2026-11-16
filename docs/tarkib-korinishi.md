# Tarkib ko'rinishi — yangi tizim (sinov)

Qaror: 16.11.2026, foydalanuvchi bilan chatda, rasm-namunalar asosida. Holat: **fiqh 2-darsda sinov** (`tayyor-fiqh-2`); boshqa darslarda eski ko'rinish. Bu fayl — yagona manba (grammatika qoidalari — konspektda, bu yerda faqat *qanday ko'rsatilishi*).

## 1. Tamoyil
- Matnda faqat **tarjima qilish uchun eng kerakli narsa** ko'rinadi. Qolgan hammasi (holat va alomati, aniq nomi, hazf) — so'zni bosib turganda ochiladigan oynada.
- O'qiyotganda vazifa muhim, holat (raf/nasb/jar/jazm) ikkinchi darajali.

## 2. Ranglar (7 ta)
| Rang | Nima | O'zgaruvchi |
|---|---|---|
| ko'k | mubtado; kananing/innaning ismi | `--cm` |
| qizil | xabar; kananing/innaning xabari | `--cx` |
| jigarrang | fe'l | `--cf` |
| binafsha | foil, noibi foil | `--co` |
| to'q yashil | maf'ulun bih (ikki maf'ul bo'lsa — ikkalasi) | `--nb` |
| och yashil | boshqa mansublar: maf'ulun mutlaq, lahu, zarf, ma'ahu, hol, tamyiz, mustasno, munodo | `--nn` |
| pushti | kana, inna va sheriklarining o'zi (kana, laysa, kada…; inna, anna, layta…; jinsni inkor qiluvchi «lo») | `--nz` |

- Qolgan hamma so'z **qora**: harflar, majrur, muzofun ilayh, tobe'lar (sifat, ta'kid, badal).
- Zanna — oddiy fe'l rangida, ikki maf'uli to'q yashil.
- Qo'shilgan zamir o'z vazifasi rangida (bir so'z bo'laklab bo'yaladi: fe'l + foil + maf'ul). Muzofun ilayh bo'lgan zamir qora.
- Ma'tuf — o'zi ergashgan so'z rangida, fonsiz.
- Jar-majrur xabar o'rnida — ikkala so'z qizil, fonsiz. Zarf xabar o'rnida — qizil, muzofun ilayhi bilan qizil fonda.
- Ismi foil fe'ldek amal qilsa — maf'uli yashil.

## 3. Bog'lanish — rangli fon
| Fon | Nima |
|---|---|
| tutash (`i`) | izofa; mavsul + sila; ichki jumla |
| ostida nuqtalar (`d`) | sifat va boshqa tobe'lar (ta'kid, badal, ishoradan keyingi badal) |
| ostida uzuq chiziq (`m`) | mutaalliq: jar-majrur, zarf birikmasi, lom + fe'l |

- **Fon rangi** — qaysi so'zga bog'lansa (yoki qaysi o'rinda bo'lsa), o'sha so'zning rangi. Ustun bo'lmagan so'zga bog'lansa — kulrang.
- **Ichma-ich**: fon ichida to'qroq fon (izofa zanjiri, jar-majrur ichida izofa, izofa + sifat, mavsul ichida sila). Ikki qavatdan oshirilmaydi: sifat yoki majrur o'rnidagi mavsulga alohida tashqi fon qo'yilmaydi — sifat/jar-majrur foni uni silasi bilan o'rab turadi.
- Zamirga izofa bitta so'z ichida — fonsiz.
- **Ichki jumla**: vazifasi ustun bo'lsa — o'sha rangda fon (xabar — qizil; aytilgan gap, «an» + fe'l, «anna» + jumla maf'ul o'rnida — yashil; mubtado o'rnida — ko'k). Hol jumlasi — och yashil fon. Shart jumlasi — kulrang, javobi fonsiz. Sila — mavsul foni ichida to'qroq fon; mavsul va foni mavsulning vazifasi rangida.
- **Oraga so'z tushsa**: oradagi so'z shu guruhniki bo'lsa — hammasi bitta fonda; begona bo'lsa — bog'lanuvchi so'z yolg'iz o'z fonida, rangi boshning rangi. Mubtado–xabar, fe'l–foil uzoqda bo'lsa — rangning o'zi bog'laydi.

## 4. Yashirin foil
- Foili yashirin fe'l (yoki ismi yashirin kana) tagida **kichik arabcha zamir** (هُوَ، أَنْتَ، نَحْنُ، أَنَا). Rangi yashiringan narsaning rangida: foil — binafsha, kananing ismi — ko'k.
- Qo'shilgan zamirga («katabtu») yozuv qo'yilmaydi — u rang bilan ko'rsatiladi. Ismi foilning yashirin zamiriga ham qo'yilmaydi (oynada).
- Ism fe'ldan yoki kanadan oldin kelsa, u mubtado; foil / kananing ismi — yashirin zamir, fe'l/kana jumlasi — xabar.
- Yozuv uchun qator orasi 3,0 → 3,3 (ichma-ich fon ichidagi fe'lda yozuv tashqi fondan pastga tushadi).

## 5. Ko'rib chiqilib rad etilganlar
Bog'lanishni chiziq/yoy bilan; ramka («oyna»); holat rangi (raf/nasb/jar/jazm bo'yicha bo'yash); so'z ostida o'zbekcha yorliq; nosix so'z ramkada yoki feruza rangda; ichki fon oq; yashirin foil uchun nuqta/chiziqcha.

## 6. Kodda (fiqh `fN.html`)
- Таркиб rejimida `#tx` klasslari: `fqn` — yangi ranglar, `fqg` — + fonlar. Bosqich tugmasi `#fvk`: «Эски / Ранг / Ранг + боғланиш»; `localStorage["fiqh-vk"]` (0/1/2, sukut 2).
- So'z rangi: eski `c-*` yonida yangi `n-*` (`cm cx cf co cb cn cz`). `nk()` eski klassdan o'giradi (`cj` → qora, `ch` → `cn`); farq qilsa `NC={"seg-so'z": "klass"}`.
- Guruhlar: `GR=[[seg, birinchi, oxirgi, tur, rang]]` — tur `i d m`, rang `m x f o b n g`. Ichma-ichlik oraliqlarning bir-birini o'z ichiga olishidan chiqadi; `line()` ularni eski izofa yoylari (`IZ`) bilan birga yasaydi. Klasslar: `.fg .gi/.gd/.gm .t*`, `.gp` (ichida guruh bor), `.gs` (3 so'zgacha — qatorda bo'linmaydi).
- Ranglar: `--nb`, `--nn`, `--nz` (kunduzgi va tungi); fon — `color-mix` bilan shu rangdan.
- Belgilar qatori `.flgn` — faqat darsda uchragan ranglar; izoh `.flgc`.
- **Hali kodda yo'q:** yashirin zamir yozuvi (2-dars matnida fe'l yo'q); o'qilayotgan so'z eski usulda (fon bilan) yonadi.

## 7. Namunalar
`docs/tarkib-korinishi/yakun-1…8.png` — 61 holat (ismiy jumla; kana, inna; fe'liy jumla; mansublar; izofa va mutaalliq; tobe'lar; mavsul va ichki jumlalar), `oraga-soz-tushganda.png`. Qayta yasash: `python3 docs/tarkib-korinishi/gen/yakun.py` (Playwright + Chrome).

## 8. Navbatda
1. Haqiqiy matnda ko'rib, bosqich sukutini tanlash (hammasi birdan yoki faqat bosilgan/o'qilayotgan gapda fon).
2. Rang ajratishi sust odamlar uchun tekshiruv: qizil/yashil/jigarrang, pushti/qizil, ikki yashil — och-to'qligi bilan ham farq qilsin.
3. O'qilayotgan so'z yonishini fondan boshqa usulga o'tkazish.
4. Uzun jumla foni qatordan qatorga bo'linishini sinash.
5. Yashirin zamir yozuvi kodi; fon bosilganda u tegishli so'z yonishi (qora so'zga bog'langan kulrang fon uchun).
6. Belgilashni tekshiruvchi skript; yo'riqnomaga mavzu; fiqh 1 va arab tili darslari (foydalanuvchi sinovni ma'qullagach).
