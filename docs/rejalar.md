# Keyingi rejalar (hali qilinmagan)

Foydalanuvchi aytganda qilinadi. Qilingani shu yerdan o'chirilib, tegishli joyga (texnik.md / CLAUDE.md) yoziladi.
Manba: 11.11.2026 tadqiqoti (Claude Docs: «Arab Tili loyihasi: yo'lga qo'yilganlik tadqiqoti»).

## 1. O'quvchi taraqqiyoti: takror, reyting, ilova (foydalanuvchi qarorlari, 12.11.2026)
Qilingan qismi — `docs/texnik.md` 14 (ma'lumot fayllari, «Такрорлаш» sinovi).
- **Qarorlar:** sayt, Telegram Mini App va kelajakdagi app — bitta server, bitta hisob, bitta kod. Hisob ichki raqam bilan; kirish hozir Telegram, keyin Google va Apple. Natijalar avval qurilmada (oflayn), keyin serverga sinxronlanadi. Taxallusni o'quvchi o'zi yozadi (takrorlanmasin, nojo'ya so'z o'tmasin). So'z, mashq savoli va qoida belgilari — o'zgarmas raqamli `data/` fayllarida. Takror va ball hisobi alohida modul (`takror.js`); reyting serverda hisoblanadi (aldab bo'lmasin). Hozirgi «Машқ» qoidalari o'zgarmaydi; takror — alohida bo'lim. Xavfsizlik va o'quvchi ma'lumotlari maxfiyligiga e'tibor.
- **Qamrov:** takror va reyting 1-kitob boshidan; yangi dars qo'shilsa o'zi kiradi. 2-kitob darslari hozircha kirmaydi. Atoqli otlar va harflar takrorga kirmaydi.
- **Funksiyalar:** 1) oraliqli takror (FSRS, ~90%); 2) faol eslash kartalari (arabcha → ma'no, ma'no → arabcha, ovoz → ma'no, so'z oxiri harakati); 3) «Билган сўзларим»; 4) qoidalar xaritasi (savollar qoida belgilari bilan — qaysi qoida mustahkam, qaysi zaif); 5) kunlik maqsad, streak (muzlatish bilan), taqvimda faollik; 6) haftalik reyting/liga (taxallus; ball faqat to'g'ri takror va yangi o'zlashtirilgan so'z uchun); 7) eslatma (hozir bot, appda push); 8) kitob darslari asosidagi o'z daraja shkalasi va daraja testi (A1–C2 yozilmaydi); 9) statistika (so'zlar, takrorlar, aniqlik, vaqt).
- **Bosqichlar:** 1) ma'lumot fayllari — qilindi; 2) bitta darsda sinov (kartalar, FSRS, hisoblagich) — 1-dars, saytga joylandi 12.11.2026 (keyingisi: 2–9-darslarni ochish); 3) server va hisob; 4) reyting, streak, eslatma; 5) Android app (o'rta yo'l: haqiqiy qobiq — pleyer, push, oflayn; darslar saytdan) → Play Market; 6) rivojlantirish, daraja testi, fikrlar; 7) to'laqonli Android app (o'sha server va ma'lumotlar); 8) Apple.
- **Ochiq:** 2 tugma va kuniga 10 yangi so'z, «bilgan» = 7 kun — Claude tavsiyasi bilan qo'yildi, foydalanuvchi sinovda ko'rib tasdiqlaydi. O'zini baholash (Билдим) reyting ballida qanday hisoblanishi — 4-bosqichda hal qilinadi.

- **«Йўл» va «Созламалар» — qolgan ish (13.11.2026; tafsilot `docs/texnik.md` 15–16):** dizayn kodga o'tkazildi, sinovda (`sinov-yol.html`, `sinov-sozlamalar.html`). Qolgani: 1) foydalanuvchi ko'rib izoh beradi → tuzatish; 2) «joyla» degach asosiy saytga: `yol-sinov` tarmog'ini `main` ga qo'shish (o'zgarganlari: `yol.html`, `sozlamalar.html`, `takror.html`, `takror.js`, `tg.js`, `shell.js`, `nahv.html`, `data/lugat.json`, `data/ikonka.json`, `fon/`, `src/build/ajrat.py`, `ikonka.py`), bosh sahifaga «Йўл» kartasi, `sw.js` FILES, `deploy.sh` ga `ikonka.py` tekshiruvi; joylashdan keyin telefonda tekshirish; 3) sozlamalardagi «тез орада»lar (yozuv kattaligi, harakat, tarjima, oflayn saqlash) — `shell.js` / `sw.js` ishi; 4) dars sahifasida qulf, ruscha. ElevenLabs'da 13.11 da jami ≈2317 kredit ketgan (1-bob rasmi, yo'l g'oyalari, 6 ta bob foni, 5 ta bob kartasi rasmi).
- **So'z bazasi va «Луғат» (13.11.2026, foydalanuvchi qarori; sinovda):** qilindi — dars oxirida so'zlarni saralash (bilmaganlar belgilanadi), bob imtihonida bilmaganlarning hammasi + tekshiruv, xato so'z qayta so'raladi, «Такрорлаш» ichida «Луғат» yorlig'i (holat, daraja, statistika, qidiruv), harf va olmoshlar bazada, dars ichida «билмайман» belgisi (hamma darslar, `shell.js`), ko'plik va muannas ko'rsatiladi, «Машқ» yorlig'i — Сўзлар / Феъллар / Ҳарфлар mashqlari (`docs/texnik.md` 15). **Navbatda:** fe'l shakllari va ko'pliklarni ham takror jadvaliga (FSRS) kiritish; harf turi izohi yo'q harflarga tur qo'shish (dars hujjati/konspekt bo'yicha); matndagi so'zni lug'at yozuviga bog'lash (so'z oynasidan belgilash uchun); keyin belgilar va jurnalni serverga ko'chirish (telefon almashsa yo'qolmasin).

## 2. Repo va joylash tartibi
- Ish belgisi (`lock.sh`), sinov (`sinov.sh`) va align fayllarini `main` dan alohida tarmoqqa chiqarish: Vercel'da 21 yig'ishdan 4 tasi reliz edi (10–11.11). Sinov havolasi o'zgaradi — avval kelishiladi.
- Push paytida yengil avtomat tekshiruv (GitHub Actions): sahifa ochiladimi, `sw.js` FILES dagi fayllar bormi.
- Yig'ishni tiklanadigan qilish: skriptlardagi eski sessiya yo'li (`d13da55d…`, 23 fayl) o'rniga bitta o'zgaruvchi; `shell.js`, `shell.css`, `tg.js` uchun bitta manba (ildiz va `src/build` farq qiladi).
- Audio'ni git tarixidan tashqarida saqlash (masalan Cloudflare R2 — mobil ilova rejasida): tarixda 2530 mp3, 374 MB; oyiga ~340 MB o'sish.
  - Qachon boshlanadi: GitHub'dagi repo hajmi **700–800 MB** ga yetganda (foydalanuvchi qarori, 11.11.2026; o'shanda 337 MB). GitHub: 1 GB gacha tavsiya, 5 GB dan ogohlantiradi, bitta fayl 100 MB dan katta bo'lsa qabul qilmaydi. Hajmni ko'rish: `gh api -X GET search/repositories -f q='repo:abduhakim9999/arab-tili' --jq '.items[0].size'` (KB).
  - `src/build/scratchpad/` dagi mp3 lar repodan olinmaydi: ~37 MB — Eshitish manba ovozlari (pullik, qayta yig'ish uchun kerak); saytdagisi bilan bir xillari git'da qo'shimcha joy olmaydi.
- Ochiq savol: Vercel bepul tarifida kunlik joylash chegarasi.

## 3. Play Market
- `action-capacitor-android` (GitHub Actions'da saytdan Android ilova), `awesome-capacitor` ro'yxati.

## 4. Videolar / oyat misollari (kerak bo'lsa)
- `quran-align` (cpfair): qorilar ovozida har so'z vaqti — oyat misolida so'z yonishi uchun.

## 5. Tarmoqlar
- `main` ichidagi 11 tarmoqni o'chirish (foydalanuvchi GitHub'da o'zi o'chiradi yoki Claude): gap-turi, legenda-yopiq, mahzuf-feil, mahzuf-korinishi, menyu-tepada, tarkib-eshitish, tarkib-tarjima, tinglash-93, uzbek-ovoz-v161, versiya-yozuvi, xabar-izohi.

## 6. Bepul ovoz — VoiceStudio / OmniVoice (sinaldi 11.11.2026)
- Model `k2-fsa/OmniVoice` (pip `omnivoice`, 3.3 GB, HuggingFace'dan yuklanadi) Claude bulut kompyuterida videokartasiz ishladi: yuklash 22 s, so'z ~18 s, gap ~23 s. ElevenLabs krediti ketmaydi.
- Til kodlari: arabcha fusha — `arb` (`ar` tanilmaydi), o'zbekcha — `uz`.
- O'z ovozi: foydalanuvchi eshitib «yaxshi» dedi (سَبْعٌ، صُورَةٌ، عَائِلَةٌ، مُعَلِّمٌ, bitta arabcha va bitta o'zbekcha gap).
- Ovoz nusxalash (96-dars yozuvidan 6 s namuna): «juda yomon, o'xshamadi» — ishlatilmaydi.
- Keyingi qadam (aytilganda): bitta dars Луғат/Матн'ini ElevenLabs bilan yonma-yon solishtirish; tanvin (vaqfsiz) va ع/ص/ح ni tekshirish.

## Kerak emas deb topilgan (Claude yaxshiroq)
- Harakat qo'yish (Mishkal, libtashkeel, Sadeed), tahlil (CAMeL Tools, I3rab), bepul ovoz (Habibi, ArTST).
