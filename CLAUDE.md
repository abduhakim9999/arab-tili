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
- Fiqh (parol bilan yopiq, `docs/texnik.md` 10): birinchi kitob — «Мухтасарул виқоя», al-Qori sharhi «فتح باب العناية» bilan (tarjima + grammatik tahlil + sharh; keyin boshqa kitoblar). 1-dars: «Матн · Атамалар · Шарҳ · Хулоса · Машқ». Fiqh va arab tili — alohida programmalar (bir-biriga havola yo'q). Sharh matni: `src/manba/` (shifrlangan).
- Eshitish: **1, 6, 7, 8, 9, 74, 93, 94, 95, 96**. Ochiq ish: 2–5, 70–73, 91–92 ni qo'shish.
- Ruscha versiya (11.11.2026): til «Яна» → «Созламалар» → Тил (sukut — o'zbekcha, boshida so'ralmaydi); ruschasi bor darslar: **1–4** (`ruN.html`). Manba `src/ru/` (`build.py`, `ru.js`, lug'atlar; `docs/texnik.md` 12). **Kod bitta — ikkala tilga** (14.11.2026, foydalanuvchi qarori): funksiya o'zbekcha sahifada qilinadi, ruschasi o'sha koddan ishlaydi; yangi matn — shu ishning o'zida ruscha lug'atga ham (`src/ru/lugat-qobiq.txt`); ruschasi yo'q narsa — «Тез орада». Qolgani: 16 dars (5–9, 70–74, 91–96), ovoz, Sarf/Fe'llar/Eshitish/Yo'riqnoma.
- «Наҳв» bo'limi (11.11.2026): `nahv.html` — эъроб аломатлари жадвали (2 yorliq); «Қоидалар» bo'limida (`qoidalar.html`), so'z oynasidagi holat yorlig'idan o'tiladi (`docs/texnik.md` 13). Navbatda: 55 qoida kartasi ro'yxati.
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
  | So'z oynasi: ‹ ›, Таркиб Ўзбекча/Арабча, qo'shimchalar tugma (`zoX`, `.zo-*`) | hamma darslar, fiqh 1 | — |
  | Луғат yorlig'ida «билмайман» belgisi → so'z bazasi (`shell.js`; `docs/texnik.md` 15) | hamma darslar | — |
- Oxirgi qilinganlar (10–14.11.2026):
  - **Kitob oxiri — bitta karta** (14.11.2026; **tayyor, saytga joylanmagan** — Vercel limiti, foydalanuvchi: hamma chatlardagi ish tayyor bo'lgach birga joylanadi): «N-КИТОБ СЎЗЛАРИ» (biladigan / jami so'z, %, 4 daraja), «Сўзларни такрорлаш», ixtiyoriy «Китоб имтиҳони»; keyingi kitob — muqovali karta. Batafsil `docs/texnik.md` 15.
  - **Ruscha rejim — bitta qobiq** (14.11.2026): ruschada ham xarita va pastki 4 tugma; «Луғат», «Қоидалар», «Наҳв», «Яна», «Созламалар» o'sha o'zbekcha kod + ruscha qatlam (`qobiq.js` ulaydi; `ru-index.js` — lug'at, so'z/mashq ma'lumoti; `ru.js` `data/*.json` ni almashtiradi); ruschasi yo'q dars/imtihon/bo'lim — «Тез орада»; `deploy.sh` ruschani o'zi qayta yasaydi va `src/ru/tekshir/qobiq.py` bilan tekshiradi. Batafsil `docs/texnik.md` 12.
  - **Ro'yxat birinchi, Луғат 4 daraja, yo'riqnoma** (14.11.2026 ertalab; **saytda**): «Бош саҳифа»da hammada birinchi **ro'yxat** (xaritani tanlagan — `yol-kor = 'x'`), ro'yxatda bob — rasmli karta; Луғат: «**N сўзни биламан**» + kitob chizig'i «1-китоб: b / jami сўз» + 4 daraja 🔵 мустаҳкам (30 kundan keyin ham to'g'ri, `MUST`) · 🟢 биламан · 🟡 ўрганяпман · 🔴 билмайман; «Сўзлар бу ерга қандай тушади?» kartasi (4 qadam, «Тушунарли» / ⓘ); fe'l kartasi shakl nomlari bilan, harf turi — «Билдим / Билмадим»; «Қўшимча машқ» olib tashlandi. Batafsil `docs/texnik.md` 14, 15.
  - **Majburiy kirish (14.11.2026; **saytda**):** brauzer/ilovada 1-dars ochiq, keyingi darslar Telegram orqali kirgandan keyin (`tg.js` oynasi); Telegram ichida so'ralmaydi; «Созламалар»da kod yashirin (eski usul, ~14.12 da olib tashlanadi) va «Ҳисобни ўчириш». Batafsil `docs/texnik.md` 17.
  - **«Луғат» soddalashdi** (14.11.2026; **saytda**): faqat 3 holat — 🔴 билмайман · 🟡 ўрганяпман · 🟢 биламан (tepada uchta katta son, bosilsa — filtr); so'z turli kunlarda ketma-ket **3 marta** to'g'ri topilsa «биламан» bo'ladi va «Билмаганларим»dan chiqadi (`BILDI`, `kunlar()`), xato — qaytadan; «Такрорлаш · N сўз · M савол» (kartalar emas, so'zlar — `takror.js` `sanoq()`); turlar pastdagi tugmalarda; takror kartasida muannasi so'z yonida, ma'no panelda, kichik «қайта эшитиш» tugmasi. Batafsil `docs/texnik.md` 14.
  - **«Йўл» soddalashdi** (13.11.2026 kech; **saytda**): manzara faqat bob boshida banner, yo'l tinch zaminda (`body.fon-1`); tugunlarda oq hoshiya, hozirgi dars katta + «ҲОЗИРГИ ДАРС»; tepadagi «дарс · сўз · такрор» olib tashlandi → kitob yorliqlari «1-китоб | 2-китоб» + «Рўйхат / Харита» tugmasi; kitob oxirida «N-КИТОБ ОХИРИ» kartasi; darslar xira emas (o'tilgan / o'tilmagan); har kitobga muqovasi rangi (1 — olovrang, 2 — och yashil), har bobga o'z tusi (`KR`, `MV.r`); bob tasmasi yoki rasmli bob kartasi bosilsa boblar ro'yxati tushib keladi (bob rasmlari bilan, sonsiz); «Яна»dan «Муаллиф» olib tashlandi. **14.11:** pastdagi «Йўл» → **«Бош саҳифа»** (uy belgisi, `qobiq.js`) — xaritada qayta bosilsa «Китобни танланг» oynasi sirg'alib chiqadi (kitob kartalari muqova rangida + «Кўриниш: Харита | Рўйхат»); tepadagi kitob yorliqlari olib tashlandi. Batafsil `docs/texnik.md` 15.
  - **«Луғат» — bitta ekran** (13.11.2026; **saytda**): pastki tugma «Такрорлаш» o'rniga **«Луғат»** (fayl `takror.html`); yorliqlar yo'q — takror, lug'at va mashq birlashdi: karta «Сўзларим» (son, umumiy statistika, uch tur **Исм · Феъл · Ҳарф** — olmoshlar ism), tugma «Такрорлаш · N та», «Қўшимча машқ»; bilmaganlar ro'yxat tepasida; «Машқ» savollari (ko'plik, fe'l shakllari, harf turi) kunlik takrorga kirdi (`takror.js` shakl kartasi `w…s`). Xaritada kitob oxirida «N-китобга ўтиш» tugmasi. Batafsil `docs/texnik.md` 14, 18.
  - **Bitta qobiq** (13.11.2026; **saytda**): hamma asosiy sahifada bir xil tepa tasma va pastki 4 tugma (`qobiq.js`: Йўл · Луғат · Қоидалар · Яна); **asosiy ekran — xarita**: `index.html` o'zbekcha rejimda `yol.html` ga o'tkazadi (ruscha rejimda eski ro'yxat qoladi); yangi `qoidalar.html` (Сарф, Феъллар, Наҳв, Эшитиш), `yana.html` (hisob, «Telegram орқали кириш», Созламалар, Йўриқнома, «Бош экранга қўшиш»); dars va ichki sahifalardan «orqaga» — oxirgi bo'limga (`tg.js`). Shu bilan birga: oynalarda qisqa matn + ⓘ, «Навбати келмаган» (qulf o'rniga), qat'iy tozalash + 30 kun qaytarish, «аниқ биламан» belgisi, takror chegaralari 21/90 kun + «қийин сўз», yo'riqnomada «Такрорлаш». Batafsil `docs/texnik.md` 14–18. **Telefonda va Telegram ichida foydalanuvchi tekshiradi.**
  - «Йўл» (12–13.11.2026; **saytda**, bosh sahifada kartasi): `yol.html` — darslar xaritasi (bob = vahda, 80% o'tish, bob/kitob imtihoni, oldindan topshirib o'tish); dars o'tishi — «Машқ» 80% + so'zlarni saralash (bilmaganlarni belgilash); **so'z bazasi** (`soz` + takror jurnali): bob imtihonida bilmaganlarning hammasi + tekshiruv, «Такрорлаш» ichida «Луғат» (holat va statistika) va «Машқ» (Сўзлар / Феъллар / Ҳарфлар) yorliqlari, harf/olmoshlar ham bazada; xatolar «Такрорлаш»da birinchi (`takror.js` `ustun`, `ustunSoz`). Yangi dizayn kodda (13.11): har bobga o'z manzarasi (`fon/*.jpg`, `MV` jadvali), tugunlarda dars ikonkalari (`data/ikonka.json` ← `src/build/ikonka.py`), pastki tugmalar qatori; boblar orasida ravoq tasma, bob kartasida alohida chizilgan rasm (`fon/k-*.jpg`), dars oynasi (ikonka, holat, hajmli tugmalar). Batafsil `docs/texnik.md` 15; qolgan ish `docs/rejalar.md` 1.
  - «Созламалар» (13.11.2026; **saytda**): `sozlamalar.html` — yozuv kattaligi, harakat, tarjima, tezlik, o'zbekcha ovoz, oflayn saqlash, saqlangan ovozlarni tozalash, kunlik yangi so'zlar, tovush, «Эркин режим», til, ko'rinish, natijalarni tozalash. Kalitlar va qoidalar — `docs/texnik.md` 16.
  - Natijalarni serverda saqlash (13.11.2026; **saytda**): `baza.js` + `api/soz.js` + Vercel Blob ombori `arab-tili-baza` (yopiq); maxfiy ko'chirish kodi (Telegramda — avtomatik, saytda — «Созламалар»dan); birlashtirish va tozalash qoidalari — `docs/texnik.md` 17.
  - «Такрорлаш» (12.11.2026): `takror.html` — FSRS bilan so'z takrori (arabcha → ma'no, ma'no → arabcha, ovoz → ma'no) va so'z oxiri savollari, «Билган сўзларим»; bosh sahifada «Давом этиш» ostida karta. 13.11.2026 dan so'z bazasiga ulangan: faol darslar — so'zlari saralangan darslar; «Луғат» va «Машқ» yorliqlari; atoqli otlar kirmaydi (harf va olmoshlar kiradi). Ma'lumot fayllari `data/` (`src/build/ajrat.py`; dars o'zgarsa qayta ishga tushiriladi, aks holda `deploy.sh` to'xtaydi). Batafsil `docs/texnik.md` 14, reja `docs/rejalar.md` 1.
  - So'z oynasi (‹ ›, ✕, Таркиб Ўзбекча/Арабча, qo'shimchalar tugma) hamma darslarga o'tkazildi (`docs/texnik.md` 4).
  - Fiqh: 1-darsga «Машқ» (5 fiqhiy + 5 grammatik savol); Muqaddimaga al-Qori sharhi (34–40-betlar, arabcha + tarjima, archive.org skaneri bo'yicha); grammatika darsiga havola bekor (`docs/texnik.md` 10).
  - Машқdagi «🔊 Тинглаш» tugmasi hamma darslardan o'chirildi; yangi darslarda ham qo'yilmaydi (`docs/texnik.md` 5).
  - «Аудио юкланяпти… N%» qotib qolishi tuzatildi (hamma darslar, Eshitish): sababi — pleyerga tarmoq javobi va keshdan yasalgan javob aralash berilgani (Chrome media qotadi). Endi har mp3 javobi SW yasagan; fayl bir marta yuklanadi; foiz haqiqiy (SW dan); qotsa o'zi qayta ulanadi; yuklanmasa «Юклаш» tugmasi (`sw.js`, `tg.js`; `docs/texnik.md` 1).
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
- **Keyingi rejalar** (foydalanuvchi aytganda): `docs/rejalar.md` — o'quvchi taraqqiyoti (takror 2–9-darslar, server, reyting, ilova), repo tartibi, Play Market, tarmoqlar.
- Eskiroq yozuvlar (05–07.11.2026 va undan oldin): `docs/tarix.md`.
