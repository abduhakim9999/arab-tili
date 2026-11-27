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

## 3a. Bog'lovchi harflar — asosiy ma'nolar, misolsiz
27.11.2026, foydalanuvchi: «fa undan oldingi jumlaga bog'liq … shu sababli / natijada / va / ya'ni kabi ma'nolar bo'lishi mumkin — bunaqa misollarni olib tashlasak, fa ning arablar biladigan ma'nosini bilsa»; «matnda kelgan holati ham qolsin».

- **Qaysi harflar:** وَ، فَـ، ثُمَّ، أَوْ، أَمْ، لَكِنَّ، لَكِنْ. Vovul hol (وَ ...) ham shu yerga kiradi: u وَ ning 4-ma'nosi.
- **Ma'no:** har darsda bir xil, harfning asosiy ma'nolari ro'yxati. Shu darsdagi ma'no ajratilib turadi: oddiy rangda, yonida «шу дарсда» belgisi (`VOC[4].hm`). Qolgan ma'nolar kulrang.
- **Misol yo'q.** Bu harflarning ma'nosi oldingi gapga bog'liq, bo'lak gap chalkashtiradi.
- **Takrorda bitta karta.** Boshqa darslardagi yozuvlar birinchisiga `ay` bilan bog'lanadi.
- **Ma'nolar bitta joyda:** `src/build/harf_manolar.json` (o'zbekcha va ruscha).
  - Ma'nolar tartibi o'zgarmaydi, chunki `hm` raqami shunga bog'langan. Yangi ma'no ro'yxat oxiriga qo'shiladi.
  - Turni dastur ma'nodagi «…ҳарфи)» so'zidan aniqlaydi (`ajrat.py turi()`). Shuning uchun qavs «ҳарфи)» bilan tugashi kerak, aks holda yozuv «so'z» bo'lib qoladi.
- **Qo'llash:** `src/build/lugat_harf.py`. Shu darsdagi ma'noni eski ma'nodan topadi; topa olmasa yoki xato topsa, `HM` ga qo'lda yoziladi.
- **Takrorda har ma'no — alohida karta** (27.11.2026, foydalanuvchi: «har bir ma'nosini bilish uchun alohida saqlab eslab qolish kerak emasmikin — hozir bitta bo'lib o'tib ketadi», → «qil»).
  - Ma'noning kursda birinchi uchragan yozuvi o'sha ma'noning kartasi bo'ladi: `asl` — bosh kartaga. Bosh karta — harfning kursdagi birinchi yozuvi, u o'z ma'nosining kartasi.
  - Shu ma'no keyin yana uchrasa, `ay` bilan o'sha kartaga bog'lanadi.
  - Karta o'quvchi o'sha darsni o'tganda ochiladi. Hozirgi darslar bo'yicha وَ da 5 ta, فَـ da 6 ta karta.
  - Karta «Маъноси?» turida:
    - old tomonda harf va matndagi gap turadi; harf yashil, harf gap boshida bo'lsa oldingi bo'lak ham beriladi;
    - orqa tomonda faqat shu ma'no (`km` = `uz[hm]`, `ajrat.py`) va gap tarjimasi chiqadi.
  - Karta gapi `lugat_harf.py` dagi `KARTA` da qo'lda tanlangan (`VOC[4].kg`, `{…}` — harf). `ajrat.py karta_gapi()`:
    - gap matnning bitta qatorida topilsa — dars gapi bo'ladi, ruschasi ham avtomatik;
    - topilmasa — misol sifatida beriladi (`x`; 71 va 91-darslarda).
  - Yangi darsda yangi ma'no chiqsa, unga `KARTA` qatori yoziladi (aks holda skript «DIQQAT» deydi).
  - Ruschada `km` — shu ma'noning ruschasi (`src/ru/ru.js`).
  - Bosh kartadagi eski o'quvchi natijasi o'z ma'nosida qoldi: وَ — «ва, ҳам», فَـ — «чунки».
- **Jar harflari** (فِي، مِنْ، عَلَى…) bu qoidaga kirmaydi. Ularning misoli qisqa birikmada tushunarli, fe'llarning to'q sariq belgisi ham shu misollarga tayanadi.

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
  - 2-bosqich (shu kuni): belgisi yo'q fe'llar matn bo'yicha tekshirildi. 4 tasiga boshqaruv qo'shildi: 71 تَشَابَهَ (فِي ..), 93 غَدَا (إِلَى ..), 93 رَجَعَ (إِلَى ..), 93 اِشْتَرَى (بِـ..).
  - Bir xil fe'l keyin keladigan jar harfi bilan har doim ham boshqaruv bo'lmaydi. Masalan: joy (جَلَسَ فِي), qism (أَكَلَ مِنْ, تَنَاوَلَ مِنْ), boshqa so'zga tegishli harf (يُفَضِّلُونَ الزَّوَاجَ بِـ…), qarata aytish (قَالَ لِـ). Bular belgilanmaydi.
- **Misol matndan (27.11.2026):** `src/build/lugat_misol.py`. Misollaridan hech biri matnda bo'lmagan 27 yozuvga matndagi gap birinchi misol bo'lib qo'shildi.
  - Gap so'zning matndagi o'rnidan (`w`) olinadi. Jar harfli fe'lda o'sha harf kelgan o'rin tanlanadi.
  - Gap 14 so'zdan uzun bo'lsa, vergulgacha qisqartiriladi. Tarjima `TR` dan olinadi.
  - Ruscha darsda tarjima `src/ru/dNN.json` dan olinadi.
  - Kitob misollari o'chirilmaydi.
- Diqqat: `kitob_hamma.py` yoki `vocNN.py` qayta ishga tushirilsa, keyin `lugat_jar.py`, `lugat_misol.py`, `lugat_harf.py` va `lugat_yangi_mano.py` ham ishga tushiriladi. Hammasi qayta ishlatilsa hech narsani buzmaydi. Sabab: `ay` bilan bog'langan qator yozuvni bog'langan so'zdan oladi.

## 7. Yangi dars lug'atini tekshirish
1. Jar belgisi bor har fe'lni ko'rib chiqish: harf misolda bormi? Yo'q bo'lsa, dars matnida bormi? Matnda ham yo'q bo'lsa, belgi qo'yilmaydi.
2. Misol matndan olinganmi? «МИСОЛ» chiqadigan yozuvlar ro'yxati: `node` + Playwright bilan sahifadagi `.la-mt` sanaladi. Namuna skriptlar — `src/build/scratchpad/lt/`.
3. Jar harfli misolda `{^…}` ikkala tomonda ham bormi: arabchada harf, tarjimada qo'shimcha.

## 8. Holat va qolgan ish (27.11.2026 oxiri)
- **Misollar:**
  - 1520 yozuvda misol dars matnidan;
  - 86 bog'lovchi harf misolsiz (3a);
  - 120 yozuv misolsiz: asosan sonlar, nisbalar va ismlar — kitob lug'atida bor, matnda yo'q;
  - 32 yozuvda kitob misoli qoldi, chunki so'z matnda topilmadi.
- **`lugat_misol.py` endi misolsiz so'zga ham misol qo'shadi.** So'zning matndagi o'rni yozilmagan bo'lsa, uni matndan o'zi qidiradi: shakllari bo'yicha, ال، و، ف، ب، ل oldi qo'shimchalari bilan.
  - Mos kelmagan topilmalar `TASHLA` ga yoziladi. Masalan: عَلِيٌّ ga عَلَيْكُمْ topilardi; أَهْلٌ ga «أَهْلاً وَسَهْلاً» iborasi tushardi.
  - Jami 27 + 134 yozuvga matndagi gap qo'shildi.
- **Yangi ma'no yozuvlari (`lugat_yangi_mano.py`):** 95 جَاءَ بِـ «(...ни) олиб келмоқ» (id 1761) va 70 سَمِعَ بِـ «(...ҳақида) эшитмоқ» (id 1760).
  - Ular dars VOC oxiriga qo'shildi va asosiy so'zga `asl` bilan bog'landi.
  - Matndagi o'rni asosiy yozuvdan shularga o'tdi.
- **Qolgan ish:** misolsiz 120 va kitob misolli 32 yozuv matnda yo'q. Ular shu holicha qoladi, yangi dars kelganda shu darsda uchrasa — o'sha darsdan misol olinadi.
