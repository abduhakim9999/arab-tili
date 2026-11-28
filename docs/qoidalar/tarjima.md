# Tarjima qoidasi (o'zbekcha matn)

Yagona manba — o'zbekcha tarjima yozilishi va dars matnini tekshirish qoidalari shu yerda (28.11.2026 da `yangi-dars` skillidan ko'chdi; skill faqat shu faylga havola qiladi). Tarjima ovozda qanday aytilishi (qavsdagi variantdan bittasi, lotin yozuv) — `docs/texnik/05-eshitish.md`.

## 1. Yuklamalar chiziqcha bilan (28.11.2026, foydalanuvchi: «chi chiziqcha bilan yozilishi kerak … Saida-chi»)

- O'zbek imlo qoidasi: **-чи, -ку, -ю** yuklamalari so'zga chiziqcha bilan yoziladi: «Саид-чи қаерда?», «Ўзинг-чи?», «бор-ку», «келди-ю».
- So'zning o'z qismi bo'lgan «чи» ga tegilmaydi: ишчи, ўқувчи, сотувчи, элчи, сабабчи; tartib sonlar (биринчи, иккинчи); -моқчи (демоқчи).
- Hamma joyda bir xil: dars sahifasi (`NN.html`, `src/build/outputs/`), lug'at (`vocNN.py`, `b1.txt`), Eshitish (`tinglash.html`, `listen/lN.json`), `data/*.json` (`ajrat.py` bilan qayta yasaladi). Chiziqcha ovozga ta'sir qilmaydi — audio qayta yasalmaydi.
- Kitob nusxalari (`src/manba/grammatika/`, `scratchpad/sarf/`) — kitob matni, o'zgartirilmaydi.
- 28.11.2026 tuzatilgani (`tayyor-chi-yuklama`): Саид-чи, Саида-чи, Кўзойнак-чи (9-dars), Бу-чи (7), аҳволларинг-чи / ишларинг-чи (1 — lug'at misoli, 2), миллатинг-чи, фуқаролигинг-чи (3). -ку va -ю darslarda yo'q edi (borlari allaqachon chiziqcha bilan).

## 2. Hujjat tarjimasini tekshirish (26.11.2026, foydalanuvchi: «сўзларни эмас — сўзлар бўлади, bunday xatolar bo'lsa tuzat»)
- Tarjima faqat harf adashishiga emas, **o'zbekcha grammatikaga** ham tekshiriladi:
  - kelishik va qo'shimcha mosligi: «Бизга иш керак, сўзларни эмас» → «сўзлар эмас»; «فِي» — «-да»: «ўқиганинг эмас» → «ўқиганингда эмас»;
  - birlik/ko'plik mosligi: «мукофотлардан бири — … мукофотларидир» (99-dars) — bir-biriga mos emas;
  - ortiqcha so'z: «Сабаби у ерда» → «Сабаби»; bir gapda ikki marta bir ma'no («Жумладан, … шулар жумласидандир»);
  - ortiqcha tinish belgisi: «намозхонада, намоз ўқияпти».
- Tarjima arabchadan ma'no jihatidan uzoqlashgan joy (grammatik xato emas) — alohida «ma'no farqi» deb ko'rsatiladi.
- Tuzatishlar `yangi-dars` 3-qadamida alohida ro'yxatda beriladi; **hujjat tarjimasi foydalanuvchi roziligisiz o'zgarmaydi**.
- Dars hujjatida tarjima bo'lmasa — tarjima kitob lug'atidagi misol-tarjimalar asosida qilinadi va foydalanuvchiga aytiladi (31.10.2026; konspekt 1-bo'lim).

## 3. Arabcha matn harakati — lug'atga qarab (26.11.2026, foydalanuvchi: 90-darsda «битолатун (ишсизлик) бўлиши керак»)
- Harakat avvalo dars ovoziga, keyin sahifa rasmiga qarab qo'yiladi (PDF matni buzilgan bo'ladi; konspekt 1-bo'lim).
- Hujjatda harakat yo'q bo'lsa yoki ovozda aniq eshitilmasa — so'z harakati mashhur lug'atdan tekshiriladi (Lisonul-arab, as-Sihoh, al-Mu'jam al-vasit); zamonaviy keng tarqalgan o'qilishga tayanilmaydi.
- Ma'no harakatga qarab o'zgarsa (بِطَالَةٌ — ishsizlik, بَطَالَةٌ — botirlik) — lug'atdagisi qo'yiladi; ovoz yoki hujjat bilan farq qilsa — `yangi-dars` 3-qadamida aytiladi.
- Ovozda ikki xil o'qilishi mumkin bo'lgan so'zni (majhul/ma'lum, tanvin, g'ayri munsarif) bepul fonema tekshiruvi bilan solishtirish mumkin: `listen/ctcscore.py` (nomzod talaffuzlar CTC bo'yicha; 99-darsda ishlatildi). Vaqf qilingan so'z oxiri ovozdan bilinmaydi — grammatikaga qarab qo'yiladi.
