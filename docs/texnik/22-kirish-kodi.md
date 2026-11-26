# Texnika — 22-bo'lim (asosiy fayl: `docs/texnik.md`)

## 22. Сайтга кириш коди (26.11.2026, foydalanuvchi qarori)

Foydalanuvchi: «hozircha hamma ishlatmasligi uchun kodli qilib qo'yamiz, keyin kimdir pul to'lasa ochib beramiz», «oddiy bitta parolli, 4 xonali», «butun sayt yopiladi», «bir kunda bir marta so'ralsa bo'ladi»; o'sha kuni o'zgardi: «kodi bir marta teriladigan bo'lsin, har kuni so'raydigan emas». Pullik versiyagacha vaqtinchalik.

- **Qayerda:** `tg.js` boshida («KIRISH KODI» bloki, Profil va ko'rinish mavzusidan keyin). `tg.js` fiqhdan boshqa hamma sahifada birinchi yuklanadi — butun sayt, ikkala til, Telegram ichida ham, ko'rish/sinov sahifalarida ham. Fiqh alohida (o'z paroli, `10-fiqh.md`).
- **Ishlashi** (26.11.2026 dan — bir marta): kod to'g'ri bo'lsa localStorage «kirish-ok» = `KX`. Shu qurilma/brauzerda boshqa so'ralmaydi. Yana so'raladi faqat: kod almashsa (`KX` boshqa), brauzer ma'lumoti tozalansa, yashirin rejim yoki boshqa qurilma/brauzer. Avvalgi kunlik yozuv `KX:kun` ham qabul qilinadi va `KX` ga o'tkaziladi (bugun kod tergan qurilma qayta so'ramaydi). Kalit Profil'ga kirmaydi — ikkala tilga umumiy.
- **Oyna:** `<html>` ga qo'shiladi (body hali bo'lmasa ham), `html.kq-yopiq body{visibility:hidden}` — sahifa ko'rinmaydi, lekin chiziladi (o'lchovlar buzilmaydi). Ikonka, «Кириш коди», 4 nuqta, raqam tugmalari (fiqh PIN qolipi), ⌫; kompyuterda klaviatura raqamlari ham. Yorug'/tungi — `data-theme` va telefon sozlamasi bo'yicha. Ruscha: «Код доступа».
- **Xato:** «Нотўғри код» + silkinish; 5 xatodan keyin 30 s kutish («kirish-xato», «kirish-kut»).
- **Kod repoga yozilmaydi** (repo ochiq) — `tg.js` da faqat `KX` (FNV-1a xesh, «nurut-tolib:» + kod). Kod foydalanuvchida.
- **Kodni almashtirish:** `node src/build/kirish-kod.js 1234` → `tg.js` dagi `KX` yangilanadi → odatdagidek `tayyor-…` tarmoq va «joyla». Eski kod bilan ochilgan qurilmalarda darhol yana so'raladi.
- **Cheklov (foydalanuvchiga aytilgan):** bu «eshik qulfi» — tekshiruv brauzerda, 4 raqam oz, repo va github.io ochiq, mp3 fayllar to'g'ridan-to'g'ri ochiladi. Haqiqiy himoya — pullik versiyada: har o'quvchiga alohida kod, tekshiruv serverda, fayllar yopiq, repo private.
- **Olib tashlash:** `tg.js` dagi «KIRISH KODI» blokini o'chirish (yoki `yop()` chaqiruvini).
- Sinov (26.11.2026, Playwright, `service_workers='block'`): oyna chiqadi va sahifa yashirin; xato kod; to'g'ri kod → ochiladi, qayta yuklash va boshqa dars — so'ramaydi; kun o'zgarsa — so'raydi (26.11.2026 dan: so'ramaydi; eski `KX:kun` → `KX`, boshqa `KX` — so'raydi); 5 xato → kutish (to'g'ri kod ham o'tmaydi); klaviatura; ruscha (`ru1.html`); tungi ko'rinish (`yol.html`). Sahifa xatolari yo'q.
