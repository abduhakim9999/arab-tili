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
- Ruscha versiya (sinov, 11.11.2026): **1-dars** — `src/ru/` (`build.py`, `ru.js`, lug'atlar; `docs/texnik.md` 12); sinov sahifasi github.io `sinov-ru1.html`. O'zbekcha sahifalarga tegilmaydi. Qolgani: til tanlash, 19 dars, ovoz.
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
- Oxirgi qilinganlar (10–12.11.2026):
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
- **Keyingi rejalar** (foydalanuvchi aytganda): `docs/rejalar.md` — lug'at «Такрорлаш» (ts-fsrs), repo tartibi, Play Market, tarmoqlar.
- Eskiroq yozuvlar (05–07.11.2026 va undan oldin): `docs/tarix.md`.
