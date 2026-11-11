# Arab tili loyihasi («نُورُ الطَّالِبِ») — Claude uchun kirish

Claude Code bu faylni har sessiyada o'zi o'qiydi. Bu yerda faqat asosiy qoidalar va **qayerda nima turishi**; batafsili `docs/` da.

## Qayerda nima turadi (har narsa bitta joyda)
| Joy | Nima | Kim o'qiydi |
|---|---|---|
| Loyiha instruction'i (claude.ai) | 7 ta o'zgarmas asosiy qoida | claude.ai loyiha chatlari, har doim |
| Xotira — loyiha `preferences.md` | Faqat Claude qanday ishlashi (uslub, ruxsat, kredit) | claude.ai chatlari |
| `docs/kitob-konspekti.md` | **Grammatika**: tarkib qoliplari, atamalar, kitobda yo'q mavzular, izoh yozish uslubi | hamma; asli claude.ai loyihasida, bu — nusxasi (birga yangilanadi) |
| `docs/texnik.md` | **Texnika**: sayt, yig'ish, Eshitish, ovozlar (vaqf qoidasi), bot | hamma; yagona manba |
| `CLAUDE.md` (shu fayl) | Kirish, qoidalar, xarita, darslar holati | Claude Code, repo ulangan chatlar |
| `src/build/README.md` | Yig'ish muhitini tiklash buyruqlari | dars yasashda |
| `yangi-dars` skilli | Yangi dars + Eshitish **ish tartibi** (qadamlar) | fayl tashlab /yangi-dars deyilganda |
| claude.ai `claude/claude-qollanma.md` | Claude'ni kredit tejab ishlatish bo'yicha qo'llanma | claude.ai chatlari |

Qoidalar to'qnashsa: grammatikada — konspekt; texnikada — `docs/texnik.md`; ishlash uslubida — foydalanuvchining eng oxirgi gapi.

## Asosiy qoidalar
- Javob o'zbekcha (lotin), qisqa. Sahifa ichidagi matn kirilcha. Arabcha matn doim to'liq harakat bilan.
- Chatda qator arabcha so'z bilan boshlanmaydi; arabcha va o'zbekcha bitta jumlada aralashmaydi.
- Savol berilsa — faqat javob. Ish **«qil»** deyilgandan keyin. Pullik xizmatlar (ElevenLabs, Adobe) — ruxsat bilan (dars raqami ovozi va yangi darsning Eshitish ovozi — doimiy ruxsat, `yangi-dars` 3-qadamida narxi aytiladi).
- Foydalanuvchi aytgan yo'ldan yaxshiroq yo'l bo'lsa — bajarishdan oldin o'zing qisqa taklif qil (qaror unda).
- Kredit tejash: keraksiz tool ishlatma; sahifani qayta yasama — faqat kerakli joyini o'zgartir; sinov avval bitta darsda.
- Dars hujjati va o'z audiosi — asosiy manba; hujjatda yo'q narsa mashhur kitoblardan, to'qilmaydi; tashqaridan olingani faqat chatda aytiladi.
- Bitta repoda bir vaqtda ikki chatda ishlanmaydi: ish boshida `sh src/build/lock.sh check` va `on`; joylash faqat `bash src/build/deploy.sh "xabar"`; oxirida `lock.sh off` (batafsil `docs/texnik.md` 1-bo'lim).
- Ish oxirida yangilik bo'lsa — tegishli joyga yoziladi (yuqoridagi jadval bo'yicha), boshqa joyga takrorlanmaydi.

## Darslar holati
- Sayt: https://nurut-tolib.vercel.app/ (fiqh: https://nurut-tolib-fiqh.vercel.app/; eski github.io ham ishlaydi) · Mini App `t.me/Arabtilihivar_bot/darslar` · versiya `sw.js` dagi `var C`.
- Darslar: 1-kitob **1–9**; 2-kitob **70–74, 91–96**.
- Fiqh (parol bilan yopiq, `docs/texnik.md` 10): birinchi kitob — «Мухтасарул виқоя», al-Qori sharhi «فتح باب العناية» bilan (tarjima + grammatik tahlil + sharh; keyin boshqa kitoblar). 1-dars: «Матн · Атамалар · Шарҳ · Хулоса»; 7 mashq, 8 havola qoldi. Sharh matni: `src/manba/` (shifrlangan).
- Eshitish: **1, 6, 7, 8, 9, 74, 93, 94, 95, 96**. Ochiq ish: 2–5, 70–73, 91–92 ni qo'shish.
- **Qilinmay qolganlar** (bir darsda qilingan yangilik → qolgan darslarga o'tkazish; foydalanuvchi so'raganda qilinadi; har yangilikdan keyin shu yerga qator qo'shiladi, o'tkazilgani yangilanadi):
  | Yangilik | Bor | Qolgan |
  |---|---|---|
  | Eshitish (Матн/Луғат/Таркиб) | 1, 6, 7, 8, 9, 74, 93, 94, 95, 96 | 2–5, 70–73, 91–92 |
  | ЎЗ rejimida sarlavha (bob/dars) yonishi (`UZT.h`) | 1, 8, 9, 96 | 95 + «ЎЗ» qo'shiladigan darslar |
  | Pleyer «ЎЗ» tarjima + 🎧 (`UZT`) | 1, 8, 9, 95, 96 | 6, 7, 74, 93, 94 (+ yangi Eshitishlar) |
  | Eshitish bosh qismi bo'laklab (bob / dars alohida, ekranda yozuv) | 1, 8, 9 | 6, 7, 74, 93, 94, 95 |
  | O'zbekcha ovozda qavsli variantdan bittasi | 1 | 6, 7, 74, 93, 94, 95 — tekshirish |
  | Ovoz: har so'z/gap alohida generatsiya (bitta audiodan qirqilmagan) | 1, 8, 9 | 6, 7 Луғат — tekshirish |
  | Eshitish Таркибда o'zbekcha qator | 1, 6 | 7, 74, 93 (94, 95 — tekshirish) |
  | Eshitish Матнида mavzu (sarlavha) aytiladi | 1 | 6, 7, 74, 93, 94, 95 — tekshirish |
  | ЎЗ: o'zbekcha o'qilganda arabcha so'z yonadi (`UZT.w`, bepul moslash) | 1, 8, 9, 96 | 95 + «ЎЗ» qo'shiladigan darslar |
  | Луғат tinglash qoidasi: harflar o'qilmaydi, har shakl alohida + sukut, fe'l 4 shakl, o'zbekchada muannas yo'q (`lugat2.py`) | 7, 8, 9 | 1, 6 |
  | Луғат arabchasi vaqfsiz: Hijozi ovozi + IPA (`ipa.py`), avtomat fonema tekshiruvi (`phcheck.py`) | 7, 8, 9 | 1, 6 (+ yangi darslar shu usulda) |
  | Луғат o'zbekchasida «jam» aytilmaydi (faqat ma'no; `ovoz.py voc_uz`) | yangi darslardan | 7, 8, 9 da «jam» qolgan — qayta yasalmaydi |
  | Pleyer ko'rinishi, sahifa siljitgichi (`shell.js`) | hamma darslar | — |
  | Abzas bo'sh joyi bosilsa o'qiydi; Таркибда o'qilayotgan gap legenda ostida qolmaydi (`shell.js`) | hamma darslar | — |
  | So'z oynasi: ‹ ›, Таркиб Ўзбекча/Арабча, qo'shimchalar tugma (`zoX`, `.zo-*`) | 95, fiqh 1 | 1–7, 70–74, 91–94 |
- Oxirgi qilinganlar (10–11.11.2026):
  - 96-dars «السَّفَرُ لِطَلَبِ الْعِلْمِ» (Илм ўрганиш учун сафар қилиш; k2b7, Шариф ва Ҳорун): audio — foydalanuvchi yozuvi (tiniq, sarlavhadan); lug'at yo'q, mashq 12; Eshitish Матн (Davronbek) + Таркиб (Hamed, GitHub tts orqali); «ЎЗ» + so'z yonishi (`listen/uzt96.py`). Grammatika qarorlari — konspekt 7. Abzas bosilsa o'qiydi, Таркибда gap legenda ostida qolmaydi (`shell.js`, hamma darslar; `docs/texnik.md` 5).
  - 7–9-dars Луғат arabchasi Hijozi ovozida (`fkqevZRU7Xj52dY1CTkq`, v4) vaqfsiz qayta yasaldi: oxiri harakatli so'z IPA bilan (`listen/ipa.py`), ortiqcha gap kesiladi (`trim1.py`), xatolar bepul fonema tanigich bilan topilib (`phcheck.py`) urg'u+bo'g'in belgili IPA bilan tuzatildi (`picks.txt`). Hamed (Microsoft) va nun usuli sinaldi — vaqf qiladi, yaramadi (`docs/texnik.md` 5).
  - 7–9-dars Луғат tinglash qayta yasaldi: harflar o'qilmaydi, har shakl alohida + sukut, fe'l 4 shakl, o'zbekchada muannas yo'q (`docs/texnik.md` 5).
  - Yangi versiya ilovaga qaytganda ham tekshiriladi (chiqib-kirish shart emas); audio o'ynayotganda «Янгилаш» tugmasi (`tg.js`, `sw.js`; `docs/texnik.md` 5).
  - 8-dars «Умар ва Усмон» (shajara) va 9-dars «Бомдод азони» — bitta yozuvdan (`align/in/w89.mp3`) ajratildi; 8-dars 9-qatorida yozuvda «ابْنُهُ» o'qilmagan (sahifada hujjat matni); lug'at 139–198; Eshitish Матн+Луғат+Таркиб (`listen/mk89.py`), «ЎЗ» + so'z yonishi (`listen/uzt89.py`). Grammatika qarorlari — konspekt 7.
- (08–09.11.2026):
  - Fiqh 1-dars: har yorliqning o'z tugmalari — Шарҳда Ҳаракат, Таржима, bet ‹ › ro'yxati, Aa; Атамалар/Хулосада panel yo'q; ishlamaydigan tugmalar olib tashlandi (`docs/texnik.md` 10). Grammatika darslarida Луғат/Машқ uchun xuddi shu — so'ralsa.
  - Sayt Vercel'ga ko'chdi: darslar https://nurut-tolib.vercel.app (fiqhsiz), fiqh https://nurut-tolib-fiqh.vercel.app (alohida «Фиқҳ» ilovasi, parol); `vercel-build.sh`, Ignored Build Step (`docs/texnik.md` 1, 8). Sabab: github.io ba'zi provayderlarda ochilmaydi.
  - sw.js yangilanishi bo'lak-bo'lak (`var H` xeshlar, o'zgarmagani ko'chiriladi) — sekin internetda ham yangilanadi (`docs/texnik.md` 1).
  - Qulf ekranidagi pleyer (Media Session) — hamma darslar va fiqh (`shell.js`, `docs/texnik.md` 5).
  - Fiqh 1-dars sharhi: 41–46-betlar arabcha + so'zma-so'z tarjima; atamalar — nuqtali chiziq, bosilsa izoh; bet yozuvi tepada qotadi; Muqaddimada tepa qator qotadi (`docs/texnik.md` 10).
  - Keyingi reja: Play Market (foydalanuvchi Google Play hisobini ochadi; TWA). Ilova tavsiyasi kartasi olib tashlandi.
- (07.11.2026):
  - Fiqh: kitob matni va al-Qori sharhi arabchasi har darsning ichida («Шарҳ» → «📜 Асл матн · N-бет»; 1-dars: 41–46-betlar tayyor); Muqaddima alohida karta (`fkitob.html`); «Китобни ўқиш» olib tashlandi (`docs/texnik.md` 10).
  - Fiqh: «📚 Китобни ўқиш» (`fkitob.html`) — Muqaddima (dastlabki tarjima) + 1-dars; yangi dars kelganda shu yerga ham qo'shiladi (`docs/texnik.md` 10).
  - Fiqh: «Фиқҳ / Наҳв» rejimi olib tashlandi — faqat «Таркиб» tugmasi (`docs/texnik.md` 10).
  - So'z oynasi yangilandi — 95 va fiqh 1-dars (`docs/texnik.md` 4); fiqh.html «📖 Китоб ҳақида».
  - Fiqh 1-dars: ⏮/⏭ gapma-gap, tezlik ro'yxati, sahifa siljitgichi, «Фиқҳ / Наҳв» rejimi (`docs/texnik.md` 10).
  - Fiqh paroli kuniga bir marta; tepadagi yorliqlar (dars, fiqh) fonsiz, ostida chiziq; 1-dars «ЎЗ» da o'zbekcha o'qilganda arabcha so'z yonadi (`docs/texnik.md` 5, 10).
  - (06.11.2026):
  - Pleyer: surgich o'rniga «N / M гап», ▶ o'rtada (⏮ ▶ ⏭), tugmalar kattaroq; sahifa siljitgichi (o'ng chetda tutqich + bo'lim yozuvi + tepada chiziq) — hamma darslarda (`docs/texnik.md` 5).
  - 1-dars Eshitish: Матн (dars audiosi + Davronbek), Луғат 26 so'z (Abdullah/Davronbek, har so'z alohida generatsiya), Таркиб (Hamed); bosh qism bo'laklarga (bob/dars alohida, ekranda yozuvi bilan); «ЎЗ» va 🎧 1-darsda ham. Ovoz qoidalari: `docs/texnik.md` 6.
  - (05.11.2026):
  - Dars pleyeri: ⏮/⏭ gapma-gap, tezlik 0.5–1.5× (bosib tursa ro'yxat), «ЎЗ» o'zbekcha tarjima va 🎧 Eshitishga o'tish — hozircha 95-darsda (`docs/texnik.md` 5). Ochiq: «ЎЗ»ni Eshitishi bor 6, 7, 74, 93, 94 ga qo'shish.
  - Таркиб qutisi grammatika va fiqhda yagona (`docs/texnik.md` 4); Eshitishda o'qilayotgan gap ekran tepasida ergashadi — dars (`shell.js` follow, Таркибда ranglar qatori ostida) va fiqhda (`docs/texnik.md` 5, 10).
  - Bosh sahifa «Давом этиш» kartasi oddiy (oq/to'q), 7-bob rasmi; sayt tez ochiladi — audio versiyaga kirmaydi, yuklanish belgisi (`docs/texnik.md` 1).
  - Ranglar dars va fiqhda yagona (`docs/texnik.md` 3): zamir o'z vazifasi rangida, izofa yoyi, harf va muzofun ilayh rangsiz, fe'l tilla-jigarrang, harakat ranglari palitradan, tarjima rangsiz, strelka bog'langan so'zga; ranglar tepada; `yoriqnoma.html`.
  - 95-dars — «الْعَرَبِيَّةُ الْفَصِيحَةُ وَأَثَرُهَا» (Адабий араб тили ва унинг таъсири); audio — foydalanuvchi yozuvi (tiniq, faqat sarlavha+matn; tayyorlov savollari o'qilmagan); lug'at yo'q, mashq 14; Eshitish: Матн (Davronbek) + Таркиб (Hamed).
  - 94–95 yangi bob: k2b7 «7-БОБ · اللُّغَةُ الْعَرَبِيَّةُ» (foydalanuvchi: «بَيْنَ طَالِبَتَيْنِ» dan boshlab); 94 — bobning 1-darsi (SHOWU), bob nomi ovozi Abdullah.
  - 6-dars Eshitish Таркиб: o'zbekcha qator to'liq (↳ izohlar + jumla izohi).
  - 7-dars — Али ва Аммор (2-боб «الْأُسْرَةُ», yangi bo'lim k1b2); hujjatda tarjima yo'q — kitob lug'ati misollaridan; lug'at 116–138 (kitobdan), mashq 8; Eshitish: Матн (Davronbek) + Луғат (Abdullah/Davronbek) + Таркиб (Hamed).
  - 6-dars lug'ati kitobdagi 95–115 bilan almashtirildi, Луғат yo'lagi qayta yasaldi.
  - 6-dars — Нада ва Ҳуда (5-darsning muannas shakli); audio — foydalanuvchi yozuvi (tiniq); lug'at 95–105 (kitobda berilmagan, dars so'zlaridan tuzildi), mashq 7; Eshitish: Матн + Луғат + Таркиб.
  - 5-dars — Ahmad va Badr; ovoz ElevenLabs (Mehdi + Omar), yozuv xira bo'lgani uchun; lug'at 74–94, mashq 7.
  - 94-dars — «بَيْنَ طَالِبَتَيْنِ»; audio «العربية بين يديك» 2-kitob 79-dars (kirish 28.1 s gacha kesilgan); lug'at yo'q, mashq 15; Eshitish: Матн (SARHAD) + Таркиб (Hamed).
