# Texnika — 16-bo'lim (asosiy fayl: `docs/texnik.md`)

## 16. «Созламалар» (13.11.2026, foydalanuvchi qarori; saytda 13.11.2026 dan)

- **Sahifa `sozlamalar.html`** — «Йўл» tepasidagi tishli g'ildirakdan; «‹» → `yol.html`. 4 guruh. **Tartib (14.11.2026, foydalanuvchi: til va sozlama boshroqda bo'lsin):** «Тил» — sozlamadan chiqib, «Яна» sahifasining eng tepasida (`.n-til`, localStorage `til`); bu yerda: УМУМИЙ (Кўриниш) → ЎҚИШ → ЭШИТИШ → МАШҚ ВА ТАКРОР → НАТИЖАЛАРНИ САҚЛАШ → tozalash / hisobni o'chirish (eng pastda). «Яна»: Тил → Созламалар («Кўриниш, ёзув, овоз, такрор») → hisob kartasi → qolganlari. Dars ichidagi Aa / harakat / tezlik tugmalari joyida qoladi — sozlamada faqat boshlang'ich holati.
- **Ishlaydiganlari va kalitlari:**
  | Sozlama | Qayerda saqlanadi | Kim o'qiydi |
  |---|---|---|
  | Ўқиш тезлиги (Секин 0.75 / Оддий 1 / Тез 1.25) | `dars-tezlik` | `shell.js` pleyeri (mavjud kalit) |
  | Ўзбекча таржима овози | `dars-uz` («1»/«0») | `shell.js` «ЎЗ» (mavjud kalit) |
  | Товуш ва тебраниш | `sozlama.tovush` (`false` — o'chiq) | `yol.html` `sado()` |
  | Эркин режим | `sozlama.erkin` | `yol.html` `hisobla()` |
  | Тил | `til` («uz»/«ru») | hamma sahifa (12-bo'lim); o'zgarsa sahifa qayta yuklanadi |
  | Кўриниш (Ёруғ / Тунги / Авто) | `sozlama.kor` («yorug»/«tungi»/«avto») | `<html data-theme>`: `yol.html`, `sozlamalar.html`, `takror.html` boshidagi bir qator + `tg.js` boshida (qolgan hamma sahifalar — asosiy saytga joylangandan keyin) |
  `sozlama` — bitta JSON, `tg.js` orqali Telegram bulutiga ham yoziladi (`data-key="sozlama"`).
- **O'qish va oflayn sozlamalari (13.11.2026):**
  | Sozlama | Qayerda saqlanadi | Qanday ishlaydi |
  |---|---|---|
  | Арабча ёзув катталиги (Кичик 18 / Ўрта 22 / Катта 28) | `sozlama.yozuv` + `sozlama.oqT` (o'zgargan vaqt) | `shell.js` oxiridagi bo'lak: har darsga **bir marta** qo'llaydi (`sozlama-q` da dars kaliti → `oqT`), keyin darsning o'z «Aa» si va saqlangan o'lchami ustun |
  | Ҳаракатлар | `sozlama.harakat` (sukut — o'chiq) | `shell.js` «Таркиб ва Ҳаракат ҳар доим ёпиқ» bo'lagi: yoqilgan bo'lsa dars harakat bilan ochiladi. Sukut o'zgarmadi (31.10.2026 qarori) |
  | Таржима | `fe-pref.t` (darsdagi «Таржима» tugmasi bilan bitta joy) | `shell.js` ning mavjud `fe-pref` kodi |
  | Офлайн сақлаш | `sozlama.oflayn` (sukut — yoqilgan) | o'chirilgan bo'lsa `tg.js` har sahifa ochilganda `arab-tili-audio` keshini o'chiradi (ovoz telefonda yig'ilmaydi; `sw.js` ga tegilmadi) |
  | Сақланган овозларни тозалаш | — | `caches.delete('arab-tili-audio')`; ostida nechta fayl saqlangani ko'rinadi |
- **Фикр юбориш** — `https://t.me/Arabtilihivar_bot`; **Илова версияси** — `sw.js` dagi `var C` o'qiladi.
- **«Натижаларни тозалаш»** (tasdiq bilan): `yol` ga bo'sh holat **yoziladi** (o'chirilmaydi — aks holda `tg.js` Telegram bulutidagi eski nusxani qaytaradi) + `yol-t`; `yol-xato`, `yol-kitob`, so'z bazasi belgilari (`soz`), takror jurnali (`takror-j`, `takror-xulosa`) o'chadi; har `darsNN-holat` dan faqat `q` va `qr` (mashq javoblari) olib tashlanadi, o'qish joyi va boshqa holat qoladi. Sinov sahifasida `yol-sinov…`, `takror-sinov-…` kalitlari; **dars javoblari sinovda ham haqiqiy** (github.io dagi darslar bilan bitta xotira).
- **Tozalash qat'iy (13.11.2026, foydalanuvchi qarori):** tasdiq — oynada **ЎЧИРИШ** so'zini qo'lda yozish (lotincha OCHIRISH ham o'tadi: klaviaturada «Ў» bo'lmasligi mumkin; `togri()`); o'chirishdan oldingi nusxa **30 kun** turadi — telefonda `baza-eski` (sinovda `baza-sinov-eski`): `{v, ar: vaqt, r, rk, ls: {kalit: qiymat}}` (yo'l, so'z bazasi, jurnal, darslarning mashq javoblari), serverda ham (17-bo'lim). Saqlaydigan narsa bo'lmasa nusxa yozilmaydi (oldingisi ustiga bo'sh tushmasin). Tugma ostida «Ўчирилган: sana · яна N кун сақланади» + **«Қайтариш»** (`qaytar()`): qiymatlar joyiga yoziladi (hozirgilari o'rniga), `yol-t` va dars `-t` lari yangi vaqt (Telegram bulutidagi bo'sh nusxadan ustun). Muddati o'tgan nusxa o'chiriladi. Oyna va qator klasslari: `.s-dg`, `.s-dk`, `.s-da`, `.s-qt` (`.s-mb` — band: kichik tugmalar).
- Keyin (server bilan): kunlik maqsad, eslatma vaqti, taxallus. G'oya (alohida ish): o'zbekcha lotin yozuvi.
