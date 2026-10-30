# Arab tili loyihasi — Claude Code uchun qo'llanma

Bu fayl repo ildiziga `CLAUDE.md` nomi bilan qo'yiladi; Claude Code uni har sessiyada o'zi o'qiydi.
Batafsil hujjatlar repoda emas, claude.ai «Arab Tili» loyihasida: `claude/kitob-konspekti.md`, `claude/texnik-eslatma.md`, `claude/claude-qollanma.md`. Ular kerak bo'lsa foydalanuvchidan so'rang yoki u nusxasini repoga qo'ysin.

---

## 1. Ish qoidalari (foydalanuvchi qarori)
- Javob o'zbekcha (lotin). Sahifa interfeysi kirillda.
- Arabcha matn doim to'liq harakat bilan.
- Chatda qator yoki band hech qachon arabcha so'z bilan boshlanmaydi (ilova qatorni teskari ko'rsatadi).
- Savol berilsa — faqat javob. Ish foydalanuvchi **«qil»** deganidan keyin boshlanadi. Konnektor va pullik xizmatlar (ElevenLabs, Adobe) so'ramasdan ishlatilmaydi.
- Kredit tejash: keraksiz tool ishlatma; sahifani qayta yasama — faqat kerakli joyini o'zgartir.
- Yangi ko'rinish yoki qoida avval bitta darsda sinaladi, ma'qul bo'lsa hamma darslarga o'tkaziladi.
- Bitta repoda bir vaqtda ikki chatda ishlanmaydi; ishdan oldin `git pull`.
- Qisqa yoz. Foydalanuvchi bilmagan foydali imkoniyatni qisqa tavsiya qil.

## 2. Mazmun qoidalari
1. **Dars hujjati — asosiy manba.** Kitob qoidalari `kitob-konspekti.md` da (kitob PDF'ini qayta o'qima).
2. Hujjatda katta nahv/e'rob kitoblariga zid aniq xato bo'lsa — foydalanuvchiga ayt va to'g'risini qo'y. Ixtilofli masalada hujjatdagini qoldir, boshqa fikrni «⚖️ Бошқа фикрлар» da ko'rsat. Harf adashishi — opechatka, to'g'risini yoz.
3. Hujjatda yo'q narsani mashhur kitoblardan ol (Ibn Hishom «Mug'niy», «Alfiya» va h.k.), to'qima. Tashqaridan olingani faqat chatda aytiladi, sahifaga «Китобда йўқ» deb yozilmaydi.
4. Kitob atamalari ishlatiladi: эъроб, «эъробдан унга ўрин йўқ», «раф/насб/жар ўринда», аломати, мафъулун биҳ, «… сабаб насб/жазм/жар қилинган». («иъроб», «маҳаллан марфуъ», «белгиси», «омил» — ishlatilmaydi.)
5. Tanvin fath alif ustiga qo'yiladi (ضَرْباً).
6. Lug'at faqat foydalanuvchi lug'at faylini (yoki kitob sahifasini) berganda qo'shiladi.
7. Harakatlar PDF matnidan emas, sahifa **rasmidan** tekshiriladi (PDF'dagi arabcha matn buzilgan bo'ladi).
8. Audio hujjatdagi matndan farq qilsa: matn hujjat bo'yicha; audio faqat bir xil o'qilgan so'zlarga ulanadi.

## 3. Yangi dars tartibi
1. Dars hujjati beriladi → kitob konspekti bilan solishtiriladi → kitobda yo'q joylar ro'yxati foydalanuvchiga beriladi.
2. Foydalanuvchi o'qituvchidan so'raydi yoki «mashhur kitoblardek qil» deydi, keyin «qil».
3. Sahifa yasaladi, harakatlar rasmdan tekshiriladi, Playwright bilan skrinshot (390px, kunduz/tun, Таркиб yoqilgan).
4. Yangi qoida chiqsa — kitob konspektiga qo'shiladi.

---

## 4. Sayt
- https://abduhakim9999.github.io/arab-tili/ — GitHub Pages, `main` dan.
- Telegram Mini App: bot `@Arabtilihivar_bot`, `t.me/Arabtilihivar_bot/darslar`.
- Bosh sahifa: Ruqaa «نُورُ الطَّالِبِ» (o'zgartirilmaydi); panel Сарф · Феъллар · Эшитиш; «Давом этиш»; 1-китоб, 2-китоб. Minimal uslub.
- Darslar: 1-kitob **1, 2, 3, 4, 5**; 2-kitob **70, 71, 72, 73, 74, 91, 92, 93**. Har dars — `NN.html` + `aNN-ҳэш.mp3`.
- Boshqa sahifalar: `feellar.html` (200 fe'l, test, reyting), `fel.html` (kunlik fe'l testi), `sarf.html`, `tinglash.html` (eshitib o'rganish).

### Yig'ish muhiti
- Hamma ish fayllari: `src/build/` — **avval `src/build/README.md` ni o'qing** (tiklash buyruqlari, yo'llar skriptlarda qattiq yozilgan).
- Dars ma'lumotlari: `src/build/scratchpad/dNN/` (`dataNN.py` e'rob, `vocNN.py` lug'at, `jmNN.py` jumla o'rni, `quizNN.py` mashq, `genNN.py` generator, `dlgNN.mp3`).
- Yig'uvchi: `src/build/scratchpad/site/build.py` (LESSONS, UNIT, HDR, LN, TOPIC, TITLE, LISTEN); ikonkalar `index.tpl.html` dagi `ICO`.
- «Таркиб»: `site/tarkib.py` (ST_FIX — gap turi, SJ_FIX — yashirin so'z; kalit takrorlanmasin), `tarkib2.js`.
- Dars boshi ovozi: `scratchpad/hdr/hNN.mp3` + `hcfg.json`.
- Ovozni matnga moslash: GitHub Actions `align.yml` — `align/in/NAME.mp3` + `NAME.txt` push qilinsa `align/out/NAME.align.json` chiqadi (~2 daqiqa).
- **Diqqat:** `build.py` natijasidagi eski darslar sahifalari repodagidan farq qiladi (ular to'g'ridan-to'g'ri tuzatilgan). Yangi dars qo'shganda faqat yangi `NN.html`, `aNN-…mp3`, `index.html` ni nusxalang, `sw.js` ga qo'lda qo'shing. Kichik o'zgarishda tayyor faylni tuzating va `src/build` dagi nusxasini ham.
- Versiya: repo ildizidan `sh src/build/bump.sh` (qo'lda sed qilinmaydi). Hozir **v162**.
- Foydalanuvchi ko'rib chiqishi kerak bo'lgan katta o'zgarish alohida branch'da, «ha» dan keyin main'ga.

### Dars sahifasi tuzilishi
- Pastki panel: Матн / Луғат / Машқ; pleyer (▶, chiziq, tezlik). Tugmalar: Ҳаракат, Таржима, Таркиб, 🎨 Ранглар.
- Ranglar (`shell.css`): mubtado ko'k, fo'il binafsha-ko'k, xabar qizil, fe'l to'q sariq-qizil, maf'ulun bih yashil, jar-majrur ko'k-yashil, zarf/hol pushti; maf'ul mutlaq va harflar rangsiz.
- Таркиб: gap ustida tur («исмийя / феълийя / таажжуб»); yashirin so'z punktir ramkada; shibhi jumla kartasi [mutaalliq] → [so'zlar].
- Mashq: faqat qiyin joylar; to'g'ri javobda o'zi keyingisiga o'tadi.

## 5. Eshitish (`tinglash.html`)
- Rejimlar: Матн (arabcha gap → o'zbekcha tarjima), Луғат, Таркиб (arabcha e'rob). Hozir faqat **74 va 93**.
- Skriptlar: `src/build/scratchpad/listen/` (`mk93.py`, `build_t.py`, `sp93.py`), Таркиб — `src/build/tkbuild.py NN`.
- Har rejim bitta yaxlit mp3 (telefon qulfda ham uzilmasin).
- **Ochiq ish:** 1–5 va 70–73, 91–92 darslarni qo'shish.

## 6. Ovozlar
- Edge-tts (bepul): arabcha `ar-SA-HamedNeural` (Таркиб), `ar-EG-ShakirNeural` (ج ni «г» deydi — eskirgan), o'zbekcha `uz-UZ-SardorNeural`. Bu muhitda certifi'ga `/root/.ccr/ca-bundle.crt` qo'shiladi.
- ElevenLabs (pullik, so'rab ishlatiladi): **Mehdi VO** `pO3ZuaXj0mFWxTrn1tPt` (asosiy arabcha ovoz, eleven_multilingual_v2), **Omar** `xvhpbk8otnNHtT3fjCpr` (5-darsda Badr). Fe'llar: oxirgi harakat cho'zib yoziladi, oralarida `<break time="1.5s" />`.
- Xira yozuvni tozalash: ffmpeg yetmadi; ElevenLabs Voice Isolator ishlaydi, lekin qimmat (~300 kredit / 17 s). Adobe Enhance Speech natijasi foydalanuvchida ochilmadi.

## 7. Bot va Apps Script
- `@Arabtilihivar_bot`: Vercel (`api/tg.js`) → Google Apps Script (`src/bot/eshitish.gs`). Apps Script qo'lda yangilanadi (raw havola → Ctrl+A/Ctrl+V → 💾 → Новая версия).
- `BOT_TOKEN` faqat foydalanuvchi o'zi qo'yadi — so'ralmaydi, hech qayerga yozilmaydi.
- /panel: Натижалар, Кунлик ҳивар, Кунлик феъл, Созлама. «Eshitdi» — faqat so'rovnomada ovoz berish orqali; eshitmaganlar → Қора рўйхат.

## 8. 5-dars (30.10.2026 qilingan)
- Ahmad va Badr suhbati; ovoz ElevenLabs (Mehdi + Omar), foydalanuvchi yozuvi xira bo'lgani uchun.
- Tarkib mashhur kitoblar bo'yicha: «أَهْلًا وَسَهْلًا» — yashirin جِئْتَ/وَطِئْتَ ning maf'ulun bihi; «مَعَ السَّلَامَةِ» — مَعَ zarf, yashirin اِذْهَبْ ga mutaalliq (gap — феълийя); «أَخِي، صَدِيقِي» — taqdiriy zamma (61-dars qolipi), أَخٌ besh ismdan.
- Lug'at 74–94, mashq 7 ta.
