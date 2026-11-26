# 23. Dars «Машқ» savollari — tuzish tartibi va tekshiruv

26.11.2026, foydalanuvchi qarori: «savollarni yaxshilab tuzish kerak va tartib yo'lga qo'yilsin», «kelajakda tartibga to'g'ri kelmaydigan savol chiqsa ham moslashib, yaxshi yo'lni tanlab ketaverish kerak», «har safar o'zing mulohaza qilib qo'yishing kerak har bitta savolni — ma'lum qoida bo'yicha bo'lsa, xato ketib qolishi mumkin», «qil». Tarmoq: `tayyor-savol-tartib`.

## Asosiy tamoyil
Quyidagi tartib — **yo'l-yo'riq, qaror emas**. Har savol alohida o'ylanadi. Tartibga to'g'ri kelmaydigan holatda eng to'g'ri yo'l tanlanadi va qaror sababi bilan `src/build/savol-tuzatish.json` ga yoziladi (keyingi chat nima uchun shunday qilinganini bilsin). Tekshiruv dasturi faqat yordamchi: u topmagani «to'g'ri» degani emas.

## Tartib
1. **Bitta sinov:** «Bu savol nimani o'rgatadi?» Aniq javob bo'lmasa — savol qo'yilmaydi.
2. **So'ralmaydi (harakat savoli sifatida):**
   - harakati amalda o'zgarmaydigan so'z (mabniy yoki qotib qolgan: الْآنَ، مَعَ، أَيْضاً، جِدًّا، شُكْراً، عَفْواً، سُبْحَانَ);
   - yodlangan ibora (جَزَاكَ اللَّهُ خَيْراً، اَلْحَمْدُ لِلَّهِ، إِنْ شَاءَ اللَّهُ، أَهْلاً وَسَهْلاً…) — o'quvchi o'ylamay topadi; bunday so'z «Нима учун?» turida so'ralishi mumkin;
   - shu darsda yoki oldingi darsda aynan so'ralgan savol (bir xil so'z, harakat va vazifa). Darsning mavzusi bo'lsa va har biri boshqa narsani o'rgatsa (masalan, 97-dars: كَانَ — tanvinli / muzof / أَصْبَحَ) — qoladi;
   - shubhali (ixtilofli yoki manbasi aniq bo'lmagan) misol — matn kitobdagidek qoladi, faqat sinov savoli bo'lmaydi.
3. **Tur so'zga qarab** (yangi turlar — 3-bosqich, quyida):
   - oddiy mu'rab so'z — «Ҳаракати?» (hozirgi tur: so'z oxiri harakati);
   - harakat holatni ko'rsatmasa (jam'i muannas nasbi, ғайри мунсариф jarri, асмои хамса, мусанно, jam'i muzakkar) — «Ҳолати?»;
   - so'zning vazifasi muhim bo'lsa — «Нима учун?»;
   - ta'sir qilgan so'z uzoqda yoki yashirin bo'lsa — «Сабабчини топ».
4. **Variantlar:**
   - hammasi arabchada bor shakl (olmosh harakati moslansin: …تُهُمْ / …تَهُمْ / …تِهِمْ, «…تُهِمْ» emas);
   - bir-biridan ko'rinib farq qiladi (bir xil ko'rinadigan ikki tugma bo'lmaydi);
   - to'g'ri javob variantlar ichida aynan (harakati, tanvini bilan);
   - yorliq javobni ochib qo'ymaydi: yorliq — faqat harakat nomi («замма», «танвинли касра»…). Hamma variantda bir xilda holat yozilsa («و — раф», «ي — насб/жар») — mumkin. Qoida va sabab («касра ўрнига», «2 сукун учун») faqat javobdan keyin izohda;
   - chalg'ituvchi variant — o'quvchi rostdan adashadigan shakl (masalan, ғайри мунсариф so'zning tanvinli shakli).
5. **Dars bo'yicha muvozanat:**
   - doim bitta harakatni bosgan o'quvchi o'tish chegarasiga (80%) yetmasin;
   - darsning yangi grammatika mavzusiga ko'proq savol;
   - kamida 5 savol; kam qolsa — boshqa tur bilan to'ldiriladi, to'ldirish uchun ma'nosiz savol qo'shilmaydi.
6. **Izoh (`TRK` sababi):** qisqa, konspekt atamalari bilan; dars matnidagi tahlilga zid bo'lmaydi; bir xil holatga hamma darsda bir xil izoh.
7. **Shubhali joy:** ixtilofli masalada dars hujjatidagi qoladi; aniq bo'lmasa — foydalanuvchidan so'raladi.
8. **Tekshiruv:** avval dastur, keyin har savol o'qib chiqiladi (quyida).

## Qayerda nima
- Savol manbasi — dars sahifasi `NN.html`: `TRK` (qiyin joy → [ta'sir qilgan so'z, sabab]; savol shu kalitlardan olinadi), `QOV` (qo'lda variantlar; yo'q bo'lsa sahifadagi `qends()` o'zi yasaydi), `QUR` (savol «Машқ»dan chiqariladi — matn, Таркиб, izoh joyida qoladi). Ruscha `ruNN.html` — shulardan `src/ru/build.py` bilan.
- **Qarorlar — `src/build/savol-tuzatish.json`** (dars → `qur` / `trk` / `qov` / `qoldi`, har yozuvda sabab; `_kutadi` — faqat yangi turlar bilan hal bo'ladigan darslar). Qo'llash: `python3 src/build/savol_tuzat.py [NN …]` — faqat shu uch JSON qiymatini almashtiradi, qayta ishga tushirilsa o'zgarmaydi. Dars sahifasi generator bilan qayta yasalsa — shu skript yana ishga tushiriladi (generator manbalari `scratchpad/dNN/quizNN.py` ga alohida yozilmaydi).
- **Tekshiruv — `python3 src/build/savol_tekshir.py [NN …]`** (`data/mashq.json` bo'yicha, `ajrat.py` dan keyin): XATO (javobsiz, bir xil tugma, javobni ochuvchi yorliq, dars ichida takror) — albatta tuzatiladi; DIQQAT (qotgan so'z, yodlangan ibora, darslararo takror, shubhali olmosh shakli, 5 dan kam) — o'ylab qaror; BOSQICH3 (taxmin bilan o'tadi); KUTADI — `_kutadi` darslari. `qoldi` dagi kalitlar ko'rsatilmaydi. Chiqish kodi XATO bo'lsa 1.
- Ish tartibi (savol o'zgarganda): `savol-tuzatish.json` → `savol_tuzat.py` → `ajrat.py --ochir` → `tekshir_data.py` → `savol_tekshir.py` (XATO 0) → ruscha bo'lsa `src/ru/build.py NN --out .` + `harvest.py` (MISS 0) → har o'zgargan savolni o'qib chiqish.

## Holat (26.11.2026)
- 379 savolning hammasi o'qib chiqildi. E'rob va izohlar deyarli hammasi to'g'ri. 40 ta qaror (`savol-tuzatish.json`): 26 savol chiqarildi (dars ichida takror 10, darslararo takror 1, yodlangan ibora / qotgan so'z 13, shubhali misol 1, mabniy 1), 2 izoh (5, 6-dars سَهْلاً — dars tahliliga moslandi), 12 variant to'plami (javobni ochuvchi yorliq 4, bir xil ko'rinadigan tugma 3, olmosh shakli 2 — 92-dars, `c` belgisi 2, yorliq bir xillash 1). 4 savol o'ylab qoldirildi (`qoldi`). Mashq: 379 → 353. Tekshiruv: avval XATO 20 / DIQQAT 65 → XATO 0 / DIQQAT 0, KUTADI 44.
- Variant yorlig'idagi `c` — **harakat** belgisi (R замма, N фатҳа, J касра, Z сукун/жазм, B мабний), holat emas. Holat savoli uchun holat dars matnidagi tahlildan olinadi.
- **3-bosqich (kutadi):** 1–8 va 12-darslar — suhbat darslari, so'raladigan so'zlar deyarli hammasi raf yoki yodlangan ibora; faqat «Ҳаракати?» bilan yaxshi savol bo'lmaydi (1, 2, 7, 12 — taxmin bilan o'tadi; 8 — 4 savol). Yangi turlar ko'rinishi foydalanuvchiga ko'rsatiladi, ma'qul bo'lsa avval bitta darsda sinov.
- «Боб якуни» (ixtiyoriy aralash savollar) — 3-bosqichdan keyin alohida gaplashiladi.
