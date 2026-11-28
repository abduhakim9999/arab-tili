# Qoidalar — har tur o'z joyida

27.11.2026, foydalanuvchi: «har birida alohida saqlanadigan joy bo'lishi kerak — grammatika qoidalari saqlanadigan, lug'atlar saqlanadigan, va yana nimalarga kerak — o'ylab chiq».

Har qoida **bitta joyda** turadi; boshqa joyda faqat havola. Yangi qaror shu jadvaldagi joyga yoziladi. Ish boshlashdan oldin kerakli qatordagi faylni o'qish kifoya.

| Tur | Nima haqida | Joyi |
|---|---|---|
| **Grammatika** | tarkib qoliplari, atamalar, kitobda yo'q mavzular, izoh (tarkib) yozish uslubi | claude.ai loyihasi `claude/kitob-konspekti.md` — asl nusxa (24.11.2026 qarori; repoda faqat havola `docs/kitob-konspekti.md`) |
| **Tarjima va matn** | o'zbekcha matn imlosi (Саид-чи, бор-ку), hujjat tarjimasini tekshirish, arabcha harakat lug'atga qarab | `docs/qoidalar/tarjima.md` (28.11.2026) |
| **Lug'at** | so'z yozuvi (birlik/jam/muannas, fe'l shakllari, boshqaruv), ma'no, misol, belgilar va ranglar | `docs/qoidalar/lugat.md` |
| **Tarkib ko'rinishi** | so'z ranglari, ramka, bosganda chiqadiganlar, «Қоидалар» qutisi | `docs/tarkib-korinishi.md` |
| **Mashq savollari** | savol turlari, «Эъроб» qolipi (5 bosqich), tekshiruv | `docs/texnik/23-savollar.md` |
| **Ovoz va Eshitish** | Eshitish yo'laklari, bosh qism, Луғат tinglash qoidasi | `docs/texnik/05-eshitish.md` |
| **Ovozlar** | joriy ovozlar (ID, model), vaqf, generatsiya qoidasi | `docs/texnik/06-ovozlar.md` («Жорий овозлар») |
| **Tekshirish** | Playwright, kirish va kod oynasi, avtomat audit | `docs/texnik/09-tekshirish.md` |
| **Ranglar (umumiy)** | sayt ranglari, tungi rejim | `docs/texnik/03-ranglar.md` |
| **Ruscha** | nima ruschalanadi, lug'at fayllari | `docs/texnik/12-ruscha.md` |
| **Yangi dars tartibi** | faqat qadamlar va havolalar — qoida matni yo'q (hujjat → sahifa → Eshitish → joylash) | `yangi-dars` skilli (claude.ai) |
| **Claude ishlash uslubi** | ruxsat, kredit, javob uslubi | claude.ai loyiha xotirasi `preferences.md` |
| **Texnika** | sayt, yig'ish, ma'lumot fayllari, joylash | `docs/texnik.md` → `docs/texnik/NN-….md` |

## Qaror yozish tartibi (28.11.2026)
28.11.2026, foydalanuvchi: «nimaga bunday bo'lyapti, buni to'g'rilash kerak. Yengillik qilingan narsalar qolib ketmasin. Keyinchalik ham to'g'ri bo'ladigan bo'lishi kerak». Sabab: bir qoida bir nechta joyda nusxa bo'lib turgan (skill, konspekt, xotira, texnik fayllar) — o'zgarganda bittasi yangilanib, qolganlari eski qolgan.

Har yangi qaror yoki qoida o'zgarsa — shu ishning o'zida:
1. **Bitta joyga** — yuqoridagi jadvaldagi o'z faylига (sana va foydalanuvchi so'zi bilan). Boshqa joylarda nusxa emas, faqat havola.
2. **Eski gapni topib to'g'rilash** — eski qoidaning iborasi `docs/qoidalar/eskirgan.txt` ga yoziladi (eski ibora → to'g'ri joy), keyin tekshiruv: `python3 src/build/qoida_tekshir.py [konspekt nusxasi]`. U repo hujjatlari, `CLAUDE.md` va sessiyadagi skill nusxalarini (`yangi-dars`, `joyla`) qidiradi; konspektni `project_read` bilan olib, faylini argument qilib beriladi. «TOPILDI» qolmasin (tarix yozuvlari — «eskirgan», «bekor», «endi», «ilgari» so'zli qatorlar — sanalmaydi).
3. **Hamma ko'rinishda** — qaror ekranga oid bo'lsa, u ko'rinadigan hamma joy tekshiriladi («Луғат» yorlig'i, takror, so'z oynasi, ruscha) va foydalanuvchiga hammasi ko'rsatiladi; bittasida qilib qolganini «keyin» deb qoldirilmaydi (26.11 dagi ikki maf'ul qarori faqat takrorda qilingan edi).
4. **Xotira va loyiha ko'rsatmasi** — skript ularni ko'rmaydi: xotiradagi `preferences.md` qatorlari qo'lda solishtiriladi; claude.ai loyiha ko'rsatmasini faqat foydalanuvchi o'zgartiradi — kerak bo'lsa matni taklif qilinadi.

## Hali bitta joyga yig'ilmaganlar (taklif)
- ~~Tarjima uslubi~~ — 28.11.2026 da `docs/qoidalar/tarjima.md` ga yig'ildi (imlo, hujjat tarjimasini tekshirish, harakat lug'atga qarab).
- **Video darslar** (grammatika videolari, «Сўз йўли», kana) — reja fayllarida (`docs/kana-video-reja.md`, `docs/texnik/21-grammatika-video.md`); umumiy video qoidasi alohida emas.
- **Grammatika repoda?** — hozir claude.ai loyihasida. Claude Code sessiyasi uni o'qiy olmaydi; repoga `docs/qoidalar/grammatika.md` qilib ko'chirish — foydalanuvchi qarori bilan.
