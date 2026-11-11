# Keyingi rejalar (hali qilinmagan)

Foydalanuvchi aytganda qilinadi. Qilingani shu yerdan o'chirilib, tegishli joyga (texnik.md / CLAUDE.md) yoziladi.
Manba: 11.11.2026 tadqiqoti (Claude Docs: «Arab Tili loyihasi: yo'lga qo'yilganlik tadqiqoti»).

## 1. Lug'at «Такрорлаш» — ts-fsrs (eng foydali)
- Kutubxona: ts-fsrs (open-spaced-repetition, JS, server kerak emas). Nusxasi repoga qo'yiladi (CDN emas).
- O'quvchi: bosh sahifada «🔁 Такрорлаш · бугун N сўз» → arabcha so'z (harakatli, ovozi o'zi) → «Кўрсатиш» → ma'no, ko'plik / fe'l shakllari → baho tugmasi. Bilmagani shu kuni yana, bilgani 1 kun → 3 kun → hafta (FSRS hisoblaydi). Oxirida «Бугунга тамом. Эртага N сўз».
- So'zlar: o'quvchi ochgan darslar lug'ati; kuniga yangi so'z chegarasi, takrorlar hammasi.
- Ish: yangi `takror.html` + kutubxona nusxasi + bosh sahifada karta; dars sahifalariga tegilmaydi; `sw.js` FILES. Avval sinov.
- Ovoz: mavjud Луғат kliplari (yangi generatsiya yo'q).
- Cheklov: natija telefonda (localStorage); keyin Telegram CloudStorage (feellar.html dagidek).
- Hal qilinmagan: tugmalar 2 ta (Билмадим/Билдим — tavsiya) yoki 4 ta; kuniga nechta yangi so'z (taklif 10); sinov darsi (taklif 7-dars, 23 so'z, Hijozi ovozi).

## 2. Repo va joylash tartibi
- Ish belgisi (`lock.sh`), sinov (`sinov.sh`) va align fayllarini `main` dan alohida tarmoqqa chiqarish: Vercel'da 21 yig'ishdan 4 tasi reliz edi (10–11.11). Sinov havolasi o'zgaradi — avval kelishiladi.
- Push paytida yengil avtomat tekshiruv (GitHub Actions): sahifa ochiladimi, `sw.js` FILES dagi fayllar bormi.
- Yig'ishni tiklanadigan qilish: skriptlardagi eski sessiya yo'li (`d13da55d…`, 23 fayl) o'rniga bitta o'zgaruvchi; `shell.js`, `shell.css`, `tg.js` uchun bitta manba (ildiz va `src/build` farq qiladi).
- Audio'ni git tarixidan tashqarida saqlash (masalan Cloudflare R2 — mobil ilova rejasida): tarixda 2530 mp3, 374 MB; oyiga ~340 MB o'sish.
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
