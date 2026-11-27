# Lug'at qoidasi — yagona manba

Dars «Луғат» yorlig'idagi har yozuv nimadan iborat bo'ladi va qanday ko'rinadi. Yangi dars lug'ati boshidanoq shu qoida bilan tuziladi. Eski dars tuzatilganda ham shu qoidaga keltiriladi.

Asos — 27.11.2026, foydalanuvchi so'zlari:
- «so'zning o'zi, tarjimasi alohida, matndagisi bilan matndagi tarjimasi alohida — bir-biriga qorishib ketmasin»;
- «mufrad bilan jam ketma-ket yoziladi, orada ج; muannasi bo'lsa — مؤ bilan»;
- «ikkalovi bir xil bo'lsa — bitta misol yetarli»;
- «jar harfini belgilab, tagida misolda jar harfi bergan ma'noni ham belgilab ko'rsatsin»;
- «ba'zi fe'llar jar harfisiz o'zi shundoq ma'no beradi — ularga ko'rsatish shart emas»;
- «aynan matndagi ma'noni tushuntirib berish kerak lug'at».

Ma'lumot oqimi va skriptlar — `docs/texnik/14-takror-malumot.md`. Bu faylda faqat qoidaning o'zi.

## 1. Lug'atga nima kiradi
- Dars matnidagi **hamma so'z**, matn tartibida. Ot `ال`siz yoziladi. Qo'shilib keladigan harf va olmosh ham kiradi (بِ، وَ، سَ، ..كِ، ..هَا).
- Oldingi darsda shu ma'noda bor so'z yangi kartaga aylanmaydi. U o'sha yozuvga `ay` bilan bog'lanadi. Yangi ma'no bo'lsa — `asl` bilan o'z kartasi bo'ladi.
- Takrorga kirmaydiganlar (atoqli otlar, sonlar va h.k.) ma'nodagi belgidan bilinadi: «(эр.исми)», «(аёл исми)», «(вил.шаҳ.)».

## 2. Bosh qator — so'zning o'zi
**Ot.** Birlik, ko'plik va muannas bitta qatorda, kitobdagidek ketma-ket yoziladi:
- muzakkar, muannasi yo'q: `دَرْسٌ ج دُرُوسٌ`;
- muannasi bor: `مُعَلِّمٌ مؤ. مُعَلِّمَةٌ ج مُعَلِّمُونَ`;
- «ة»siz muannas ot (أَرْضٌ، يَدٌ، نَفْسٌ): so'z yonida «(مؤ.)» chiqadi (VOC `mq: 1`).

Ko'plik to'liq yoziladi (kitobdagi «..ُونَ» kengaytiriladi).

**Fe'l.** To'rt shakl yoziladi: moziy – muzore' – amr – masdar.

**Boshqaruv** yozuv oxirida, qavsda turadi:
- **Jar harfi** — `(فِي ..)`, `(عَلَى ..)`, `(بِـ..)`… Faqat so'z **dars matnidagi ma'nosida** shu harf bilan kelsa yoziladi. Matnda harfsiz kelsa, yozilmaydi va o'zbekchada «(...га)» ham bo'lmaydi.
  - Masalan, سَاعَدَ الْأُسْرَةَ («oilaga yordam beradi») — belgisiz, ma'nosi «ёрдам бермоқ».
- **Ikki maf'ul** — `(هُ هُ)` (أَعْطَى، جَعَلَ…). Bitta maf'ul «(هُ)» yozilmaydi.
- Lozim fe'l (نَزَلَ) va nosix (كَانَ) belgisiz bo'ladi.

## 3. Ma'no
- **Matndagi ma'no** birinchi turadi va katta yoziladi. Katta lug'atlardagi boshqa muhim ma'nolar (`y`) uning tagida kichik va kulrang bo'ladi. Ma'no bittadan ko'p bo'lsa, raqamlanadi.
- Ot `ال`siz, fe'l «-моқ» bilan yoziladi. Testda fe'l moziyda so'raladi («-ди», `lugat-moziy.json`).
- Jar harfi bo'lsa, ma'no boshida uning o'zbekcha jufti turadi: «(...га)», «(...да)», «(...дан)», «(...ҳақида)», «(...учун)», «(...билан)».
  - Jar harfi o'zbekchada «-ни» bo'lib tushsa, «(...ни)» yoziladi: حَافَظَ عَلَى → «(...ни) сақламоқ».
  - Jar harfisiz fe'lda oddiy «-ни» va «-га» yozilmaydi.

## 4. Misol
- **Bitta misol.** U dars matnidan olinadi; matndagi gapning qisqartirilgan bo'lagi ham bo'lishi mumkin.
- Ustida chiziq va sarlavha turadi:
  - «МАТНДА» — misolning hamma so'zi matnning bitta qatorida bo'lsa;
  - «МИСОЛ» — misol kitobdan olingan va matnda yo'q bo'lsa.
  - Ruschasi: «В ТЕКСТЕ», «ПРИМЕР».
- Arabcha doim tepada, tarjima doim ostida turadi. Ular yonma-yon qo'yilmaydi.
- Ma'lumotda bir nechta misol bo'lishi mumkin (kitob lug'ati, takror kartasi ularni ishlatadi). Ko'rinishda baribir bittasi chiqadi. Tanlash tartibi:
  1. jar harfi belgilangan misol;
  2. bo'lmasa, dars matnidagi misol;
  3. bo'lmasa, birinchi misol.
- **Belgilar** (VOC misolida; `data/lugat.json` ga belgisiz chiqadi):
  - `{…}` — so'zning o'zi va tarjimadagi uning ma'nosi (yashil);
  - `{^…}` — jar harfi va tarjimadagi unga mos qo'shimcha (to'q sariq). Masalan: `{بَارَكَ} اللَّهُ {^فِي}كَ` — `Аллоҳ сиз{^га} {барака берсин}`.
  - Belgisiz (kitob) misolda so'zni kod o'zi topib yashil qiladi. Qavsdagi boshqaruv qidirilmaydi.
  - Jar harfi misolda bo'lmasa, to'q sariq rang yo'q.

## 5. Ranglar
| Rang | Nima |
|---|---|
| yashil | so'z va tarjimadagi ma'nosi (misolda) |
| to'q sariq | jar harfi: tepadagi `(فِي ..)`, ma'nodagi «(...да)», misoldagi harf va qo'shimcha — bitta rang, bir-biriga bog'lanadi |
| kulrang, kichik | `ج`, `مؤ.`, ma'no raqami, boshqa ma'nolar, «МАТНДА» sarlavhasi |

Tungi rejimda yashil va to'q sariq ochroq bo'ladi.

## 6. Qayerda turadi
- **Ma'lumot:** `N.html` dagi `VOC` — `[kn, yozuv, [ma'nolar], [[arabcha, tarjima]…], {y, w, ay, asl, mq…}]`. Undan `src/build/ajrat.py` `data/lugat.json` ni yasaydi.
- **Ko'rinish:** `shell.js` — `tuz()` (ma'no, ج/مؤ., misol tanlash, «МАТНДА»), `bosh()` (qavs), `belgi()` (`{…}`, `{^…}`), `matnda()`, `topib()`. Kod ikkala til uchun bitta.
- **Manba:** yangi darslar — `src/build/scratchpad/aNN/vocNN.py`; kitob lug'ati darslari — `lq/kNN.py` (`SILA`), `lq/bNN.txt`.
- **Bir martalik tuzatish (27.11.2026):** `src/build/lugat_jar.py`.
  - 6 yozuvdan matnda yo'q boshqaruv olib tashlandi: 70 أَمَرَ, 74 شُكْراً, 91 va 98 سَاعَدَ, 94 نَطَقَ, 96 وَجَبَ.
  - 62 misolda jar harfi belgilandi.
  - So'z raqamlari saqlandi.
  - Diqqat: `kitob_hamma.py` yoki `vocNN.py` qayta ishga tushirilsa, keyin `lugat_jar.py` ham ishga tushiriladi. Sababi: `ay` bilan bog'langan qator yozuvni bog'langan so'zdan oladi.

## 7. Yangi dars lug'atini tekshirish
1. Jar belgisi bor har fe'lni ko'rib chiqish: harf misolda bormi? Yo'q bo'lsa, dars matnida bormi? Matnda ham yo'q bo'lsa, belgi qo'yilmaydi.
2. Misol matndan olinganmi? «МИСОЛ» chiqadigan yozuvlar ro'yxati: `node` + Playwright bilan sahifadagi `.la-mt` sanaladi. Namuna skriptlar — `src/build/scratchpad/lt/`.
3. Jar harfli misolda `{^…}` ikkala tomonda ham bormi: arabchada harf, tarjimada qo'shimcha.

## 8. Hali qilinmagan (27.11.2026)
- **67 so'zda ko'rsatilgan misol matndan emas.** Ular kitob misollari, asosan 70–74, 91 va 1–12-darslarda. Ularni matndagi gap bilan almashtirish kerak: `lugat_gap.py` topgan `g` gapi bor, tarjimasi `TR` dan olinadi.
- **255 so'z misolsiz.** Asosan sonlar va ismlar.
- **Fe'l boshqaruvi faqat jar belgisi bor 75 yozuvda tekshirildi.** Belgisi yo'q fe'llar matnda jar harfi bilan kelgan bo'lishi mumkin — ular alohida tekshiriladi.
