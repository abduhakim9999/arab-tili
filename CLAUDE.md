# Arab tili loyihasi («نُورُ الطَّالِبِ») — Claude uchun kirish

Claude Code bu faylni har sessiyada o'zi o'qiydi. Bu yerda faqat asosiy qoidalar va **qayerda nima turishi**; batafsili `docs/` da.

## Qayerda nima turadi (har narsa bitta joyda)
| Joy | Nima | Kim o'qiydi |
|---|---|---|
| Loyiha instruction'i (claude.ai) | 7 ta o'zgarmas asosiy qoida | claude.ai loyiha chatlari, har doim |
| Xotira — loyiha `preferences.md` | Faqat Claude qanday ishlashi (uslub, ruxsat, kredit) | claude.ai chatlari |
| claude.ai `claude/kitob-konspekti.md` | **Grammatika**: tarkib qoliplari, atamalar, kitobda yo'q mavzular, izoh yozish uslubi (Projects → `project_read`) | hamma; yagona asl nusxa (24.11.2026 dan repoda nusxa yo'q — `docs/kitob-konspekti.md` faqat havola) |
| `docs/texnik.md` → `docs/texnik/NN-….md` | **Texnika**: sayt, yig'ish, Eshitish, ovozlar (vaqf qoidasi), bot. `docs/texnik.md` — faqat mundarija; har bo'lim alohida faylda (24.11.2026), keragini o'qing | hamma; yagona manba |
| `src/manba/grammatika/` | **Grammatika kitobi** matni: yangi nashr 1–53 (`kitob-1-53.md`), eski nashr 54–94 (`eski-54-94/`) | grammatika, video darslar |
| `docs/grammatika-pleyer-reja.md` | «Грамматика» bo'limi (qilingan, «Татбиқ» bilan o'zgargan) va «Эшитиш» pleyeri **rejasi** (hali boshlanmagan) | shu ishlarda |
| `docs/kana-video-reja.md`, `docs/soz-yoli-video.md` | Kana video turkumi rejasi; «Сўз йўли» video matni (24.11.2026 da claude.ai loyihasidan ko'chdi) | video ishida |
| `docs/mavzular-hisobi.md` | **Mavzular hisobi** — «Татбиқ» sahifalari va grammatika videolari birga, dars bo'yicha: qaysi mavzu qaysi darsga ko'chgan, va'dalar, nima qolgan (23.11.2026 dan; videolarniki `docs/kana-video-reja.md` 1a dan ko'chirildi) | Татбиқ darsi va video ishidan oldin va keyin |
| `docs/tarkib-korinishi.md` | **Tarkib ko'rinishi** (yangi tizim, sinov): ranglar, bosganda chiqadiganlar, yashirin foil; namunalar | hamma; yagona manba |
| `src/video/` | **Grammatika videolari** manbasi (ovoz, sahnalar, yig'ish; `docs/texnik.md` 21); reja — `docs/kana-video-reja.md` | video ishida |
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
- **Chatlar parallel ishlaydi** (19.11.2026, foydalanuvchi: «boshqa chatlar o'z ishini davom ettiraveradi, bitta joylash bilan hammasi joylanadi»): har chat o'z `tayyor-<nomi>` tarmog'ida (`origin/main` dan) ishlaydi, boshqa chat ishlayotgani (`lock.sh check` → BAND) uni to'xtatmaydi. Band-belgi (`lock.sh`, `ish-belgi` tarmog'ida) faqat `main`ga yozadigan ishda: «joyla» va `sinov.sh` — boshida `check` + `on`, oxirida `off`; BAND bo'lsa faqat shu ish kutadi. Umumiy fayllar to'qnashuvi joylashda hal qilinadi (`docs/texnik.md` 1). **Tayyor ish darhol joylanmaydi** (14.11.2026, foydalanuvchi: Vercel limiti) — `tayyor-<nomi>` tarmog'iga push; «joyla» deyilganda hamma `tayyor-*` birlashtirilib bir marta `bash src/build/deploy.sh "xabar"` (batafsil `docs/texnik.md` 1-bo'lim).
- Ish oxirida yangilik bo'lsa — tegishli joyga yoziladi (yuqoridagi jadval bo'yicha), boshqa joyga takrorlanmaydi.

## Darslar holati
- Sayt: https://nurut-tolib.vercel.app/ (fiqh: https://nurut-tolib-fiqh.vercel.app/; eski github.io ham ishlaydi; joylanmagan `tayyor-*` ishlar — https://abduhakim9999.github.io/arab-tili/tayyor/ , `docs/texnik.md` 1) · Mini App `t.me/Arabtilihivar_bot/darslar` · versiya `sw.js` dagi `var C`.
- Darslar: 1-kitob **1–12**; 2-kitob **70–74, 90–96**; **97**; **98**.
- Fiqh (parol bilan yopiq, `docs/texnik.md` 10): birinchi kitob — «Мухтасарул виқоя», al-Qori sharhi «فتح باب العناية» bilan (tarjima + grammatik tahlil + sharh; keyin boshqa kitoblar). 1-dars: «Матн · Атамалар · Шарҳ · Хулоса · Машқ»; **3-dars** «مُسْتَحَبَّاتُ الْوُضُوءِ» (22.11.2026; saytda — 22.11.2026; sharh 57–58 to'liq); **2-dars** «سُنَنُ الْوُضُوءِ» (16.11.2026; saytda — 18.11.2026; sharh 46–48-betlar, 49–57 — qisqa bayon «тайёрланмоқда»). 2-darsda **yangi tarkib ko'rinishi sinovda** (16–17.11.2026; rang — vazifa yoki holat oilasi: 5 asosiy + och yashil mansub + feruza majrur, ramka — asosiy bo'lak o'rni; bosganda — ramka va chiziq; gap ostida «Қоидалар» qutisi; so'z oynasi kitob tartibida; belgilar holat bo'yicha + ⓘ (5 qadamli ko'rsatma 18.11 da olib tashlandi — o'rniga keyin video); «Эски / Янги» tugmasi olib tashlandi (18.11.2026) — faqat yangi ko'rinish; fiqh 1-darsda ham (18.11.2026); `docs/tarkib-korinishi.md`). Fiqh va arab tili — alohida programmalar (bir-biriga havola yo'q). Sharh matni: `src/manba/` (shifrlangan).
- Eshitish: **1, 6, 7, 8, 9, 10, 11, 12, 74, 90, 93, 94, 95, 96, 97, 98**. Ochiq ish: 2–5, 70–73, 91–92 ni qo'shish.
- Ruscha versiya (11.11.2026): til «Яна» → Тил (sukut — o'zbekcha, boshida so'ralmaydi); ruschasi bor darslar: **1–12** (`ruN.html`). Manba `src/ru/` (`build.py`, `ru.js`, lug'atlar; `docs/texnik.md` 12). **Kod bitta — ikkala tilga** (14.11.2026, foydalanuvchi qarori): funksiya o'zbekcha sahifada qilinadi, ruschasi o'sha koddan ishlaydi; yangi matn — shu ishning o'zida ruscha lug'atga ham (`src/ru/lugat-qobiq.txt`); ruschasi yo'q narsa — «Тез орада». 2-kitob darslari (70–74, 90–98) ruschalanmaydi — 22.11.2026 qarori: ruscha faqat 1-kitob uchun (70-dars qoralamasi `src/ru/d70.*` ishlatilmaydi), ovoz, Sarf/Fe'llar/Eshitish/Yo'riqnoma.
- «Наҳв» bo'limi (11.11.2026): `nahv.html` — эъроб аломатлари жадвали (2 yorliq); «Қоидалар» bo'limida (`qoidalar.html`), so'z oynasidagi holat yorlig'idan o'tiladi (`docs/texnik.md` 13). Reja o'zgardi (19.11.2026): «Қоидалар» → «Грамматика», qoida kartalari video darslar ostiga boradi — `docs/grammatika-pleyer-reja.md`.
- **Qilinmay qolganlar** (bir darsda qilingan yangilik → qolgan darslarga o'tkazish; foydalanuvchi so'raganda qilinadi; har yangilikdan keyin shu yerga qator qo'shiladi, o'tkazilgani yangilanadi):
  | Yangilik | Bor | Qolgan |
  |---|---|---|
  | Eshitish (Матн/Луғат/Таркиб) | 1, 6, 7, 8, 9, 10, 11, 12, 74, 93, 94, 95, 96, 97, 98, 90 (98, 90 — Луғат yo'lagisiz) | 2–5, 70–73, 91–92; 98, 90 Луғат yo'lagi |
  | ЎЗ rejimida sarlavha (bob/dars) yonishi (`UZT.h`) | 1, 8, 9, 10, 11, 12, 96, 97, 98, 90 | 95 + «ЎЗ» qo'shiladigan darslar |
  | Pleyer «ЎЗ» tarjima (`UZT`; 🎧 19.11.2026 da olib tashlandi) | 1, 8, 9, 10, 11, 12, 95, 96, 97, 98, 90 | 6, 7, 74, 93, 94 (+ yangi Eshitishlar) |
  | Eshitish bosh qismi bo'laklab (bob / dars alohida, ekranda yozuv) | 1, 8, 9, 10, 11, 12, 97, 98, 90 | 6, 7, 74, 93, 94, 95 |
  | O'zbekcha ovozda qavsli variantdan bittasi | 1, 10, 11, 12, 97, 98, 90 | 6, 7, 74, 93, 94, 95 — tekshirish |
  | Ovoz: har so'z/gap alohida generatsiya (bitta audiodan qirqilmagan) | 1, 8, 9, 10, 11, 12, 97, 98, 90 | 6, 7 Луғат — tekshirish |
  | Eshitish Таркибда o'zbekcha qator | 1, 6, 10, 11, 12, 97, 98, 90 | 7, 74, 93 (94, 95 — tekshirish) |
  | Eshitish Матнида mavzu (sarlavha) aytiladi | 1, 10, 11, 12, 97, 98, 90 | 6, 7, 74, 93, 94, 95 — tekshirish |
  | ЎЗ: o'zbekcha o'qilganda arabcha so'z yonadi (`UZT.w`, bepul moslash) | 1, 8, 9, 10, 11, 12, 96, 97, 98, 90 | 95 + «ЎЗ» qo'shiladigan darslar |
  | Луғат tinglash qoidasi: harflar o'qilmaydi, har shakl alohida + sukut, fe'l 4 shakl, o'zbekchada muannas yo'q (`lugat2.py`) | 7, 8, 9, 10, 11, 12 | 1, 6 |
  | Луғат arabchasi vaqfsiz: Hijozi ovozi + IPA (`ipa.py`), avtomat fonema tekshiruvi (`phcheck.py`) | 7, 8, 9, 10, 11, 12 | 1, 6 (+ yangi darslar shu usulda) |
  | Луғат o'zbekchasida «jam» aytilmaydi (faqat ma'no; `ovoz.py voc_uz`) | yangi darslardan | 7, 8, 9 da «jam» qolgan — qayta yasalmaydi |
  | Pleyer ko'rinishi, sahifa siljitgichi (`shell.js`) | hamma darslar | — |
  | Abzas bo'sh joyi bosilsa o'qiydi; Таркибда o'qilayotgan gap legenda ostida qolmaydi (`shell.js`) | hamma darslar | — |
  | Bo'sh joy bosilsa — belgilangan narsa bekor (o'qimaydi); har gap kartasida ▶ (`tarkib3.js`, `docs/tarkib-korinishi.md` 12) | hamma «Нур ут-толиб» darslari (saytda — 19.11.2026) | — (ruscha 1–12 — saytda, 23.11.2026) |
  | So'z oynasi: ‹ ›, Таркиб Ўзбекча/Арабча, qo'shimchalar tugma (`zoX`, `.zo-*`) | hamma darslar, fiqh 1 | — |
  | Луғат yorlig'ida «билмайман» belgisi → so'z bazasi (`shell.js`; `docs/texnik.md` 15) | hamma darslar | — |
  | «Қоидалар» qutisi yopiq + qoida kartalari yangi qolipda (`tarkib3.js` `qf`, `QT`; konspekt 8) | hamma «Нур ут-толиб» darslari — 59 karta (`src/build/qt-yangi.json`, `node src/build/qt.js`; saytda — 19.11.2026); fiqh 1, 2 — yopiq quti va kartalar (saytda — 19.11.2026) | — (ruscha 1–12 — ruscha kartalar `src/ru/qt-ru.json`, 23 ta; saytda, 23.11.2026) |
  | Lug'at qoralamasi (kitob lug'ati yo'q dars): matndagi ma'no, boshqa ma'nolar tagida kichik (raqamli), «қоралама» faqat ko'rishda (o'zak bloki yo'q), fe'l + masdar bitta yozuvda, misolda {so'z} yashil (`docs/texnik.md` 14) | 92, 97 (saytda — 19.11.2026; 22.11.2026 dan «hamma so'z» usuliga o'tdi); 98 (saytda — 22.11.2026) | — |
  | Dars lug'atida matndagi HAMMA so'z (eski so'z `ay`/`asl` bilan bog'langan) + «Луғат» yorlig'ida guruhlar (biladiganlari pastda yopiq; `docs/texnik.md` 14) | 92, 94, 95, 96, 97 (`tayyor-lugat-hamma`, 22.11.2026); 98, 1–10, 70–74, 91, 93 (`tayyor-lugat-qolgan`, 22.11.2026; kitob darslarida — kitob yozuvlari joyida, `scratchpad/lq/kitob_hamma.py`); 90 (boshidanoq, 93 so'z); 11, 12 (boshidanoq; Луғат yo'lagi — faqat yangi so'zlar); guruhlar — hamma darslarda (kod) | Eshitish «Луғат» ovozi yangi qatorlarga (1–10, 93–98; ElevenLabs — ruxsat bilan); ruscha 70 (`d70.json` — yangi qatorlar) |
  | Lug'atda fe'l boshqaruvi: «(هُ هُ)» (faqat ikki maf'ulli), «(عَلَى ..)» + o'zbekchada «(...га)»; bitta «(هُ)» yozilmaydi (`lugat_sila.py`; `docs/texnik.md` 14) | 92, 94–98; 1–10 (8: صَلَّى، سَلَّمَ «(عَلَى ..)»; 10: سَكَنَ «(فِي ..)»; qolganlari belgisiz); 70, 71, 73, 91, 93 (`SILA`; 72, 74 — kerak emas); 90, 11, 12 (boshidanoq) | yangi darslar — boshidanoq |
  | Yangi tarkib ko'rinishi: rang — vazifa/holat oilasi, ramka — asosiy bo'lak o'rni, bosganda — ramka va chiziq (`docs/tarkib-korinishi.md`) | fiqh 1, 2 (saytda); hamma «Нур ут-толиб» darslari (`tarkib3.js`; saytda — 19.11.2026) | — (ruscha 1–12 va yangi darslar — saytda, 23.11.2026; `docs/texnik.md` 12) |
- Oxirgi qilinganlar (faqat oxirgi 3 ta, yangisi tepada; 4-si qo'shilganda eng eskisi `docs/tarix.md` ga ko'chadi — 24.11.2026 tekshiruvi: bu fayl har sessiyada o'qiladi, kichik tursin):
  - **«Луғат»: fe'l — moziy – muzore' – masdar; ko'plikdagi ortiqcha tanvin tuzatildi** (26.11.2026; foydalanuvchi: «mujtamaatun da harakati bug», «fe'llarda moziy muzore masdar yozilish kerak … masdar ma'nosi … katta kitoblardek», ikki masdar — «B», «qil»; `tayyor-lugat-fel`): `ajrat.py kengayt()` «..َاتٌ» da tanvinni olib tashlaydi (مُجْتَمَعَاتٌ، مَجَالَاتٌ، مُخْتَبَرَاتٌ، تَدْرِيبَاتٌ، اِخْتِلَافَاتٌ، نِدَاءَاتٌ); `lugat.json` va `mashq.json` da bir harfda ikki harakat — 0. «Луғат» qatorida fe'l `felQ()` bilan uch shaklda, ma'no «-моқ»; qidiruv shakllar bilan; 4 fe'lga ism masdar (`lugat-tuzatish.json`). Ikkala tilda (kod bitta). `docs/texnik.md` 14.
  - **«Рейтинг» → «Сўзлар» ichida ikki tugma: «Билган» va «Мустаҳкам»** (26.11.2026; foydalanuvchi: «so'zlarni ichida 2 ta kategoriya qilsachi», «7 kunlik kerakmas», «qil»; `tayyor-reyting-ikki`; **saytda** — 26.11.2026, «joyla»): «Билган» — биламан + мустаҳкам (son faqat o'sadi; o'zi belgilagani darhol), «Мустаҳкам» — avvalgidek; har biri o'z soni bo'yicha saralanadi, avval «Билган». Server: yangi kalit `rey:b` / `rey:ru:b`, `api/reyting.js` javobida `b`; eski o'quvchilar — saqlaganda yoki reytingni ochganda bir marta hisoblanadi (`rey:bx`). Ruscha: «Знаю · Прочно». `qobiq.py` (ru) — MISS 0, XATO 0. `docs/texnik.md` 19.
  - **«Машқ»: so'zlar faqat 80% dan keyin; kitob bo'laklari bo'yaladi** (25.11.2026; foydalanuvchi: «80% o'tgandan keyin lug'atlari tushishi kerak emasmi mashqqa?», «olib tashlanadi», «qil va to'g'irla»; `tayyor-mashq-80`; **saytda** — 26.11.2026, «joyla»): dars so'zlari «Машқ»ga faqat eng yaxshi natija 80% bo'lganda (`yol.html yigish`); 80% siz ilgari tushganlari «Машқ»/«Луғат»/statistikada ko'rinmaydi, natijalari saqlanadi (`takror.html otganlar()`); dars natijasi ostida «80% олсангиз…» / «Дарс ўтилди ✓…» qatori (`shell.js natija80`); kitob bo'laklarida o'tilgan dars to'q rangda (CSS specificity xatosi: `.mq-kb i.ds u` `u.y` ni bosib ketardi). Ikkala tilda. Playwright: «Машқ» statistikasi, 50%/90% da so'z qo'shilishi, natija qatori (uz/ru). `docs/texnik.md` 15.
- **Keyingi rejalar** (foydalanuvchi aytganda): `docs/rejalar.md` — o'quvchi taraqqiyoti (takror 2–9-darslar, server, reyting, ilova), repo tartibi, Play Market, tarmoqlar.
- Eskiroq yozuvlar (13.11.2026 va undan oldin): `docs/tarix.md`.
