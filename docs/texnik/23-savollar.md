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
- **3-bosqich — bajarildi (26.11.2026):** 1–8 va 12-darslar yangi turlar bilan qayta tuzildi (quyida). `_kutadi` bo'sh; `savol_tekshir.py` — XATO 0, DIQQAT 0, BOSQICH3 0.

## Yangi savol turlari (26.11.2026; foydalanuvchi chizmani ko'rib «Ha yaxshilab qil» — sinov 7-dars; keyin «Hammasini qil» — 1–6, 8, 12)
- **Turlar:** `h` «Ҳолати?» (Раф / Насб / Жар — yoki `o` bilan boshqa), `v` «Нима учун?» (`s` — savol matni, `o` — variantlar), `s` «Сабабчини топ» (gapdagi qolgan so'zlar bosiladi; ta'sir qilgan so'z boshqa qatorda bo'lsa — o'sha qator ham tepada; `j` — kalit, sukut `TRK` dagi). `j` — to'g'ri javob, `iz` — javobdan keyin (sukut `TRK` sababi), `sabab` — nima uchun shunday tuzilgani (sahifaga yozilmaydi). Hammasi **qo'lda, har savol alohida o'ylab** — `savol-tuzatish.json` → `tur`; avtomatik yasalmaydi (masalan, «Нима учун?» chalg'ituvchisi bahsli bo'lmasin: 7-dars عَدْنَانُ — «Хабар», «Атфи баён» qo'yilmadi, ba'zi kitoblarda shunday tahlil bor).
- **Qachon qaysi:** harakati holatni ko'rsatmasa yoki oxiri ko'rinmasa (mabniy هَذِهِ — kasra, lekin raf o'rinda; olmoshli أُسْرَتِي, maqsur عِيسَى) — «Ҳолати?»; darsning yangi qoidasi sababni so'rasa (عَبْلَةُ — nima uchun tanvinsiz) yoki so'zning vazifasi muhim bo'lsa — «Нима учун?»; bog'lanishni ko'rish kerak bo'lsa (fe'l → foil, mubtado → xabar) — «Сабабчини топ». Bir so'z — bitta savol: turli savoli bor so'zning harakat savoli darsdan va «Такрор»dan chiqadi. Harakat savolida chalg'ituvchi — o'quvchi rostdan qiladigan xato (muzof yoki ғайри мунсариф so'zga tanvin: صُورَةٌ، سَعِيدَةٌ).
- **Kod:** `savol.js` (umumiy; ko'rsatish, baholash, o'z CSS) + sahifa «Машқ» kodidagi 7 ilgak (`savol_tuzat.py` `KOD` — darsda `tur` bo'lsa o'zi qo'yadi, `<script src="savol.js">` ham; «Машқ» kodi 26 darsda bir xil, aniq matn bilan). Saqlash: turli savol `S.q.o` da `[qator, so'z, tur]`; tiklashda to'plam hozirgi rejaga mos bo'lmasa (tur o'zgargan, savol qo'shilgan) — «Машқ» qaytadan. Ruscha — o'sha kod; matnlar `src/ru/lugat-umumiy.txt` (umumiy) va `dNN.txt` (izohlar).
- **Ma'lumot:** `ajrat.py` sahifadan (`QTX.ops`, variant tartibi sahifadagidek) `data/mashq.json` → `"t"` ro'yxati (`id` — `idlar.json` `T|…` kaliti, `k`, `t`, `s`, `o`, `to` — to'g'ri indeks, `ok` — «Сабабчини топ» so'z kalitlari, `iz`, `gap`, `tr`). `"s"` — faqat harakat savollari («Такрор» o'zgarmadi; turli savollar «Такрор»ga hozircha kirmaydi). `darslar.json` `mashq` — ikkalasi birga.
- **`yol.html yigish`:** turli savolni `t` bo'yicha baholaydi (`c === to`; xato `Такрор` ro'yxatiga qo'shilmaydi). Saqlangan javoblarda hozir yo'q savol bo'lsa (eski to'plam) — foiz qayta hisoblanmaydi, avvalgi `R.d` qoladi (bir-ikki qolgan savoldan «o'tdi» chiqmasin); sinov: eski 8 savollik saqlanma, natija 25% → o'zgarmadi, dars ochilganda 9 savol qaytadan.
- **Tekshiruv:** `savol_tekshir.py` turli savollarni ham ko'radi (to'g'ri javob, variant takrori, izoh; taxmin foizi: doim «замма / Раф», «фатҳа / Насб» yoki «касра / Жар» bosish, boshqa turda — tasodif). Playwright: har savol (to'g'ri / xato), natija, qayta yuklash, `yol` foizi, ruscha (`ru7.html` — o'zbekcha qolgan matn 0).
- **7-dars (9 savol):** «Ҳаракати?» — صُورَةُ (muzof — tanvinsiz), سَعِيدَةُ (ғайри мунсариф); «Ҳолати?» — هَذِهِ (Раф), أُسْرَتِي (Жар), عِيسَى (Раф); «Нима учун?» — عَدْنَانُ (Бадал), عَبْلَةُ (ғайри мунсариф); «Сабабчини топ» — اللَّهُ (شَاءَ), مُهَنْدِسٌ (هُوَ). Chiqarildi: طَبِيبَةٌ، طَالِبٌ، مُعَلِّمَةٌ — «هِيَ/هُوَ … хабари» bir xil namunasi 3–4 marta. Taxmin foizi 56% (avval 100%).
- **1–6, 8, 12-darslar** (`tayyor-savol-turlar`; har dars matni o'qilib, har savol alohida o'ylandi — sababi `savol-tuzatish.json` da): suhbat darslarida harakat savoli deyarli hammasi «замма» yoki yodlangan ibora edi — endi asosiy tuzoqlar so'raladi: **harakat ≠ holat** (mabniy مَا، كَيْفَ، أَيْنَ، أَنْتِ، هِيَ، هَذَا، مَاذَا — ko'rinadigan harakat holatni bildirmaydi; olmoshli أَخِي، صَدِيقَتِي — raf, kasra ko'rinsa ham), **tanvin bor-yo'qligi va sababi** (munsarif خَالِدٌ / ғайри мунсариф خَوْلَةُ، خَدِيجَةُ، مِصْرَ / ال — الْعَبَّاسُ / ة li erkak ismi حَمْزَةُ / muzof عَبْدُ، بَعْضَ / nisba sifat تُرْكِيٌّ، مِصْرِيَّةٌ), **ta'sir qiluvchi** (jar harfi مِنْ، muzof أُسْرَةُ، fe'l أُرِيدُ، mubtado → xabar; هَلْ hech narsani raf qilmaydi), **vazifa** (xabar muqaddamdan keyingi mubtado; مَعَ — jar harfi emas, zarf; ma'tuf; أَيّ — savol so'zlari ichida mu'rab), fe'l holati (تُرِيدُ — raf, variantlar Раф / Насб / Жазм).
- **Parallel darslar** (1↔2, 3↔4, 5↔6 — erkak/ayol suhbati): bir xil so'z bir xil tur bilan ikki marta so'ralmaydi — ikkinchi darsda boshqa tur (masalan, كَيْفَ: 1-dars «Ҳолати?», 2-dars «Нима учун доим фатҳа?»; بَاكِسْتَانَ harakati — 3-dars, مِصْرَ sababi — 4-dars). Salom, أَهْلاً وَسَهْلاً, الْحَمْدُ لِلَّهِ — bir marta.
- **«Сабабчини топ» faqat haqiqiy ta'sir qiluvchida:** fe'l → foil/maf'ul, jar harfi (alohida so'z bo'lsa), muzof → muzofun ilayh, mubtado → xabar. Mubtadoning o'zi (ta'sir qiluvchisi — ibtido, so'z emas), ma'tuf (TRK bog'liq so'zi — ma'tuf alayh, ta'sir qiluvchi emas) va jar harfi so'zga qo'shilgan holat (لِلَّهِ) — bu turda so'ralmaydi.
- **Savollar soni:** 1 — 6, 2 — 5, 3 — 7, 4 — 5, 5 — 5, 6 — 6, 7 — 9, 8 — 6, 12 — 7 (jami mashq: 304 harakat + 42 turli). 8-darsga 2 yangi harakat savoli (`trk` `"yangi": true` — TRK ga izoh qo'shiladi): وَالِدُهُ (olmosh هُ/هِ moslashuvi), عَبْدُ (muzof — tanvinsiz). Har darsda doim bir tugmani bosish 80% ga yetmaydi.
- **Ball** (`shell.js` `qans` o'rami) turli savolda ham ishlaydi — `QTX.ans` `q.ch`/`q.ok` ni o'rnatadi. Playwright (uz/ru, 1–8, 12): har savol to'g'ri/xato, natija = kutilgan, `yol` foizi to'g'ri, xato yo'q, ruscha o'zbekcha qolgan matn 0. `savol.js`: «Сабабчини топ» savoli olmoshli so'zda holatni izohdan oladi («шунинг учун раф»).
- «Боб якуни» (ixtiyoriy aralash savollar) — 3-bosqichdan keyin alohida gaplashiladi.
