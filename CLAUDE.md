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
- Sayt: https://abduhakim9999.github.io/arab-tili/ · Mini App `t.me/Arabtilihivar_bot/darslar` · versiya `sw.js` dagi `var C`.
- Darslar: 1-kitob **1–7**; 2-kitob **70–74, 91–95**.
- Fiqh (parol bilan yopiq, `docs/texnik.md` 10): «Мухтасарул виқоя» 1-dars (1–6-qadam tayyor; 7 mashq, 8 havola qoldi).
- Eshitish: **6, 7, 74, 93, 94, 95**. Ochiq ish: 1–5, 70–73, 91–92 ni qo'shish.
- Oxirgi qilinganlar (05.11.2026):
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
