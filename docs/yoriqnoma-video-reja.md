# Ilova yo'riqnoma videolari — turkum rejasi

26.11.2026. Foydalanuvchi: «tushuntirish videolarini qilamiz», «ballar qanday qilinishi, ilovadagi mashq qanday ishlashi — bularni ham tushunadigan qilish kerak», «ilovani hamma yeri tushunarli bo'lishi kerak», «yaxshilab o'ylab boshla». Grammatika videolari bu yerga kirmaydi (`docs/kana-video-reja.md`). Texnikasi: `docs/texnik/20-yoriqnoma.md` (o'ynatkich, ⓘ) va `21-grammatika-video.md` (video yig'ish).

## 1. Videolar (o'quvchi yo'li tartibida)

| № | Video | Nimani tushuntiradi | ⓘ joyi | Bosqich | Holat |
|---|---|---|---|---|---|
| 1 | Танишув | ilova nima beradi; 5 bo'lim; kundalik tartib: dars → dars «Эъроб»i → har kuni «Бугунги машқ» | birinchi kirish; «Йўриқнома» | 2 | — |
| 2 | Дарсни ўқиш | «Матн»: so'zni bosish (shu so'zdan o'qiydi), bosib turish (so'z oynasi), «Таржима», «Ҳаракат», pleyer, «ЎЗ», tezlik | dars sahifasi | 2 | — |
| 3 | Таркиб ва ранглар | «Таркиб»: ranglar va ramkalar, so'z oynasidagi e'rob, «Қоидалар» qutisi | dars sahifasi («Таркиб») | 3 | — |
| 4 | Дарс «Эъроб»и ва «Боб якуни» | savol turlari, 80%, keyingi dars ochilishi, so'zlar «Машқ»ga tushishi, +100 ball; «Хатолар устида ишлаш», bob imtihoni (26.11.2026 dan; oldin yorliq nomi «Машқ» edi) | dars «Эъроб» yorlig'i | 2 | — |
| 5 | «Машқ» қандай ишлайди | «Бугунги машқ» (26.11.2026 dan faqat so'z), ikki tomonli karta, «Кўрсатиш», «Билдим / Билмадим», «Луғат» belgilari | «Машқ» ⓘ | 1 | — |
| 6 | Сўз йўли | so'z 4 pog'onadan qanday o'tadi | «Машқ» ⓘ | 1 | saytda (v335); 27.11.2026 yangilandi (`tayyor-yoriqnoma-ovoz`): «Эъроб», «Бугунги машқ» — k2, k3a, k4 qayta ovoz |
| 7 | Баллар ва рейтинг | nimaga qancha ball, 🔥 seriya, «Ҳафта» va «Сўзлар» | «Рейтинг» ⓘ va «Машқ»dagi «🔥 N кун» | 1 | ovozsiz qoralama tayyor (26.11.2026) — `docs/ball-video.md`, `src/video/ball/` |
| 8 | Эшитиш | «Матн / Луғат / Таркиб» yo'laklari, sozlash, oflayn | «Эшитиш» | keyin | pleyer qayta qilingach (`docs/grammatika-pleyer-reja.md`) |
| 9 | Грамматика | «Сарф», «Наҳв», «Татбиқ» | «Грамматика» | keyin | «Татбиқ» davom etyapti |
| 10 | Созламалар ва аккаунт | Telegram orqali kirish, natijalar saqlanishi, til, ko'rinish, kunlik so'zlar soni | «Яна» / «Созламалар» | 3 | — |

**Navbat:** 1-bosqich — 7, 5, 6 (yangi ball qoidasi 30.11.2026 dushanbadan; «Машқ» 26.11.2026 da o'zgardi). 2-bosqich — 1, 2, 4. 3-bosqich — 3, 10. 8 va 9 — bo'limlari tinchigach (hozir olinsa, tez eskiradi).

## 2. Ko'rinish va yasash usuli

- Shablon — «Сўз йўли» (`src/video/sozyoli/`): yashil fon, tepada bo'lim chiziqlari, sahna nomi; vertikal 720×1280; Farruh ovozi; ekrandagi yozuv kirilcha.
- «Qanday ishlatiladi» sahnalari — **haqiqiy ekran rasmi** ustida: barmoq bosadi, bosilgan joy kattalashadi va yorishadi, keyin ochilgan ekran ko'rsatiladi (foydalanuvchi, 14.11.2026: «qayerni bosish va bosganda nima bo'lishi ko'rinsin»). Tushuncha sahnalari (zina, jadval, kunlar) — chizma.
- Ekran rasmlari ilovadan Playwright bilan avtomatik olinadi (`src/build/qollanma.py` usuli: `KORISH`, `kirish-ok`, `api` yopiq, 390×844). Ilova o'zgarsa — qayta olinadi.
- Har gap alohida ovoz fayli — matn o'zgarsa, faqat o'sha gap qayta yoziladi.
- Uzunlik 45–90 soniya; bitta videoda bitta mavzu. Muhim narsa pastki va o'ng chetdan uzoqda turadi (Shorts tugmalari).
- Ilova chiqarmaydigan narsa ekran rasmiga qo'shib ko'rsatilmaydi (masalan, tinglashda «+10» uchmaydi) — bunday joy chizma bilan beriladi.
- **Har video ish tartibi:** qoidalar koddan tekshiriladi → matn va ssenariy (`docs/<nom>-video.md`) → foydalanuvchi «qil» → ovozsiz qoralama → izohlar → Farruh ovozi (ruxsat bilan) → `tayyor-…` tarmoq → «joyla».

## 3. Ilovadagi joyi

26.11.2026 (foydalanuvchi: «yaxshi variantni o'ylab, o'shani qil») — qilindi (`tayyor-video-ball`): umumiy oyna va ro'yxat `tg.js` `Vid` (`docs/texnik/20-yoriqnoma.md`); «Рейтинг» ⓘ, «Машқ»dagi «🔥 N кун», «Йўриқнома» → «🎬 Видеолар». Qoralama video asosiy saytda ko'rinmaydi (`q`).

- Har video — o'z bo'limidagi ⓘ ortida, pastdan chiqadigan oynada («Машқ»dagidek: birinchi kirishda bir marta o'zi ochiladi, video o'zi boshlanmaydi; ko'rilmaguncha ⓘ yonida sariq nuqta).
- Hammasi — «Яна» → «Йўриқнома» tepasida, shu jadval tartibida.
- Bitta ⓘ ortida ikki video bo'lsa («Машқ»: 5 va 6) — oynada ikki qatorli ro'yxat.

## 4. Eskirgan joylar (26.11.2026 holati)

- ~~«Кўрсатмалар» (3 animatsiya) — hali «Ўрганиш» va «Такрор» deydi~~ — 26.11.2026 tuzatildi; 27.11.2026: Farruh ovozi qo'shildi, «Луғат» 4 → 10 qadam, «Эъроб», «Бошлаш» ustidagi ro'yxat (`docs/texnik/20-yoriqnoma.md`; `tayyor-yoriqnoma-ovoz`).
- ~~«Сўз йўли» videosi — 3- va 4-sahna ovozi va yozuvi, oxirgi kadr~~ — 27.11.2026 tuzatildi (2-sahna ham: «Эъроб», 80%). Qolgani: videodagi so'z kartasi eski «Луғат» qatori ko'rinishida (holat yozuvi o'ngda) — ilovada 26.11 dan 3 qavatli; video hikoyasi holat yozuviga tayangani uchun o'zgartirilmadi.
- Ruscha rejimda faqat eski ko'rsatmalar bor (video yo'q).

## 5. Ochiq qarorlar (foydalanuvchidan)

1. ~~O'zbekchada eski 3 ta «Кўрсатмалар» videolar bilan almashtiriladimi~~ — hal bo'ldi (27.11.2026, foydalanuvchi: «yaxshisini topib qil»): «Кўрсатмалар» qoladi, ovoz o'zining ichiga qo'shiladi (ilova o'zgarsa rasmlar avtomat qayta olinadi, faqat o'zgargan gap qayta yoziladi — mp4 dan arzon). Mp4 videolar — tushuncha mavzulari uchun («Сўз йўли», «Баллар»).
2. Ruscha: hozircha eski ko'rsatmalar matni «Бугунги машқ»ga to'g'rilanadimi; videolarning ruschasi — keyin.
3. «Танишув» birinchi kirishda o'zi ochilsinmi.
